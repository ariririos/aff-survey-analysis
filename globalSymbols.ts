export type QuestionTitle = string; // questionTitle is just a type of string for now since TS doesn't like symbols as object keys??
export type Response = Map<QuestionTitle, string>
export type ResByAssoc = { [assoc: string]: Response[] };

export const assocDictByLong = {
    'Current student (2019 or later)': 'cs',
    'Graduate (2018 or earlier)': 'gs',
     'Parent or guardian of current student (2019 or later)': 'csp',
     'Parent or guardian of graduate (2018 or earlier)': 'gsp',
     'Current or former OHS teacher': 't',
     'Other (including OHS staff, and other OCSD teachers or staff)': 'o'
 };

 export const assocDictByShort = Object.keys(assocDictByLong).reduce((o, k) => { o[assocDictByLong[k]] = k; return o; }, {});

class TwoWayStringDict {
    map: { [x: string]: string };
    reverseMap: { [x: string]: string };
    constructor(map: { [x: string]: string; }) {
        this.map = map;
        this.reverseMap = {};
        for (let key in map) {
            if (map.hasOwnProperty(key) && key !== 'revGet') {
                const value = map[key];
                this[key] = value;
                this.reverseMap[value] = key;
            }
        }
    }
    revGet(key: string) { return this.reverseMap[key]; }
}

type AssocDict = { [P: string]: string };

function TwoWayStringDictFactory(dict: { [x: string]: string }): TwoWayStringDict & AssocDict {
    return new TwoWayStringDict(dict) as TwoWayStringDict & AssocDict;
}

export const assoc = TwoWayStringDictFactory({
    cs: 'students',
    gs: 'graduates',
    csp: 'current student parents',
    gsp: 'graduate parents',
    t: 'teachers'
});

// possible choices:
// single choice, multi choice, likert 3, likert 5, textbox, likertFreq

/**
 * Maps question titles to their corresponding question type.
 * @param questionTitles - global question titles array
 */
export const questionTypesByTitleClosure = (qT: QuestionTitle[]) => ({
    [qT[12]]: 'singleChoice',
    [qT[68]]: 'singleChoice',
    [qT[69]]: 'singleChoice',
    [qT[70]]: 'likert3',
    [qT[71]]: 'likert3',
    [qT[72]]: 'likert3',
    [qT[73]]: 'likert3',
    [qT[74]]: 'likert3',
    [qT[75]]: 'likert3',
    [qT[76]]: 'likert3',
    [qT[77]]: 'likert3',
    [qT[78]]: 'likert3',
    [qT[79]]: 'likert3',
    [qT[80]]: 'likert3',
    [qT[81]]: 'likert3',
    [qT[82]]: 'likert3',
    [qT[83]]: 'likert3',
    [qT[84]]: 'likert3',
    [qT[85]]: 'likert3',
    [qT[86]]: 'likert3',
    [qT[87]]: 'likert3',
    [qT[88]]: 'likert3',
    [qT[89]]: 'likert3',
    [qT[90]]: 'multiChoice',
    [qT[92]]: 'multiChoice',
    [qT[94]]: 'multiChoice',
    [qT[96]]: 'multiChoice',
    [qT[98]]: 'multiChoice',
    [qT[100]]: 'multiChoice',
    [qT[102]]: 'singleChoice',
    [qT[103]]: 'singleChoice',
    [qT[104]]: 'likert3',
    [qT[105]]: 'likert3',
    [qT[106]]: 'likert3',
    [qT[107]]: 'likert3',
    [qT[108]]: 'likert3',
    [qT[109]]: 'likert3',
    [qT[110]]: 'multiChoice',
    // GRADSTU
    [qT[13]]: 'textbox',
    // CURRSTUPARENT
});

/**
 * Maps question titles to their verbal short titles.
 * @param qT - global question titles array
 */
