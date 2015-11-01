function group_bar(id,title){
    var width = 600,height = 400;
    var svg = draw_frame(id,width,height);
    var margin = {top: 50, right: 35, bottom: 60, left: 35};
    // rangeRoundBands() 和 rangeBands() 类似，但对range值和band宽度做了round()处理；
    var x0 = d3.scale.ordinal()
        .rangeRoundBands([0,width-margin.right-margin.left], .1);
    
    var x1 = d3.scale.ordinal();
    
    var y = d3.scale.linear()
        .range([height-margin.bottom-margin.top,0]);
    
    var color = d3.scale.ordinal()
        .range(["#98abc5", "#ff8c00"]);
    
    var xAxis = d3.svg.axis()
        .scale(x0)
        .orient("bottom");
    
    // todo d3.formate .2s
    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left")
        .tickFormat(d3.format("d"));
    
    d3.csv("/data/bar/group.csv", function(error, data) {
      if (error) throw error;
      var count_type = d3.keys(data[0]).filter(function(key) { return key !== "month"; });
    
      data.forEach(function(d) {
        d.count = count_type.map(function(name) { return {name: name, value: +d[name]}; });
      });
    
      x0.domain(data.map(function(d) { return d.month; }));
      x1.domain(count_type).rangeRoundBands([0, x0.rangeBand()]);
      var max = d3.max(data, function(d) { return d3.max(d.count, function(d) { return d.value; }); });
      y.domain([0, max]);
    
      svg.append("g")
          .attr("class", "x axis")
          .attr("transform", "translate("+margin.left+"," + (height - margin.bottom) + ")")
          .call(xAxis);
    
      svg.append("g")
          .attr("class", "y axis")
          .attr("transform", "translate("+margin.left+"," + (margin.top) + ")")
          .call(yAxis);
    
      var month = svg.selectAll(".month")
          .data(data)
        .enter().append("g")
          .attr("class", "g")
          .attr("transform", function(d) { return "translate(" + (x0(d.month) + margin.left) + "," + margin.top + ")"; });
    
      month.selectAll("rect")
          .data(function(d) { return d.count; })
        .enter().append("rect")
          .attr("width", x1.rangeBand())
          .attr("x", function(d) { return x1(d.name); })
          .attr("y", function(d) { return y(d.value); })
          .attr("height", function(d) { return height-y(d.value)-margin.top-margin.bottom; })
          .style("fill", function(d) { return color(d.name); });

      month.selectAll("count_text")
          .data(function(d){return d.count;})
          .enter()
          .append("text")
          .attr("width", x1.rangeBand())
          .attr("text-anchor","start")
          .attr("x", function(d) { return x1(d.name) + x1.rangeBand()/2; })
          .attr("y", function(d) { return y(d.value) - 4; })
          .text(function(d){ return d.value;});
    
      var legend = svg.selectAll(".legend")
          .data(count_type.slice().reverse())
        .enter().append("g")
          .attr("class", "legend")
          .attr("transform", function(d, i) { return "translate(" + (width-22) +"," + (4 + i * 20 )+ ")"; });
    
      legend.append("rect")
          .attr("x", 0)
          .attr("width", 18)
          .attr("height", 18)
          .style("fill", color);
    
      legend.append("text")
          .attr("x", -4)
          .attr("y", 9)
          .attr("dy", ".35em")
          .style("text-anchor", "end")
          .text(function(d) { return d; });

        svg.append("g")
            .attr("transform","translate(" + (width/2-80) + "," + (height-margin.bottom/5) + ")")
            .append("text")
            .text(title);
    });
}
