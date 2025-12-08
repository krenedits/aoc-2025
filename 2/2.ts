import { getData } from "../common";

const data = getData('input.txt').split(',').map(line => line.split('-').map(Number)) as [number, number][];

// the biggest number in the input has 10 digits,
// so we don't need more primes
// for part 1 make it primes = [2]
const primes = [2, 3, 5, 7];

const getPrimeDividers = (value: number, index = 0): number[] => {
    const divider = primes[index];
    
    if (!divider) {
        return [];
    }
    
    return value % divider === 0 ? [divider, ...getPrimeDividers(value, index + 1)] : getPrimeDividers(value, index + 1);
}

const numbers = new Set<number>();

const examineRange = ([start, end]: [number, number]): void => {
    const lengths = [('' + start).length, ('' + end).length];
    const allDividers = lengths
        .map((length) => getPrimeDividers(length));
        
    allDividers.forEach((dividers, i) => {
        dividers.forEach(divider => {
            let prefix = 10 ** ((lengths[i] / divider) - 1);
            let number = +('' + prefix).repeat(divider);
            while (number <= end) {
                if (number >= start) {
                    numbers.add(number);
                }
                prefix++;
                number = +('' + prefix).repeat(divider);
            }
        });
    });
}


data.map(([start, end]) => examineRange([start, end]))
console.log([...numbers].reduce((acc, number) => {
    return acc + number;
}, 0));