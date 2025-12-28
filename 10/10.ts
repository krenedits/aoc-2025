import { getLines } from "../common";

console.time('total');

interface Line {
    indicators: number[];
    wirings: number[][];
    joltages: number[];
}

const data = getLines('input.txt').map(line => {
    const indicators = line.match(/(\.|#)+/g)?.map(indicator => indicator.split('').map(char => char === '.' ? 0 : 1)).flat();
    const wirings = line.match(/\((\d+|,)+\)/g)?.map(wiring => wiring.match(/\d+/g)?.map(Number));
    const joltages = line.match(/{(\d+|,)+}/g)?.map(wiring => wiring.match(/\d+/g)?.map(Number)).flat()
    return {
        indicators,
        wirings,
        joltages
    }
}) as Line[];

let lineCount = 1;

const traverseOptions = (goalIndicators: number[], wirings: number[][]) => {
    let cache: Record<string, number> = {};
    let best = Infinity

    const traverseOption = (indicators: number[], wiring: number[], count = 0) => {
        const key = indicators.join();
        if (count >= best || cache[key] && cache[key] < count) {
            return;
        }

        if (key === goalIndicators.join()) {
            best = cache[key];
            return;
        }

        let newIndicators = indicators.map((indicator, i) => {
            return wiring.includes(i) ? (indicator + 1) % 2 : indicator;
        })
        
        wirings.forEach(wiring => traverseOption(newIndicators, wiring, count + 1));
    }

    wirings.forEach(wiring => traverseOption(Array.from({length: goalIndicators.length}).fill(0).map(_e => 0), wiring))

    return best;
}

// task one
// console.log(data.map(({indicators, wirings}) => traverseOptions(indicators, wirings)).reduce((acc, count) => acc + count, 0));

const gcd = (a: number, b: number): number => b === 0 ? Math.abs(a) : gcd(b, a % b);

const simplifyRow = (row: number[], result: number): [number[], number] => {
    let g = Math.abs(result);
    for (const val of row) {
        g = gcd(g, Math.abs(val));
        if (g === 1) return [row, result];
    }
    if (g === 0) return [row, result];
    return [row.map(v => v / g), result / g];
};

const gaussElimination = (matrix: number[][], results: number[]): number => {
    const n = results.length;
    const m = matrix[0].length;
    const maxVal = Math.max(...results);
    const pivotCols: number[] = [];

    let row = 0, col = 0;
    while (row < n && col < m) {
        const maxValue = Math.max(...matrix.slice(row).map(r => Math.abs(r[col])));
        if (maxValue === 0) {
            col++;
            continue;
        }
        
        const maxRowIndex = matrix.findIndex((r, i) => i >= row && Math.abs(r[col]) === maxValue);
        [matrix[row], matrix[maxRowIndex]] = [matrix[maxRowIndex], matrix[row]];
        [results[row], results[maxRowIndex]] = [results[maxRowIndex], results[row]];

        for (let r = row + 1; r < n; r++) {
            if (matrix[r][col] === 0) continue;
            const a = matrix[row][col];
            const b = matrix[r][col]
            for (let c = 0; c < m; c++) {
                matrix[r][c] = matrix[r][c] * a - matrix[row][c] * b;
            }
            results[r] = results[r] * a - results[row] * b;
            [matrix[r], results[r]] = simplifyRow(matrix[r], results[r]);
        }
        pivotCols.push(col);
        row++;
        col++;
    }

    const freeVars: number[] = [];
    for (let c = 0; c < m; c++) {
        if (!pivotCols.includes(c)) {
            freeVars.push(c);
        }
    }

    const computeSolution = (freeValues: number[]): number[] | null => {
        const solution: number[] = Array(m).fill(0);
        
        freeVars.forEach((col, i) => {
            solution[col] = freeValues[i];
        });
        
        for (let r = pivotCols.length - 1; r >= 0; r--) {
            const pivotCol = pivotCols[r];
            let sum = results[r];
            for (let c = pivotCol + 1; c < m; c++) {
                sum -= matrix[r][c] * solution[c];
            }
            
            if (sum % matrix[r][pivotCol] !== 0) {
                return null;
            }
            solution[pivotCol] = sum / matrix[r][pivotCol];
            
            if (solution[pivotCol] < 0) {
                return null;
            }
        }
        
        return solution;
    };

    const generateFreeVarCombinations = (index: number, current: number[], results: number[]) => {
        if (index === freeVars.length) {
            const solution = computeSolution(current);
            if (solution) {
                results.push(solution.reduce((acc, val) => acc + val, 0));
            }
            return;
        }
        
        for (let val = 0; val <= maxVal; val++) {
            current[index] = val;
            generateFreeVarCombinations(index + 1, current, results);
        }
    };

    const allResults: number[] = [];
    generateFreeVarCombinations(0, Array(freeVars.length).fill(0), allResults);

    return Math.min(...allResults);
};

const buildMatrix = (wirings: number[][], numCounters: number): number[][] => {
    const matrix: number[][] = [];
    for (let counter = 0; counter < numCounters; counter++) {
        const row: number[] = [];
        for (let buttonIdx = 0; buttonIdx < wirings.length; buttonIdx++) {
            row.push(wirings[buttonIdx].includes(counter) ? 1 : 0);
        }
        matrix.push(row);
    }
    return matrix;
};

console.log(data.map(({joltages, wirings}) => {
    return gaussElimination(buildMatrix(wirings, joltages.length), [...joltages]);
}).reduce((acc, count) => acc + count, 0));
console.timeEnd('total');