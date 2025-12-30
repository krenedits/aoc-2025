import { getLines } from "../common";

class Node {
    name: string;
    connections: string[];

    constructor(name: string, connections: string[]) {
        this.name = name;
        this.connections = connections;
    }
}

const START = 'you';
const START_TWO = 'svr';
const FFT = 'fft';
const DAC = 'dac';
const END = 'out';

let data: Node[] = getLines('input.txt').map(line => {
    const [name, ...rest] = line.replaceAll(':', '').split(' ');
    
    return new Node(name, rest);
});


const visited: Record<string, boolean> = {};
let cache = new Map<string, number>();

const traverse = (nodeName: string, end = END): number => {
    if (cache.has(`${nodeName},${end}`)) {
        return cache.get(`${nodeName},${end}`)!;
    }

    if (nodeName === end) {
        return 1;
    }

    const node = data.find(n => n.name === nodeName);
    if (!node) return 0;
    visited[nodeName] = true;

    let count = 0;
    for (const connection of node.connections) {
        if (!visited[connection]) {
            count += traverse(connection, end);
        }
    }

    cache.set(`${nodeName},${end}`, count);

    visited[nodeName] = false;
    return count;
}

const getPathCount = (start: string, end: string = END) => {
    cache = new Map<string, number>();

    return traverse(start, end);
}

const taskOne = getPathCount(START);
console.log(taskOne);

const taskTwo = getPathCount(START_TWO, FFT) * getPathCount(FFT, DAC) * getPathCount(DAC, END) + getPathCount(START_TWO, DAC) * getPathCount(DAC, FFT) * getPathCount(FFT, END);
console.log(taskTwo);