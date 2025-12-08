import { getLines, Matrix } from "../common";

const PAPER_ROLL = '@';
const MAX_ADJACENT = 4;

const data = getLines('input.txt').map(line => line.split(''));

const map = new Matrix(data);

const initPaperRollsCount = map.findAll(PAPER_ROLL).length;

const getAccessiblePaperRolls = () => map.findAll(PAPER_ROLL).filter(([x, y]) => {
    const {direct, diagonal} = map.getAllNeighbours(x, y)
    const adjacents = [...direct, ...diagonal];

    return adjacents.filter(elem => elem === PAPER_ROLL).length < MAX_ADJACENT;
});

// part 1
console.log(getAccessiblePaperRolls().length)

while (getAccessiblePaperRolls().length) {
   const accessiblePaperRolls = getAccessiblePaperRolls();
   accessiblePaperRolls.forEach(([x, y]) => {
       map.replace(x, y, '.');
   });
}

console.log(initPaperRollsCount - map.findAll(PAPER_ROLL).length);

