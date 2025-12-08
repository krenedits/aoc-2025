import { getLines } from "../common";

const MODULO = 100;

const data = getLines('example.txt');

let exactZeroCounter = 0;
let zeroCrossedCounter = 0;
let value = 50;

const customModulo = (value: number) => {
    if (value < 0) {
        return MODULO + (value % MODULO);
    }

    return value % MODULO;
}

for (const line of data) {
    const direction = line[0];
    let distance = +line.slice(1);
    zeroCrossedCounter += Math.floor(distance / 100);
    const delta = direction === 'L' ? -1 : 1;
    distance = (distance % MODULO) * delta;
    const newValue = value + distance;

    if (newValue < 0 || newValue >= MODULO) {
        zeroCrossedCounter += !value && newValue < 0 ? 0 : 1;
    }

    value = customModulo(newValue);

    if (value === 0) {
        exactZeroCounter++;
    }

}

console.log(exactZeroCounter)
console.log(exactZeroCounter + zeroCrossedCounter)