const { assoc } = require('./globalSymbols');
const { likertToWords } = require('./likertHelpers');
const { arrMean, arrMedian, arrMode, arrayToInstances } = require('./arrayHelpers');

const defaultStatsClosure = (resByAssoc) => (agg, converter, assocName) => ({
    [`% ${assocName} who answered`]: converter(agg).length / resByAssoc[Object.keys(assoc).find(key => assoc[key] === assocName)].length * 100 + '%',
    'Mean': likertToWords(arrMean(converter(agg).filter(res => !Number.isNaN(res))), converter),
    'Mode': (() => {
        const modes = arrMode(converter(agg).filter(res => !Number.isNaN(res)));
        return { 'Answers': modes[1].map(mode => likertToWords(mode, converter)).toString(), 'Frequency': modes[0] };
    })(),
    'Median': likertToWords(arrMedian(converter(agg)), converter)
});

const classYearStats = agg => {
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

// agg: Array of comma separated strings of answers, and -99
const multiChoiceStats = agg => {
    const cleanedAgg = agg.filter(ans => ans != '-99').map(ans => ans.split(',')); // FIXME: -99 filtering
    const flatAgg = cleanedAgg.flat();
    // const subjects = arrayToInstances(flatAgg); TODO: not implementing yet
    return {
        'Most answered (mode)': (() => {
            const modes = arrMode(flatAgg);
            return {
                'Answer(s)': modes[1].toString(),
                'Frequency': `${((modes[0] / cleanedAgg.length) * 100).toFixed(2)}% (${modes[0]})`
            }
            // FIXME: add %
        })()
    };
};

const singleChoiceStats = agg => {
    const cleanedAgg = agg.filter(ans => ans != '-99');
    return arrayToInstances(cleanedAgg);
}

module.exports = { defaultStatsClosure, classYearStats, multiChoiceStats, singleChoiceStats };