const assocDictByLong = {
    'Current student (2019 or later)': 'cs',
    'Graduate (2018 or earlier)': 'gs',
     'Parent or guardian of current student (2019 or later)': 'csp',
     'Parent or guardian of graduate (2018 or earlier)': 'gsp',
     'Current or former OHS teacher': 't',
     'Other (including OHS staff, and other OCSD teachers or staff)': 'o'
 };
 const assocDictByShort = Object.keys(assocDictByLong).reduce((o, k) => { o[assocDictByLong[k]] = k; return o; }, {});

 const assoc = {
    cs: 'students',
    gs: 'graduates',
    csp: 'current student parents',
    gsp: 'graduate parents',
    t: 'teachers'
};

// possible choices:
// single choice, multi choice, likert 3, likert 5, textbox, likertFreq

const questionTypesByTitleClosure = (questionTitles) => ({
    [questionTitles[96]]: 'multiChoice',
    [questionTitles[88]]: 'likert3',
    [questionTitles[86]]: 'likert3'
});


const questionTitlesToShortTitlesClosure = (qT) => ({
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
    [qT[80]]: 'Likert 1: Easy to find other academics support?',
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
    // GRADSTU
    [qT[13]]: 'Years that answered',
    // CURRSTUPARENT
})

module.exports = { assocDictByLong, assocDictByShort, assoc, questionTypesByTitleClosure, questionTitlesToShortTitlesClosure };