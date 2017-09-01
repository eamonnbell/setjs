var UNIVERSE_N = 4;
var system = range(UNIVERSE_N);
var intervals = system.slice(1);

function bruteforce(arr, generator_test) {
	// use Heap's algorithm to generate permutations
	var passingPermutations = [];
	var index = 0;

	function swap(arr, a, b) {
		var tmp = arr[a];
		arr[a] = arr[b];
		arr[b] = tmp;
	}
	
	function generatePermutations(elements, n, process) {
		var stack = new Array(n).fill(0);
		var i = 0;
		
		while (i < n) {
			if (stack[i] < i) {
				if (i % 2 == 0) {
					swap(elements, 0, i);
				} else {
					swap(elements, stack[i], i);
				}
				process(elements)
				stack[i] += 1;
				i = 0;
			} else {
				stack[i] = 0;
				i += 1;
			}
		}
	}

	if (generator_test(arr)) {
		passingPermutations.push(arr.slice());
	}

	generatePermutations(arr, arr.length, function(perm){
		if (generator_test(perm)) {
			passingPermutations.push(perm.slice());
			// postMessage(perm);
		}
	});

	return passingPermutations;
}

function bruteforceBauerMengelbergFerentz(arr, generator_test) {
	// use algorithm described in BauerMengelbergFerentz to generate permutations
	// currently a copy of bruteforce
	var passingPermutations = [];
	var index = 0;

	function swap(arr, a, b) {
		var tmp = arr[a];
		arr[a] = arr[b];
		arr[b] = tmp;
	}
	
	function generatePermutations(elements, n, process) {
		var stack = new Array(n).fill(0);
		var i = 0;
		
		while (i < n) {
			if (stack[i] < i) {
				if (i % 2 == 0) {
					swap(elements, 0, i);
				} else {
					swap(elements, stack[i], i);
				}
				process(elements)
				stack[i] += 1;
				i = 0;
			} else {
				stack[i] = 0;
				i += 1;
			}
		}
	}

	if (generator_test(arr)) {
		passingPermutations.push(arr.slice());
	}
	
	generatePermutations(arr, arr.length, function(perm){
		if (generator_test(perm)) {
			passingPermutations.push(perm.slice());
			// postMessage(perm);
		}
	});

	return passingPermutations;
}

function add(a, b) {
	return ((a + b) % UNIVERSE_N + UNIVERSE_N) % UNIVERSE_N;
}

function mod(k) {
	return k % UNIVERSE_N;
}

function isCongruentToZero(k) {
	return mod(k) === 0;
}

function applySequence(starting, iseq) {
	var result = [];

	result.push(starting);

	for (var i = 0; i < iseq.length; i++) {
		result.push(add(result[i], iseq[i]));
	}

	return result;
}

function generatorTestNaive(iseq) {
	var notes = applySequence(0, iseq);

	var is_generator = system.every(function (val) {
		return notes.indexOf(val) >= 0;
	});
	return is_generator;
}

function range(n) {
	var output = [];

	for (var i = 0; i < n; i++) {
		output.push(i);
	}

	return output;
}


function sumover(array) {
	return array.reduce((a, b) => a + b);
}

function generatorTestAllContiguousSubsets(iseq) {
	var subset;

	for (var i = 2; i < iseq.length; i++) {
		for (var j = 0; j + i < iseq.length + 1; j++) {
			subset = iseq.slice(j, j + i);
			if (isCongruentToZero(sumover(subset))) {
				return false;
			} else {
				continue;
			}
		}
	}

	return true;
}

function generatorTestPartialSums(iseq) {
	// initial string := contiguous subset including a[0]
	// internal string := contiguous subset not including a[0]
	// partial sum := sum of digits in initial string
	// nth partial sum := sum of first n digits

	// rules
	// 1. no partial sum may be = 0 mod 12
	// 2. no partial sum (other than 11th) may be = 6 mod 12
	// SO 
	// tests on partial sums can tell us whether subsets
	// with first and last are ok
	// BUT
	// they can also deal with internal strings
	// not including the last, since these strings will have
	// sum(string) = 0 mod 12 iff two partials sums are cong mod 12
	// THEREFORE
	// we can replace 54 addition tests with this:
	// look at the eleven partial sums mod 12
	// will constitute exact permutation iff distinct and diff from 0

	var partial_sums = [];

	for (var i = 0; i < iseq.length; i++) {
		partial_sum = mod(sumover(iseq.slice(0, i + 1)));
		partial_sums.push(partial_sum);
	}

	var is_exact_permutation = intervals.every(function (val) {
		return partial_sums.indexOf(val) >= 0;
	});

	return is_exact_permutation;
}

function start(generator_test) {
	// console.log({ system, intervals });
	bruteforce(intervals, generator_test);
}

function stop() {
	console.log("about to call this.close()");
	this.close();
}

message_registry = {
	'stop': stop,
	'start_naive': start.bind(null, generatorTestNaive),
	'start_partial_sums': start.bind(null, generatorTestPartialSums),
	'start_all_contiguous_subsets': start.bind(null, generatorTestAllContiguousSubsets)
};

onmessage = function (event) {
	console.log(event.data);
	if (event.data in message_registry) {
		message_registry[event.data]();
		console.log('event recieved and execution completed');
	} else {
		console.log('event recieved but not in registry');
	}
};

module.exports = {
	sumover,
	range,
	bruteforce,
	bruteforceBauerMengelbergFerentz,
}

