function draw_frame(id,width,height){
    
    var svg = d3.select("#" + id)
        .append("svg")
        .attr("width",width + 2)
        .attr("height",height + 2);

    // add a frame
    svg.append("rect")
        .attr("x",1)
        .attr("y",1)
        .attr("width",width)
        .attr("height",height)
        .style("fill","none")
        .style("stroke","grey")
        .style("stroke-width",1);

    return svg;
}
function create_arc(inner,outer){
    var arc = d3.svg.arc()
        .outerRadius(outer)
        .innerRadius(inner);
    return arc;
}
function create_pie(){
    var pie = d3.layout.pie()
        .sort(null)
        .value(function(d){return d.count;});
    return pie;
}
