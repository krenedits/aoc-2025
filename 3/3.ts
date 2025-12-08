import { getLines } from "../common";

const data = getLines('input.txt');

// DIGITS = 2 for part 1
const DIGITS = 12;

const getHighestJoltage = (bank: string) => {
    const highests: string[] = [];
    let from = 0;
    
    for (let i = 0; i < DIGITS; i++) {
        let j = from;
        from++;
        let max = +bank[j];

        while (j < bank.length - (DIGITS - i) + 1) {
            if (+bank[j] > max) {
                max = +bank[j];
                from = j + 1;
            }
            j++;
        }

        highests.push('' + max);
    }

    return highests.join('');
}

console.log(data.map(getHighestJoltage).reduce((acc, number) => acc + +number, 0));
