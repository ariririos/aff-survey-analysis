const arrayToInstances = arr => {
    const values = {};
    for (let value of arr) {
        if (values[value] === undefined) values[value] = 0;
        values[value]++;
    }
    return values;
};

const arrMean = arr => arr.reduce((a, b) => a + b) / arr.length;
const arrMode = arr => {
    // FIXME: can this just be a normal array?
    const vals = new Map();
    for (let val of arr) { // add up instances of each value
        if (vals.get(val) === undefined) vals.set(val, 0);
        vals.set(val, vals.get(val) + 1);
    }

    const instances = [...vals.values()];
    const maxInstances = Math.max(...instances); // find max instances of a value

    const modes = [];

    for (let [k, v] of vals.entries()) {
        if (v === maxInstances) modes.push(k);
    }

    return [maxInstances, modes];
};
const arrMedian = (arr) => {
    const sorted = arr.sort();
    if (sorted.length % 2 === 1) return sorted[Math.floor(arr.length / 2)];
    return (sorted[arr.length / 2] + sorted[(arr.length / 2) - 1]) / 2;
};

const is2D = array =>  array.every(item => Array.isArray(item));

module.exports = { arrayToInstances, arrMean, arrMode, arrMedian, is2D };