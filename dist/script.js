var height = 360,
width = 800,
hMargin = 100,
wMargin = 100;

var tooltip = d3.select("body").append("div").
attr("class", "tooltip").
attr("id", "tooltip").
style("opacity", 0);

const svgGraph = d3.select("body").append("div").
style("height", height + hMargin * 2 + "px").
attr("class", "frame").
style("width", width + wMargin * 2 + "px").
style("background-color", "beige").
style("margin", "40px auto");

svgGraph.append("div").
attr("class", "inner").
style("text-align", "center").
style("margin", 0).
style("height", hMargin + "px").
style("background-color", "white").
append("div").
attr("id", "title").
style("height", "50%").
append("text").
text("Monthly Global Land-Surface Temperature").
attr("id", "title").
style("font-size", "30px").
style("color", "#000");

svgGraph.select(".inner").
append("div").
style("height", "50%").
append("text").
text("1753 - 2015: base temperature 8.66℃").
attr("id", "description").
style("font-size", "20px").
style("color", "#000");

var svg = svgGraph.append("svg").
style("width", width + wMargin * 2 + "px").
style("height", height + hMargin + "px").
append("text").
text("Months").
attr("transform", "translate(" + 35 + "," + height / 1.5 + ")rotate(-90)");

d3.json('https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/global-temperature.json', function (error, data) {
  if (error) throw error;
  var dataset = [];
  var numMonths = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  var months = ["", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December", ""];
  var maxYear = 2000;
  var minYear = 2000;
  data.monthlyVariance.forEach(function (obj) {
    if (maxYear < obj.year) {maxYear = obj.year;}
    if (minYear > obj.year) {minYear = obj.year;}
    dataset.push([obj.year, months[obj.month], obj.variance]);
  });
  var i = 1;
  var myRange = [hMargin / 2];
  while (i < months.length - 1) {
    myRange[i] = hMargin / 2 + height / 12 * i - height / 24;
    i++;
  }
  myRange[months.length - 1] = height + hMargin / 2;
  var yScale = d3.scaleOrdinal().
  domain(months).
  range(myRange);

  var xScale = d3.scaleLinear().
  domain([minYear, maxYear]).
  range([wMargin, width + wMargin]);

  var xAxis = d3.axisBottom(xScale).
  tickFormat(d3.format("d"));

  d3.select("svg").append("g").
  attr("transform", `translate(0, ${height + hMargin / 2})`).
  attr("id", "x-axis").
  call(xAxis);

  var yAxis = d3.axisLeft(yScale).
  tickSize(5);
  d3.select("svg").append("g").
  attr("transform", `translate(${wMargin - width / (2 * (maxYear - minYear + 1))}, 0)`).
  attr("id", "y-axis").
  call(yAxis);

  d3.select("svg").selectAll("rect").
  data(dataset).
  enter().
  append("rect").
  attr("class", "cell").
  attr("data-month", function (d) {
    return numMonths[months.indexOf(d[1]) - 1];
  }).
  attr("data-year", function (d) {
    return d[0];
  }).
  attr("data-temp", function (d) {
    return 8.66 + d[2];
  }).
  attr("x", function (d) {
    return xScale(d[0]);
  }).
  attr("y", function (d) {
    return yScale(d[1]) - height / 24;
  }).
  attr("height", height / 12).
  attr("width", width / (maxYear - minYear + 1)).
  attr("fill", function (d, i) {
    let color = 70 - Math.round(d[2] * 20);
    if (color < 0) {color = 0;}
    return "hsl(" + color + ", 100%, 50%)";
  }).
  on("mouseover", function (d, i) {
    let temp = (Math.round((86600 + d[2] * 10000) / 1000) / 10).toFixed(1);
    tooltip.style("opacity", 0.8);
    tooltip.html("<span>" + d[0] + " - " + d[1] + "</span>" + "<br>" + "<span>" + temp + "ºC" + "</span>").
    style("left", xScale(d[0]) - 50 + "px").
    style("top", yScale(d[1]) + hMargin / 2 + "px").
    attr("data-year", d[0]);
  }).
  on("mouseout", function (d, i) {
    tooltip.style("opacity", 0);
  });

  //Create a color legend corresponding to temperature scale. Each single-colored cell pertains to the specific temperature value contained in the array. Each color is calculated following the seame linear scale used for graphic plotting of colored bars inside svg graph, taking into account that 8.66ºC corresponds to hsl(70, 100%, 50%).

  var colorScale = [0, 2.5, 5, 7.5, 10, 12.5];

  var legend = d3.select("svg").append("g").
  attr("id", "legend");

  legend.selectAll("rect").
  data(colorScale).
  enter().
  append("rect").
  attr("class", "color-cell").
  attr("x", width + wMargin * 1.25).
  attr("y", function (d, i) {
    return hMargin / 2 * i + hMargin / 2;
  }).
  attr("height", hMargin / 2).
  attr("width", hMargin / 4).
  style("fill", function (d, i) {
    let tempDiff = d - 8.66;
    let color = 70 - Math.round(tempDiff * 20);
    if (color < 0) {color = 0;}
    return "hsl(" + color + ", 100%, 50%)";
  });
  for (let i = 0; i < colorScale.length; i++) {
    d3.select("svg").append("text").
    text(colorScale[i]).
    attr("x", width + wMargin * 1.55).
    attr("y", hMargin / 2 * i + 3 * hMargin / 4);
  }

});