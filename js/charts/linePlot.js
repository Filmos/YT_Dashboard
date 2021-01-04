function updateLinePlot(dataInput) {
  // make a place for a new chart
  //d3.select("svg").remove();

  var margin = {top: 10, right: 30, bottom: 30, left: 60},
    width = 700 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#linePlot")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

// !!!!!!!!!!!!!!!!!!!!!!!!
// data processing
var dataX = d3.nest()
    .key(function(v){
      var datatmp = new Date(v.time);
      return datatmp.getFullYear() + "-" + datatmp.getMonth() + "-" + datatmp.getDay() + "-" + datatmp.getHours();
    })
    .rollup(v => d3.mean(v, function(d) { return +d[SELECTED_DATATYPE]; }))
    .entries(dataInput);

var dataFormat = "%Y-%m-%d-%H";

dataX = dataX.sort((a, b) => {
  var date1 = d3.timeParse(dataFormat)(a.key)
  var date2 = d3.timeParse(dataFormat)(b.key)
  return date1 - date2;
});
// !!!!!!!!!!!!!!!!!!!!!!!!
// end of data processing

// Add X axis - date format
var x = d3.scaleTime()
      .domain(d3.extent(dataX, function(d) {
        var x = d3.timeParse(dataFormat)(d.key);
        return x; }))
      .range([ 0, width ]);

    xAxis = svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

    // Add Y axis
    var y = d3.scaleLinear()
      .domain([0, d3.max(dataX, function(d) { return +d.value; })])
      .range([ height, 0 ]);
    yAxis = svg.append("g")
      .call(d3.axisLeft(y));

    // Add a clipPath: everything out of this area won't be drawn.
    var clip = svg.append("defs").append("svg:clipPath")
        .attr("id", "clip")
        .append("svg:rect")
        .attr("width", width )
        .attr("height", height )
        .attr("x", 0)
        .attr("y", 0);

    // Add brushing
    var brush = d3.brushX()                   // Add the brush feature using the d3.brush function
        .extent( [ [0,0], [width,height] ] )  // initialise the brush area: start at 0,0 and finishes at width,height: it means I select the whole graph area
        .on("end", updateChart)               // Each time the brush selection changes, trigger the 'updateChart' function

    // Create the line variable: where both the line and the brush take place
    var line = svg.append('g')
      .attr("clip-path", "url(#clip)")

    line.append("path")
        .attr("class", "line")
        .data([dataX])
        .attr("fill", "steelblue")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 1.5)
        .attr("d", d3.line()
              .x(function(d) { return x(d3.timeParse(dataFormat)(d.key))})
              .y(function(d) { return y(d.value) })
             )

    // Add the brushing
    line
      .append("g")
        .attr("class", "brush")
        .call(brush);

    // A function that set idleTimeOut to null
    var idleTimeout
    function idled() { idleTimeout = null; }

    // A function that update the chart for given boundaries
    function updateChart() {

      // What are the selected boundaries?
      extent = d3.event.selection

      // If no selection, back to initial coordinate. Otherwise, update X axis domain
      if(!extent){
        if (!idleTimeout) return idleTimeout = setTimeout(idled, 350); // This allows to wait a little bit
        x.domain([ 4,8])
      }else{
        x.domain([ x.invert(extent[0]), x.invert(extent[1]) ])
        line.select(".brush").call(brush.move, null) // This remove the grey brush area as soon as the selection has been done
      }

      // Update axis and line position
      xAxis.transition().duration(1000).call(d3.axisBottom(x))
      line
          .select('.line')
          .transition()
          .duration(1000)
          .attr("d", d3.line()
            .x(function(d) { return x(d3.timeParse(dataFormat)(d.key))})
            .y(function(d) { return y(d.value) })
          )
    }

    // If user double click, reinitialize the chart
    svg.on("dblclick",function(){
      x.domain(d3.extent(dataX, function(d) {
              var x = d3.timeParse(dataFormat)(d.key);
              return x; }))
      xAxis.transition().call(d3.axisBottom(x))
      line
        .select('.line')
        .transition()
        .attr("d", d3.line()
          .x(function(d) { return x(d3.timeParse(dataFormat)(d.key))})
          .y(function(d) { return y(d.value) })
      )
    });


}
