/*
Based on: http://bl.ocks.org/mbostock/4063582
*/

/*
Necessary attributes for a Node:
"children" -> array of Nodes
"name" -> name of node
"value" -> numeric value of the node

The treemap is configurable with: width and height
*/
function treeMap(){

	var margin = {top: 40, right: 10, bottom: 10, left: 10};
	width = 960 - margin.left - margin.right;
	height = 500 - margin.top - margin.bottom;

	var color = d3.scale.category20c();

	//applies styling for a leaf node (absolute divs)
	function styleNode(node){
		node.style("border", "solid 1px white")
			.style("font", "10px sans-serif")
			.style("line-height", "12px")
			.style("overflow", "hidden")
			.style("position", "absolute")
			.style("text-indent", "2px");

		return node;
	}

	//computes the position of one div node
	function position() {
	  this.style("left", function(d) { return d.x + "px"; })
	      .style("top", function(d) { return d.y + "px"; })
	      .style("width", function(d) { return Math.max(0, d.dx - 1) + "px"; })
	      .style("height", function(d) { return Math.max(0, d.dy - 1) + "px"; });
	}

	function chart(selection){
		selection.each(function (root) {

		var treemap = d3.layout.treemap()
	    .size([width, height])
	    .value(function(d) { return d.value; }); //function that retrieves the numeric value of a node

		var div = d3.select(this).append("div") //the treemap exists inside a div in the parent
		    .style("position", "relative")
		    .style("width", (width + margin.left + margin.right) + "px")
		    .style("height", (height + margin.top + margin.bottom) + "px")
		    .style("left", margin.left + "px")
		    .style("top", margin.top + "px");

		var node = div.datum(root) //add the top leve json data object to the top level div
			  .selectAll(".node")
		      .data(treemap.nodes) //compute all treemap nodes 
			  .enter().append("div")
		      .call(styleNode) //style each node
		      .call(position) //position the div for each node
		      .style("background", function(d) { return d.children ? color(d.name) : null; }) //color the non leaf nodes
		      .text(function(d) { return d.children ? null : d.name; }); //name only the leaf nodes
		});
	}

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

	return chart;
}