var selected_positions = ['PG', 'SG'];
var start_year = 2010
var end_year = 2017
var attri = '3 Pointers'
var display_option = "Top10";
var nba_pos = {
    "PG": "Point Guards",
    "SG": "Shooting Guards",
    "PF": "Power Forwards",
    "SF": "Small Forwards",
    "C": "Center"
};

function render_bar(data) {
    var pos_colors = ["PG","SG","PF","SF","C"];
    var colorScale = d3.scale.category10();
    colorScale.domain(data.map(function (d){return d.pos; }));

    d3.select("#svg_bar").remove();
    d3.select("#leg").remove();
    d3.select("#svg_text").remove();
    //sort bars based on value
    data = data.sort(function (a, b) {
    return d3.ascending(a.value, b.value);
    })

    //set up svg using margin conventions - we'll need plenty of room on the left for labels
    var margin = {
    top: 15,
    right: 25,
    bottom: 15,
    left: 60
    };
    
    var trans_w = 100 + margin.left
    var width = 790,
    height = 500;

    var svg = d3.select("#graphic").append("svg")
    .attr("width", width + margin.left + margin.right + 100)
    .attr("height", height + margin.top + margin.bottom + 100)
    .attr("id", "svg_bar")
    .attr("style", "margin-left: 50px")
    .attr("fill", "cyan")
    .append("g")
    .attr("transform", "translate(" + 150 + "," + margin.top + ")")
    .attr("width", width + margin.left + margin.right + 100)
    .attr("height", height + margin.top + margin.bottom + 270);

    var x = d3.scale.linear()
        .range([0, width])
        .domain([0, d3.max(data, function (d) {
            return d.value;
    })]);

    var y = d3.scale.ordinal()
        .rangeRoundBands([height, 0], .1)
        .domain(data.map(function (d) {
            return d.name;
    }));
    //make y axis to show bar names
    var yAxis = d3.svg.axis()
                .scale(y)
                //no tick marks
                .tickSize(0)
                .orient("left");

    var gy = svg.append("g")
    .attr("class", "y axis")
    .call(yAxis)

    var bars = svg.append("g").selectAll(".bar")
    .data(data)
    .enter()
    .append("g")
    //append rects
    bars.append("rect")
    .attr("class", "bar")
    .attr("y", function (d) {
        return y(d.name);
    })
    .attr("height", y.rangeBand())
    .attr("x", 0)
    .attr("width", function (d) {
        return x(d.value);
    })
    .attr("fill", function (d){
        return colorScale(d.pos); 
    });
    var svgl = d3.select(".legend")
                    .append("svg")
                    .attr("width", 100)
                    .attr("height", 125)
                    .attr("id", "leg");

    var colorLegend = d3.legend.color()
        .labelFormat(d3.format(".0f"))
        .scale(colorScale)
        .shapePadding(5)
        .shapeWidth(25)
        .shapeHeight(15)
        .labelOffset(12);

    svgl
        .attr("transform", "translate(1102, 20)")
        .call(colorLegend);
    //add a value label to the right of each bar
    bars.append("text")
    .attr("class", "label")
    //y position of the label is halfway down the bar
    .attr("y", function (d) {
        return y(d.name) + y.rangeBand() / 2 + 4;
    })
    //x position is 3 pixels to the right of the bar
    .attr("x", function (d) {
        return x(d.value)-30;
    })
    .text(function (d) {
        return d.value;
    });
    var svgt = d3.select(".TextDisplay")
                    .append("svg")
                    .attr("width", 1500)
                    .attr("height", 30)
                    .attr("id", "svg_text")
                    // .attr("transform", "translate(400, 0)");
    svgt
        // .append("g")
        .append("text")
        // .append("text")
        .attr("class", "label")
        .text(function(){
            var p = "";
            for (i = 0; i < selected_positions.length; i++) { 
                p = p + nba_pos[selected_positions[i]]
                if (i != selected_positions.length - 1)
                    p = p + ", ";
            }
            if (start_year != end_year) {
                var t = start_year+'-'+end_year+': Statistics of '+ attri +' by '+p + '(' + display_option+')'
            }
            else {
                var t = start_year+': Statistics of '+ attri +' by '+p + '('+ display_option+')';
            }
            console.log("here" + t);
            return t;
        })
        .attr("transform", "translate(100, 20)")
        .attr("style", "font-size: 20px;");
    
}

var modal = document.getElementById("myModal1");

var btn = document.getElementById("myBtn1");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];
populate_years();
// When the user clicks the button, open the modal 
btn.onclick = function () {
    modal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
span.onclick = function () {
    modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

var position_selection = {
    "PG": 0,
    "SG": 0,
    "PF": 0,
    "SF": 0,
    "C": 0,
    "G": 0
};

var display = {
    "Top10": 0,
    "Top25": 0,
    "Top50": 0
};

function updatePosition(element) {
    position_selection[element.value] = position_selection[element.value] == 0? 1:0;
}

function updateDisplay(element) {
    Object.keys(display).forEach(function (t) {
        if (t == element.value) {
            display[t] = 1;
        } else {
            display[t] = 0;
        }
    });
    // console.log(display);
}

function reload_bar() {
    selected_positions = [];
    var dropdown1 = document.getElementById("dropde2");
    var start = dropdown1.options[dropdown1.selectedIndex].text;
    var dropdown2 = document.getElementById("dropde3");
    var end = dropdown2.options[dropdown2.selectedIndex].text;
    var dropdown3 = document.getElementById("dropd4");
    var attribute = dropdown3.options[dropdown3.selectedIndex].text;
    attri = attribute;
    start_year = start;
    end_year = end;
    console.log("attr"+attribute);
    //check if values correct otw popup/alert error
    Object.keys(position_selection).forEach(function (t) {
        if (position_selection[t] == 1) {
            selected_positions.push(t);
        }
    });
    // console.log(selected_positions);
    // var display_option = "Top10";
    Object.keys(display).forEach(function (t) {
        if (display[t] == 1) {
            display_option = t;
        }
    });
    // console.log(selected_teams);
    get_players_detail('/interstats', start, end, attribute, selected_positions, display_option);
    var modal = document.getElementById("myModal1");
    modal.style.display = "none";
}

function populate_years() {
    console.log("saaal");
    $('#dropde2').html('');
    $('#dropde3').html('');
    for (var t=1980;t <=2017; t++){
        $('#dropde2').append("<option value=" + t + ">" + t + "</option>");
        $('#dropde3').append("<option value=" + t + ">" + t + "</option>");
    }
}
function players_detail(result) {
    data = JSON.parse(result)
    render_bar(data);
}

get_players_detail('/interstats', 2010, 2017, '3 Pointers', ['PG', 'SG'], "Top10");
function get_players_detail(url, year1, year2, attribute, positions, display_option) {
    $.ajax({
        type: 'POST', url: url,
        contentType: 'application/json; charset=utf-8',
        data: '{"year1": '+year1+',"year2": '+ year2 + ',"attribute": "'+attribute +'","positions": '+JSON.stringify(positions)+',"display": "'+display_option+'"}',
        xhrFields: {
            withCredentials: false
          },
          headers: {}, success: function(result) {
              players_detail(result);
          }
    });
}