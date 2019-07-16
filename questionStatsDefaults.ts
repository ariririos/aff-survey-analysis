import { assoc, ResByAssoc, QuestionTitle } from './globalSymbols';
import { likertToWords } from './likertHelpers';
import { arrMean, arrMedian, arrMode, arrayToInstances, arrayToInstancesMap } from './arrayHelpers';

export const defaultStatsClosure = (resByAssoc: ResByAssoc) => (
        agg: string[],
        converter: (agg: string[]) => number[],
        assocName: string,
    ) => ({ // FIXME: do I need -99 filtering here?
    [`% ${assocName} who answered`]: ((converter(agg).length / resByAssoc[assoc.revGet(assocName)].length) * 100).toFixed(2) + '%', // FIXME: converter needed?
    'Mean': likertToWords(+arrMean(converter(agg).filter(res => !Number.isNaN(res))).toFixed(2), converter),
    'Mode': (() => {
        const modes = arrMode(converter(agg).filter(res => !Number.isNaN(res)));
        return { 'Answers': modes[1].map(mode => likertToWords(+mode, converter)).toString(), 'Frequency': `${((modes[0] / agg.length) * 100).toFixed(2)}% (${modes[0]})` };
    })(),
    'Median': likertToWords(arrMedian(converter(agg)), converter),
    'Aggregate data': (() => {
        const instances = arrayToInstances(agg.filter(res => res !== '-99')); // FIXME: -99 filtering // FIXME: is arrayToInstances correctly adding up? probably, cause 1 ans => 1 respondent
        const instancesWithPercentages = {};
        for (let [val, instForVal] of Object.entries(instances)) {
            instancesWithPercentages[val] = `${((instForVal / resByAssoc[assoc.revGet(assocName)].length) * 100).toFixed(2)}% (${instForVal})`
        }
        return { ...instancesWithPercentages };
     })()
});

export const classYearStats = (agg: string[]) => {
    const years = arrayToInstances(agg);
    const aggNum = agg.map(year => Number(year));
    const stats = {
        'Mean': arrMean(aggNum),
        'Most frequent year(s)': (() => {
            const modes = arrMode(aggNum);
            return modes[1].toString();
        })(),
        'Median': arrMedian(aggNum)
    }
    return Object.assign({}, years, stats);
};

export const multiChoiceStatsClosure = (resByAssoc: ResByAssoc) => (agg: string[], assocName: string, qT: QuestionTitle) => {
    const cleanedAgg = agg.filter(ans => ans !== '-99').map(ans => ans.split(',')); // FIXME: -99 filtering
    const flatAgg = cleanedAgg.flat();
    // const subjects = arrayToInstances(flatAgg); TODO: not implementing yet
    return {
        [`% ${assocName} who answered`]: ((cleanedAgg.length / resByAssoc[assoc.revGet(assocName)].length) * 100).toFixed(2) + '%',
        'Most answered (mode)': (() => {
            // FIXME: is this a correct way to calculate mode? based on the aggregate answers rather than each person
            // probably b/c one person can't answer the same thing more than once
            const modes = arrMode(flatAgg);
            const matchingOfAssoc = resByAssoc[assoc.revGet(assocName)].filter(res => modes[1].some(mode => res.get(qT).split(',').includes(mode)));
            return {
                'Answer(s)': modes[1].toString(),
                'Frequency': `${((matchingOfAssoc.length / resByAssoc[assoc.revGet(assocName)].length) * 100).toFixed(2)}% of ${assocName} (${matchingOfAssoc.length})`
                // 34% of students (# of students)
            }
        })()
    };
};

export const singleChoiceStatsClosure = (resByAssoc: ResByAssoc) => (agg: string[], assocName: string, qT: QuestionTitle) => {
    const cleanedAgg = agg.filter(ans => ans != '-99');
    const answeredOfAssoc = resByAssoc[assoc.revGet(assocName)].filter(res => res.get(qT) !== '' && res.get(qT) !== '-99');
    const instancesTuples = [...arrayToInstancesMap(cleanedAgg)].map(([value]) => {
        const matchingOfAssoc = answeredOfAssoc.filter(res => res.get(qT) === value);
        return [value, `${((matchingOfAssoc.length / resByAssoc[assoc.revGet(assocName)].length) * 100).toFixed(2)}% of ${assocName} (${matchingOfAssoc.length})`]
    });
    const instancesObject = instancesTuples.reduce((obj, tuple) => { obj[tuple[0]] = tuple[1]; return obj; }, {});
    // output:
    // % who answered
    // answers: 32423: 33% of students (3)
    return {
        [`% ${assocName} who answered`]: ((cleanedAgg.length / resByAssoc[assoc.revGet(assocName)].length) * 100).toFixed(2) + '%',
        ...instancesObject
    }
};

