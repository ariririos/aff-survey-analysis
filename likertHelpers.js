const likert3Map = { 'Agree': 1, 'Neither agree nor disagree': 2, 'Disagree': 3 };
const likert3ToNumber = agg => agg.map(ans => (likert3Map)[ans] || NaN);

const likert5Map = { 'Strongly agree': 1, 'Somewhat agree': 2, 'Neither agree nor disagree': 3, 'Somewhat disagree': 4, 'Strongly disagree': 5 };
const likert5ToNumber = agg => agg.map(ans => likert5Map[ans] || NaN);

const likertFreqMap = { 'Never': 0, 'Rarely': 1, 'Sometimes': 2, 'Most of the time': 3, 'Always': 4 };
const likertFreqToNumber = agg => agg.map(ans => (likertFreqMap)[ans] || NaN);

const likertToWords = (score, converter) => {
    const mapsByConverters = new Map([[likert3ToNumber, likert3Map], [likert5ToNumber, likert5Map], [likertFreqToNumber, likertFreqMap]]);
    const map = mapsByConverters.get(converter);
    if (Object.values(map).includes(score)) return `${score} (${Object.keys(map).find(key => map[key] === score)})`;
    else {
        const flippedMap = Object.keys(map).reduce((o, key) => { o[map[key]] = key; return o; }, {});
        const vals = Object.keys(flippedMap);
        if (score < Math.min(vals) || score > Math.max(vals)) throw 'Score out of bounds';
        const below = Math.floor(score), above = Math.ceil(score);
        return `${score} (between "${flippedMap[below]}" and "${flippedMap[above]}")`;
    }
};

module.exports = { likert3Map, likert3ToNumber, likert5Map, likert5ToNumber, likertFreqMap, likertFreqToNumber, likertToWords, likertMaps: {likert3Map, likert5Map, likertFreqMap}, likertConverters: {likert3ToNumber, likert5ToNumber, likertFreqToNumber} };