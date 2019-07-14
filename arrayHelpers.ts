export const arrayToInstances = (arr: string[]) => {
    const values: { [v: string]: number } = {};
    for (let value of arr) {
        if (values[value] === undefined) values[value] = 0;
        values[value]++;
    }
    return values;
};

export const arrayToInstancesMap = function<T> (arr: T[]) {
    const vals: Map<T, number> = new Map();
    for (let val of arr) {
        if (!vals.has(val)) vals.set(val, 0);
        vals.set(val, vals.get(val) + 1);
    }
    return vals;
};

export const arrMean = (arr: number[]) => arr.reduce((a, b) => a + b) / arr.length;

export const arrMode = function<T> (arr: T[]): [number, T[]] {
    const vals = arrayToInstancesMap(arr);

    const instances = [...vals.values()];
    const maxInstances = Math.max(...instances); // find max instances of a value

    const modes: T[] = [];

    for (let [k, v] of vals.entries()) {
        if (v === maxInstances) modes.push(k);
    }

    return [maxInstances, modes];
};

export const arrMedian = (arr: number[]) => {
    const sorted = arr.sort();
    if (sorted.length % 2 === 1) return sorted[Math.floor(arr.length / 2)];
    return (sorted[arr.length / 2] + sorted[(arr.length / 2) - 1]) / 2;
};

export const is2D = (arr: any[]) =>  arr.every(item => Array.isArray(item));
