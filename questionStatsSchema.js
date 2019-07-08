const { classYearStats, defaultStatsClosure, multiChoiceStats, singleChoiceStats } = require('./questionStatsDefaults');

const { assoc } = require('./globalSymbols');
const { likert3ToNumber, likert5ToNumber, likertFreqToNumber, likert3Map, likert5Map, likertFreqMap } = require('./likertHelpers');

module.exports = (compArrRes, resByAssoc, questionTitles, defaultStats = defaultStatsClosure(resByAssoc)) => ({
    'total': () => compArrRes.length,
    'totalCurrStu': () => resByAssoc.cs.length,
    'totalGradStu': () => resByAssoc.gs.length,
    'totalCurrStuParent': () => resByAssoc.csp.length,
    'totalGradStuParent': () => resByAssoc.gsp.length,
    'totalTeacher': () => resByAssoc.t.length,
    'totalOther': () => resByAssoc.o.length,
    // currStu questions:
    [questionTitles[12]]: classYearStats,
    [questionTitles[68]]: agg => defaultStats(agg, likertFreqToNumber, assoc.cs),
    [questionTitles[69]]: agg => defaultStats(agg, likertFreqToNumber, assoc.cs),
        // Likert 1: 
        [questionTitles[70]]: agg => defaultStats(agg, likert3ToNumber, assoc.cs),
        [questionTitles[71]]: agg => defaultStats(agg, likert3ToNumber, assoc.cs),
        [questionTitles[72]]: agg => defaultStats(agg, likert3ToNumber, assoc.cs),
        [questionTitles[73]]: agg => defaultStats(agg, likert3ToNumber, assoc.cs),
        [questionTitles[74]]: agg => defaultStats(agg, likert3ToNumber, assoc.cs),
        [questionTitles[75]]: agg => defaultStats(agg, likert3ToNumber, assoc.cs),
        [questionTitles[76]]: agg => defaultStats(agg, likert3ToNumber, assoc.cs),
        [questionTitles[77]]: agg => defaultStats(agg, likert3ToNumber, assoc.cs),
        [questionTitles[78]]: agg => defaultStats(agg, likert3ToNumber, assoc.cs),
        [questionTitles[79]]: agg => defaultStats(agg, likert3ToNumber, assoc.cs),
        // Likert 2:
        [questionTitles[80]]: agg => defaultStats(agg, likert3ToNumber, assoc.cs),
        [questionTitles[81]]: agg => defaultStats(agg, likert3ToNumber, assoc.cs),
        [questionTitles[82]]: agg => defaultStats(agg, likert3ToNumber, assoc.cs),
        [questionTitles[83]]: agg => defaultStats(agg, likert3ToNumber, assoc.cs),
        [questionTitles[84]]: agg => defaultStats(agg, likert3ToNumber, assoc.cs),
        [questionTitles[85]]: agg => defaultStats(agg, likert3ToNumber, assoc.cs),
        [questionTitles[86]]: agg => defaultStats(agg, likert3ToNumber, assoc.cs),
        [questionTitles[87]]: agg => defaultStats(agg, likert3ToNumber, assoc.cs),
        [questionTitles[88]]: agg => defaultStats(agg, likert3ToNumber, assoc.cs),
        [questionTitles[89]]: agg => defaultStats(agg, likert3ToNumber, assoc.cs),
        // History of help:
        [questionTitles[90]]: multiChoiceStats,
        [questionTitles[92]]: multiChoiceStats,
        [questionTitles[94]]: multiChoiceStats,
        [questionTitles[96]]: {
            stats: multiChoiceStats,
            crossCheck: [
                {
                    question: questionTitles[88],
                    ansHere: ['Preparing for the SAT', 'Preparing for the ACT'],
                    ansThere: ['Agree', 'Neither agree nor disagree'],
                    assoc: assoc.cs,
                    opts: { a1Method: 'disjunction', a2Method: 'disjunction' }
                },
                {
                    question: questionTitles[86],
                    ansHere: ['Preparing for the SAT', 'Preparing for the ACT'],
                    ansThere: ['Disagree', 'Neither agree nor disagree'],
                    assoc: assoc.cs,
                    opts: { a1Method: 'disjunction', a2Method: 'disjunction' }
                }
            ]
        },
        // Interest lists:
        [questionTitles[98]]: multiChoiceStats,
        [questionTitles[100]]: multiChoiceStats,
        // Mentoring interest
        [questionTitles[102]]: singleChoiceStats,
        [questionTitles[103]]: singleChoiceStats,
        // Likert 3: 1-6
        [questionTitles[104]]: agg => defaultStats(agg, likert3ToNumber, assoc.cs),
        [questionTitles[105]]: agg => defaultStats(agg, likert3ToNumber, assoc.cs),
        [questionTitles[106]]: agg => defaultStats(agg, likert3ToNumber, assoc.cs),
        [questionTitles[107]]: agg => defaultStats(agg, likert3ToNumber, assoc.cs),
        [questionTitles[108]]: agg => defaultStats(agg, likert3ToNumber, assoc.cs),
        [questionTitles[109]]: agg => defaultStats(agg, likert3ToNumber, assoc.cs),
        // Reasons wouldn't ask peer?
        [questionTitles[110]]: multiChoiceStats,

    // gradStu questions:
    [questionTitles[13]]: classYearStats,
});