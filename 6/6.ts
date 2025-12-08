import { getLines, Matrix } from "../common";

type Operation = '+' | '*';

const ADDITION = '+';
const MULTIPLICATION = '*';

const rawData = getLines('input.txt');

const data = rawData.map(line => {
    let trimmed = line.trim();
    while (trimmed.includes('  ')) {
        trimmed = trimmed.replaceAll('  ', ' ');
    }

    return trimmed.split(' ');
});

const operators = data.slice(-1)[0];
const nums = data.slice(0, -1).map(line => line.map(Number))

const matrix = new Matrix(nums);

const add = (numbers: number[]) => {
    return numbers.reduce((acc, num) => acc + num, 0);
}

const multiply = (numbers: number[]) => {
    return numbers.reduce((acc, num) => acc * num, 1);
}

const OPERATIONS: Record<Operation, (numbers: number[]) => number> = {
    [ADDITION]: add,
    [MULTIPLICATION]: multiply
}

const partOne = matrix.columns.reduce((acc, nums, i) => {
    const operation = OPERATIONS[operators[i] as Operation];

    return acc + operation(nums)
}, 0);

console.log(partOne);

const partTwo = () => {
    let j = rawData[0].length - 1;
    let result = 0;
    const operatorsCopy = [...operators];
    let operator = operatorsCopy.pop();
    let numbers: number[] = [];
    
    while (j >= 0) {
        let i = 0;
        let found = false;
        let value = '';
        const operation = OPERATIONS[operator as Operation];
        
        while (i < rawData.length - 1) {
            const current = rawData[i][j];

            if (current !== ' ') {
                value += current;
                found = true;
            }

            i++;
        }

        if (found) {
            numbers.push(+value);
        } else {
            result += operation(numbers);
            numbers = [];
            operator = operatorsCopy.pop();
        }

        j--;
    }

    const operation = OPERATIONS[operator as Operation];
    if (numbers.length) {
        result += operation(numbers);
    }

    return result;
}

console.log(partTwo());