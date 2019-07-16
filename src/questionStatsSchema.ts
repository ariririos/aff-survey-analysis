import { classYearStats, defaultStatsClosure, multiChoiceStatsClosure, singleChoiceStatsClosure, multiGrpMultiChoiceStatsClosure, multiGrpSingleChoiceStatsClosure } from './questionStatsDefaults';
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
        multiGrpMultiChoiceStats = multiGrpMultiChoiceStatsClosure(resByAssoc),
        multiGrpSingleChoiceStats = multiGrpSingleChoiceStatsClosure(resByAssoc)
    ) => ({
    'total': () => compArrRes.length,
    'totalCurrStu': () => resByAssoc.cs.length,
    'totalGradStu': () => resByAssoc.gs.length,
    'totalCurrStuParentGuardian': () => resByAssoc.csp.length,
    'totalGradStuParentGuardian': () => resByAssoc.gsp.length,
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
    // teachers
        // Likert 1:
        [qT[18]]: agg => defaultStats(agg, likert5ToNumber, assoc.t),
        [qT[19]]: agg => defaultStats(agg, likert5ToNumber, assoc.t),
        [qT[20]]: agg => defaultStats(agg, likert5ToNumber, assoc.t),
        [qT[21]]: agg => defaultStats(agg, likert5ToNumber, assoc.t),
        [qT[22]]: agg => defaultStats(agg, likert5ToNumber, assoc.t),
        [qT[23]]: agg => defaultStats(agg, likert5ToNumber, assoc.t),
    [qT[24]]: agg => singleChoiceStats(agg, assoc.t, qT[24]),
    [qT[25]]: agg => singleChoiceStats(agg, assoc.t, qT[25]),
        // FIXME: default stats won't work here for indicating % of totals under branch that answered; but might not need it cause it's super specific to this group and can be figured out with some math
        // Yes, every time Likert:
        [qT[26]]: agg => defaultStats(agg, likert5ToNumber, assoc.t),
        [qT[27]]: agg => defaultStats(agg, likert5ToNumber, assoc.t),
        // Yes, not every time Likert:
        [qT[28]]: agg => defaultStats(agg, likert5ToNumber, assoc.t),
        [qT[29]]: agg => defaultStats(agg, likert5ToNumber, assoc.t),
        [qT[30]]: agg => defaultStats(agg, likert5ToNumber, assoc.t),
        [qT[31]]: agg => defaultStats(agg, likert5ToNumber, assoc.t),
        // No, never Likert:
        [qT[32]]: agg => defaultStats(agg, likert5ToNumber, assoc.t),
        [qT[33]]: agg => defaultStats(agg, likert5ToNumber, assoc.t),
    // parents and teachers questions:
    [qT[140]]: agg => multiGrpMultiChoiceStats(agg, [assoc.csp, assoc.t], qT[140]),
    [qT[142]]: agg => multiGrpMultiChoiceStats(agg, [assoc.csp, assoc.t], qT[142]),
    [qT[144]]: agg => multiGrpSingleChoiceStats(agg, [assoc.csp, assoc.t], qT[144]),
    // gradStu questions:
    [qT[13]]: classYearStats,
    [qT[112]]: agg => singleChoiceStats(agg, assoc.gs, qT[112]),
    [qT[113]]: agg => singleChoiceStats(agg, assoc.gs, qT[113]),
        // Likert 1:
        [qT[114]]: agg => defaultStats(agg, likert3ToNumber, assoc.gs),
        [qT[115]]: agg => defaultStats(agg, likert3ToNumber, assoc.gs),
        [qT[116]]: agg => defaultStats(agg, likert3ToNumber, assoc.gs),
        [qT[117]]: agg => defaultStats(agg, likert3ToNumber, assoc.gs),
        [qT[118]]: agg => defaultStats(agg, likert3ToNumber, assoc.gs),
        [qT[119]]: agg => defaultStats(agg, likert3ToNumber, assoc.gs),
        [qT[120]]: agg => defaultStats(agg, likert3ToNumber, assoc.gs),
        [qT[121]]: agg => defaultStats(agg, likert3ToNumber, assoc.gs),
        [qT[122]]: agg => defaultStats(agg, likert3ToNumber, assoc.gs),
        // Likert 2:
        [qT[123]]: agg => defaultStats(agg, likert3ToNumber, assoc.gs),
        [qT[124]]: agg => defaultStats(agg, likert3ToNumber, assoc.gs),
        [qT[125]]: agg => defaultStats(agg, likert3ToNumber, assoc.gs),
        [qT[126]]: agg => defaultStats(agg, likert3ToNumber, assoc.gs),
        [qT[127]]: agg => defaultStats(agg, likert3ToNumber, assoc.gs),
        [qT[128]]: agg => defaultStats(agg, likert3ToNumber, assoc.gs),
        [qT[129]]: agg => defaultStats(agg, likert3ToNumber, assoc.gs),
        [qT[130]]: agg => defaultStats(agg, likert3ToNumber, assoc.gs),
        [qT[131]]: agg => defaultStats(agg, likert3ToNumber, assoc.gs),
    [qT[132]]: agg => multiChoiceStats(agg, assoc.gs, qT[132]),
    [qT[134]]: agg => multiChoiceStats(agg, assoc.gs, qT[134]),
    [qT[136]]: agg => multiChoiceStats(agg, assoc.gs, qT[136]),
    [qT[138]]: agg => multiChoiceStats(agg, assoc.gs, qT[138]),
    // gradParent questions
    [qT[16]]: agg => singleChoiceStats(agg, assoc.gsp, qT[16]),
    [qT[17]]: classYearStats,
        // Likert 1:
        [qT[52]]: agg => defaultStats(agg, likert3ToNumber, assoc.gsp),
        [qT[53]]: agg => defaultStats(agg, likert3ToNumber, assoc.gsp),
        [qT[54]]: agg => defaultStats(agg, likert3ToNumber, assoc.gsp),
        [qT[55]]: agg => defaultStats(agg, likert3ToNumber, assoc.gsp),
        [qT[56]]: agg => defaultStats(agg, likert3ToNumber, assoc.gsp),
        [qT[57]]: agg => defaultStats(agg, likert3ToNumber, assoc.gsp),
        [qT[58]]: agg => defaultStats(agg, likert3ToNumber, assoc.gsp),
        [qT[59]]: agg => defaultStats(agg, likert3ToNumber, assoc.gsp),
        // Likert 2:
        [qT[60]]: agg => defaultStats(agg, likert3ToNumber, assoc.gsp),
        [qT[61]]: agg => defaultStats(agg, likert3ToNumber, assoc.gsp),
        [qT[62]]: agg => defaultStats(agg, likert3ToNumber, assoc.gsp),
        [qT[63]]: agg => defaultStats(agg, likert3ToNumber, assoc.gsp),
        [qT[64]]: agg => defaultStats(agg, likert3ToNumber, assoc.gsp),
        [qT[65]]: agg => defaultStats(agg, likert3ToNumber, assoc.gsp),
        [qT[66]]: agg => defaultStats(agg, likert3ToNumber, assoc.gsp),
        [qT[67]]: agg => defaultStats(agg, likert3ToNumber, assoc.gsp),
    // Exit matter
    [qT[145]]: agg => {
        // steps: output all answers
        // note how many total answered
        // note how many total answered by assoc
        const resWhoAnswered = compArrRes.filter(res => res.get(qT[145]) !== '' && res.get(qT[145]) !== '-99'); // FIXME: compArrRes usage
        const resLenByAssoc = [assoc.cs, assoc.csp, assoc.gs, assoc.gsp, assoc.t].reduce((obj, assocName) => {
            obj[assocName] = resWhoAnswered.filter(res => resByAssoc[assoc.revGet(assocName)].includes(res)).length;
            return obj;
        }, {});

        return {
            "All answers": agg.reduce((obj, ans) => {
                obj[ans] = {};
                return obj;
            }, {}),
            "% of respondents who answered": `${((resWhoAnswered.length / compArrRes.length) * 100).toFixed(2)}% (${resWhoAnswered.length})`,   // FIXME: using completed responses
            "% who answered by association": { ...resLenByAssoc }
        };
    }
    // FIXME: missing assoc.cs and % over 100
    // [qT[146]]: agg => multiGrpSingleChoiceStats(agg, [assoc.cs, assoc.csp, assoc.gs, assoc.gsp, assoc.t], qT[146])
});