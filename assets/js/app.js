// @TODO: YOUR CODE HERE!

// Define SVG area dimensions
var svgWidth = 960;
var svgHeight = 660;

// Define the chart's margins as an object
var chartMargin = {
  top: 25,
  right: 25,
  bottom: 25,
  left: 25
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

    // Create chart axis
    var bottomAxis = d3.axisBottom(xScale);
    var leftAxis = d3.axisLeft(yScale);

    // create bottom and left axis
    chartGroup.append("g")
        .call(leftAxis);
    
    chartGroup.append("g")
        .attr("transform", `translate(0, ${chartHeight})`)
        .call(bottomAxis);
    
    // create scatter circle plot for each point
    var scatterPlot = chartGroup.selectAll("circle")
        .data(Data)
        .enter()
        .append("circle")
        .attr("cx", (d, i) => xScale(d.poverty))
        .attr("cy", d => yScale(d.healthcare))
        .attr("r", 10)
        .attr("fill", "red")
        .attr("opacity", ".4")

    // States
    chartGroup.selectAll('text')
        .data(Data)
        .enter()
        .append('text')
        .attr('x', (d, i) => xScale(d.poverty))
        .attr('y', d => (yScale(d.healthcare-0.2)))
        .classed('label', true)
        .text(d => d.abbr)
        .on('mouseover', function(d) {
            toolTip.show(d);
        })
        .on('mouseout', function(d) {
            toolTip.hide(d, i);
        });

    // labels on axis
    chartGroup.append('text')
        .attr('transform', "rotate(90)")
        .attr('y', 0 - chartMargin.left)
        .attr('x', 0 - chartHeight)
        .attr('dy', 'em')
        .classed('Text1', true)
        .attr('xAxisLabel', "Healthcare")
        .text('Without Healthcare (%)');

    chartGroup.append('text')
        .attr('transform', "translate('+ chartWidth/2)+50'")
        .classed('Text1', true)
        .attr('xAxisLabel', "Healthcare")
        .text('Poverty (%)');

    // tooltip

    var toolTip = d3.tip()
        .attr('class', 'toolTip')
        .offset([-10, 10])
        .html(function(d) {
            return(`${d.abbr}<br>Healthcare (%)<br>Poverty: ${d.poverty}`);
            
        });

    chartGroup.call(toolTip);

    scatterPlot.on('mouseover', function(d) {
        toolTip.show(d);
    })
        .on('mouseout', function(d, i) {
            toolTip.hide(d)
        })
   

}).catch(function(error) {
    console.log(error);
});