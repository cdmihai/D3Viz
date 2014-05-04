function treeMap(){

	var margin = {top: 40, right: 10, bottom: 10, left: 10},
	    width = 960 - margin.left - margin.right,
	    height = 500 - margin.top - margin.bottom;

	var color = d3.scale.category20c();

	function styleNode(node){
		node.style("border", "solid 1px white")
			.style("font", "10px sans-serif")
			.style("line-height", "12px")
			.style("overflow", "hidden")
			.style("position", "absolute")
			.style("text-indent", "2px");

		return node;
	}

	var treemap = d3.layout.treemap()
	    .size([width, height])
	    .sticky(true)
	    .value(function(d) { return d.size; });

	function position() {
	  this.style("left", function(d) { return d.x + "px"; })
	      .style("top", function(d) { return d.y + "px"; })
	      .style("width", function(d) { return Math.max(0, d.dx - 1) + "px"; })
	      .style("height", function(d) { return Math.max(0, d.dy - 1) + "px"; });
	}

	function chart(selection){
		selection.each(function (root) {

		var div = d3.select(this).append("div")
		    .style("position", "relative")
		    .style("width", (width + margin.left + margin.right) + "px")
		    .style("height", (height + margin.top + margin.bottom) + "px")
		    .style("left", margin.left + "px")
		    .style("top", margin.top + "px");

		var node = div.datum(root).selectAll(".node")
		      .data(treemap.nodes)
			  .enter().append("div")
		      .call(styleNode)
		      .call(position)
		      .style("background", function(d) { return d.children ? color(d.name) : null; })
		      .text(function(d) { return d.children ? null : d.name; });
		});
	}

	return chart;
}