const worker = require('./worker');

// need to mock Web worker

test('sumover([1, 10, 100]) should be 111', () => {
    expect(worker.sumover([1, 10, 100])).toBe(111);
});

test('range(5) should equal [0, 1, 2, 3, 4]', () => {
    expect(worker.range(5)).toEqual([0, 1, 2, 3, 4]);
});

test('bruteforce should return all permutations', () => {
    // this not in Jest yet
    // https://github.com/facebook/jest/issues/4286
    expect(new Set(worker.bruteforce([0, 1, 2], ()=>true))).toEqual(
        new Set([[0, 1, 2], [0, 2, 1], [1, 2, 0], [1, 0, 2], [2, 0, 1], [2, 1, 0]])
    );
})