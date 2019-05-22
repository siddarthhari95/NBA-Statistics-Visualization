
function render_line(data, svg_id) {
    d3.select("#svg_"+svg_id).remove();
    // var tooltip = d3.select("body").append("div").attr("class", "tooltip");
    var tooltip = d3.select("body")
        .append("div")
        .style("opacity", 0)
        .attr("class", "tooltip")
        .style("color", "#000000")
        .style("padding", "1px");
    var margin = {top: 25, right: 25, bottom: 25, left: 45};
    var svgWidth = 350;
    var svgHeight = 300;
    var graphWidth = svgWidth - margin.left - margin.right;
    var graphHeight = svgHeight - margin.top - margin.bottom;
    var x = d3.scale.linear().range([0, graphWidth]);
    var y = d3.scale.linear().range([graphHeight, 0]);
    var xAxis = d3.svg.axis().scale(x)
                    .orient("bottom").ticks(5);
    var yAxis = d3.svg.axis().scale(y)
                    .orient("left").ticks(5);
    var closeLine = d3.svg.line()
    .x(function(d) { return x(d.Year); })
    .y(function(d) { return y(d.Attribute); });
    var title = "this chart";
    var div = "div1";
    if (svg_id == "linechart1") {
        title = "GAMES";
        div = "div1";
    } else if (svg_id == "linechart2") {
        title = "POINTS";
        div = "div1";
    } else if (svg_id == "linechart3") {
        title = "ASSISTS"; 
        div = "div1";
    } else if (svg_id == "linechart4") {
        title = "REBOUNDS";
        div = "div2";
    } else if (svg_id == "linechart5") {
        title = "BLOCKS";
        div = "div2";
    } else {
        title = "STEALS";
        div = "div2";
    }
    var svg = d3.select("#"+svg_id)
                    .append("svg")
                        .attr("width", svgWidth)
                        .attr("height", svgHeight)
                        .attr("id","svg_"+svg_id)
                        // .attr("style", "margin-right: 20px")
                    .append("g")
                        .attr("transform", 
                        "translate(" + margin.left + "," + margin.top + ")");
    data.forEach(function(d) {
        d.Year = +d.Year;
        d.Attribute = +d.Attribute;
        });
    x.domain(d3.extent(data, function(d) { return d.Year; }));
    y.domain([d3.min(data, function(d) { return Math.min(d.Attribute) }),
                d3.max(data, function(d) { return Math.max(d.Attribute) })]);
    svg.append("path")
        .attr("class", "path")
        .attr("d", closeLine(data));

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + graphHeight + ")")
            .call(xAxis);
    // Add the Y Axis
    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis);
    svg.append("text")
        .attr("x", (svgWidth / 2))
        .attr("y", 0 - (margin.top / 2))
        .attr("text-anchor", "middle")
        .style("font-size", "15px")
        .style("text-decoration", "underline")
        .text(title);
    svg.selectAll(".dot")
        .data(data)
        .enter().append("circle") // Uses the enter().append() method
        .attr("class", "dot") // Assign a class for styling
        .attr("cx", function(d, i) { if(d.Attribute > 0) return x(d.Year); })
        .attr("cy", function(d) { if(d.Attribute > 0) return  y(d.Attribute);})
        .attr("r", function(d) { if(d.Attribute > 0) return  4; })
        .on("mouseover", function(d,i){
            // tooltip
            //     .style("left", x(d.Year) + 150 + "px")
            //     .style("top", y(d.Attribute) + 130 + "px")
            //     .style("display", "inline-block")
            //     .html(d.Attribute);
            tooltip
                .style("left", d3.event.pageX - 50 + "px")
                .style("top", d3.event.pageY + 10 + "px")
                .style("opacity", 1)
                // .style("display", "inline")
                .html(d.Year+"<br/>"+d.Attribute);
        })
        .on("mouseout", function(d){
            tooltip.style("opacity", 0);
            // tooltip.style("display", "none");
        })

};
var data = "";
function special_stats(result, player_name) {
    data = JSON.parse(result)
    // console.log(Object.keys(data));
    // console.log(data["points"]["Kareem Abdul-Jabbar*"]);
    console.log(data['players']);
    render_line(data["games"]["Kareem Abdul-Jabbar"], "linechart1");
    render_line(data["points"]['Kareem Abdul-Jabbar'], "linechart2");
    render_line(data["assists"]["Kareem Abdul-Jabbar"], "linechart3");
    render_line(data["rebounds"]['Kareem Abdul-Jabbar'], "linechart4");
    render_line(data["blocks"]['Kareem Abdul-Jabbar'], "linechart5");
    render_line(data["steals"]['Kareem Abdul-Jabbar'], "linechart6");
    populate_star_players();
}
get_specials('/specials');
function get_specials(url) {
    $.ajax({
        type: 'GET', url: url,
        contentType: 'application/json; charset=utf-8',
        xhrFields: {
            withCredentials: false
          },
          headers: {}, success: function(result) {
            console.log("iam here!");
            special_stats(result);
          }
    });
}

function populate_star_players() {
    console.log(data);
    $('#dropd1').html('');
    data['players'].forEach(function(t, i) {
        console.log(t);
        $('#dropd1').append("<option value="+t+">"+t+"</option>");
    });
}

function get_star_players() {
    var dropdown = document.getElementById("dropd1");
    var value = dropdown.options[dropdown.selectedIndex].text;
    console.log(data);
    console.log(value);
    render_line(data["games"][value], "linechart1");
    render_line(data["points"][value], "linechart2");
    render_line(data["assists"][value], "linechart3");
    render_line(data["rebounds"][value], "linechart4");
    render_line(data["blocks"][value], "linechart5");
    render_line(data["steals"][value], "linechart6");
}