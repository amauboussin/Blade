

var container = d3.select('#vis');
var all_data;
var scatter_data;
var scatter_svg;

var x, y;

d3.json('data/all.json', function(error, data){
    all_data = data;
    scatter_data = all_data['hard'];
    scatter_svg = make_scatter(scatter_data);
    update_scatter(scatter_svg, scatter_data);
});


function make_scatter(data){

    var margin = {top: 20, right: 50, bottom: 30, left: 50},
        width = document.getElementById('vis').offsetWidth,
        height = width * .7,
        width = width - margin.left - margin.right,
        height = height - margin.top - margin.bottom;

    var line = d3.svg.line()
        .x(function(d) { return x(d.x); })
        .y(function(d) { return y(d.y); });

    var color = d3.scale.category10();

    x = d3.scale.linear()
    .range([0, width]);

    y = d3.scale.linear()
        .range([height, 0]);

    x.domain([0,100]).nice();
    y.domain([0,100]).nice();

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left");

    var svg = container.append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    //line of perfect calibration
    svg.append("path")
        .attr("class", "line")
        .style("stroke-dasharray", ("3, 3"))
        .attr("d", line([{'x' : 0, 'y' : 0}, {'x' : 100, 'y' : 100}]))
      
    console.log(width, height)
    svg.append("text")
      .attr("class", "axis-label")
      .attr("x", -width/2.5)
      .attr("y", height * 4/5 - 2)

      // .attr("transform", "rotate(45, 20, " + height-5 + ")")
      .attr("transform", "rotate(-36)")

      .style("text-anchor", "start")
      .text("Line of Perfect Calibration");


    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
      .append("text")
        .attr("class", "axis-label")
        .attr("x", width)
        .attr("y", -6)
        .style("text-anchor", "end")
        .text("Confidence");
    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
      .append("text")
        .attr("class", "axis-label")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Percent Correct");
    svg.selectAll(".dot")
        .data(data)
      .enter().append("circle")
        .attr("class", "dot")
        .attr("r", 3.5);

    return svg;

}

function update_scatter(scatter, data){
    var t = d3.transition()
      .duration(750);
    scatter.selectAll(".dot")
      .data(data)
      .transition(t)
      .attr("cx", function(d) { return x(d.confidence * 100); })
      .attr("cy", function(d) { return y(d.correct * 100); });
}

// var buttons = ["hard", "easy",  "all"];

// for (var i in buttons) {
//   var key = buttons[i];
//   d3.select("#"+key)
//     .on("click", function(){
//       var this_button = d3.select(this);
//       this_button.classed("active", !this_button.classed("active"));
//       update_scatter(scatter_svg, all_data[key]);
//     });
// }

d3.select("#"+'hard')
    .on("click", function(){
      var this_button = d3.select(this);
      this_button.classed("active", !this_button.classed("active"));
      update_scatter(scatter_svg, all_data['hard']);
    });

d3.select("#"+'easy')
    .on("click", function(){
      var this_button = d3.select(this);
      this_button.classed("active", !this_button.classed("active"));
      update_scatter(scatter_svg, all_data['easy']);
    });

d3.select("#"+'all')
    .on("click", function(){
      var this_button = d3.select(this);
      this_button.classed("active", !this_button.classed("active"));
      update_scatter(scatter_svg, all_data['all']);
    });




