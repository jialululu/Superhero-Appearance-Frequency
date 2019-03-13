var i, node;
var groupSep =  10; // the distance between different nodes

// controls the node radius and the distance between links
// var noderadius = d3.scaleSqrt().range([2,4]); // set five levels for result node radius, range is the result value
var noderadius = 2;
var linkwidth = d3.scaleLinear().range([1.5, 4]);  // the thickest line should be no more than the smallest node diameter

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
    left:5,
    right:5
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

var path =

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
    linkwidth.domain(d3.extent(graph.links, function(d){return d.count;}));

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
        .attr('fill', 'rgba(100,107,110,0.8)')
        .attr('stroke', '#191c33')
        .attr('stroke-width', '1px')
        .attr('cx', function(d,i){return i*width/(this.length);})
        .attr('cy', function(d,i){return height;})
        .attr('r', function(d){return noderadius; }) //change circle radius based on the magnitute of links
        .on('mouseover', function(d){
            node.style('fill', null);

            d3.select(this).style('fill', '#d66742'); // the node with your mouse on

            var nodesToHighlight = graph.links.map(function(e){return e.source === d ?
                e.target : e.target === d ? e.source : 0})
                .filter(function(d){return d; }); // nodes linked to it

            node.filter(function(d){return nodesToHighlight.indexOf(d) >= 0; })
            // gives you the nodes which have new arrays mapped to it
                .style('fill', '#d66742');
            link.style('stroke', function(link_d){
                return link_d.source === d | link_d.target === d ? '#d69265' : null;
            });
        })
        .on('mouseout', function(d){
            node.style('fill', null);
            link.style('stroke', null);
        });

    var link = svg.append('g')
        .attr('class', 'links')
        .selectAll('path')
        .data(graph.links)
        .enter()
        .attr('fill', null)
        .attr('stroke','rgba(100,107,110,0.8)')
        .attr('stroke-opacity', '0.4')
        .attr('d', function(d) {
            return ['M', d.source.x, height, 'A', (d.source.x - d.target.x) / 2, ',',
                (d.source.x - d.target.x) / 2, 0, 0, ',',
                d.source.x < d.target.x ? 1 : 0, d.target.x, ',', height].join(' ');
        });
        .attr('stroke-width', function(d){ return linkwidth(d.count); })
        .on('mouseover', function(d){
            link.style('stroke', null);
            d3.select(this).style('stroke', '#d69265');
            node.style('fill', function(node_d){
                return node_d === d.source || node_d === d.target ? '#d66742' : null;
            });
        })
        .on('mouseout', function(d){
            link.style('stroke', null);
            node.style('fill', null);
        });

        });
    // graph.sort(function(a,b){
    //     return a.APPEARANCES - b.APPEARANCES
    // });


    // // compute links
    // var link = svg.append('g')
    //     .attr('class', 'links')
    //     .selectAll('path')
    //     .data(graph)
    //     .enter().append('path')
    //     .attr()

// })