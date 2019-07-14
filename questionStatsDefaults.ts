import { assoc, ResByAssoc, QuestionTitle } from './globalSymbols';
import { likertToWords } from './likertHelpers';
import { arrMean, arrMedian, arrMode, arrayToInstances, arrayToInstancesMap } from './arrayHelpers';

export const defaultStatsClosure = (resByAssoc: ResByAssoc) => (
        agg: string[],
        converter: (agg: string[]) => number[],
        assocName: string
    ) => ({ // FIXME: do I need -99 filtering here?
    [`% ${assocName} who answered`]: ((converter(agg).length / resByAssoc[assoc.revGet(assocName)].length) * 100).toFixed(2) + '%',
    'Mean': likertToWords(+arrMean(converter(agg).filter(res => !Number.isNaN(res))).toFixed(2), converter),
    'Mode': (() => {
        const modes = arrMode(converter(agg).filter(res => !Number.isNaN(res)));
        return { 'Answers': modes[1].map(mode => likertToWords(+mode, converter)).toString(), 'Frequency': `${((modes[0] / agg.length) * 100).toFixed(2)}% (${modes[0]})` };
    })(),
    'Median': likertToWords(arrMedian(converter(agg)), converter)
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
    const cleanedAgg = agg.filter(ans => ans != '-99').map(ans => ans.split(',')); // FIXME: -99 filtering
    const flatAgg = cleanedAgg.flat();
    // const subjects = arrayToInstances(flatAgg); TODO: not implementing yet
    return {
        [`% ${assocName} who answered`]: ((cleanedAgg.length / resByAssoc[assoc.revGet(assocName)].length) * 100).toFixed(2) + '%',
        'Most answered (mode)': (() => {
            const modes = arrMode(flatAgg);
            const matchingStudents = resByAssoc[assoc.revGet(assocName)].filter(res => modes[1].some(mode => res.get(qT).split(',').includes(mode)));
            return {
                'Answer(s)': modes[1].toString(),
                'Frequency': `${((matchingStudents.length / resByAssoc[assoc.revGet(assocName)].length) * 100).toFixed(2)}% of ${assocName} (${matchingStudents.length})`
                // 34% of students (# of students)
            }
        })()
    };
};

export const singleChoiceStatsClosure = (resByAssoc: ResByAssoc) => (agg: string[], assocName: string, qT: QuestionTitle) => {
    const cleanedAgg = agg.filter(ans => ans != '-99');
    const answeredStudents = resByAssoc[assoc.revGet(assocName)].filter(res => res.get(qT) !== '' && res.get(qT) !== '-99');
    const instancesTuples = [...arrayToInstancesMap(cleanedAgg)].map(([value]) => {
        const matchingStudents = answeredStudents.filter(res => res.get(qT) === value);
        return [value, `${((matchingStudents.length / resByAssoc[assoc.revGet(assocName)].length) * 100).toFixed(2)}% of ${assocName} (${matchingStudents.length})`]
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

export const multiGrpMultiChoiceStatsClosure = (resByAssoc: ResByAssoc) => (agg: string[], assocArr: string[], qT: QuestionTitle) => {
    
};