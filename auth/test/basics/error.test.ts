const add = (a, b) => {
    if (typeof a === 'number' && typeof b === 'number') {
        return a + b;
    }
    throw Error('Inputs should be numbers');
}

const subtract = (a, b) => {
    if (typeof a === 'number' && typeof b === 'number') {
        return a - b;
    }
    throw Error('Inputs should be numbers');
}

const multiply = (a, b) => {
    if (typeof a === 'number' && typeof b === 'number') {
        return a * b;
    }
    throw Error('Inputs should be numbers');
}


test('Addition: Throw Error when inputs are not numbers', async () => {
    expect(() => add('5', 5)).toThrowError(
        Error('Inputs should be numbers')
    )
})

test('Subtraction: Throw Error when inputs are not numbers', async () => {
    expect(() => subtract('5', 5)).toThrowError(
        Error('Inputs should be numbers')
    )
})

test('Multiplication: Throw Error when inputs are not numbers', async () => {
    expect(() => multiply('5', 5)).toThrowError(
        Error('Inputs should be numbers')
    )
})

test('Multiplying two numbers', async () => {
    expect(multiply(10, 10)).toStrictEqual(100)
    expect(multiply(200, 100)).toStrictEqual(20000)
})