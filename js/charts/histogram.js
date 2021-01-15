
function updateHistogram(dataInput) {

    if (SELECTED_DATATYPE == "General"){
        var data = d3.nest()
            .key(function(v){
                var datatmp = new Date(v.time) //v to jest to data input, time to data, datatmp to Data
                datatmp.setHours(0)
                datatmp.setMinutes(0)
                datatmp.setSeconds(0)
                datatmp.setMilliseconds(0)
                return datatmp.getFullYear() + '-' + ('0' + (datatmp.getMonth()+1)).slice(-2) + '-' + ('0' + (datatmp.getDate()+1)).slice(-2)
            })
        data = data.rollup(v => v.length)
        data = data.entries(dataInput)

        //var dataFormat = "%Y-%m-%dT";

        dataX=[]
        for (const [key, value] of Object.entries(data)) {
            dataX.push(value.value)
        }
        label = "Number of days"

    }else{
        var dataX = dataInput.map(v => v[SELECTED_DATATYPE]);
        dataX.sort(function(a, b){return b-a});
        label = 'Number of videos'

    }

    ////////

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
                if (SELECTED_DATATYPE == "Like to dislike ratio") {
                    labels.unshift(bucketborder + "<");
                } else {
                    labels.unshift(Math.round(bucketborder) + "<");
                }
            }
            bucketsize = 0;
            if (SELECTED_DATATYPE === "Likes per thousand views" || SELECTED_DATATYPE === "Dislikes per thousand views" || SELECTED_DATATYPE === "Comments per thousand views") {
                bucketborder = Math.round(bucketborder / 2);
            } else if (SELECTED_DATATYPE === "Like to dislike ratio") {
                bucketborder = bucketborder / 2;
                //    bucketborder = bucketborder - step;
            } else if(SELECTED_DATATYPE == "General"){
                //bucketborder = Math.round(bucketborder - step);
                bucketborder = Math.round(bucketborder / 2);

            }else {
                bucketborder = Math.round(bucketborder / 5);
            }
            //i = i - 1;
        }
    }
    //console.log(SELECTED_DATATYPE.toLowerCase());
    //console.log(min, max);
    //console.log(step)
    //console.log("BUCKET");
    //console.log(buckets);
    //console.log("LABELS");
    //console.log(labels);

//end of data processing
//graph generating


    if(SELECTED_DATATYPE == "General") {
        $('#histogramTitle').text("Histogram of number of watched videos")
    } else {
        $('#histogramTitle').text("Histogram of number of" + SELECTED_DATATYPE.toLowerCase()+" over time")
    }

    Chart.defaults.global.datasets.bar.categoryPercentage = 1;
    const ctx = document.getElementById('histogram');

    const histogram = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: label,
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

}