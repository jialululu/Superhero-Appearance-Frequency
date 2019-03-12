var i, node;
var groupSep =  10; // the distance between different nodes

// controls the node radius and the distance between links
// var noderadius = d3.scaleSqrt().range([2,4]); // set five levels for result node radius, range is the result value
var noderadius = 2;
// var linkwidth = d3.scaleLinear().range([1.5, 2*noderadius.range()[0]]);  // the thickest line should be no more than the smallest node diameter

// the margin of the svg
// var margin = {
//     top:noderadius.range()[0] + 1,
//     right:noderadius.range()[0]+1,
//     bottom:noderadius.range()[0]+1,
//     left:noderadius.range()[0]+1
// };

var margin = {
    top: 3,
    bottom:3,
    left:3,
    right:3
};

var width = 1200 - margin.left - margin.right;
var height =  800 - margin.top - margin.bottom;

var x = d3.scaleLinear().range([0, width]);  // result x range

//create svg
var svg = d3.select('#network-graph')
    .append('svg')
    .attr('width', width + margin.left + margin.right )
    .attr('height', height + margin.top + margin.bottom)
    .append('g');

console.log(svg);

// main visualization

data = d3.json('Data/data_co.json', function(error, graph){
    if (error) throw error;

    // sort nodes by APPEARANCES
    // console.log(graph);
    graph.nodes.sort(function(a,b){return d3.descending(a.APPEARANCES, b.APPEARANCES);});

    // console.log(graph.nodes);

    //compute x, y coordinates for nodes
    // for (i=0; i < 155; i++){
    //     node = graph.nodes[i];
    //     node.x = i*width/155;  // slice width into n-1 parts, when i = 0, the first node is located on the origin
    //     node.y = height;
    // }


    // set node radius and link width
    // noderadius.domain(d3.extent(graph.nodes, function(d){return d.APPEARANCES;}));
    // linkwidth.domain(d3.extent(graph.links, function(d){return d.count;}));

    // compute node
    var node = svg.append('g')
        .attr('class', 'nodes')
        .selectAll('circle')
        .data(graph.nodes)
        .enter()
        .filter(function(d){return d.APPEARANCES >= 50})
        .append('circle')
        // .attr('cx', function(d){return d.x; })
        // .attr('cy', function(d){return height-noderadius.range()[0]; })
        .attr('cx', function(d,i){return i*width/155;})
        .attr('cy', function(d,i){return height;})
        .attr('r', function(d){return noderadius; }) //change circle radius based on the magnitute of links
    //     .on('mouseover', function(d){
    //         node.style('fill', null);
    //         d3.select(this).style('fill', 'orange');
    //         var nodesToHighlight = graph.map(function(e){return e.})
    //
    //     })
    // graph.sort(function(a,b){
    //     return a.APPEARANCES - b.APPEARANCES
    });


    // // compute links
    // var link = svg.append('g')
    //     .attr('class', 'links')
    //     .selectAll('path')
    //     .data(graph)
    //     .enter().append('path')
    //     .attr()

// })