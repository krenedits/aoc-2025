import { getLines } from "../common";

const N_SHORTEST = 1000;
const N_LARGEST_GROUP = 3;

type Point = [number, number, number];

const coordinates = getLines('input.txt').map(line => line.split(',').map(Number)) as Point[];

const getDistance = ([x, y, z]: Point, [a, b, c]: Point) => Math.sqrt(
            Math.pow(x - a, 2) + Math.pow(y - b, 2) + Math.pow(z - c, 2), 
        );

const getDistances = () => {
    const distances: Record<string, number> = {};

    let i = 0; 

    while (i < coordinates.length - 1) {
        let j = i + 1;

        while (j < coordinates.length) {
            distances[`${i}-${j}`] = getDistance(coordinates[i], coordinates[j]);
            j++;
        }
        i++;
    }

    return distances;
}

const distances = getDistances();

let id = 0;
const groups: Record<string, number> = {};

const fromShortest = Object.entries(distances).sort(([_key1, value1], [_key2, value2]) => value1 - value2);

let last = fromShortest[0][0];

fromShortest.forEach(([key], i) => {
    // for part one:
    // if (i >= N_SHORTEST) return;

    const [from, to] = key.split('-');
    const fromGroup = groups[from];
    const toGroup = groups[to];

    if (fromGroup !== toGroup) {
        last = key;
    }

    // no group
    if (!(fromGroup || toGroup)) {
        id++;
        groups[from] = id;
        groups[to] = id;
    }

    // only from group
    if (fromGroup && !toGroup) {
        groups[to] = fromGroup;
    }

    // only to group
    if (!fromGroup && toGroup) {
        groups[from] = toGroup;
    }

    // both have group (merge)
    if (fromGroup && toGroup && fromGroup !== toGroup) {
        Object
        .keys(groups)
        .filter(key => groups[key] === toGroup)
        .forEach(key => {
            groups[key] = fromGroup
        });
    }
})

const groupCounts = Object.values(groups).reduce((acc, group) => {
    acc[group] = acc[group] ? acc[group] + 1 : 1
    return acc;
}, {} as Record<number, number>);

const result = Object.values(groupCounts).sort((a, b) => b - a).slice(0, N_LARGEST_GROUP).reduce((acc, count) => acc * count, 1)

const [[x], [a]] = last.split('-').map(index => coordinates[+index]);

console.log(result);
console.log(x * a)