function updateHeatMap(dataInput) {
  // make a place for a new chart
  //d3.select("svg").remove();

  // !!!!!!!!!!!!!!!!!!!!!!!!
  // data processing
  var dataX = d3.nest()
      .key(function(v){
        var datatmp = new Date(v.time);
        return datatmp.getDay();
      })
      .key(function(v){
        var datatmp = new Date(v.time);
        return datatmp.getHours();
      })
      .rollup(v => v.length)
      .entries(dataInput);
      console.log(dataX);

  var dataProcessed = [];

  dataX.forEach(p => {
      p.values.forEach(q => {
        dataProcessed.push({day : p.key, hour : q.key, val : q.value});
    });
  });
  console.log(dataProcessed);

  for(var i = 0; i < 7; i++){
    var tmpDay = dataProcessed.find(w => w.day == i);
    if (tmpDay == undefined){
      for(var j = 0; j < 24; j++){
        dataProcessed.push({day : i, hour : j, val : 0});
      }
    } else {
      for(var j = 0; j < 24; j++){
        var tmpHour = dataProcessed.find(w => w.day == i && w.hour == j);
        if(tmpHour == undefined){
          dataProcessed.push({day : i, hour : j, val : 0});
        }
      }
    }
  }

  // !!!!!!!!!!!!!!!!!!!!!!!!
  // end of data processing



  // set the dimensions and margins of the graph
var margin = {top: 10, right: 30, bottom: 30, left: 60},
  width = 450 - margin.left - margin.right,
  height = 450 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#heatmap")
.append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
.append("g")
  .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");



  // Labels of row and columns -> unique identifier of the column called 'group' and 'variable'
  var myGroups = d3.map(dataProcessed, function(d){return d.day;}).keys().sort((a, b) => a - b);
  var myVars = d3.map(dataProcessed, function(d){return d.hour;}).keys().sort((a, b) => b - a);

  // Build X scales and axis:
  var x = d3.scaleBand()
    .range([ 0, width ])
    .domain(myGroups)
    .padding(0.05);
  svg.append("g")
    .style("font-size", 15)
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x).tickSize(0))
    .select(".domain").remove()

  // Build Y scales and axis:
  var y = d3.scaleBand()
    .range([ height, 0 ])
    .domain(myVars)
    .padding(0.05);
  svg.append("g")
    .style("font-size", 15)
    .call(d3.axisLeft(y).tickSize(0))
    .select(".domain").remove()

  // Build color scale
  var myColor = d3.scaleSequential()
    .interpolator(d3.interpolateInferno)
    .domain([1,100])

  // create a tooltip
  var tooltip = d3.select("#heatmap")
    .append("div")
    .style("opacity", 0)
    .attr("class", "tooltip")
    .style("background-color", "white")
    .style("border", "solid")
    .style("border-width", "2px")
    .style("border-radius", "5px")
    .style("padding", "5px")

  // Three function that change the tooltip when user hover / move / leave a cell
  var mouseover = function(d) {
    tooltip
      .style("opacity", 1)
    d3.select(this)
      .style("stroke", "black")
      .style("opacity", 1)
  }
  var mousemove = function(d) {
    tooltip
      .html("The exact value of<br>this cell is: " + d.val)
      .style("left", (d3.mouse(this)[0]+70) + "px")
      .style("top", (d3.mouse(this)[1]) + "px")
  }
  var mouseleave = function(d) {
    tooltip
      .style("opacity", 0)
    d3.select(this)
      .style("stroke", "none")
      .style("opacity", 0.8)
  }

  // add the squares
  svg.selectAll()
    .data(dataProcessed, function(d) {return d.day+':'+d.hour;})
    .enter()
    .append("rect")
      .attr("x", function(d) { return x(d.day) })
      .attr("y", function(d) { return y(d.hour) })
      .attr("rx", 4)
      .attr("ry", 4)
      .attr("width", x.bandwidth() )
      .attr("height", y.bandwidth() )
      .style("fill", function(d) { return myColor(d.val)} )
      .style("stroke-width", 4)
      .style("stroke", "none")
      .style("opacity", 0.8)
    .on("mouseover", mouseover)
    .on("mousemove", mousemove)
    .on("mouseleave", mouseleave)


// Add title to graph
//svg.append("text")
//        .attr("x", 0)
//        .attr("y", -50)
//        .attr("text-anchor", "left")
//        .style("font-size", "22px")
//        .text("A d3.js heatmap");

// Add subtitle to graph
//svg.append("text")
//        .attr("x", 0)
//        .attr("y", -20)
//        .attr("text-anchor", "left")
//        .style("font-size", "14px")
//        .style("fill", "grey")
//        .style("max-width", 400)
//        .text("A short description of the take-away message of this chart.");
}
