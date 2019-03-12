var height = 1000
var width = 1200
var padding = {top:0,bottom:50,left:100,right:100}
var appearanceFilterThreshold = 20
var yDomain1 = [0,80]
var xDomain = [1939,2013]

var dotRadius = 5

function parseHairColor(hair) {
  if (hair != "") {
    result = hair.split(" ")[0].toLowerCase()
    if (result == "blond") {
      result = "gold"
    }
    if (result == "white") {
      result = "lightgrey"
    }
  }
  else {
    result = "grey"
  }
  // console.log(result)
  return result
}


// create svg for graph
var graphSvg = d3.select('#demographic-graph')
      .append('svg')
      .attr('height',height)
      .attr('width',width);

// print in console for debug
// console.log('test',graphSvg)

//define tooltip section
var div = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0)
    .style("position", "absolute")
    .style("z-index","100");

// load csv file
d3.csv("Data/0_marvel-wikia-data.csv",function(error,data){
  if (error) throw error;

  // calculate the y position of item based on counter
  var counter = {}
  var yPositionCounter = function(d,counter) {
    var year = d.Year
    if (Object.keys(counter).includes(year)) {
      counter[year] = counter[year] + 1;
    }
    else {
      counter[year] = 1;
    }
    return counter[year];
  }

  // console.log("dataset",data)
  var items = graphSvg.selectAll('g')
        .data(data)
        .enter()
        .filter(function(d){return d.APPEARANCES >= appearanceFilterThreshold})
        .append('g');
        //.attr("transform", "translate("+ padding.left + "," + (height-padding.bottom) + ")");

  // console.log("counter",counter);

  var timescaler = d3.scaleLinear().domain(xDomain).range([padding.left,width-padding.right]);
  var yScale1 = d3.scaleLinear().domain(yDomain1).range([height-padding.bottom,padding.top]);
  var dots = items.append('circle')
        .attr("cx",function(d){return timescaler(d.Year)})
        .attr("cy",function(d){
            //console.log('counter',counter)
            return yScale1(yPositionCounter(d,counter))
        })
        .attr("r",dotRadius)
        .attr("fill",function(d) {return parseHairColor(d.HAIR)})
        .on("mouseover", function(d) {
          console.log("mouseover",d3.select(this).attr("cx"))
          div.transition()
              .duration(100)
              .style("opacity",1);
          div.html(d.name + "<br/>" + d.EYE + "<br/>" + d.HAIR + d.Year)
              .style("left", d3.event.pageX + 10 + "px")
              .style("top", d3.event.pageY + 10 + "px")
              console.log()
        })
        .on("mouseout", function(d) {
          div.transition()
            .duration(100)
            .style("opacity", 0);
        });


  // Define the axes
  var xAxis = d3.axisBottom()
      .scale(timescaler)
      .ticks(xDomain[1]-xDomain[0]);
  graphSvg.append("g")
      .attr("class", "axis")
      .attr("transform", "translate(0," + (height-padding.bottom) + ")")
      .call(xAxis)
      .selectAll("text")
      .style("text-anchor", "end")
      .attr("dx", "-.8em")
      .attr("dy", "-0.6em")
      .attr("transform", "rotate(-90)");
});
