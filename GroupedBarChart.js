function groupedBarChart() {

	var margin = {
			top: 20,
			right: 20,
			bottom: 30,
			left: 40
		},
		width = 960 - margin.left - margin.right,
		height = 500 - margin.top - margin.bottom;

	//column name of first grouping
	var mainGroupingName = ""

	var x0 = d3.scale.ordinal()
		.rangeRoundBands([0, width], .1);

	var x1 = d3.scale.ordinal();

	var y = d3.scale.linear()
		.range([height, 0]);

	var color = d3.scale.ordinal()
		.range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

	var xAxis = d3.svg.axis()
		.scale(x0)
		.orient("bottom");

	var yAxis = d3.svg.axis()
		.scale(y)
		.orient("left")
		.tickFormat(d3.format(".2s"));

	var styleAxis = function (element) {
		element.style("fill", "none")
			.style("stroke", "#000")
			.style("shape-rendering", "crispEdges")
			.style("font", "10px sans-serif")

		return element;
	}

	var chart = function (selection) {

		selection.each(function (data) {

			var secondGroupingNames = d3.keys(data[0]).filter(function (key) {
				return key !== mainGroupingName;
			});

			data.forEach(function (d) {
				d.secondGrouping = secondGroupingNames.map(function (name) {
					return {
						name: name,
						value: +d[name]
					};
				});
			});

			x0.domain(data.map(function (d) {
				return d[mainGroupingName];
			}));

			x1.domain(secondGroupingNames).rangeRoundBands([0, x0.rangeBand()]);
			
			y.domain([0, d3.max(data, function (d) {
				return d3.max(d.secondGrouping, function (d) {
					return d.value;
				});
			})]);

			var svg = d3.select(this) //the element that contains the graph
				.append("svg") //create the svg
				.attr("width", width + margin.left + margin.right) //width, including margins
				.attr("height", height + margin.top + margin.bottom) //height, including margins
				.append("g")
				.attr("transform", "translate(" + margin.left + "," + margin.top + ")"); //translate to margin corner

			svg.append("g")
				.call(styleAxis)
				.attr("transform", "translate(0," + height + ")")
				.call(xAxis);

			svg.append("g")
				.call(styleAxis)
				.call(yAxis)
				.append("text")
				.attr("transform", "rotate(-90)")
				.attr("y", 6)
				.attr("dy", ".71em")
				.style("text-anchor", "end")
				.text("Population");

			var mainGrouping = svg.selectAll(".mainGrouping")
				.data(data)
				.enter().append("g")
				.attr("class", "g")
				.attr("transform", function (d) {
					return "translate(" + x0(d[mainGroupingName]) + ",0)";
				});

			mainGrouping.selectAll("rect")
				.data(function (d) {
					return d.secondGrouping;
				})
				.enter().append("rect")
				.attr("width", x1.rangeBand())
				.attr("x", function (d) {
					return x1(d.name);
				})
				.attr("y", function (d) {
					return y(d.value);
				})
				.attr("height", function (d) {
					return height - y(d.value);
				})
				.style("fill", function (d) {
					return color(d.name);
				});

			var legend = svg.selectAll(".legend")
				.data(secondGroupingNames.slice().reverse())
				.enter().append("g")
				.attr("class", "legend")
				.attr("transform", function (d, i) {
					return "translate(0," + i * 20 + ")";
				});

			legend.append("rect")
				.attr("x", width - 18)
				.attr("width", 18)
				.attr("height", 18)
				.style("fill", color);

			legend.append("text")
				.attr("x", width - 24)
				.attr("y", 9)
				.attr("dy", ".35em")
				.style("text-anchor", "end")
				.text(function (d) {
					return d;
				});
		});

	}

	chart.mainGroupingName = function (value) {
		if (!arguments.length) return dateFormat;
		mainGroupingName = value;

		return this;
	};

	return chart;
}