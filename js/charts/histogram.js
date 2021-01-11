//const d3 = require("jquery");

function updateHistogram(dataInput) {
    d3.select("#histogram>svg").remove();

    var dataX = dataInput.map(v => v[SELECTED_DATATYPE]);

    min = d3.min(dataX);
    //console.log("M I N");
    //console.log(min);
    max = d3.max(dataX);
    //console.log("M A X");
    //console.log(max);
    domain = [min,max];

    if(SELECTED_DATATYPE == "General") {
        $('#histogramTitle').text(" ")
    } else {
        $('#histogramTitle').text("Histogram of " +SELECTED_DATATYPE.toLowerCase()+" over time")
    }

    var margin = { top: 30, right: 50, bottom: 30, left: 100 },
        width = 1000 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;

// The number of bins
    Nbin = 10;

    var x = d3.scaleLinear()
        .domain(domain)
        .range([0, width]);


    var histogram = d3.histogram()
        .domain(x.domain()) // then the domain of the graphic
        .thresholds(x.ticks(Nbin)); // theen the numbers of bins

    //var histogram = d3.layout.histogram()
    //    .bins(x.ticks(Nbin))
    //    (dataX);

// And apply this function to data to get the bins
    var bins = histogram(dataX);

    //console.log("pierwszy log");

    var svg = d3.select("#histogram")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    //console.log("drugi log");

    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

    //console.log("trzeci");

    var y = d3.scaleLinear()
        .range([height, 0])
        .domain([
            0,
            d3.max(bins, function(d) {
                return d.length;
            })
        ]);

    svg.append("g").call(d3.axisLeft(y));

    svg
        .selectAll("rect")
        .data(bins)
        .enter()
        .append("rect")
        .attr("x", 1)
        .attr("transform", function(d) {
            return "translate(" + x(d.x0) + "," + y(d.length) + ")";
        })
        .attr("width", function(d) {
            return x(d.x1) - x(d.x0) - 1;
        })
        .attr("height", function(d) {
            return height - y(d.length);
        })
        .style("fill", "#C34A36");

}