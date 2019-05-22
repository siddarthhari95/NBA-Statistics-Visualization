var start_year = 2010
var end_year = 2011
function render_fdl(nodes, links, stats) {
    // console.log(nodes);
    // console.log(links);
    d3.select("#svg_fdl1").remove();
    d3.select("#svg_text").remove();
    var width = 1160,
    height = 800;
    var tooltip = d3.select("body")
        .append("div")
        .style("opacity", 0)
        .attr("class", "toolTip")
        .style("color", "#000000")
        .style("padding", "1px");
    
    var mousemove = function (d) {
        // console.log(stats[d.name]);
        if (Object.keys(team_selection).includes(d.name)) {
            tooltip.style("opacity", 0);
            return;
        }
        crtable(d.name,stats[d.name], ['Team', 'G', 'PT', 'AST', 'RB', 'BL', 'ST']);
        tooltip
            .style("left",d3.event.pageX - 50 + "px")
            .style("top", d3.event.pageY + 10 + "px")
            .style("opacity", 1);
        
    }
    
    var crtable = function (name, data, columns) {
        tooltip.select("table").remove();
        var table = tooltip.append("table"),
            thead2 = table.append('thead'),
            thead = table.append('thead'),
            tbody = table.append('tbody');
        // table.append('caption').text(name);
        // append the header row
        thead2.append('tr')
            .selectAll('th')
            .data([name]).enter()
            .append('th')
            .attr("colspan",7)
            .text(function (column) { return column; });
        thead.append('tr')
            .selectAll('th')
            .data(columns).enter()
            .append('th')
            .text(function (column) { return column; });
        // create a row for each object in the data
        var rows = tbody.selectAll('tr')
            .data(data)
            .enter()
            .append('tr');

        // create a cell in each row for each column
        var cells = rows.selectAll('td')
            .data(function (row) {
                return columns.map(function (column) {
                    return { column: column, value: row[column] };
                });
            })
            .enter()
            .append('td')
            .text(function (d) { return d.value; });

        return table;
    }
    // A function that change this tooltip when the leaves a point: just need to set opacity to 0 again
    var mouseleave = function (d) {
        tooltip
            .transition()
            .duration(200)
            .style("opacity", 0)
    }

    var svg = d3.select("#fdl1").append("svg")
        .attr("width", width)
        .attr("height", height)
        // .attr("fill", "cyan")
        .attr("id","svg_fdl1");

    var force = d3.layout.force()
        .gravity(0.05)
        .alpha(-100)
        .distance(140)
        .charge(-100)
        .size([width, height]);
    force
        .nodes(d3.values(nodes))
        .links(links)
        .start();
    // console.log("2:" + width);
    var link = svg.selectAll(".link")
        .data(links)
      .enter().append("line")
        .attr("class", "link");
    // console.log(width);
    var node = svg.selectAll(".node")
        .data(nodes)
        .enter().append("g")
        .attr("class", "node")
        .call(force.drag);
    node.append("image")
        .attr("xlink:href", function(d) {
            if (d.name == 'ATL')
                return "http://content.sportslogos.net/logos/6/220/full/9168_atlanta_hawks-primary-2016.png";
            if (d.name == "BOS")
                return "http://content.sportslogos.net/logos/6/213/full/slhg02hbef3j1ov4lsnwyol5o.png"
            if (d.name == "NJN")
                return "http://content.sportslogos.net/logos/6/3786/full/137_brooklyn-nets-primary-2013.png"
            if (d.name == "CHH")
                return "http://content.sportslogos.net/logos/6/5120/full/1926_charlotte__hornets_-primary-2015.png"
            if (d.name == "CHI")
                return "http://content.sportslogos.net/logos/6/221/full/hj3gmh82w9hffmeh3fjm5h874.png"
            if (d.name == "CLE")
                return "http://content.sportslogos.net/logos/6/222/full/6921_cleveland_cavaliers-primary-2018.png"
            if (d.name == "DAL")
                return "http://content.sportslogos.net/logos/6/228/full/3463_dallas_mavericks-primary-2018.png"
            if (d.name == "DEN")
                return "http://content.sportslogos.net/logos/6/229/full/xeti0fjbyzmcffue57vz5o1gl.gif"
            if (d.name == "DET")
                return "http://content.sportslogos.net/logos/6/223/full/2164_detroit_pistons-primary-2018.png"
            if (d.name == "GSW")
                return "http://content.sportslogos.net/logos/6/235/full/qhhir6fj8zp30f33s7sfb4yw0.png"
            if (d.name == "HOU")
                return "http://content.sportslogos.net/logos/6/230/full/8xe4813lzybfhfl14axgzzqeq.gif"
            if (d.name == "IND")
                return "http://content.sportslogos.net/logos/6/224/full/3083.gif"
            if (d.name == "LAC")
                return "http://content.sportslogos.net/logos/6/236/full/5462_los_angeles_clippers-primary-2016.png"
            if (d.name == "SDC")
                return "http://content.sportslogos.net/logos/6/236/full/5462_los_angeles_clippers-primary-2016.png"
            if (d.name == "LAL")
                return "http://content.sportslogos.net/logos/6/237/full/uig7aiht8jnpl1szbi57zzlsh.png"
            if (d.name == "MEM")
                return "http://content.sportslogos.net/logos/6/231/full/4373_memphis_grizzlies-primary-2019.png"
            if (d.name == "MIA")
                return "http://content.sportslogos.net/logos/6/214/full/burm5gh2wvjti3xhei5h16k8e.gif"
            if (d.name == "MIL")
                return "http://content.sportslogos.net/logos/6/225/full/8275_milwaukee_bucks-primary-2016.png"
            if (d.name == "MIN")
                return "http://content.sportslogos.net/logos/6/232/full/9669_minnesota_timberwolves-primary-2018.png"
            if (d.name == "NYK")
                return "http://content.sportslogos.net/logos/6/216/thumbs/2nn48xofg0hms8k326cqdmuis.gif";
            if (d.name == "OKC")
                return "http://content.sportslogos.net/logos/6/2687/thumbs/khmovcnezy06c3nm05ccn0oj2.gif";
            if (d.name == "NOP")
                return "http://content.sportslogos.net/logos/6/4962/thumbs/496226812014.gif";
            if (d.name == "ORL")
                return "http://content.sportslogos.net/logos/6/217/thumbs/wd9ic7qafgfb0yxs7tem7n5g4.gif";
            if (d.name == "PHI")
                return "http://content.sportslogos.net/logos/6/218/thumbs/21870342016.gif";
            if (d.name == "PHO")
                return "http://content.sportslogos.net/logos/6/238/thumbs/23843702014.gif";
            if (d.name == "POR")
                return "http://content.sportslogos.net/logos/6/239/thumbs/23997252018.gif";
            if (d.name == "SAC")
                return "http://content.sportslogos.net/logos/6/240/thumbs/24040432017.gif";
            if (d.name == "SAS")
                return "http://content.sportslogos.net/logos/6/233/thumbs/23325472018.gif";
            if (d.name == "TOR")
                return "http://content.sportslogos.net/logos/6/227/thumbs/22745782016.gif";
            if (d.name == "TOT")
                return "http://content.sportslogos.net/logos/6/227/thumbs/22745782016.gif";
            if (d.name == "UTA")
                return "http://content.sportslogos.net/logos/6/234/thumbs/23467492017.gif";
            if (d.name == "WAS")
                return "http://content.sportslogos.net/logos/6/219/thumbs/21956712016.gif";
            if (d.name == "SEA")
                return "http://content.sportslogos.net/logos/6/2687/thumbs/khmovcnezy06c3nm05ccn0oj2.gif";
            
            return "https://upload.wikimedia.org/wikipedia/commons/7/7a/Basketball.png";
        }) 
        .attr("x", -8)
        .attr("y", -8)
        .attr("width", function(d){ 
            // return 36;
            if (Object.keys(team_selection).includes(d.name)){
                return 80;
            } else {
                var avgG = 0;
                stats[d.name].forEach(function(x){avgG += x['G']+x['PT']+x['BL'] })
                avgG /= stats[d.name].length;
                // console.log("compare here: ",avgG, stats[d.name][0]['G']);
                return 6 * Math.log(5 + avgG);
            }
        })
        .attr("height", function (d) {
            // return 36;
            if (Object.keys(team_selection).includes(d.name)) {
                return 80;
            } else {
                var avgG = 0;
                stats[d.name].forEach(function (x) { avgG += x['G'] + x['PT'] + x['BL'] })
                avgG /= stats[d.name].length;
                // console.log("compare here: ", avgG, stats[d.name][0]['G']);
                return 6 * Math.log(5 + avgG);
            }
        });
    node.transition()
        .duration(50)
        .delay(function (d, i) { return i * 50; })
        .attrTween("r", function (d) {
            var i = d3.interpolate(0, d.radius);
            return function (t) { return d.radius = i(t); };
        });
    node.append("text")
        .attr("dx", 10)
        .attr("dy", ".15em")
        .text(function(d) { return d.name });
    node.on("mouseover", function(d){
        link.style('stroke-width', function(l) {
                if (d === l.source || d === l.target)
                return 3;
                else
                return 1;
            });
        link.style('stroke', function(l){
            if (d === l.source || d == l.target)
                return "c37044";
        });
        if (Object.keys(team_selection).includes(d.name)) {
            tooltip.style("opacity", 0);
        } else{
            tooltip.style("opacity", 1);
        }
    });
    node.on('mouseout', function() {
        link.style('stroke-width', 0);
      });
    node.on("mouseleave", mouseleave);
    node.on("mousemove", mousemove);
    force.on("tick", function() {
        link.attr("x1", function(d) { return d.source.x; })
          .attr("y1", function(d) { return d.source.y; })
          .attr("x2", function(d) { return d.target.x; })
          .attr("y2", function(d) { return d.target.y; });
  
        node.attr("transform", function(d) { 
          // console.log(d.x);
          return "translate(" + d.x + "," + d.y + ")"; 
        });
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
            if (start_year != end_year) {
                var t = start_year+'-'+end_year;
            }
            else {
                var t = start_year;
            }
            console.log("here" + t);
            return t;
        })
        .attr("transform", "translate(650, 25)")
        .attr("style", "font-size: 20px;");
};
var data = "";
var team_selection = {
    "LAL": 0,
    "BOS": 0,
    "HOU": 0,
    "UTA": 0,
    "TOT": 0,
    "IND": 0,
    "DEN": 0,
    "PHI": 0,
    "CLE": 0,
    "SAS": 0,
    "CHI": 0,
    "WAS": 0,
    "NJN": 0,
    "SEA": 0,
    "DET": 0,
    "MIL": 0,
    "NYK": 0,
    "GSW": 0,
    "SDC": 0,
    "PHO": 0,
    "ATL": 0,
    "POR": 0,
    "LAC": 0,
    "DAL": 0,
    "SAC": 0,
    "CHH": 0,
    "ORL": 0,
    "MIA": 0,
    "TOR": 0,
    "MEM": 0,
    "OKC": 0,
    "NOP": 0 };

