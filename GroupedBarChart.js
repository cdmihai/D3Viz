/*
Based on: http://bl.ocks.org/mbostock/3887051
*/

/*
Displays a grouped bar chart.
The chart takes as input the name of the first column (via mainGroupName()).
This is the column around which the rest of the columns are grouped by.
*/
function groupedBarChart() {

	//pading around the chart
	var margin = {
			top: 20,
			right: 20,
			bottom: 30,
			left: 40
		};
	var width = 960 - margin.left - margin.right;
	var height = 500 - margin.top - margin.bottom;
	var yLabel ="";

	//column name of first grouping
	//the bars will be grouped by this column
	var mainGroupingName = ""

	//scale responsible for the main grouping
	var x0 = d3.scale.ordinal()

	//scale responsible for the grouped bars
	//it "exists" inside x0: its range is as big as one band in X0
	var x1 = d3.scale.ordinal();

	var y = d3.scale.linear();

	//a color scale for the grouped bars
	var color = d3.scale.category20();
	
	var xAxis = d3.svg.axis()
		.scale(x0)
		.orient("bottom");

	var yAxis = d3.svg.axis()
		.scale(y)
		.orient("left")
		.tickFormat(d3.format(".2s"));

	//add styling to the axis. 
	var styleAxis = function (element) {
		element.style("fill", "none")
			.style("stroke", "#000")
			.style("shape-rendering", "crispEdges")
			.style("font", "10px sans-serif")

		return element;
	}

	var chart = function (selection) {

		selection.each(function (data) {

			//retrieve the inner grouping column names as all the column names of a node except the primary one
			var secondGroupingNames = d3.keys(data[0]).filter(function (key) {
				return key !== mainGroupingName;
			});

			//add a new field to all data objects that contains an array off all the values in a key - value format
			//this is needed to be able to join the grouped data to its marks
			data.forEach(function (d) {
				d.secondGrouping = secondGroupingNames.map(function (name) {
					return {
						name: name,
						value: +d[name]
					};
				});
			});

			x0.rangeRoundBands([0, width], .1); 

			//the domain of the primary grouping
			x0.domain(data.map(function (d) {
				return d[mainGroupingName];
			}));

			//the domain of the secondary grouping represents the values of the secondary grouped columns
			//the range is the range of one of the primary groupings. This ensures that the grouped columns fit in the larger grouping
			x1.domain(secondGroupingNames).rangeRoundBands([0, x0.rangeBand()]);
			
			y.range([height, 0]);

			//compute the maximum of all the nested values
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

			//Ox axis styling
			svg.append("g")
				.call(styleAxis)
				.attr("transform", "translate(0," + height + ")")
				.call(xAxis);

			//Oy axis styling and label
			svg.append("g")
				.call(styleAxis)
				.call(yAxis)
				.append("text")
				.attr("transform", "rotate(-90)")
				.attr("y", 6)
				.attr("dy", ".71em")
				.style("text-anchor", "end")
				.text(yLabel);

			//create groups for each main grouping value
			var mainGrouping = svg.selectAll(".mainGrouping")
				.data(data) //the top level data is joined, each row in the data gets one group
				.enter().append("g")
				.attr("class", "g")
				.attr("transform", function (d) {
					return "translate(" + x0(d[mainGroupingName]) + ",0)"; //each main grouping is translated to a position via the x0 scale

				});

			//create the grouped bars
			mainGrouping.selectAll("rect")
				.data(function (d) { //for each row, join its nested data to rectangles from inside each higher level group
					return d.secondGrouping;
				})
				.enter().append("rect")
				.attr("width", x1.rangeBand()) //use x1 to get the height of a single bar, so it fits inside the larger band defined by x0
				.attr("x", function (d) {
					return x1(d.name); //use x1 to obtain the position of a specific bar
				})
				.attr("y", function (d) {
					return y(d.value); //use y to scale the actual value
				})
				.attr("height", function (d) {
					return height - y(d.value);
				})
				.style("fill", function (d) {
					return color(d.name); //get the color for a specific bar
				});


			var legend = svg.selectAll(".legend")
				.data(secondGroupingNames.slice())
				.enter().append("g")
				.attr("class", "legend")
				.attr("transform", function (d, i) {
					return "translate(0," + i * 20 + ")"; //put the legend boxes vertically on top of each other
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

	//here be getters and setters

	chart.mainGroupingName = function (value) {
		if (!arguments.length) return dateFormat;
		mainGroupingName = value;

		return this;
	};

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

	chart.yLabel = function (value) {
		if (!arguments.length) return yLabel;
		yLabel = value;

		return this;
	};

	return chart;
}