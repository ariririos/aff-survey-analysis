import { ResByAssoc, QuestionTitle, Response } from './globalSymbols';

/**
 * Tuple structure:
 * [["Name of current branch", Function<Bool> if should go down this branch?] , ["categorization for aggResByQuestion", Function<T> that outputs the requested data]]
 */
type DataSchemaValue = [[string, (r?: Response) => boolean], [string, (((r?: Response) => string))] | DataSchema | (number[] | DataSchemaValueDummy)[]];

interface DataSchema extends Array<DataSchemaValue> { }
interface DataSchemaValueDummy extends DataSchemaValue {}

// FIXME: compArrRes should be moved to filteringSchema
export default function(resByAssoc: ResByAssoc, compArrRes: Map<QuestionTitle, string>[], questionTitles: QuestionTitle[]): DataSchema {
    return [
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
                            ['Current student parents/guardians', r => resByAssoc.csp.includes(r)],
                            ['totalCurrStuParentGuardian', () => null]
                        ],
                        [
                            ['Graduate parents/guardians', r => resByAssoc.gsp.includes(r)],
                            ['totalGradStuParentGuardian', () => null]
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
            ['Current student parents/guardians', r => resByAssoc.csp.includes(r)],
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
            ['Current and former teachers', r => resByAssoc.t.includes(r)],
            [
                [
                    18
                ],
                [
                    19
                ],
                [
                    20
                ],
                [
                    21
                ],
                [
                    22
                ],
                [
                    23
                ],
                [
                    24
                ],
                [
                    ['Teachers who have been asked for other academics support', r => resByAssoc.t.includes(r) && r.get(questionTitles[24]) === 'Yes'],
                    [
                        [
                            25
                        ],
                        [
                            ['"Yes, every time I was asked."', r => resByAssoc.t.includes(r) && r.get(questionTitles[25]) === "Yes, every time I was asked."],
                            [
                                [
                                    26
                                ],
                                [
                                    27
                                ]
                            ]
                        ],
                        [
                            ['"Yes, but not every time I was asked."', r => resByAssoc.t.includes(r) && r.get(questionTitles[25]) === "Yes, but not every time I was asked."],
                            [
                                [
                                    28
                                ],
                                [
                                    29
                                ],
                                [
                                    30
                                ],
                                [
                                    31
                                ]
                            ]
                        ],
                        [
                            ['"No, not every time."', r => resByAssoc.t.includes(r) && r.get(questionTitles[25]) === "No, I have never provided support with other academics when I was asked. (e.g. I referred the student to someone else)"],
                            [
                                [
                                    32
                                ],
                                [
                                    33
                                ]
                            ]
                        ]
                    ]
                ]
            ]
        ],
        [
            ['Current student parents/guardians and teachers', r => ['csp', 't'].some(type => resByAssoc[type].includes(r))],
            [
                [
                    140
                ],
                [
                    142
                ],
                [
                    144
                ]
            ]
        ],
        [
            ['Graduates', r => resByAssoc.gs.includes(r)],
            [
                [
                    13
                ],
                [
                    112
                ],
                [
                    113
                ],
                [
                    114
                ],
                [
                    115
                ],
                [
                    116
                ],
                [
                    117
                ],
                [
                    118
                ],
                [
                    119
                ],
                [
                    120
                ],
                [
                    121
                ],
                [
                    122
                ],
                [
                    123
                ],
                [
                    124
                ],
                [
                    125
                ],
                [
                    126
                ],
                [
                    127
                ],
                [
                    128
                ],
                [
                    129
                ],
                [
                    130
                ],
                [
                    131
                ],
                [
                    132
                ],
                [
                    134
                ],
                [
                    136
                ],
                [
                    138
                ]
            ]
        ],
        [
            ['Graduate parents/guardians', r => resByAssoc.gsp.includes(r)],
            [
                [
                    16
                ],
                [
                    17
                ],
                [
                    52
                ],
                [
                    53
                ],
                [
                    54
                ],
                [
                    55
                ],
                [
                    56
                ],
                [
                    57
                ],
                [
                    58
                ],
                [
                    59
                ],
                [
                    60
                ],
                [
                    61
                ],
                [
                    62
                ],
                [
                    63
                ],
                [
                    64
                ],
                [
                    65
                ],
                [
                    66
                ],
                [
                    67
                ]
            ]
        ],
        [
            ['Exit matter', r => compArrRes.includes(r)],
            // FIXME: compArrRes filtering
            [
                [
                    145
                ]
            ]
        ]
    ];
}