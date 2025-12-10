import { getLines, Point } from "../common";

const coordinates = getLines('input.txt').map(line => line.split(',').map(Number)) as Point[];

const getRectangle = ([x, y]: Point, [a, b]: Point) => (Math.abs(x - a) + 1) * (Math.abs(y - b) + 1); 

const getDistances = () => {
    const distances: Record<string, number> = {};

    let i = 0;

    while (i < coordinates.length - 1) {
        let j = i + 1;

        while (j < coordinates.length) {
            distances[`${i}-${j}`] = getRectangle(coordinates[i], coordinates[j]);
            j++;
        } 
        
        i++;
    }
    
    return distances
}

const distances = getDistances();
console.log(Math.max(...Object.values(distances)));

const getBorders = () => {
    let i = 0;
    let borders: Record<number, Set<number>> = {};

    while (i < coordinates.length - 1) {
        const [[x1, y1], [x2]] = [coordinates[i], coordinates[i + 1]];
        
        if (x1 !== x2) {
            let j = Math.min(x1, x2) + 1;

            while (j <= Math.max(x1, x2)) {
                borders[j] = new Set([...(borders[j] ?? []), y1]);
                j++;
            }
        }

        i++;
    }

    return borders;
}

const borders = getBorders();

const isWithinBorders = (point: Point) => {
    if (coordinates.some(([x, y]) => x === point[0] && y === point[1])) {
        return true;
    }

    const bordersToCross = borders[point[0]];

    let y = point[1] + 1;
    const MAX_Y = Math.max(...(bordersToCross ?? [0]));

    let crossCount = 0;

    while (y <= MAX_Y) {
        if (bordersToCross.has(y)) {
            crossCount++;
        }
        y++;
    }

    return crossCount % 2 === 1;
}

const getCommon = (edge: [Point, Point]): {
    value: number,
    axis: 'x' | 'y'
} => {
    const [[x1, y1], [x2, y2]] = edge
    return x1 === x2 ? {
        value: x1,
        axis: 'x'
    } : {
        value: y1,
        axis: 'y'
    };
}

const isEdgeIntersectsBorder = (edge: [Point, Point]): boolean => {
    const edgeCommon = getCommon(edge);

    let i = 0;

    while (i < coordinates.length - 1) {
        const borderCommon = getCommon([coordinates[i], coordinates[i + 1]]);
        if (edgeCommon.axis !== borderCommon.axis) {
            const edgeRange =  edge.map(point => point[edgeCommon.axis === 'x' ? 1 : 0]);
            const borderRange =  [coordinates[i], coordinates[i + 1]].map(point => point[borderCommon.axis === 'x' ? 1 : 0]);
            
            if (
                borderCommon.value > Math.min(...edgeRange) && borderCommon.value < Math.max(...edgeRange)
                && edgeCommon.value > Math.min(...borderRange) && edgeCommon.value < Math.max(...borderRange)
            ) {
                return true;
            }
        }
        
        i++;
    }

    return false;
}

const getLargestRectangleWithinBorders = () => {
    const sortedDistances = Object.entries(distances).sort((d1, d2) => d2[1] - d1[1]);

    let i = 0;

    while (i < sortedDistances.length) {
        const distance = sortedDistances[i];
        const [[x1, y1], [x2, y2]] = distance[0].split('-').map((index) => coordinates[+index])
        const [[x3, y3], [x4, y4]] = [[x1, y2], [x2, y1]];
        const isVerticesWithinBorder = isWithinBorders([x3, y3]) && isWithinBorders([x4, y4]);
        const edges = [
            [[x1, y1], [x3, y3]],
            [[x1, y1], [x4, y4]],
            [[x2, y2], [x3, y3]],
            [[x2, y2], [x4, y4]],
        ] as [Point, Point][];
        const isAnyEdgeIntersectsBorder = edges.some(isEdgeIntersectsBorder);

        if (isVerticesWithinBorder && !isAnyEdgeIntersectsBorder) {
            return distance[1];
        }

        i++;
    }

    return null;
}

console.log(getLargestRectangleWithinBorders());