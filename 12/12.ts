import { getData, Matrix } from "../common";

// fix present size
const PRESENT_SIZE = 3;
const rawData = getData('input.txt').split('\n\n');
const rawPresents = rawData.slice(0, -1);
const rawRegions = rawData.slice(-1)[0].split('\n');

class Present extends Matrix<string> {
    weight: number = 0;
    
    constructor(data: string[][]) {
        super(data);
        this.weight = data.flat().filter(c => c === '#').length;
    }

    rotate(x: 0 | 1, y: 0 | 1): Present {
        let newData = [...this.rows];
        if (x && y) {
            newData = this.rows.reverse().map(row => row.slice().reverse());
        } else if (x) {
            newData = this.columns.map(col => col.slice().reverse());
        } else if (y) {
            newData = this.columns.map(col => col.slice()).reverse();
        }
        return new Present(newData);
    }

    flip(): Present {
        const newData = this.rows.map(row => row.slice().reverse());
        return new Present(newData);
    }

   rotations(): Present[] {
       const rotations: Present[] = [];
       const seen = new Set<string>();
       
       for (const x of [0, 1] as const) {
           for (const y of [0, 1] as const) {
               const newPresent = this.rotate(x, y);
               for (const p of [newPresent, newPresent.flip()]) {
                   const key = p.rows.map(r => r.join('')).join('|');
                   if (!seen.has(key)) {
                       seen.add(key);
                       rotations.push(p);
                   }
               }
           }
       }
       return rotations;
   }
}

const presents = rawPresents.map(p => new Present(p.split('\n').slice(1).map(line => line.trim().split(''))));

class Region extends Matrix<string> {
    presents: number[];
    width: number;
    height: number;

    constructor(width: number, height: number, presents: number[]) {
        super(Array.from({length: height}).map(() => Array.from({length: width}).map(() => '.')));
        this.presents = presents;
        this.width = width;
        this.height = height;
    }

    canPlace(present: Present, x: number, y: number): boolean {
        for (let dy = 0; dy < PRESENT_SIZE; dy++) {
            for (let dx = 0; dx < PRESENT_SIZE; dx++) {
                if (present.rows[dy][dx] === '#' && this.rows[y + dy][x + dx] !== '.') {
                    return false;
                }
            }
        }
        return true;
    }

    canFitRemaining(remainingPresents: Present[]): boolean {
        const neededSpaces = remainingPresents.reduce((sum, p) => sum + p.weight, 0);
        const availableSpaces = this.rows.flat().filter(c => c === '.').length;
        
        return availableSpaces >= neededSpaces;
    }

    place(present: Present, x: number, y: number): void {
        for (let dy = 0; dy < PRESENT_SIZE; dy++) {
            for (let dx = 0; dx < PRESENT_SIZE; dx++) {
                if (present.rows[dy][dx] === '#') {
                    this.rows[y + dy][x + dx] = '#';
                }
            }
        }
    }

    remove(present: Present, x: number, y: number): void {
        for (let dy = 0; dy < PRESENT_SIZE; dy++) {
            for (let dx = 0; dx < PRESENT_SIZE; dx++) {
                if (present.rows[dy][dx] === '#') {
                    this.rows[y + dy][x + dx] = '.';
                }
            }
        }
    }

    solve(): boolean {
        const presentsToPlace = this.presents.reduce((acc, presentCount, index) => {
            for (let i = 0; i < presentCount; i++) {
                acc.push(presents[index]);
            }
            return acc;
        }, [] as Present[]);
        presentsToPlace.sort((a, b) => b.weight - a.weight);

        const backtrack = (index: number): boolean => {
            if (index === presentsToPlace.length) {
                return true;
            }

            if (!this.canFitRemaining(presentsToPlace.slice(index))) {
                return false;
            }

            const present = presentsToPlace[index];


            for (let y = 0; y <= this.height - PRESENT_SIZE; y++) {
                for (let x = 0; x <= this.width - PRESENT_SIZE; x++) {
                    for (const rotation of present.rotations()) {
                        if (this.canPlace(rotation, x, y)) {
                            this.place(rotation, x, y);
                            if (backtrack(index + 1)) {
                                return true;
                            }
                            this.remove(rotation, x, y);
                        }
                    }
                }
            }

            return false;
        };

        return backtrack(0);
    }
}

const regions = rawRegions.map(r => {
    const [width, height, ...presents] = [...(r.match(/(\d+)/g) || [])].map(Number);
    return new Region(width, height, presents);
});

let count = 0;
for (const region of regions) {
    if (region.solve()) {
        count++;
    }
}

console.log(`Total regions solved: ${count}`);