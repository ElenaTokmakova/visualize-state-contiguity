    //https://github.com/d3/d3-force
    //https://github.com/d3/d3-force/releases/tag/v1.0.0
    //http://d3indepth.com/force-layout/
    //https://bl.ocks.org/mbostock/4062045
    //https://bl.ocks.org/syntagmatic/6f30a2d719871d041c6eace2193b9f33
    //https://roshansanthosh.wordpress.com/2016/09/25/forces-in-d3-js-v4/
    //https://bl.ocks.org/mbostock/f584aa36df54c451c94a9d0798caed35
    //https://bl.ocks.org/HarryStevens/f636199a46fc4b210fbca3b1dc4ef372
    //https://bl.ocks.org/shimizu/e6209de87cdddde38dadbb746feaf3a3    
    //https://bl.ocks.org/mbostock/0adcc447925ffae87975a3a81628a196
    //https://gist.github.com/fancellu/2c782394602a93921faff74e594d1bb1

    var url = "https://raw.githubusercontent.com/DealPete/forceDirected/master/countries.json";

    d3.json(url, function(error, json) {
      if (error) throw error;

    var dataset = json;
    var nodes = dataset.nodes;
    var links = dataset.links; 
    
    const padding = 100;  

    var chart = d3.select(".chart");     

    let width = parseInt(chart.style("width"));
    let height = parseInt(chart.style("height"));            

    var svg = chart.append("svg")
                   .attr("width", width)
                   .attr("height", height);
                     

    var tooltip = d3.select(".chart").append("p")
                    .attr("class", "tooltip")
                    .style("opacity", 0);    

    //force functions:
    //forceCenter (for setting the center of gravity of the system)
    //forceManyBody (for making elements attract or repel one another)
    //forceCollide (for preventing elements overlapping)
    //forceX and forceY (for attracting elements to a given point)
    //forceLink (for creating a fixed distance between connected elements)  

    var simulation = d3.forceSimulation(nodes)
      .force("link", d3.forceLink(links).distance(50))
      //makes the elements attracte or repel each other 
      // strength of the attraction or repulsion can be set using .strength() 
      //a positive value will cause elements to attract one another 
      //a negative value causes elements to repel each other
      //the default value is -30
      .force("charge", d3.forceManyBody().strength(-50))
      //attracts the elements towards a centre point
      //without it elements might disappear off the page
      .force("center", d3.forceCenter((width)/2, (height)/2))
      .force("xAxis",d3.forceX().strength(0.04).x((width)/2))
      .force("yAxis",d3.forceY().strength(0.1).y((height)/2));

    var link = svg.append("g")
      .attr("class", "links")
      .selectAll("line")
      .data(links)
      .enter()
      .append("line");

    var node = d3.select(".flags")
      .style("position", "absolute")            
      .selectAll(".node")
      .data(nodes)
      .enter()
      .append('img')
      .style("position", "absolute")
      .attr('class', d => 'flag flag-' + d.code)      
      .call(d3.drag()
          .on("start", dragstarted)
          .on("drag", dragged)
          .on("end", dragended))

    //ON HOVER FUNCTIONS

      .on("mouseover", function(d){           
         let country = d.country;        
         tooltip.transition()
          .duration(200)
          .style("opacity", 0.9);
         tooltip.html("<span class='country'>" + country + "</span>")
          .style("left", (d3.event.pageX + 5) + "px")
          .style("top", (d3.event.pageY)+ "px");
      })

      .on("mouseout", function(d){         
         tooltip.transition()
          .duration(500)
          .style("opacity", 0);
      });

    //https://bl.ocks.org/mbostock/4062045

    simulation
      .nodes(nodes)
      .on("tick", ticked);

    simulation.force("link")
      .links(links);  

    function ticked() {
      link
          .attr("x1", (d) => d.source.x )
          .attr("y1", (d) => d.source.y )
          .attr("x2", (d) => d.target.x )
          .attr("y2", (d) => d.target.y );

      node          
          .style('left', d => (d.x - 8) + "px")
          .style('top', d => (d.y - 5) + "px");
      }
  
    function dragstarted(d) {
      if (!d3.event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(d) {
      d.fx = d3.event.x;
      d.fy = d3.event.y;
    }

    function dragended(d) {
      if (!d3.event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }  
    
}); //end d3.json()
 