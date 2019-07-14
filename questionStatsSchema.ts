import { classYearStats, defaultStatsClosure, multiChoiceStatsClosure, singleChoiceStatsClosure, multiGrpMultiChoiceStatsClosure } from './questionStatsDefaults';
import { assoc, QuestionTitle, ResByAssoc } from './globalSymbols';
import { likert3ToNumber, likert5ToNumber, likertFreqToNumber, likert3Map, likert5Map, likertFreqMap } from './likertHelpers';

/**
 * @param compArrRes - responses arranged by QuestionTitle => String, filtered for completion as marked by Qualtrics
 * @param resByAssoc - completed arranged responses organized by association
 * @param questionTitles - global question titles array
 * @param defaultStats - closure returning function with resByAssoc in scope for likert question stats
 * @param singleChoiceStats - closure returning function with resByAssoc in scope for single choice question stats
 * @param multiChoiceStats - closure returning function with resByAssoc in scope for multiple choice question stats
 */
export default (
        compArrRes: Map<QuestionTitle, string>[],
        resByAssoc: ResByAssoc,
        qT: QuestionTitle[],
        defaultStats = defaultStatsClosure(resByAssoc),
        singleChoiceStats = singleChoiceStatsClosure(resByAssoc),
        multiChoiceStats = multiChoiceStatsClosure(resByAssoc),
        multiGrpMultiChoiceStats = multiGrpMultiChoiceStatsClosure(resByAssoc)
    ) => ({
    'total': () => compArrRes.length,
    'totalCurrStu': () => resByAssoc.cs.length,
    'totalGradStu': () => resByAssoc.gs.length,
    'totalCurrStuParent': () => resByAssoc.csp.length,
    'totalGradStuParent': () => resByAssoc.gsp.length,
    'totalTeacher': () => resByAssoc.t.length,
    'totalOther': () => resByAssoc.o.length,
    // currStu questions:
    [qT[12]]: classYearStats,
    [qT[68]]: agg => defaultStats(agg, likertFreqToNumber, assoc.cs),
    [qT[69]]: agg => defaultStats(agg, likertFreqToNumber, assoc.cs),
        // Likert 1:
        [qT[70]]: agg => defaultStats(agg, likert3ToNumber, assoc.cs),
        [qT[71]]: agg => defaultStats(agg, likert3ToNumber, assoc.cs),
        [qT[72]]: agg => defaultStats(agg, likert3ToNumber, assoc.cs),
        [qT[73]]: agg => defaultStats(agg, likert3ToNumber, assoc.cs),
        [qT[74]]: agg => defaultStats(agg, likert3ToNumber, assoc.cs),
        [qT[75]]: agg => defaultStats(agg, likert3ToNumber, assoc.cs),
        [qT[76]]: agg => defaultStats(agg, likert3ToNumber, assoc.cs),
        [qT[77]]: agg => defaultStats(agg, likert3ToNumber, assoc.cs),
        [qT[78]]: agg => defaultStats(agg, likert3ToNumber, assoc.cs),
        [qT[79]]: agg => defaultStats(agg, likert3ToNumber, assoc.cs),
        // Likert 2:
        [qT[80]]: agg => defaultStats(agg, likert3ToNumber, assoc.cs),
        [qT[81]]: agg => defaultStats(agg, likert3ToNumber, assoc.cs),
        [qT[82]]: agg => defaultStats(agg, likert3ToNumber, assoc.cs),
        [qT[83]]: agg => defaultStats(agg, likert3ToNumber, assoc.cs),
        [qT[84]]: agg => defaultStats(agg, likert3ToNumber, assoc.cs),
        [qT[85]]: agg => defaultStats(agg, likert3ToNumber, assoc.cs),
        [qT[86]]: agg => defaultStats(agg, likert3ToNumber, assoc.cs),
        [qT[87]]: agg => defaultStats(agg, likert3ToNumber, assoc.cs),
        [qT[88]]: agg => defaultStats(agg, likert3ToNumber, assoc.cs),
        [qT[89]]: agg => defaultStats(agg, likert3ToNumber, assoc.cs),
        // History of help:
        [qT[90]]: agg => multiChoiceStats(agg, assoc.cs, qT[90]),
        [qT[92]]: agg => multiChoiceStats(agg, assoc.cs, qT[92]),
        [qT[94]]: agg => multiChoiceStats(agg, assoc.cs, qT[94]),
        [qT[96]]: {
            stats: agg => multiChoiceStats(agg, assoc.cs, qT[96]),
            crossCheck: [
                {
                    question: qT[88],
                    ansHere: ['Preparing for the SAT', 'Preparing for the ACT'],
                    ansThere: ['Agree', 'Neither agree nor disagree'],
                    assoc: assoc.cs,
                    opts: { a1Method: 'disjunction', a2Method: 'disjunction' }
                },
                {
                    question: qT[86],
                    ansHere: ['Preparing for the SAT', 'Preparing for the ACT'],
                    ansThere: ['Disagree', 'Neither agree nor disagree'],
                    assoc: assoc.cs,
                    opts: { a1Method: 'disjunction', a2Method: 'disjunction' }
                },
                {
                    question: qT[96],
                    ansHere: 'Preparing for the SAT',
                    ansThere: 'Preparing for the ACT',
                    assoc: assoc.cs
                }
            ]
        },
        // Interest lists:
        [qT[98]]: agg => multiChoiceStats(agg, assoc.cs, qT[98]),
        [qT[100]]: agg => multiChoiceStats(agg, assoc.cs, qT[100]),
        // Mentoring interest
        [qT[102]]: agg => singleChoiceStats(agg, assoc.cs, qT[102]),
        [qT[103]]: agg => singleChoiceStats(agg, assoc.cs, qT[103]),
        // Likert 3: 1-6
        [qT[104]]: agg => defaultStats(agg, likert3ToNumber, assoc.cs),
        [qT[105]]: agg => defaultStats(agg, likert3ToNumber, assoc.cs),
        [qT[106]]: agg => defaultStats(agg, likert3ToNumber, assoc.cs),
        [qT[107]]: agg => defaultStats(agg, likert3ToNumber, assoc.cs),
        [qT[108]]: agg => defaultStats(agg, likert3ToNumber, assoc.cs),
        [qT[109]]: agg => defaultStats(agg, likert3ToNumber, assoc.cs),
        // Reasons wouldn't ask peer?
        [qT[110]]: agg => multiChoiceStats(agg, assoc.cs, qT[110]),

    // currStuParent questions:
    [qT[14]]: agg => singleChoiceStats(agg, assoc.csp, qT[14]),
    [qT[15]]: agg => multiChoiceStats(agg, assoc.csp, qT[15]),
        // Likert 1:
        [qT[34]]: agg => defaultStats(agg, likert3ToNumber, assoc.csp),
        [qT[35]]: agg => defaultStats(agg, likert3ToNumber, assoc.csp),
        [qT[36]]: agg => defaultStats(agg, likert3ToNumber, assoc.csp),
        [qT[37]]: agg => defaultStats(agg, likert3ToNumber, assoc.csp),
        [qT[38]]: agg => defaultStats(agg, likert3ToNumber, assoc.csp),
        [qT[39]]: agg => defaultStats(agg, likert3ToNumber, assoc.csp),
        [qT[40]]: agg => defaultStats(agg, likert3ToNumber, assoc.csp),
        [qT[41]]: agg => defaultStats(agg, likert3ToNumber, assoc.csp),
        [qT[42]]: agg => defaultStats(agg, likert3ToNumber, assoc.csp),
        // Likert 2:
        [qT[43]]: agg => defaultStats(agg, likert3ToNumber, assoc.csp),
        [qT[44]]: agg => defaultStats(agg, likert3ToNumber, assoc.csp),
        [qT[45]]: agg => defaultStats(agg, likert3ToNumber, assoc.csp),
        [qT[46]]: agg => defaultStats(agg, likert3ToNumber, assoc.csp),
        [qT[47]]: agg => defaultStats(agg, likert3ToNumber, assoc.csp),
        [qT[48]]: agg => defaultStats(agg, likert3ToNumber, assoc.csp),
        [qT[49]]: agg => defaultStats(agg, likert3ToNumber, assoc.csp),
        [qT[50]]: agg => defaultStats(agg, likert3ToNumber, assoc.csp),
        [qT[51]]: agg => defaultStats(agg, likert3ToNumber, assoc.csp),
    // parents and teachers questions:
    [qT[140]]: agg => multiGrpMultiChoiceStats(agg, [assoc.csp, assoc.gsp, assoc.t], qT[140]),
    // gradStu questions:
    [qT[13]]: classYearStats,
});