function createThemedTooltip(parent) {
  var tooltip = parent.append("div")
    .style("opacity", 0)
    .style("transition", "opacity 0.5s")
    .attr("class", "tooltip card shadow p-1")
    .style('pointer-events', 'none')
    
  tooltip.append("div")
           .attr("class", "tooltip-title text-primary text-uppercase font-weight-bold")
           .style("font-size", "0.8rem")
  tooltip.append("span")
           .attr("class", "tooltip-value text-gray-800 font-weight-bold")
           .style("font-size", "1rem")
  tooltip.append("span")
           .attr("class", "tooltip-sub-value text-gray-300 font-weight-bold")
           .style("font-size", "1rem")
           
  tooltip.selectAll("*").style('pointer-events', 'none')
  return tooltip
}