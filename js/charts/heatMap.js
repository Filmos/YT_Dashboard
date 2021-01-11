function initHeatMap() {
  // set the dimensions and margins of the graph
  var margin = {top: 10, right: 30, bottom: 30, left: 60},
    width = 450 - margin.left - margin.right,
    height = 450 - margin.top - margin.bottom;
  
  // append the svg object to the body of the page
  var svg = d3.select("#heatmap")
              .append("svg")
                .attr('viewBox','-40 0 400 430' )
                .attr('preserveAspectRatio','xMinYMin');
  

    // Build X scales and axis:
    var x = d3.scaleBand()
      .range([ 0, width ])
      .domain([1, 2, 3, 4, 5, 6, 7])
      .padding(0.05);
  
    var weekdayNames = ["Mon.", "Tue.", "Wed.", "Thu.", "Fri.", "Sat.", "Sun."]
    svg.append("g")
      .style("font-size", 15)
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x)
              .tickSize(0)
              .tickFormat(function(d) { return weekdayNames[d - 1]; }))
      .call(g => g.select(".domain").remove())
      .call(g => g.selectAll("text").style("fill", "#ff6961"))
  
  
    // Build Y scales and axis:
    var y = d3.scaleBand()
      .range([ height, 0 ])
      .domain(Array.from({length: 24}, (_, i) => 23 - i))
      .padding(0.05);
  
    svg.append("g")
      .style("font-size", 15)
      .call(d3.axisLeft(y).tickSize(0).tickFormat(function(d) { return d+":00"; }))
      .call(g => g.select(".domain").remove())
      .call(g => g.selectAll("text").style("fill", "#ff6961"))
  
  
    // Create a tooltip
    var tooltip = createThemedTooltip(d3.select("#heatmap"))
      
    // Three function that change the tooltip when user hover / move / leave a cell
    var mouseover = function(d) {
      tooltip
        .style("opacity", 1)
      d3.select(this)
        .style("stroke", "black")
    }
    var mousemove = function(d) {
      tooltip
        .style("left", (d3.event.pageX - this.parentNode.getBoundingClientRect().x + 20) + "px")
        .style("bottom", (this.parentNode.getBoundingClientRect().height - d3.event.pageY + this.parentNode.getBoundingClientRect().y + 18) + "px")
      
      if(d.val === null) {
        tooltip.select(".tooltip-value").text("")
        tooltip.select(".tooltip-sub-value").text("No videos viewed")
      } else {
        let dat = DATATYPES_DEFINITIONS[SELECTED_DATATYPE]
        tooltip.select(".tooltip-value").text(dat.format(d.val))
        tooltip.select(".tooltip-sub-value").text(" "+dat.suffixName)
        
        if(SELECTED_DATATYPE == "General") {
          tooltip.select(".tooltip-title").text("Value for this timeframe")
        } else {
          tooltip.select(".tooltip-title").text("Median for this timeframe")
        }
      }
    }
    var mouseleave = function(d) {
      tooltip
        .style("opacity", 0)
      d3.select(this)
        .style("stroke", "none")
    }
  
  
    // Add the squares
    var dataBlank = [];
    for(let d=1;d<8;d++) for(let h=0;h<24;h++) dataBlank.push({day: d, hour: h})
    
    svg.selectAll()
      .data(dataBlank, function(d) {return d.day+':'+d.hour;})
      .enter()
      .append("rect")
        .attr("x", function(d) {return x(d.day) })
        .attr("y", function(d) {return y(d.hour)})
        .attr("rx", 4)
        .attr("ry", 4)
        .attr("width", x.bandwidth() )
        .attr("height", y.bandwidth())
        .style("stroke-width", 4)
        .style("stroke", "none")
        .style("transition", "fill 1s")
      .on("mouseover", mouseover)
      .on("mousemove", mousemove)
      .on("mouseleave", mouseleave)
}

function updateHeatMap(dataInput) {
  // Data processing
  var dataX = d3.nest()
      .key(function(v){
        var datatmp = new Date(v.time);
        return datatmp.getDay() + 1;
      })
      .key(function(v){
        var datatmp = new Date(v.time);
        return datatmp.getHours();
      })
      
  if(SELECTED_DATATYPE == "General") dataX = dataX.rollup(v => v.length)
  else dataX = dataX.rollup(v => d3.mean(v, function(d) { return +d[SELECTED_DATATYPE]; }))
      
  dataX = dataX.entries(dataInput);


  // Data restructuring
  var dataProcessed = [];
  for(let d=1;d<8;d++) for(let h=0;h<24;h++) dataProcessed.push({day: d, hour: h, val: null})
  dataX.forEach(p => {
      p.values.forEach(q => {
        dataProcessed[(p.key-1)*24+q.key*1].val = q.value
    });
  });
  
  // Update title
  if(SELECTED_DATATYPE == "General") {
    $('#heatMapTitle').text("Videos viewed throughout the week")
  } else {
    $('#heatMapTitle').text("Viewing preferences throughout the week")
  }
  
  // Build color scale
  var maxVal = d3.max(dataProcessed.filter(d => d.val != null), function(d) { return +d.val;} );
  var minVal = d3.min(dataProcessed.filter(d => d.val != null), function(d) { return +d.val;} );
  var myColor = d3.scaleSequential()
    .interpolator(d3.interpolateInferno)
    .domain([Math.log10(minVal), Math.log10(maxVal)])
    
  // Update heatmap
  d3.select("#heatmap svg").selectAll('rect')
    .data(dataProcessed, function(d) {return d.day+':'+d.hour;})
    .style("fill", function(d) { if(d.val===null) return 'transparent'; return myColor(Math.log10(d.val))} )

}
