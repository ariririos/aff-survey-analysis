const { questionTitlesToShortTitlesClosure } = require('./globalSymbols');

/**
 * Data structure:
 * Tuple: [["Name of current branch", Function<Bool> if should go down this branch?] , ["categorization for aggResByQuestion", Function<T> that outputs the requested data]]
 */
module.exports = (resByAssoc, questionTitles, questionTitlesToShortTitles = questionTitlesToShortTitlesClosure(questionTitles)) =>
[
    [
        ['All respondents', () => true],
        [
            [
                ['Total number of complete responses', () => true],
                ['total', () => null]
            ],
            [
                ['Demographics that answered', () => true],
                [
                    [
                        ['Current students', r => resByAssoc.cs.includes(r)],
                        ['totalCurrStu', () => null]
                    ],
                    [
                        ['Graduates', r => resByAssoc.gs.includes(r)],
                        ['totalGradStu', () => null]
                    ],
                    [
                        ['Current student parents', r => resByAssoc.csp.includes(r)],
                        ['totalCurrStuParent', () => null]
                    ],
                    [
                        ['Graduate parents', r => resByAssoc.gsp.includes(r)],
                        ['totalGradStuParent', () => null]
                    ],
                    [
                        ['Teachers', r => resByAssoc.t.includes(r)],
                        ['totalTeacher', () => null]
                    ],
                    [
                        ['Other', r => resByAssoc.o.includes(r)],
                        ['totalOther', () => null]
                    ]
                ]
            ]
        ]

    ],
    [
        ['Current students', r => resByAssoc.cs.includes(r)],
            [
                [
                    12 // Class year
                ],
                [
                    68 // how often struggle w/ schoolwork?
                ],
                [
                    69 // how often struggle to find help?
                ],
                [
                    70 // Likert 1: 1 - 10
                ],
                [
                    71
                ],
                [
                    72
                ],
                [
                    73
                ],
                [
                    74
                ],
                [
                    75
                ],
                [
                    76
                ],
                [
                    77
                ],
                [
                    78
                ],
                [
                    79
                ],
                [
                    80 // Likert 2: 1 - 10
                ],
                [
                    81
                ],
                [
                    82
                ],
                [
                    83
                ],
                [
                    84
                ],
                [
                    85
                ],
                [
                    86
                ],
                [
                    87
                ],
                [
                    88
                ],
                [
                    89
                ],
                [
                    90 // specifics about history of help
                ],
                [
                    92
                ],
                [
                    94
                ],
                [
                    96
                ],
                [
                    98 // interest lists
                ],
                [
                    100
                ],
                [
                    102 // mentoring interest
                ],
                [
                    103
                ],
                [
                    104 // Likert 3: 1-6
                ],
                [
                    105
                ],
                [
                    106
                ],
                [
                    107
                ],
                [
                    108
                ],
                [
                    109
                ],
                [
                    110 // why wouldn't ask peers for help?
                ]
            ]
    ],
    [
        ['Graduates', r => resByAssoc.gs.includes(r)],
        [
            [
                13
            ]
        ]
    ]
];