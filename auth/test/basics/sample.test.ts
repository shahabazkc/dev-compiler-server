
const mathOperations = {
    sum: function (a, b) {
        return a + b;
    },

    diff: function (a, b) {
        return a - b;
    },
    product: function (a, b) {
        return a * b;
    },
    divide: function (a, b) {
        return a / b;
    }
};

describe("Testing with done", () => {
    test('Adding two numbers', (done) => {
        expect(mathOperations.sum(1, 2)).toStrictEqual(3);
        expect(mathOperations.sum(5, 5)).toStrictEqual(10);
        done();
    });


    test('Subtracting two numbers', (done) => {
        expect(mathOperations.diff(1, 2)).toStrictEqual(-1);
        expect(mathOperations.diff(5, 5)).toStrictEqual(0);
        done();
    });

    test('Multiplying two numbers', (done) => {
        expect(mathOperations.product(1, 2)).toStrictEqual(2);
        expect(mathOperations.product(5, 5)).toStrictEqual(25);
        done();
    });

    test('Divinding two numbers', (done) => {
        expect(mathOperations.divide(25, 5)).toStrictEqual(5);
        expect(mathOperations.divide(5, 5)).toStrictEqual(1);
        done();
    });
});

describe("Testing with async", () => {
    test('Adding two numbers', async() => {
        expect(mathOperations.sum(1, 2)).toStrictEqual(3);
        expect(mathOperations.sum(5, 5)).toStrictEqual(10);
    });


    test('Subtracting two numbers', async () => {
        expect(mathOperations.diff(1, 2)).toStrictEqual(-1);
        expect(mathOperations.diff(5, 5)).toStrictEqual(0);
    });

    test('Multiplying two numbers', async () => {
        expect(mathOperations.product(1, 2)).toStrictEqual(2);
        expect(mathOperations.product(5, 5)).toStrictEqual(25);
    });

    test('Divinding two numbers', async() => {
        expect(mathOperations.divide(25, 5)).toStrictEqual(5);
        expect(mathOperations.divide(5, 5)).toStrictEqual(1);
    });
});