export const multiGrpMultiChoiceStatsClosure = (resByAssoc: ResByAssoc) => (agg: string[], assocNameArr: string[], qT: QuestionTitle) => {
    const cleanedAgg = agg.filter(ans => ans !== '-99').map(ans => ans.split(',')), cleanFlatAgg = cleanedAgg.flat(); // FIXME: -99 filtering
    const assocNameObjToCopy = assocNameArr.reduce((obj, assocName) => { obj[assocName] = []; return obj; }, {});
    const cleanAggAnsByAssocName: { [x: string]: string[][] } = Object.assign({}, assocNameObjToCopy);
    for (let assocName of assocNameArr) {
        for (let res of resByAssoc[assoc.revGet(assocName)]) {
            const ans = res.get(qT);
            if (ans !== '-99' && ans !== '') { // FIXME: -99 filtering
                cleanAggAnsByAssocName[assocName].push(ans.split(','));
            }
        }
    }

    const cleanFlatAggAnsByAssocName = assocNameArr.reduce((obj, assocName) => { obj[assocName] = cleanAggAnsByAssocName[assocName].flat(); return obj; }, {});

    // @ts-ignore FIXME:
    const assocNameWords = assocNameArr.map(assocName => assocName[0].toUpperCase() + assocName.slice(1)), assocNameListWords = new Intl.ListFormat('en', { type: 'conjunction' }).format(assocNameWords);

    const statsByAssocName = Object.assign({}, assocNameObjToCopy);

    for (let assocName of assocNameArr) {
        // FIXME: is all this necessary if one ans == one respondent?
        // can't we just do arrMode on the cleanFlatAggAnsByAssocName[assocName]
        const resByThisAssoc = resByAssoc[assoc.revGet(assocName)];
        const aggAnsByThisAssoc = cleanFlatAggAnsByAssocName[assocName];
        const uniqueAnsToThisQuestion = aggAnsByThisAssoc.reduce((uniqueAnsArr, ans) => {
            if (!uniqueAnsArr.includes(ans)) uniqueAnsArr.push(ans);
            return uniqueAnsArr;
        }, []);
        const ansByThisAssocFreq: { [x: string]: number } = uniqueAnsToThisQuestion.reduce((obj, ans) => {
            obj[ans] = resByThisAssoc.filter(res => res.get(qT).split(',').includes(ans)).length;
            return obj;
        }, {});
        statsByAssocName[assocName] = {
            [`% ${assocName} who answered`]: ((cleanAggAnsByAssocName[assocName].length / resByThisAssoc.length) * 100).toFixed(2) + '%',
            'Most answered (mode)': (() => {
                let modeAns = [];
                const modeFreq = Math.max(...Object.values(ansByThisAssocFreq));
                for (let [k, v] of Object.entries(ansByThisAssocFreq)) {
                    if (v === modeFreq) modeAns.push(k);
                }
                return {
                    'Answer(s)': modeAns.toString(),
                    'Frequency': `${((modeFreq / resByThisAssoc.length) * 100).toFixed(2)}% of ${assocName} (${modeFreq})`
                };
            })(),
            ...ansByThisAssocFreq
        };
    }

    return {
        'Overall': {
            [`% ${assocNameListWords} who answered`]: ((cleanedAgg.length / assocNameArr.map(assocName => resByAssoc[assoc.revGet(assocName)].length).reduce((a, b) => a + b)) * 100).toFixed(2) + '%',
            'Most answered (mode)': (() => {
                const modes = arrMode(cleanFlatAgg);
                const matchingByAssocName = Object.assign({}, assocNameObjToCopy);
                for (let assocName of assocNameArr) {
                    matchingByAssocName[assocName] = resByAssoc[assoc.revGet(assocName)].filter(res => modes[1].some(mode => res.get(qT).split(',').includes(mode)))
                }
                const totalMatching = assocNameArr.map(assocName => matchingByAssocName[assocName].length).reduce((a, b) => a + b);
                const totalResLength = assocNameArr.map(assocName => resByAssoc[assoc.revGet(assocName)].length).reduce((a, b) => a + b);
                return {
                    'Answer(s)': modes[1].toString(),
                    'Frequency': `${((totalMatching / totalResLength) * 100).toFixed(2)}% of ${assocNameListWords} (${totalMatching})`
                }
            })()
        },
        ...statsByAssocName
    }
};


