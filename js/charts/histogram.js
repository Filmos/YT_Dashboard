//const d3 = require("jquery");

function updateHistogram(dataInput) {

    var dataX = dataInput.map(v => v[SELECTED_DATATYPE]);
    dataX.sort(function(a, b){return b-a});
    //console.log("DATA X")
    //console.log(dataX);

    min = d3.min(dataX);
    max = d3.max(dataX);
    domain = [min,max];
    Nbin = 15; // The number of bins

    step = (max - min)/Nbin;
    buckets = [];
    labels = [];
    bucketborder = max;
    //labels.unshift(Math.round(bucketborder));
    bucketsize = 0;

    for (let i = 0; i < dataX.length ; i++){

        if (dataX[i] >= bucketborder){
            bucketsize += 1;
        }
        else {
            if (bucketsize != 0 || bucketborder > 1) {
                buckets.unshift(bucketsize);
                if (SELECTED_DATATYPE == "Like to dislike ratio"){
                    labels.unshift(bucketborder + "<");
                }else {
                    labels.unshift(Math.round(bucketborder) + "<");
                }
            }
            bucketsize = 0;
            if (SELECTED_DATATYPE === "Likes per thousand views" || SELECTED_DATATYPE === "Dislikes per thousand views" || SELECTED_DATATYPE === "Comments per thousand views" ) {
                bucketborder = Math.round(bucketborder / 2);
            }else if (SELECTED_DATATYPE === "Like to dislike ratio"){
                bucketborder = bucketborder / 2;
            //    console.log("druga")
            //    bucketborder = bucketborder - step;
            }else {
                bucketborder = Math.round(bucketborder / 5);
            }
            //i = i - 1;
        }
    }
    //buckets.unshift(bucketsize);
    console.log(SELECTED_DATATYPE.toLowerCase());
    console.log(min, max);
    console.log(step)
    console.log("BUCKET");
    console.log(buckets);
    console.log("LABELS");
    console.log(labels);

//end of data processing

    if(SELECTED_DATATYPE == "General") {
        $('#histogramTitle').text(" ")
    } else {
        $('#histogramTitle').text("Histogram of number of" + SELECTED_DATATYPE.toLowerCase()+" over time")
    }

    Chart.defaults.global.datasets.bar.categoryPercentage = 1.3;
    const ctx = document.getElementById('histogram');

    const histogram = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Number of blah blah',
                data: buckets,
                backgroundColor: '#C34A36',
            }]
        },
        options: {
            scales: {
                xAxes: [{
                    display: false,
                    //barPercentage: 1.3,
                    ticks: {
                        max: 3,
                    }
                }, {
                    display: true,
                    ticks: {
                        autoSkip: false,
                        max: 4,
                    }
                }],
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        }
    });


    //%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%5

    /*
    d3.select("#histogram>svg").remove();

    var dataX = dataInput.map(v => v[SELECTED_DATATYPE]);

    console.log("BLAHBLAH");

    min = d3.min(dataX);
    max = d3.max(dataX);
    domain = [min,max];
    Nbin = 10; // The number of bins


    if(SELECTED_DATATYPE == "General") {
        $('#histogramTitle').text(" ")
    } else {
        $('#histogramTitle').text("Histogram of " +SELECTED_DATATYPE.toLowerCase()+" over time")
    }

    var margin = { top: 30, right: 50, bottom: 30, left: 100 },
        width = 1000 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;

// The number of bins



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

     */

}