function updateTeam(element) {
    // console.log(element.value);
    team_selection[element.value] = team_selection[element.value] == 0? 1:0;
    // console.log(team_selection);
}

function reload_fdl() {
    var modal = document.getElementById("myModal");
    modal.style.display = "none";
    var dropdown1 = document.getElementById("dropd2");
    var start = dropdown1.options[dropdown1.selectedIndex].text;
    var dropdown2 = document.getElementById("dropd3");
    var end = dropdown2.options[dropdown2.selectedIndex].text;
    start_year = start;
    end_year = end;
    //check if values correct otw popup/alert error
    var selected_teams = [];
    Object.keys(team_selection).forEach(function (t) {
        if (team_selection[t] == 1) {
            selected_teams.push(t);
        }
    });
    // console.log(selected_teams);
    get_team_players('/teaminfo', start, end, selected_teams);
}

function team_info(result, player_name) {
    data = JSON.parse(result)
    render_fdl(data['nodes'], data['links'], data['player_stats']);
}

get_team_players('/teaminfo', 2010, 2011, ['GSW', 'LAL']);

function get_team_players(url, year1, year2, teams) {
    $.ajax({
        type: 'POST', url: url,
        contentType: 'application/json; charset=utf-8',
        data: '{"year1": '+year1+',"year2": '+ year2 + ',"teams": '+JSON.stringify(teams) +'}',
        xhrFields: {
            withCredentials: false
          },
          headers: {}, success: function(result) {
            team_info(result);
          }
    });
}

var modal = document.getElementById("myModal");

var btn = document.getElementById("myBtn");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

populate_years_here();
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

// populate_years();

function populate_years_here() {
    $('#dropd2').html('');
    $('#dropd3').html('');
    for (var t=1980;t <=2017; t++){
        $('#dropd2').append("<option value=" + t + ">" + t + "</option>");
        $('#dropd3').append("<option value=" + t + ">" + t + "</option>");
    }
}