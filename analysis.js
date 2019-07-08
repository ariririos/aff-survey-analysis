const treeify = require('treeify');
const dataStructureSchemaClosure = require('./dataStructureSchema');
const questionStatsSchemaClosure = require('./questionStatsSchema');
const { questionTypesByTitleClosure, questionTitlesToShortTitlesClosure } = require('./globalSymbols');
const { is2D } = require('./arrayHelpers'); 
const { likertToWords, likertConverters } = require('./likertHelpers');
const chalk = require('chalk');

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
module.exports = ({ arrangedResponses, compArrRes, resByAssoc, questionTitles }) => {
    const questionStatsSchema = questionStatsSchemaClosure(compArrRes, resByAssoc, questionTitles);
    const dataStructureSchema = dataStructureSchemaClosure(resByAssoc, questionTitles);
    const questionTypesByTitle = questionTypesByTitleClosure(questionTitles);
    const questionTitlesToShortTitles = questionTitlesToShortTitlesClosure(questionTitles);

    const aggResByQuestionTitle = {};
    const graphicTree = {};

    const traverseSchemaForStructure = (arrayOfTuples, r, parentBranch = graphicTree) => {
        // console.log('traversing this schema: ', arrayOfTuples);
        for (let tuple of arrayOfTuples) { // go through all tuples
            console.log(tuple);
            if (typeof tuple[0] == 'number') {
                // bottom of recursion, attach directly to parent
                const questionTitle = questionTitles[tuple[0]],
                      questionShortTitle = questionTitlesToShortTitles[questionTitle],
                      accessorFunction = r => r.get(questionTitle);
                if (!aggResByQuestionTitle[questionTitle]) aggResByQuestionTitle[questionTitle] = [];
                aggResByQuestionTitle[questionTitle].push(accessorFunction(r));
                parentBranch[questionShortTitle] = questionTitle; 
            }
            // FIXME: add an if that checks for just a number -- if so, replace it with
            /*
                [
                    [questionTitlesToShortTitles[Number], r => r.get(questionTitles[Number] !== null)],
                    [questionTitles[Number], r => r.get(questionTitles[Number])]
                ]
            */
            else if (tuple[0][1](r)) {
                if (!parentBranch[tuple[0][0]]) parentBranch[tuple[0][0]] = {};
                if (!is2D(tuple[1])) { // stop at an Array[3]
                    if (!aggResByQuestionTitle[tuple[1][0]]) aggResByQuestionTitle[tuple[1][0]] = [];
                    aggResByQuestionTitle[tuple[1][0]].push(tuple[1][1](r));
                    parentBranch[tuple[0][0]] = tuple[1][0];
                    // TODO: need to filter here or somewhere for -99 answers (or maybe filter for them in the structure schema that makes sure the respondents answered the right questions)
                }
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
    const performCrossCheck = ({ qT1, a1, qT2, a2, assocName, qT1Short, qT2Short, opts = {} }) => {
        // a1 and a2 can be either a single value or Array<T>
        let a1Arr = a1, a2Arr = a2;
        if (!Array.isArray(a1)) a1Arr = [a1];
        if (!Array.isArray(a2)) a2Arr = [a2];
        const a1Method = opts.a1Method || 'conjunction',
              a2Method = opts.a2Method || 'conjunction';
        const filterByType = (arrRes, qT, a, method) => {
            if (questionTypesByTitle[qT] === 'multiChoice') {
                return arrRes.filter(res => res.get(qT)).filter(res => res.get(qT) !== '-99').filter(res => {
                    if (method === 'conjuction') return a.every(ans => res.get(qT).split(',').includes(ans)); 
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
        (() => { let temp = questionTitles; debugger;} );

        const a1ListFormat = new Intl.ListFormat('en', { type: a1Method });
        const a2ListFormat = new Intl.ListFormat('en', { type: a2Method });

        let a1Words = a1ListFormat.format(a1Arr.map(x => x.toString())), a2Words = a2ListFormat.format(a2Arr.map(x => x.toString()));
        // if (['likert3', 'likert5', 'likertFreq'].includes(questionTypesByTitle[qT1])) a1Words = a1ListFormat.format(a1Arr.map(ans => likertToWords(ans, likertConverters[questionTypesByTitle[qT1] + 'ToNumber'])));
        // if (['likert3', 'likert5', 'likertFreq'].includes(questionTypesByTitle[qT2])) a2Words = a2ListFormat.format(a2Arr.map(ans => likertToWords(ans, likertConverters[questionTypesByTitle[qT2] + 'ToNumber'])));

        return `${((overlap.length / qT1Match.length) * 100).toFixed(2)}% (${overlap.length}) of ${assocName} that answered "${a1Words}" to ${qT1Short} also answered "${a2Words}" to ${qT2Short}`;

    };

    const traverseSchemaForAnalysis = (arrayOfTuples, pB = graphicTree) => {
        let parentBranch = pB;
        for (let tuple of arrayOfTuples) { // traverse array of tuples
            parentBranch = pB[tuple[0][0]];
            if (typeof tuple[0] === 'number' || !is2D(tuple[1])) {
                let questionShortTitle, questionTitle;
                if (typeof tuple[0] === 'number') {
                    questionTitle = questionTitles[tuple[0]];
                    questionShortTitle = questionTitlesToShortTitles[questionTitle];
                }
                else {
                    questionShortTitle = tuple[0][0];
                    branchCheckerFunction = tuple[0][1];
                    questionTitle = tuple[1][0];
                    accessorFunction = tuple[1][1];
                }
                const statsObj = questionStatsSchema[questionTitle];
                if (typeof statsObj === 'function') {
                    pB[questionShortTitle] = statsObj(aggResByQuestionTitle[questionTitle]);
                }
                else if (statsObj.stats !== undefined && statsObj.crossCheck !== undefined) {
                    let crossCheck = statsObj.crossCheck;
                    if (!Array.isArray(statsObj.crossCheck)) crossCheck = [statsObj.crossCheck]
                    pB[questionShortTitle] = Object.assign(
                        {},
                        statsObj.stats(aggResByQuestionTitle[questionTitle]),
                        {
                            'Cross-question trends':
                                crossCheck.map(obj => performCrossCheck({
                                    qT1: questionTitle,
                                    a1: obj.ansHere,
                                    qT2: obj.question,
                                    a2: obj.ansThere,
                                    assocName: obj.assoc,
                                    qT1Short: 'this question',
                                    qT2Short: `"${questionTitlesToShortTitles[obj.question]}"`,
                                    opts: obj.opts
                                }))
                        });
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

    for (let res of arrangedResponses) {
        traverseSchemaForStructure(dataStructureSchema, res);
    }

    traverseSchemaForAnalysis(dataStructureSchema);

    // Colorify tree:
    const coloredTree = {};
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
        // add recursion-level based colors
    }
    
    colorify(graphicTree, coloredTree, 0);

    console.log(coloredTree);

    // Print graphic tree
    console.log(treeify.asTree(coloredTree, true));

}