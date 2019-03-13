var i, node;
var groupSep =  10; // the distance between different nodes

// controls the node radius and the distance between links
// var noderadius = d3.scaleSqrt().range([2,4]); // set five levels for result node radius, range is the result value
var noderadius = 4;
var noderadius2 = 6;
var linkwidth = d3.scaleLinear().range([0.5, 10]);  // the thickest line should be no more than the smallest node diameter
var filterThreshold = 50;
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

//define tooltip section
var div2 = d3.select("body").append("div")
    .attr("class", "tooltip-2")
    .style("opacity", 0)
    .style("position", "absolute")
    .style("z-index","100");

// main visualization

data = d3.json('Data/data_co.json', function(error, graph){
    if (error) throw error;

    console.log("node",graph.nodes);
    console.log("link",graph.links);

    // console.log(graph);
    // var idToNode = {};
    // graph.nodes.forEach(function(d){
    //   idToNode[d.id] = d;
    // });
    // var filteredLinks = {};
    // graph.links.forEach(function(e){
    //   if (Object.keys(idToNode).includes(e.source)&&Object.keys(idToNode).includes(e.target)) {
    //     e.source = idToNode[e.source];
    //     e.target = idToNode[e.target];
    //   }
    // });
    // console.log(idToNode);
    // console.log("idToNode",graph.links);

    // process data
    var idToNode = {};
    graph.nodes.forEach(function(d,i){
      idToNode[d.id] = d;
    });

    var keys = Object.keys(idToNode)
    graph.links.forEach(function(e){
        e.source = idToNode[e.source];
        e.target = idToNode[e.target];
    });

    //console.log("idToNode",graph.links);

    graph.nodes.sort(function(a,b){return d3.descending(a.APPEARANCES, b.APPEARANCES);});

    // console.log(graph.nodes);

    // compute x, y coordinates for nodes
    for (i=0; i < graph.nodes.length; i++){
        node = graph.nodes[i];
        node.x = i*width/graph.nodes.length;  // slice width into n-1 parts, when i = 0, the first node is located on the origin
        node.y = height;
    }

    // set node radius and link width
    // noderadius.domain(d3.extent(graph.nodes, function(d){return d.APPEARANCES;}));
    linkwidth.domain(d3.extent(graph.links, function(d){return d.count;}));


    var filteredLength = 0;
    // compute node
    var node = svg.append('g')
        .attr('class', 'nodes')
        .selectAll('circle')
        .data(graph.nodes)
        .enter()
        .filter(function(d){
            if (d.APPEARANCES >= 50) {filteredLength = filteredLength + 1;}
            return d.APPEARANCES >= 50;
        })
        .append('circle')
        // .attr('cx', function(d){return d.x; })
        // .attr('cy', function(d){return height-noderadius.range()[0]; })
        .attr('fill', function(d){return parseHairColor(d.HAIR);})
        .attr('id',function(d){return d.id;})
        .attr('cx', function(d,i){return i*width/filteredLength;})
        .attr('cy', function(d,i){return height;})
        .attr('r', function(d){return noderadius; }) //change circle radius based on the magnitute of links
        .on('mouseover', function(d){
            var nodesToHighlight = graph.links.map(function(e){return e.source === d ?
                e.target : e.target === d ? e.source : 0})
                .filter(function(d){return d; }); // nodes linked to it
            //console.log("nodesToHighlight",nodesToHighlight);
            node.attr('opacity',0.2);
            node.filter(function(d){return nodesToHighlight.indexOf(d) >= 0; })
            // gives you the nodes which have new arrays mapped to it
            .attr('r',noderadius2)
            .attr('opacity',1);
            d3.select(this).attr('fill', parseHairColor(d.HAIR))
            .attr('r',noderadius2)
            .attr('opacity',1); // the node with your mouse on

            link.attr('stroke', function(link_d){
                return link_d.source === d | link_d.target === d ? parseHairColor(d.HAIR) : 'rgba(100,107,110,0.8)';
            })
            .attr('stroke-opacity', function(link_d){
                return link_d.source === d | link_d.target === d ? 1 : 0.2;
            })
            .attr('stroke-width', function(link_d){
                //console.log(linkwidth(link_d.count))
                return link_d.source === d | link_d.target === d ? linkwidth(link_d.count)*3 : linkwidth(link_d.count);
            });

            div2.transition()
                .duration(100)
                .style("opacity",1);
            div2.html(d.id + "<br/>" + d.SEX + "<br/>" + d.HAIR +  "<br/>" + d.EYE)
                .style("left", d3.event.pageX - 60 + "px")
                .style("top", d3.event.pageY + 10 + "px")
        })
        .on('mouseout', function(d){
            //d3.select(this).attr('fill', 'rgba(100,107,110,0.8)');
            console.log(link)
            link
              .attr('stroke-color', null)
              .attr('stroke-opacity',0.4);
            //console.log("node",node);
            node
              .attr('opacity',0.8)
              .attr('r',noderadius);
            div2.transition()
             .duration(100)
             .style("opacity", 0);
        });


    var link = svg.append('g')
        .attr('class', 'links')
        .selectAll('path')
        .data(graph.links)
        .enter()
        .append('path')
        .attr('stroke','rgba(100,107,110,0.8)')
        .attr('stroke-opacity', '0.4')
        .attr('fill',"transparent")
        .attr('z-index',-1)
        .attr('d', function(d) {
          return ['M', d.source.x, height, 'A', (d.source.x - d.target.x) / 2, ',',
              (d.source.x - d.target.x) / 2, 0, 0, ',',
              d.source.x < d.target.x ? 1 : 0, d.target.x, ',', height].join(' ');
        })
        .attr('stroke-width', function(d){return linkwidth(d.count); })
        .on('mouseover', function(d){
            // d3.select(this).attr('stroke', '#d69265')
            // .attr('stroke-width',function(d){return linkwidth(d.count)*3;})
            // .attr('stroke-opacity',1);
            // console.log("selected",d3.select('#'+d.source.id));
            // console.log("selected",d3.select('#'+d.target.id));
            // d3.select('#'+d.source.id).attr('fill','#d69265');
            // d3.select('#'+d.target.id).attr('fill','#d69265');
        })
        .on('mouseout', function(d){
          // d3.select(this).attr('stroke', 'rgba(100,107,110,0.8)')
          // .attr('stroke-width',function(d){return linkwidth(d.count);})
          // .attr('stroke-opacity',0.4);
          // node.attr('fill', 'rgba(100,107,110,0.8)');
        });

        });


    // // compute links
    // var link = svg.append('g')
    //     .attr('class', 'links')
    //     .selectAll('path')
    //     .data(graph)
    //     .enter().append('path')
    //     .attr()

// })
