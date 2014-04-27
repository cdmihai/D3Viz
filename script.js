function lineChart(){

	var margin = {top: 20, right: 20, bottom: 20, left: 40},
				    width = 960 - margin.left - margin.right,
				    height = 500 - margin.top - margin.bottom;
				
	var parseDate = d3.time.format("%d-%b-%y").parse;

	var x = d3.time.scale()
	    .range([0, width]);

	var y = d3.scale.linear()
	    .range([height, 0]);

	var xAxis = d3.svg.axis()
	    .scale(x)
	    .orient("bottom");

	var yAxis = d3.svg.axis()
	    .scale(y)
	    .orient("left");

	var line = d3.svg.line()
	    .x(function(d) { return x(d.date); })
	    .y(function(d) { return y(d.close); });

	var styleAxis = function styleAnAxis(element){
		element.style("fill", "none")
				.style("stroke", "#000")
				.style("shape-rendering", "crispEdges")
				.style("font", "10px sans-serif")
		
		return element;
	}

	var styleLine = function styleALine(element){
		element.style("fill", "none")
				.style("stroke", "steelblue")
				.style("stroke-width", "1.5px");

		return element;
	} 

	var chart = function (selection){
		selection.each(function(data) {

			data.forEach(function(d) {
			  d.date = parseDate(d.date);
			  d.close = +d.close;
			});

			var svg = d3.select(this).append("svg")
				.attr("width", width + margin.left + margin.right)
			    .attr("height", height + margin.top + margin.bottom)
			  	.append("g")
			    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


			x.domain(d3.extent(data, function(d) { return d.date; }));
			y.domain(d3.extent(data, function(d) { return d.close; }));
			
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
			    .text("Price ($)");
			
			svg.append("path")
			    .datum(data)
			    .call(styleLine)
			    .attr("d", line);

		});
	}

	return chart;

}