/*
Based on: http://bl.ocks.org/mbostock/3883245
*/
/*
Displays a time line chart: Ox represents time and Oy is linear.
Configurables: width, height, yLabel, dateFormat
*/
function lineChart() {

	//padding around the chart
	var margin = {
		top: 20,
		right: 20,
		bottom: 20,
		left: 40
	};
	var width = 960 - margin.left - margin.right;
	var height = 500 - margin.top - margin.bottom;
	var yLabel = "";
	var dateFormat = "%d-%b-%y";

	var parseDate = d3.time.format(dateFormat).parse;

	//the two scales. Ox is always a time scale
	var x = d3.time.scale()
	var y = d3.scale.linear()

	var xAxis = d3.svg.axis()
		.scale(x)
		.orient("bottom");

	var yAxis = d3.svg.axis()
		.scale(y)
		.orient("left");

	//line used to draw the path. Its coordinates are defined by x: time and y: value
	var line = d3.svg.line()
		.x(function (d) {
			return x(d.date);
		})
		.y(function (d) {
			return y(d.close);
		});

	//style the axis. Without this they are drawn very thick
	var styleAxis = function (element) {
		element.style("fill", "none")
			.style("stroke", "#000")
			.style("shape-rendering", "crispEdges")
			.style("font", "10px sans-serif")

		return element;
	}

	//style the line generator that will generate the path
	var styleLine = function (element) {
		element.style("fill", "none")
			.style("stroke", "steelblue")
			.style("stroke-width", "1.5px");

		return element;
	}

	var chart = function (selection) {

		x.range([0, width]);

		y.range([height, 0]);

		selection.each(function (data) {

			//coerce the data into expected data types
			data.forEach(function (d) {
				d.date = parseDate(d.date);
				d.close = +d.close;
			});


			var svg = d3.select(this) //the element that contains the graph
				.append("svg") //create the svg
				.attr("width", width + margin.left + margin.right) //width, including margins
				.attr("height", height + margin.top + margin.bottom) //height, including margins
				.append("g")
				.attr("transform", "translate(" + margin.left + "," + margin.top + ")"); //translate to margin corner

			//the axis domains
			x.domain(d3.extent(data, function (d) {
				return d.date;
			}));
			y.domain(d3.extent(data, function (d) {
				return d.close;
			}));

			//create the X axis
			svg.append("g")
				.call(styleAxis)
				.attr("transform", "translate(0," + height + ")") // translate to margin height (check var init)
			.call(xAxis);

			//create the Y axis
			svg.append("g")
				.call(styleAxis)
				.call(yAxis)
				.append("text") //add the Ylabel, rotate by 90 degrees
			.attr("transform", "rotate(-90)")
				.attr("y", 10) //y offset from the acis
			.attr("dy", ".71em")
				.style("text-anchor", "end")
				.text(yLabel);

			//add the linechart
			svg.append("path")
				.datum(data) //set the coordinates that define the line
			.call(styleLine)
				.attr("d", line); // use the previously defined line generator that uses the time and value as coordinates

		});
	}

	//here be setters and getters

	chart.width = function (value) {
		if (!arguments.length) return width;
		width = value - margin.left - margin.right;

		return this;
	};

	chart.height = function (value) {
		if (!arguments.length) return height;
		height = value - margin.top - margin.bottom;

		return this;
	};

	chart.yLabel = function (value) {
		if (!arguments.length) return yLabel;
		yLabel = value;

		return this;
	};

	chart.dateFormat = function (value) {
		if (!arguments.length) return dateFormat;
		dateFormat = value;

		return this;
	};

	return chart;

}