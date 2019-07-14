import { ResByAssoc, QuestionTitle } from './globalSymbols';

/**
 * Defines the minimum questions that need to be answered for a response to be considered complete. All fully complete survey responses should count, and some less-than-complete responses should also.
 * - Basic criteria: filling out all the required questions for flow (association and the teacher likert switch)
 * - Filling out at least one question from each likert presented
 * - idea: should spit out some brackets: perfect (all questions completed), passing (minimum requirements for consideration met), anything in between (maybe include subcategories by % answered as breakpoints)
 * - schema needs to include data per question that says, 1: required, 2: part of aggregate (meet some %), 3: not required at all
 * - interpreter should filter out for -99 (or should it? should it be replacing -99s in responses with something?)
 */
export default (resByAssoc: ResByAssoc, questionTitles: QuestionTitle[]) =>
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
        ['Current student parents', r => resByAssoc.csp.includes(r)],
            [
                [
                    14
                ],
                [
                    15
                ],
                [
                    34
                ],
                [
                    35
                ],
                [
                    36
                ],
                [
                    37
                ],
                [
                    38
                ],
                [
                    39
                ],
                [
                    40
                ],
                [
                    41
                ],
                [
                    42
                ],
                [
                    43
                ],
                [
                    44
                ],
                [
                    45
                ],
                [
                    46
                ],
                [
                    47
                ],
                [
                    48
                ],
                [
                    49
                ],
                [
                    50
                ],
                [
                    51
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