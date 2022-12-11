const coefficients_a = [
    15831, 29294, 19012, 7318, 43096, 17766, 23277, 16089, 52362, 39966, 25327,
    59654, 20816, 1290, 23891, 57036, 10225, 57019, 51045, 13855,
];
const coefficients_b = [
    47784, 50919, 3423, 56944, 14634, 36940, 34534, 52669, 64966, 43297, 30583,
    37728, 54597, 18270, 25613, 36829, 51565, 48161, 4434, 41513,
];
const C = 65537;
const HASH_LENGTH = 20;

export default function minHash(inputs: number[]) {
    let h: number[] = new Array(HASH_LENGTH).fill(0);
    return h.map((_, index) => {
        return hash(inputs, coefficients_a[index], coefficients_b[index]);
    });
}

function hash(inputs: number[], a: number, b: number) {
    inputs = inputs.map((input, index) => {
        return (input * a + b) % C;
    });
    return Math.min(...inputs);
}