export const questionTitlesToShortTitlesClosure = (qT: QuestionTitle[]) => ({
    // CURRSTU
    [qT[12]]: 'Years that answered',
    [qT[68]]: 'How often struggle w/ schoolwork per week?',
    [qT[69]]: 'How often struggle to find help?',
    [qT[70]]: 'Likert 1: Easy to find academic support?',
    [qT[71]]: 'Likert 1: Can access support where you need it?',
    [qT[72]]: 'Likert 1: Know whom to ask for help?',
    [qT[73]]: 'Likert 1: Know whom to ask but don\'t?',
    [qT[74]]: 'Likert 1: Know whom to ask but don\'t b/c uncomfortable?',
    [qT[75]]: 'Likert 1: Feel confident that people you ask know how to help?',
    [qT[76]]: 'Likert 1: Is help available convenient?',
    [qT[77]]: 'Likert 1: Support helpful this year?',
    [qT[78]]: 'Likert 1: Support too basic or too advanced?',
    [qT[79]]: 'Likert 1: Know whom to talk to if unsatisfied with quality of support?',
    [qT[80]]: 'Likert 2: Easy to find other academics support?',
    [qT[81]]: 'Likert 2: Can access support where you need it?',
    [qT[82]]: 'Likert 2: Know whom to ask for help?',
    [qT[83]]: 'Likert 2: Know whom to ask but don\'t?',
    [qT[84]]: 'Likert 2: Know whom to ask but don\'t b/c uncomfortable?',
    [qT[85]]: 'Likert 2: Feel confident that people you ask know how to help?',
    [qT[86]]: 'Likert 2: Is help available convenient?',
    [qT[87]]: 'Likert 2: Support helpful this year?',
    [qT[88]]: 'Likert 2: Support too basic or too advanced?',
    [qT[89]]: 'Likert 2: Know whom to talk to if unsatisfied with quality of support?',
    [qT[90]]: 'Which school subjects could find help with?',
    [qT[92]]: 'Which school subjects couldn\'t find help with?',
    [qT[94]]: 'Which other academics could find help with?',
    [qT[96]]: 'Which other academics couldn\'t find help with?',
    [qT[98]]: 'Which school subjects would ask for help with?',
    [qT[100]]: 'Which other academics would ask for help with?',
    [qT[102]]: 'Interested in being mentored',
    [qT[103]]: 'Interested in being a mentor',
    [qT[104]]: 'Likert 3: have peers for support?',
    [qT[105]]: 'Likert 3: ask peers for support?',
    [qT[106]]: 'Likert 3: comfortable asking peers about schoolwork?',
    [qT[107]]: 'Likert 3: comfortable asking peers about other academics?',
    [qT[108]]: 'Likert 3: prefer peer help for schoolwork?',
    [qT[109]]: 'Likert 3: prefer peer help for other academics?',
    [qT[110]]: 'Why wouldn\'t ask peers for help?',
    // CURRSTUPARENT
    [qT[14]]: 'How many children currently at OHS?',
    [qT[15]]: 'Child\'s/children\'s class year(s)',
        // Likert 1:
        [qT[34]]: 'Likert 1: Easy for student(s) to find academic support?',
        [qT[35]]: 'Likert 1: Can access support where they need it?',
        [qT[36]]: 'Likert 1: I or they know whom to ask for help?',
        [qT[37]]: 'Likert 1: I or they know whom to ask but don\'t?',
        [qT[38]]: 'Likert 1: I feel confident that people student asks know how to help?',
        [qT[39]]: 'Likert 1: Is help available convenient for student and me?',
        [qT[40]]: 'Likert 1: Support helpful this year?',
        [qT[41]]: 'Likert 1: Support too basic or too advanced for student?',
        [qT[42]]: 'Likert 1: I know whom to talk to if unsatisfied with quality of support?',
        // Likert 2:
        [qT[43]]: 'Likert 2: Easy for student(s) to find other academics support?',
        [qT[44]]: 'Likert 2: Can access support where they need it?',
        [qT[45]]: 'Likert 2: I or they know whom to ask for help?',
        [qT[46]]: 'Likert 2: I or they know whom to ask but don\'t?',
        [qT[47]]: 'Likert 2: I feel confident that people student asks know how to help?',
        [qT[48]]: 'Likert 2: Is help available convenient for student and me?',
        [qT[49]]: 'Likert 2: Support helpful this year?',
        [qT[50]]: 'Likert 2: Support too basic or too advanced for student?',
        [qT[51]]: 'Likert 2: I know whom to talk to if unsatisfied with quality of support?',
    // GRADSTU
    [qT[13]]: 'Years that answered'
});