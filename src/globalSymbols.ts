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

const twoWayStringDictPrivateStorage = new WeakMap();
const twoWayStringDictStorage = (obj) => {
    if (!twoWayStringDictPrivateStorage.has(obj)) twoWayStringDictPrivateStorage.set(obj, Object.create(null));
    return twoWayStringDictPrivateStorage.get(obj);
}

class TwoWayStringDict {
    constructor(map: { [x: string]: string; }) {
        twoWayStringDictStorage(this).reverseMap = {};
        for (let key in map) {
            if (map.hasOwnProperty(key) && key !== 'revGet') {
                const value = map[key];
                this[key] = value;
                twoWayStringDictStorage(this).reverseMap[value] = key;
            }
        }
    }
    revGet(key: string) { return twoWayStringDictStorage(this).reverseMap[key]; }
}

type AssocDict = { [P: string]: string };

function TwoWayStringDictFactory(dict: { [x: string]: string }): TwoWayStringDict & AssocDict {
    return new TwoWayStringDict(dict) as TwoWayStringDict & AssocDict;
}

export const assoc = TwoWayStringDictFactory({
    cs: 'students',
    gs: 'graduates',
    csp: 'current student parents/guardians',
    gsp: 'graduate parents/guardians',
    t: 'teachers'
});

// possible choices:
// single choice, multi choice, likert 3, likert 5, textbox, likertFreq

/**
 * Maps question titles to their corresponding question type.
 * @param questionTitles - global question titles array
 */
export const questionTypesByTitleClosure = (qT: QuestionTitle[]) => ({
    // CURRSTU
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
    // CURRSTUPARENT
    [qT[14]]: 'singleChoice',
    [qT[15]]: 'multiChoice',
    [qT[34]]: 'likert3',
    [qT[35]]: 'likert3',
    [qT[36]]: 'likert3',
    [qT[37]]: 'likert3',
    [qT[38]]: 'likert3',
    [qT[39]]: 'likert3',
    [qT[40]]: 'likert3',
    [qT[41]]: 'likert3',
    [qT[42]]: 'likert3',
    [qT[43]]: 'likert3',
    [qT[44]]: 'likert3',
    [qT[45]]: 'likert3',
    [qT[46]]: 'likert3',
    [qT[47]]: 'likert3',
    [qT[48]]: 'likert3',
    [qT[49]]: 'likert3',
    [qT[50]]: 'likert3',
    [qT[51]]: 'likert3',
    // TEACHERS
    [qT[18]]: 'likert5',
    [qT[19]]: 'likert5',
    [qT[20]]: 'likert5',
    [qT[21]]: 'likert5',
    [qT[22]]: 'likert5',
    [qT[23]]: 'likert5',
    [qT[24]]: 'singleChoice',
    [qT[25]]: 'singleChoice',
    [qT[26]]: 'likert5',
    [qT[27]]: 'likert5',
    [qT[28]]: 'likert5',
    [qT[29]]: 'likert5',
    [qT[30]]: 'likert5',
    [qT[31]]: 'likert5',
    [qT[32]]: 'likert5',
    [qT[33]]: 'likert5',
    // PARENTS + TEACHERS
    [qT[140]]: 'multiChoice',
    [qT[142]]: 'multiChoice',
    [qT[144]]: 'singleChoice',
    // GRADSTU
    [qT[13]]: 'textbox',
    [qT[112]]: 'singleChoice',
    [qT[113]]: 'singleChoice',
    [qT[114]]: 'likert3',
    [qT[115]]: 'likert3',
    [qT[116]]: 'likert3',
    [qT[117]]: 'likert3',
    [qT[118]]: 'likert3',
    [qT[119]]: 'likert3',
    [qT[120]]: 'likert3',
    [qT[121]]: 'likert3',
    [qT[122]]: 'likert3',
    [qT[123]]: 'likert3',
    [qT[124]]: 'likert3',
    [qT[125]]: 'likert3',
    [qT[126]]: 'likert3',
    [qT[127]]: 'likert3',
    [qT[128]]: 'likert3',
    [qT[129]]: 'likert3',
    [qT[130]]: 'likert3',
    [qT[131]]: 'likert3',
    [qT[132]]: 'multiChoice',
    [qT[134]]: 'multiChoice',
    [qT[136]]: 'multiChoice',
    [qT[138]]: 'multiChoice',
    // GRADPARENT
    [qT[16]]: 'singleChoice',
    [qT[17]]: 'textbox',
    [qT[52]]: 'likert3',
    [qT[53]]: 'likert3',
    [qT[54]]: 'likert3',
    [qT[55]]: 'likert3',
    [qT[56]]: 'likert3',
    [qT[57]]: 'likert3',
    [qT[58]]: 'likert3',
    [qT[59]]: 'likert3',
    [qT[60]]: 'likert3',
    [qT[61]]: 'likert3',
    [qT[62]]: 'likert3',
    [qT[63]]: 'likert3',
    [qT[64]]: 'likert3',
    [qT[65]]: 'likert3',
    [qT[66]]: 'likert3',
    [qT[67]]: 'likert3',
    // Exit matter
    [qT[145]]: 'textbox'
    // [qT[146]]: 'singleChoice'
});

