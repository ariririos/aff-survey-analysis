type LikertMap = { [str: string]: number };
type LikertConverter = (agg: string[]) => number[];

export const likert3Map: LikertMap = { 'Agree': 1, 'Neither agree nor disagree': 2, 'Disagree': 3 };
export const likert3ToNumber: LikertConverter = agg => agg.map(ans => (likert3Map)[ans] || NaN);

export const likert5Map: LikertMap = { 'Strongly agree': 1, 'Somewhat agree': 2, 'Neither agree nor disagree': 3, 'Somewhat disagree': 4, 'Strongly disagree': 5 };
export const likert5ToNumber: LikertConverter = agg => agg.map(ans => likert5Map[ans] || NaN);

export const likertFreqMap: LikertMap = { 'Never': 0, 'Rarely': 1, 'Sometimes': 2, 'Most of the time': 3, 'Always': 4 };
export const likertFreqToNumber: LikertConverter = agg => agg.map(ans => (likertFreqMap)[ans] || NaN);

export const likertToWords = (score: number, converter) => {
    const mapsByConverters:Map<LikertConverter, LikertMap> = new Map([[likert3ToNumber, likert3Map], [likert5ToNumber, likert5Map], [likertFreqToNumber, likertFreqMap]]);
    const map = mapsByConverters.get(converter);
    if (Object.values(map).includes(score)) return `${score} (${Object.keys(map).find(key => map[key] === score)})`;
    else {
        const flippedMap = Object.keys(map).reduce((o, key) => { o[map[key]] = key; return o; }, {});
        const vals = Object.keys(flippedMap).map(x => +x);
        if (score < Math.min(...vals) || score > Math.max(...vals)) throw 'Score out of bounds';
        const below = Math.floor(score), above = Math.ceil(score);
        return `${score} (between "${flippedMap[below]}" and "${flippedMap[above]}")`;
    }
};

export const likertMaps = { likert3Map, likert5Map, likertFreqMap };
export const likertConverters = { likert3ToNumber, likert5ToNumber, likertFreqToNumber };
