import * as fs from 'fs';

const getData = (path: string): string => {
    return fs.readFileSync(path, 'utf8');
};

const getLines = <T extends string = string>(path: string): T[] => {
    return getData(path)
        .split('\n')
        .filter((line) => line !== '') as T[];
};

type Direction = 'UP' | 'RIGHT' | 'DOWN' | 'LEFT';
type Point = [number, number];
type NodeKey = `${number},${number}`;
type NodeDistance = Record<NodeKey, number>;

const DIRECTIONS: Record<Direction, Point> = {
    UP: [-1, 0],
    DOWN: [1, 0],
    LEFT: [0, -1],
    RIGHT: [0, 1],
};

class Matrix<T extends string | number> {
    constructor(public rows: T[][]) {
        this.rows = rows;
    }

    get columns(): T[][] {
        return this.rows[0].map((_, index) => this.rows.map((row) => row[index]));
    }

    get diagonals(): T[][] {
        let j = 0;
        const result: T[][] = [];

        while (j < this.rows.length) {
            result.push(this.rows.slice(j).map((row, index) => row[index]));
            result.push(
                this.rows
                    .map((_row, index) => {
                        const row = _row.slice(0, _row.length - j);
                        return row[row.length - index - 1];
                    })
                    .filter((row) => row !== undefined),
            );
            if (j > 0) {
                result.push(this.columns.slice(j).map((row, index) => row[index]));
                result.push(
                    this.columns
                        .slice(j)
                        .map((row, index) => {
                            return row[row.length - index - 1];
                        })
                        .filter((row) => row !== undefined),
                );
            }
            j++;
        }

        return result;
    }

    getNeighbourPoints(row: number, column: number): Point[] {
        return [
            [row - 1, column],
            [row + 1, column],
            [row, column - 1],
            [row, column + 1],
        ];
    }

    getNeighbours(row: number, column: number, all = false): T[] {
        const neighbours = [
            this.rows[row - 1]?.[column],
            this.rows[row + 1]?.[column],
            this.rows[row]?.[column - 1],
            this.rows[row]?.[column + 1],
        ];

        if (all) {
            return neighbours;
        }

        return neighbours.filter((value) => value !== undefined);
    }

    getDiagonalNeighbourPoints(row: number, column: number): Point[] {
        return [
            [row - 1, column - 1],
            [row - 1, column + 1],
            [row + 1, column - 1],
            [row + 1, column + 1],
        ];
    }

    getDiagonalNeighbours(row: number, column: number, all = false): T[] {
        const neighbours = [
            this.rows[row - 1]?.[column - 1],
            this.rows[row - 1]?.[column + 1],
            this.rows[row + 1]?.[column - 1],
            this.rows[row + 1]?.[column + 1],
        ];

        if (all) {
            return neighbours;
        }

        return neighbours.filter((value) => value !== undefined);
    }

    getAllNeighbours(row: number, column: number, all = false): { direct: T[]; diagonal: T[] } {
        return {
            direct: this.getNeighbours(row, column, all),
            diagonal: this.getDiagonalNeighbours(row, column, all),
        };
    }

    getAllNeighbourPoints(row: number, column: number): { direct: Point[]; diagonal: Point[] } {
        return {
            direct: this.getNeighbourPoints(row, column),
            diagonal: this.getDiagonalNeighbourPoints(row, column),
        };
    }

    find(value: T): Point | undefined {
        return this.rows.reduce((acc, row, rowIndex) => {
            const column = row.indexOf(value);

            if (column !== -1) {
                return [rowIndex, column];
            }

            return acc;
        }, undefined as Point | undefined);
    }

    findAll(value: T): Point[] {
        return this.rows.reduce((acc, row, rowIndex) => {
            const columns = row
                .map((char, columnIndex) => {
                    if (char === value) {
                        return [rowIndex, columnIndex];
                    }

                    return undefined;
                })
                .filter((column) => column !== undefined) as Point[];

            return [...acc, ...columns];
        }, [] as Point[]);
    }

    findAllByCondition(condition: (value: T) => boolean): Point[] {
        return this.rows.reduce((acc, row, rowIndex) => {
            const columns = row
                .map((char, columnIndex) => {
                    if (condition(char)) {
                        return [rowIndex, columnIndex];
                    }

                    return undefined;
                })
                .filter((column) => column !== undefined) as Point[];

            return [...acc, ...columns];
        }, [] as Point[]);
    }

    get(row: number, column: number): T | undefined {
        return this.rows[row]?.[column];
    }

    replace(row: number, column: number, value: T): void {
        if (this.rows[row]?.[column]) {
            this.rows[row][column] = value;
        }
    }

    replaceAll(value: T, newValue: T): void {
        this.rows = this.rows.map((row) => row.map((char) => (char === value ? newValue : char)));
    }

    toString(): string {
        return this.rows.map((row) => row.join('')).join('\n');
    }

    static getDifference(point1: Point, point2: Point): Point {
        return [point1[0] - point2[0], point1[1] - point2[1]];
    }

    static add(point1: Point, point2: Point): Point {
        return [point1[0] + point2[0], point1[1] + point2[1]];
    }

    static substract(point1: Point, point2: Point): Point {
        return [point1[0] - point2[0], point1[1] - point2[1]];
    }

    static isSamePoint(point1: Point, point2: Point): boolean {
        return point1[0] === point2[0] && point1[1] === point2[1];
    }

    // for 2x2 matrix only
    static determinantForArray(matrix: number[][]): number {
        return matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0];
    }

    // for 2x2 matrix only
    static determinant(matrix: Matrix<number>): number {
        return matrix.rows[0][0] * matrix.rows[1][1] - matrix.rows[0][1] * matrix.rows[1][0];
    }

    static manhattanDistance(point1: Point, point2: Point): number {
        return Math.abs(point1[0] - point2[0]) + Math.abs(point1[1] - point2[1]);
    }

    static euclideanDistance(point1: Point, point2: Point): number {
        return Math.sqrt(
            Math.pow(point1[0] - point2[0], 2) + Math.pow(point1[1] - point2[1], 2),
        );
    }

    getPointsWithinManhattanDistance(
        center: Point,
        distance: number
    ): Point[] {
        const points: Point[] = [];

        for (let row = 0; row < this.rows.length; row++) {
            for (let column = 0; column < this.rows[0].length; column++) {
                const point: Point = [row, column];
                const manhattanDistance = Matrix.manhattanDistance(center, point);

                if (manhattanDistance <= distance) {
                    points.push(point);
                }
            }
        }

        return points;
    }
}

export type { Point, Direction, NodeDistance, NodeKey };
export { getData, getLines, Matrix, DIRECTIONS };