export const multiGrpSingleChoiceStatsClosure = (resByAssoc: ResByAssoc) => (agg: string[], assocNameArr: string[], qT: QuestionTitle) => {
    const cleanedAgg = agg.filter(ans => ans !== '-99'); // FIXME: -99 filtering
    const assocNameObjToCopy = assocNameArr.reduce((obj, assocName) => { obj[assocName] = []; return obj; }, {});
    const cleanAggAnsByAssocName: { [x: string]: string[] } = Object.assign({}, assocNameObjToCopy);
    for (let assocName of assocNameArr) {
        for (let res of resByAssoc[assoc.revGet(assocName)]) {
            const ans = res.get(qT);
            if (ans !== '-99' && ans !== '') { // FIXME: -99 filtering
                cleanAggAnsByAssocName[assocName].push(ans);
            }
        }
    }

    // @ts-ignore FIXME:
    const assocNameWords = assocNameArr.map(assocName => assocName[0].toUpperCase() + assocName.slice(1)), assocNameListWords = new Intl.ListFormat('en', { type: 'conjunction' }).format(assocNameWords);

    const statsByAssocName = Object.assign({}, assocNameObjToCopy);

    for (let assocName of assocNameArr) {
        // FIXME: is all this necessary if one ans == one respondent?
        // can't we just do arrMode on the cleanFlatAggAnsByAssocName[assocName]
        const resByThisAssoc = resByAssoc[assoc.revGet(assocName)];
        const aggAnsByThisAssoc = cleanAggAnsByAssocName[assocName];
        const uniqueAnsToThisQuestion = aggAnsByThisAssoc.reduce((uniqueAnsArr, ans) => {
            if (!uniqueAnsArr.includes(ans)) uniqueAnsArr.push(ans);
            return uniqueAnsArr;
        }, []);
        const ansByThisAssocFreq: { [x: string]: number } = uniqueAnsToThisQuestion.reduce((obj, ans) => {
            obj[ans] = resByThisAssoc.filter(res => res.get(qT) === ans).length;
            return obj;
        }, {});
        statsByAssocName[assocName] = {
            [`% ${assocName} who answered`]: ((cleanAggAnsByAssocName[assocName].length / resByThisAssoc.length) * 100).toFixed(2) + '%',
            'Most answered (mode)': (() => {
                let modeAns = [];
                const modeFreq = Math.max(...Object.values(ansByThisAssocFreq));
                for (let [k, v] of Object.entries(ansByThisAssocFreq)) {
                    if (v === modeFreq) modeAns.push(k);
                }
                return {
                    'Answer(s)': modeAns.toString(),
                    'Frequency': `${((modeFreq / resByThisAssoc.length) * 100).toFixed(2)}% of ${assocName} (${modeFreq})`
                };
            })(),
            ...ansByThisAssocFreq
        };
    }

    return {
        'Overall': {
            [`% ${assocNameListWords} who answered`]: ((cleanedAgg.length / assocNameArr.map(assocName => resByAssoc[assoc.revGet(assocName)].length).reduce((a, b) => a + b)) * 100).toFixed(2) + '%',
            'Most answered (mode)': (() => {
                const modes = arrMode(cleanedAgg);
                const matchingByAssocName = Object.assign({}, assocNameObjToCopy);
                for (let assocName of assocNameArr) {
                    matchingByAssocName[assocName] = resByAssoc[assoc.revGet(assocName)].filter(res => modes[1].some(mode => res.get(qT) === mode));
                }
                const totalMatching = assocNameArr.map(assocName => matchingByAssocName[assocName].length).reduce((a, b) => a + b);
                const totalResLength = assocNameArr.map(assocName => resByAssoc[assoc.revGet(assocName)].length).reduce((a, b) => a + b);
                return {
                    'Answer(s)': modes[1].toString(),
                    'Frequency': `${((totalMatching / totalResLength) * 100).toFixed(2)}% of ${assocNameListWords} (${totalMatching})`
                }
            })()
        },
        ...statsByAssocName
    }
};