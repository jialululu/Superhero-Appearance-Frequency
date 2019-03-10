var height = 700
var width = 1000


var graphSvg = d3.select('#demographic-graph')
      .append('svg')
      .attr('height',height)
      .attr('width',width);

console.log('test',graphSvg)

d3.csv("Data/0_marvel-wikia-data.csv")
