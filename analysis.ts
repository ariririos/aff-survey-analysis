import treeify from 'treeify';
import dataStructureSchemaClosure from './dataStructureSchema';
import questionStatsSchemaClosure from './questionStatsSchema';
import { QuestionTitle, ResByAssoc, Response, questionTypesByTitleClosure, questionTitlesToShortTitlesClosure } from './globalSymbols';
import { is2D } from './arrayHelpers';
import chalk from 'chalk';
import debugFn from 'debug';

// both schemas, and all data
/* strat:
    - structure is recursive array of tuples of arrays
    - for first level, go through every tuple
    - check dSS[0][1] -- if it's not a 1D array, keep nesting
    - if nested, recurse: go through every tuple in the array
    - dSS is array of tuples
    - dSS[0] is first tuple (first branch)
    - dSS[0][1] is 2D (SUBBRANCH)
    - dSS[0][1] is array of tuples
    - dSS[0][1][0] is a tuple (possible branch?)
    - dSS[0][1][0][1] is 1D (NO BRANCH)
    - dSS[0][1][0][0] is the name of this branch and function to check whether to take it
    - dSS[0][1][0][1] is question title for aggregation and function to get the response from this respondent
*/

/**
 * @param closure - object with required data
 * @param closure.arrangedResponses - responses arranged by QuestionTitle => String
 * @param closure.compArrRes - responses arranged by QuestionTitle => String, filtered for completion as marked by Qualtrics
 * @param closure.resbyAssoc - completed arranged responses organized by association
 * @param questionTitles - global question titles array
 */
