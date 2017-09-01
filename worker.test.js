const worker = require('./worker');

// TODO: mock web worker interface

test('sumover([1, 10, 100]) should be 111', () => {
    expect(worker.sumover([1, 10, 100])).toBe(111);
});

test('range(5) should equal [0, 1, 2, 3, 4]', () => {
    expect(worker.range(5)).toEqual([0, 1, 2, 3, 4]);
});

test('bruteforce should return all permutations', () => {
    expect(worker.bruteforce([0, 1, 2], ()=>true).sort()).toEqual(
        [[0, 1, 2], [0, 2, 1], [1, 2, 0], [1, 0, 2], [2, 0, 1], [2, 1, 0]].sort()
    );
});

test('bruteforceBauerMengelbergFerentz should return all permutations', () => {
    expect(worker.bruteforceBauerMengelbergFerentz([0, 1, 2], ()=>true).sort()).toEqual(
        [[0, 1, 2], [0, 2, 1], [1, 2, 0], [1, 0, 2], [2, 0, 1], [2, 1, 0]].sort()
    );
})