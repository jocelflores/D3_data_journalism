// @TODO: YOUR CODE HERE!

// Define SVG area dimensions
var svgWidth = 960;
var svgHeight = 660;

// Define the chart's margins as an object
var chartMargin = {
  top: 30,
  right: 30,
  bottom: 30,
  left: 30
};

// Define dimensions of the chart area
var chartWidth = svgWidth - chartMargin.left - chartMargin.right;
var chartHeight = svgHeight - chartMargin.top - chartMargin.bottom;

// Select body, append SVG area to it, and set the dimensions
var svg = d3.select("#scatter")
  .append("svg")
  .attr("height", svgHeight)
  .attr("width", svgWidth);

  // Append a group to the SVG area and shift ('translate') it to the right and to the bottom
var chartGroup = svg.append("g")
.attr("transform", `translate(${chartMargin.left}, ${chartMargin.top})`);

// Load data from data.csv
d3.csv("data.csv").then(function (Data) {
    
    Data.forEach(function(d) {
        d.poverty = +d.poverty;
        d.healthcare = +d.healthcare;
    }); 

    // create scale
    var xScale = d3.scaleLinear()
        .domain(Data.map(d => d.poverty))
        .range([0, chartWidth]);

    var yScale = d3.scaleLinear()
        .domain([0, d3.max(Data, d => d.healthcare)])
        .range([chartHeight, 0]);

    var bottomAxis = d3.axisBottom(xScale);
    var leftAxis = d3.axisLeft(yScale);

    chartGroup.append("g")
        .call(leftAxis);
    
    chartGroup.append("g")
        .attr("transform", `translate(0, ${chartHeight})`)
        .call(bottomAxis);
    
    chartGroup.selectAll("circle")
        .data(Data)
        .endter()
        .append("circle")
        .attr("cx", d => xScale(d.poverty))
        .attr("cy", d => yScale(d.healthcare))
        .attr("r", 1.5)
        .attr("fill", "orange")
        .attr("opacity", ".9");

});