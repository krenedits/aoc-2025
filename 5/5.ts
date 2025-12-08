import { getData } from "../common";

const data = getData('example.txt')

const [rawRanges, rawIds] = data.split('\n\n');
const ranges = rawRanges.split('\n').map(line => line.split('-').map(Number)).sort((a, b) => a[0] - b[0]) as [number, number][]
const ids = rawIds.split('\n').map(Number)

const mergeRanges = (): [number, number][] => {
    let i = 0;
    let newRanges: [number, number][] = [...ranges];

    while (i < newRanges.length - 1) {
        const [currentStart, currentEnd] = newRanges[i];
        const [nextStart, nextEnd] = newRanges[i + 1];

        if (nextStart <= currentEnd + 1) {
            newRanges[i] = [Math.min(currentStart, nextStart), Math.max(currentEnd, nextEnd)];
            newRanges = [...newRanges.slice(0, i + 1), ...newRanges.slice(i + 2)];
        } else {
            newRanges[i] = [currentStart, currentEnd]
            i++;
        }
    }

    return newRanges;
}

const mergedRanges = mergeRanges();

const countOfFreshIds = ids.filter(id => mergedRanges.some(([start, end]) => start <= id && end >= id)).length

// part one
console.log(countOfFreshIds);

// part two
const countOfFreshIngredients = mergedRanges.reduce((acc, [start, end]) => {
    return acc + (end - start) + 1
}, 0)

console.log(countOfFreshIngredients)