/**
 * Maps question titles to their verbal short titles.
 * @param qT - global question titles array
 */
export const questionTitlesToShortTitlesClosure = (qT: QuestionTitle[]) => ({
    /**
     * CURRSTU
     */
    [qT[12]]: 'Years that answered',
    [qT[68]]: 'How often struggle w/ schoolwork per week?',
    [qT[69]]: 'How often struggle to find help?',
        // LIKERT 1
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
        // LIKERT 2
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
        // LIKERT 3
        [qT[104]]: 'Likert 3: have peers for support?',
        [qT[105]]: 'Likert 3: ask peers for support?',
        [qT[106]]: 'Likert 3: comfortable asking peers about schoolwork?',
        [qT[107]]: 'Likert 3: comfortable asking peers about other academics?',
        [qT[108]]: 'Likert 3: prefer peer help for schoolwork?',
        [qT[109]]: 'Likert 3: prefer peer help for other academics?',
    [qT[110]]: 'Why wouldn\'t ask peers for help?',
    /**
     * CURRSTUPARENT
     */
    [qT[14]]: 'How many children currently at OHS?',
    [qT[15]]: 'Child\'s/children\'s class year(s)',
        // LIKERT 1:
        [qT[34]]: 'Likert 1: Easy for student(s) to find academic support?',
        [qT[35]]: 'Likert 1: Can access support where they need it?',
        [qT[36]]: 'Likert 1: I or they know whom to ask for help?',
        [qT[37]]: 'Likert 1: I or they know whom to ask but don\'t?',
        [qT[38]]: 'Likert 1: I feel confident that people student asks know how to help?',
        [qT[39]]: 'Likert 1: Is help available convenient for student and me?',
        [qT[40]]: 'Likert 1: Support helpful this year?',
        [qT[41]]: 'Likert 1: Support too basic or too advanced for student?',
        [qT[42]]: 'Likert 1: I know whom to talk to if unsatisfied with quality of support?',
        // LIKERT 2:
        [qT[43]]: 'Likert 2: Easy for student(s) to find other academics support?',
        [qT[44]]: 'Likert 2: Can access support where they need it?',
        [qT[45]]: 'Likert 2: I or they know whom to ask for help?',
        [qT[46]]: 'Likert 2: I or they know whom to ask but don\'t?',
        [qT[47]]: 'Likert 2: I feel confident that people student asks know how to help?',
        [qT[48]]: 'Likert 2: Is help available convenient for student and me?',
        [qT[49]]: 'Likert 2: Support helpful this year?',
        [qT[50]]: 'Likert 2: Support too basic or too advanced for student?',
        [qT[51]]: 'Likert 2: I know whom to talk to if unsatisfied with quality of support?',
    /**
     * TEACHERS
     */
    [qT[18]]: 'Likert 1: Feel able to handle amount of academic support students request?',
    [qT[19]]: 'Likert 1: Feel able to give adequate attention to academic needs of students in _at least one_ class?',
    [qT[20]]: 'Likert 1: Feel able to give adequate attention to academic needs of stuednts in _all_ classes?',
    [qT[21]]: 'Likert 1: Use informal peer-based learning?',
    [qT[22]]: 'Likert 1: Students often struggle w/ work you assign them?',
    [qT[23]]: 'Likert 1: Students often struggle w/ content you teach?',
    [qT[24]]: 'Students have asked for support with other academics?',
    [qT[25]]: 'If students have asked for other academics support, did you provide it?',
        // Yes, every time:
        [qT[26]]: '"Yes, every time" Likert: Have felt able to handle amount of support requested?',
        [qT[27]]: '"Yes, every time" Likert: Have felt confident you understood how to provide support?',
        // Yes, but not every time:
        [qT[28]]: '"Yes, but not every time" Likert: Have felt able to handle amount of support requested?',
        [qT[29]]: '"Yes, but not every time" Likert: Have felt confident you understood how to provide support?',
        [qT[30]]: '"Yes, but not every time" Likert: Have ever not provided support b/c couldn\'t handle workload?',
        [qT[31]]: '"Yes, but not every time" Likert: Have ever not provided support b/c didn\'t feel you understood how to?',
        // No, never
        [qT[32]]: '"No, never" Likert: Have ever not provided support b/c couldn\'t handle workload?',
        [qT[33]]: '"No, never" Likert: Have ever not provided support b/c didn\'t feel you understood how to?',
    /**
     * PARENTS + TEACHERS
     */
    [qT[140]]: 'Which subjects would your student(s) want help with?',
    [qT[142]]: 'Which other academics would your student(s) want help with?',
    [qT[144]]: 'Would peer mentoring be helpful for your student(s)?',
    /**
     * GRADSTU
     */
    [qT[13]]: 'Years that answered',
    [qT[112]]: 'How often struggled w/ schoolwork per week?',
    [qT[113]]: 'How often struggled to find help?',
        // LIKERT 1
        [qT[114]]: 'Likert 1: Was easy to find academic support?',
        [qT[115]]: 'Likert 1: Could access support where you needed it?',
        [qT[116]]: 'Likert 1: Knew whom to ask for help?',
        [qT[117]]: 'Likert 1: Knew whom to ask but didn\'t?',
        [qT[118]]: 'Likert 1: Knew whom to ask but didn\'t b/c uncomfortable?',
        [qT[119]]: 'Likert 1: Felt confident that people you asked knew how to help?',
        [qT[120]]: 'Likert 1: Was help available convenient?',
        [qT[121]]: 'Likert 1: Was support too basic or too advanced?',
        [qT[122]]: 'Likert 1: Knew whom to talk to if unsatisfied with quality of support?',
        // LIKERT 2
        [qT[123]]: 'Likert 2: Was easy to find other academics support?',
        [qT[124]]: 'Likert 2: Could access support where you needed it?',
        [qT[125]]: 'Likert 2: Knew whom to ask for help?',
        [qT[126]]: 'Likert 2: Knew whom to ask but didn\'t?',
        [qT[127]]: 'Likert 2: Knew whom to ask but didn\'t b/c uncomfortable?',
        [qT[128]]: 'Likert 2: Felt confident that people you asked knew how to help?',
        [qT[129]]: 'Likert 2: Was help available convenient?',
        [qT[130]]: 'Likert 2: Was support too basic or too advanced?',
        [qT[131]]: 'Likert 2: Knew whom to talk to if unsatisfied with quality of support?',
    [qT[132]]: 'Which school subjects could find help with?',
    [qT[134]]: 'Which school subjects couldn\'t find help with?',
    [qT[136]]: 'Which other academics could find help with?',
    [qT[138]]: 'Which other academics couldn\'t find help with?',
    /**
     * GRADPARENT
     */
    [qT[16]]: 'How many children graduated from OHS?',
    [qT[17]]: 'Child\'s/children\'s class year(s):',
         // LIKERT 1:
         [qT[52]]: 'Likert 1: Was easy for student(s) to find academic support?',
         [qT[53]]: 'Likert 1: Could access support where they needed it?',
         [qT[54]]: 'Likert 1: I or they knew whom to ask for help?',
         [qT[55]]: 'Likert 1: I or they knew whom to ask but didn\'t?',
         [qT[56]]: 'Likert 1: I felt confident that people student asked knew how to help?',
         [qT[57]]: 'Likert 1: Was help available convenient for student and me?',
         [qT[58]]: 'Likert 1: Was support too basic or too advanced for student?',
         [qT[59]]: 'Likert 1: I knew whom to talk to if unsatisfied with quality of support?',
         // LIKERT 2:
         [qT[60]]: 'Likert 2: Was easy for student(s) to find other academics support?',
         [qT[61]]: 'Likert 2: Could access support where they needed it?',
         [qT[62]]: 'Likert 2: I or they knew whom to ask for help?',
         [qT[63]]: 'Likert 2: I or they knew whom to ask but didn\'t?',
         [qT[64]]: 'Likert 2: I felt confident that people student asked know how to help?',
         [qT[65]]: 'Likert 2: Was help available convenient for student and me?',
         [qT[66]]: 'Likert 2: Was support too basic or too advanced for student?',
         [qT[67]]: 'Likert 2: I knew whom to talk to if unsatisfied with quality of support?',
    /**
     * EXIT MATTER
     */
    [qT[145]]: 'Anything else to add? (textbox)',
    // [qT[146]]: 'Participate in raffle or interview?',
    // to trick the "remaining to be analyzed" section:
    [qT[10]]: '',
    [qT[11]]: ''
});