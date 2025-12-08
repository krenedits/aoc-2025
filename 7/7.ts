import { getLines, Matrix, Point } from "../common";

const data = getLines('input.txt');
const map = new Matrix(data.map(line => line.split('')));
const START = 'S';
const SPLITTER = '^';

const startPosition = map.find(START) as Point;
const tachyonXs = new Set([startPosition[1]])
const tachyonWeights = {
    [startPosition[1]]: 1,
}

const getFlowMetrics = () => {
    let i = 1;
    const rows = map.rows;
    let splitCount = 0;

    while (i < rows.length) {
        let j = 0;

        while (j < rows[i].length) {
            const current = rows[i][j];
            
            if (current === SPLITTER && tachyonXs.has(j)) {
                tachyonXs.delete(j);
                tachyonWeights[j - 1] = tachyonWeights[j - 1] ? tachyonWeights[j - 1] + tachyonWeights[j] : tachyonWeights[j];
                tachyonWeights[j + 1] = tachyonWeights[j + 1] ? tachyonWeights[j + 1] + tachyonWeights[j] : tachyonWeights[j];
                tachyonWeights[j] = 0;
                tachyonXs.add(j - 1);
                tachyonXs.add(j + 1);
                splitCount++;
            }
            
            j++;
        }

        i++;
    }

    return {
        splitCount,
        scenarios: Object.values(tachyonWeights).reduce((acc, v) => acc + v, 0)
    };
}

const { splitCount, scenarios } = getFlowMetrics();
console.log(splitCount, scenarios)

// 3076 low