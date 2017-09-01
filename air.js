var c = document.getElementById("stage");
var ctx = c.getContext("2d");
var radius = 100;

var centerX = c.width / 2;
var centerY = c.height / 2;

var computeWorker = new Worker('worker.js');

var UNIVERSE_N = 12;

var go_button = document.getElementById("go");
var stop_button = document.getElementById("stop");

var output_area = document.getElementById("output");

function resolveToPoint(r, theta, offset) {
	offset = offset || {
		x: 0,
		y: 0
	};

	theta = theta - 0.5 * Math.PI;

	return {
		x: r * Math.cos(theta) + offset.x,
		y: r * Math.sin(theta) + offset.y
	};
}

var drawCircle = function () {
	ctx.beginPath();
	ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
	ctx.lineWidth = 1;
	ctx.stroke();
};

var drawLine = function (from, to, divisions) {
	var from_theta = 2 * Math.PI / divisions * from;
	var to_theta = 2 * Math.PI / divisions * to;

	var offset = {
		x: centerX,
		y: centerY
	};

	var from_point = resolveToPoint(radius, from_theta,
		offset);
	var to_point = resolveToPoint(radius, to_theta,
		offset);

	ctx.lineWidth = 2;
	ctx.beginPath();
	ctx.moveTo(from_point.x, from_point.y);
	ctx.lineTo(to_point.x, to_point.y);
	ctx.stroke();

};

var drawSequence = function (iseq) {
	ctx.strokeStyle = 'rgba(0,0,0)';
	for (var i = 0; i < iseq.length - 1; i++) {
		drawLine(iseq[i], iseq[i + 1], UNIVERSE_N - 1);
	}
};

var clearCanvas = function () {
	ctx.clearRect(0, 0, c.width, c.height);
};

var clearOutputArea = function () {
	while (output_area.firstChild) {
		output_area.removeChild(output_area.firstChild);
	}
};

var trailEffectClear = function () {
	ctx.fillStyle = 'rgba(255, 255, 255, .8)';
	ctx.fillRect(0, 0, c.width, c.height);
};

var addResultToSelect = function (data) {
	var option = document.createElement("option");
	option.text = data;
	option.value = data;

	var select = document.getElementById("output");
	select.appendChild(option);
};

var updateStats = function () {
	var count = output_area.childElementCount;
	list_size = document.getElementById("list_size");
	list_size.innerHTML = count + " interval patterns found";
};

var init = function () {

	clearCanvas();
	clearOutputArea();
	updateStats();
	drawCircle();
	attachHandlers();
};

var attachHandlers = function () {
	computeWorker.onmessage = function (event) {
		addResultToSelect(event.data);

		trailEffectClear();
		updateStats();

		drawSequence(event.data.map(
			function (x) {
				return x - 1;
			}));
	};

	computeWorker.onerror = function (error) {
		console.log('Worker error: ', error.message);
	};
};

go_button.addEventListener("click", function () {

	clearCanvas();
	clearOutputArea();
	updateStats();

	var e = document.getElementById("generator_test");
	var generator_test_value = e.options[e.selectedIndex].value;
	computeWorker.postMessage("start_" + generator_test_value);

});

stop_button.addEventListener("click", function () {
	computeWorker.terminate();
	computeWorker = new Worker('worker.js');
	attachHandlers();
});

output_area.addEventListener("change", function () {

	clearCanvas();

	var output_area_value = output_area.options[output_area.selectedIndex].value;

	drawSequence(output_area_value.split(',').map(Number));

});

init();