export default ({ arrangedResponses, compArrRes, resByAssoc, questionTitles }: { arrangedResponses: Response[], compArrRes: Response[], resByAssoc: ResByAssoc, questionTitles: QuestionTitle[]}) => {
    const debug = debugFn('analysis');
    const questionStatsSchema = questionStatsSchemaClosure(compArrRes, resByAssoc, questionTitles);
    const dataStructureSchema = dataStructureSchemaClosure(resByAssoc, questionTitles);
    const questionTypesByTitle = questionTypesByTitleClosure(questionTitles);
    const questionTitlesToShortTitles = questionTitlesToShortTitlesClosure(questionTitles);

    const aggResByQuestionTitle: { [qT in QuestionTitle]: string[] } = {};

    const traverseSchemaForStructure = (arrayOfTuples: any, r: Map<QuestionTitle, string>, parentBranch) => {
        debug('Traversing this schema:', arrayOfTuples);
        for (let tuple of arrayOfTuples) { // go through all tuples
            // [ number: index of question in jsonData/questionTitles ]
            if (typeof tuple[0] == 'number') {
                // bottom of recursion, attach directly to parent
                const questionTitle = questionTitles[tuple[0]],
                      questionShortTitle = questionTitlesToShortTitles[questionTitle],
                      accessorFunction = (r: Response) => r.get(questionTitle);
                if (!aggResByQuestionTitle[questionTitle]) aggResByQuestionTitle[questionTitle] = [];
                aggResByQuestionTitle[questionTitle].push(accessorFunction(r));
                parentBranch[questionShortTitle] = questionTitle;
            }
            // [ [string: short title of section, (r: Response) => boolean: should continue on this branch for this response?], [ ((QuestionTitle|string): identifier for aggResByQuestionTitle, (r: Response) => string: accessor function that returns correct survey question response from overall res) | [ recurse ]] ]
            else if (tuple[0][1](r)) {
                if (!parentBranch[tuple[0][0]]) parentBranch[tuple[0][0]] = {};
                // stop at a [string, function] type tuple
                if (!is2D(tuple[1])) {
                    if (!aggResByQuestionTitle[tuple[1][0]]) aggResByQuestionTitle[tuple[1][0]] = [];
                    aggResByQuestionTitle[tuple[1][0]].push(tuple[1][1](r));
                    parentBranch[tuple[0][0]] = tuple[1][0];
                    // TODO: need to filter here or somewhere for -99 answers (or maybe filter for them in the structure schema that makes sure the respondents answered the right questions)
                }
                // continue traversing for a [ recurse ] ([any[], any[]][]) type tuple
                else { // continue traversing an array of tuples
                    traverseSchemaForStructure(tuple[1], r, parentBranch[tuple[0][0]]);
                }
            }
        }
    }

    // problem: need to have a list of possible answers because multichoice questions will have an array
    // problem: need to handle multichoice questions as not *being* a1, but *including* a1

    /**
     * performCrossCheck checks for how respondents to one question answered to another question.
     * Strategy (without multi possible answers provided):
     * For single choice questions: checks that the answer is exactly what was given
     * For multi choice questions: checks that the answer is in the list of respondent's choices
     * For likert3, likert5, or likertFreq: same as single choice
     * For textbox: checks that text is exactly what was given
     * ** checks that ALL answers are given by respondents: x% of people who answered A AND B to q1 also answered C AND D to q2
     */
    // FIXME: format for answers (number or word for likert, e.g.)
    const performCrossCheck = ({ qT1, a1, qT2, a2, assocName, qT1Short = '', qT2Short = '', opts = {} }: { qT1: QuestionTitle, a1: any, qT2: QuestionTitle, a2: any, assocName: string, qT1Short?: string, qT2Short?: string, opts?: any}) => {
        let a1Arr: string[] = a1, a2Arr: string[] = a2;
        if (!Array.isArray(a1)) a1Arr = [a1];
        if (!Array.isArray(a2)) a2Arr = [a2];
        const a1Method = opts.a1Method || 'conjunction',
              a2Method = opts.a2Method || 'conjunction';
        const filterByType = (arrRes, qT, a, method) => {
            if (questionTypesByTitle[qT] === 'multiChoice') {
                return arrRes.filter(res => res.get(qT)).filter(res => res.get(qT) !== '-99').filter(res => {
                    if (method === 'conjunction') return a.every(ans => res.get(qT).split(',').includes(ans));
                    else if (method === 'disjunction') return a.some(ans => res.get(qT).split(',').includes(ans));
                    else throw 'aMethod invalid';
                }); // FIXME: -99 filtering
            }
            else {
                 // FIXME: -99 filtering
                if (method === 'conjunction') return arrRes.filter(res => res.get(qT)).filter(res => res.get(qT) !== '-99').filter(res => res.get(qT) === a[0]); // conjunctions not supported for single choice questions
                else if (method === 'disjunction') return arrRes.filter(res => res.get(qT)).filter(res => res.get(qT) != '-99').filter(res => a.some(ans => res.get(qT) === ans));
                else throw 'aMethod invalid';
            }
        }
        const qT1Match = filterByType(arrangedResponses, qT1, a1Arr, a1Method);
        const overlap = filterByType(qT1Match, qT2, a2Arr, a2Method);

        // @ts-ignore FIXME:
        const a1ListFormat = new Intl.ListFormat('en', { type: a1Method });
        // @ts-ignore FIXME:
        const a2ListFormat = new Intl.ListFormat('en', { type: a2Method });

        let a1Words: string = a1ListFormat.format(a1Arr.map(x => x.toString())), a2Words = a2ListFormat.format(a2Arr.map(x => x.toString()));
        // if (['likert3', 'likert5', 'likertFreq'].includes(questionTypesByTitle[qT1])) a1Words = a1ListFormat.format(a1Arr.map(ans => likertToWords(ans, likertConverters[questionTypesByTitle[qT1] + 'ToNumber'])));
        // if (['likert3', 'likert5', 'likertFreq'].includes(questionTypesByTitle[qT2])) a2Words = a2ListFormat.format(a2Arr.map(ans => likertToWords(ans, likertConverters[questionTypesByTitle[qT2] + 'ToNumber'])));
        if (qT1 !== qT2) {
            return `${((overlap.length / qT1Match.length) * 100).toFixed(2)}% (${overlap.length}) of ${assocName} that answered "${a1Words}" to ${qT1Short} also answered "${a2Words}" to ${qT2Short}`;
        }
        else {
            return `${((overlap.length / qT1Match.length) * 100).toFixed(2)}% (${overlap.length}) of ${assocName} that answered "${a1Words}" also answered "${a2Words}"`;
        }

    };

    const traverseSchemaForAnalysis = (arrayOfTuples, pB) => {
        let parentBranch = pB;
        for (let tuple of arrayOfTuples) { // traverse array of tuples
            parentBranch = pB[tuple[0][0]];
            if (typeof tuple[0] === 'number' || !is2D(tuple[1])) {
                let questionShortTitle: string, questionTitle: QuestionTitle;
                if (typeof tuple[0] === 'number') {
                    questionTitle = questionTitles[tuple[0]];
                    questionShortTitle = questionTitlesToShortTitles[questionTitle];
                }
                else {
                    questionShortTitle = tuple[0][0];
                    questionTitle = tuple[1][0];
                }
                const statsObj: any = questionStatsSchema[questionTitle];
                if (typeof statsObj === 'function') {
                    pB[questionShortTitle] = statsObj(aggResByQuestionTitle[questionTitle]);
                }
                else if (statsObj.stats !== undefined && statsObj.crossCheck !== undefined) {
                    let crossCheck = statsObj.crossCheck;
                    if (!Array.isArray(statsObj.crossCheck)) crossCheck = [statsObj.crossCheck]
                    const crossCheckers = crossCheck.filter(checkObj => checkObj.question !== questionTitle);
                    const withinCheckers = crossCheck.filter(checkObj => checkObj.question === questionTitle);
                    pB[questionShortTitle] = Object.assign(
                        {},
                        statsObj.stats(aggResByQuestionTitle[questionTitle]),
                        crossCheckers.length > 0 ? {
                            'Cross-question trends':
                                crossCheckers.map(obj => performCrossCheck({
                                    qT1: questionTitle,
                                    a1: obj.ansHere,
                                    qT2: obj.question,
                                    a2: obj.ansThere,
                                    assocName: obj.assoc,
                                    qT1Short: 'this question',
                                    qT2Short: `"${questionTitlesToShortTitles[obj.question]}"`,
                                    opts: obj.opts
                                }))
                        }: {},
                        withinCheckers.length > 0 ? {
                            'Within-question trends':
                                withinCheckers.map(obj => performCrossCheck({
                                    qT1: questionTitle,
                                    a1: obj.ansHere,
                                    qT2: obj.question,
                                    a2: obj.ansThere,
                                    assocName: obj.assoc,
                                    opts: obj.opts
                                }))
                        } : {}
                    );

                }
                else {
                    throw 'questionStatsSchema question processor neither function nor correctly formatted object'
                }
            }
            else { // continue traversing the next array of tuples
                traverseSchemaForAnalysis(tuple[1], parentBranch);
            }
        }
    };

    const resultsTree = {};

    debug('Traversing schema for structure...');
    for (let res of arrangedResponses) {
        traverseSchemaForStructure(dataStructureSchema, res, resultsTree);
    }
    debug('Traversing schema for structure complete');

    debug('Traversing schema for analysis');
    traverseSchemaForAnalysis(dataStructureSchema, resultsTree);
    debug('Traversing schema for analysis complete');

    // Prep tree for output:

    const replaceArraysWithEmptyObjects = (obj, newObj) => {
        const keys = Object.keys(obj);
        for (let key of keys) {
            if (Array.isArray(obj[key])) {
                newObj[key] = {};
                for (let val of obj[key]) {
                    newObj[key][val] = {};
                }
            }
            else if (typeof obj[key] === 'object' && obj[key] !== null) {
                newObj[key] = {};
                replaceArraysWithEmptyObjects(obj[key], newObj[key]);
            }
            else if (obj.hasOwnProperty(key)) {
                newObj[key] = obj[key];
            }
            else throw '????';
        }
        return newObj;
    };

    const colorify = (obj, parent, i) => {
        const keys = Object.keys(obj);
        for (let key of keys) {
            const color = ['red', 'blue', 'green', 'cyan', 'magenta', 'yellow', 'gray', 'white'][i];
            if (typeof obj[key] === 'object' && obj[key] !== null) {
                parent[chalk[color](key)] = {};
                colorify(obj[key], parent[chalk[color](key)], i + 1);
            }
            else if (obj.hasOwnProperty(key)) {
                parent[chalk[color](key)] = obj[key];
            }
        }
    }

    const newObj = {}, coloredTree = {};
    const moddedTree = replaceArraysWithEmptyObjects(resultsTree, newObj);
    colorify(moddedTree, coloredTree, 0);
    debug('Graphic tree complete');

    // Print graphic tree
    console.log('Survey analysis results');
    console.log(treeify.asTree(coloredTree, true));

    // Restructure tree to send to server
    /**
     * Example structure:
     * [
	{"title": "Books", "expanded": true, "folder": true, "children": [
		{"title": "Art of War", "type": "book", "author": "Sun Tzu", "year": -500, "qty": 21, "price": 5.95},
		{"title": "The Hobbit", "type": "book", "author": "J.R.R. Tolkien", "year": 1937, "qty": 32, "price": 8.97},
		{"title": "The Little Prince", "type": "book", "author": "Antoine de Saint-Exupery", "year": 1943, "qty": 21, "price": 5.95},
		{"title": "Don Quixote", "type": "book", "author": "Miguel de Cervantes", "year": 1615, "qty": 21, "price": 5.95}
    ]},
    Use expanded: false,
    // write tree in a certain order: look for groups in an order and pass them in that order if they exist
     */

    const outputTree = [], groupOrder = ['All respondents', 'Current students', 'Current student parents', 'Teachers', 'Current student parents and teachers', 'Graduates', 'Graduate parents', 'Exit matter'];
    for (let group of groupOrder) {
        if (resultsTree[group] !== undefined) outputTree.push({
            title: group,
            children: []
        });
    }
    const attachData = (origObjParentOrValue, parentTree) => {
        // FIXME: primitive check needed? probably only in case of resultsTree parent group being a primitive
        if (Object(origObjParentOrValue) !== origObjParentOrValue && origObjParentOrValue !== null) { // checking if primitive value
            // parentTree should be the children prop of the direct parent
            parentTree.push({
                title: origObjParentOrValue,
            });
        }
        else { // either array or object FIXME: nesting unnecessary
            if (Array.isArray(origObjParentOrValue)) {
                parentTree.children = [];
                origObjParentOrValue.forEach(val => parentTree.children.push({ title: val }));
            }
            else {
                parentTree.children = [];
                for (let [origChildKey, origChildVal] of Object.entries(origObjParentOrValue)) {
                    // if primitive, attach directly to parentTree
                    if (Object(origChildVal) !== origChildVal) {
                        parentTree.children.push({ title: `${origChildKey}: ${origChildVal}` });
                    }
                    // else, recurse -- either array or object
                    else {
                        const newChild = { title: origChildKey, folder: true, children: [] };
                        parentTree.children.push(newChild);
                        attachData(origChildVal, newChild);
                    }
                }
            }
        }
    };

    for (let groupParent of outputTree) {
        groupParent = attachData(resultsTree[groupParent.title], groupParent)
    }
    return outputTree;
}