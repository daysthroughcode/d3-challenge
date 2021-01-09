// @TODO: YOUR CODE HERE!

//Set variables for Total SVG Dimensions

const svgWidth = 860;
const svgHeight = 600;

//Set variables for SVG margins

const chartMargin = {
    top: 30,
    right: 30,
    bottom: 75,
    left: 105
};

//Calculate SVG chart dimensions

const width = svgWidth - chartMargin.left - chartMargin.right;
const height = svgHeight - chartMargin.top - chartMargin.bottom;

// Set Chart
let svg = d3.select(".chart")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

const chartGroup = svg.append("g")
    .attr("transform", `translate(${chartMargin.left}, ${chartMargin.top})`);

// Load CSV
d3.csv("../D3_data_journalism/assets/data/data.csv").then(function (Jdata) {


    console.log(Jdata);

    //Parse through CSV and convert data to numbers
    Jdata.forEach(function (data) {
        data.income = +data.income;
        data.obesity = +data.obesity;
        //pull extra data for bonus
        data.age = +data.age;
        data.smokes = +data.smokes;
        data.state = +data.state;
        data.poverty = +data.poverty;
        data.healthcare = +data.healthcare;
    });

    //Create scale variables
    const xObesity = d3.scaleLinear()
        .domain([20, d3.max(Jdata, d => d.obesity)])
        .range([0, width]);

    const yIncome = d3.scaleLinear()
        .domain([35000, d3.max(Jdata, d => d.income)])
        .range([height, 0]);

    //Set Axis variables using scale variables
    let xAxis = d3.axisBottom(xObesity);
    let yAxis = d3.axisLeft(yIncome);

    //Append Axes to rendered chart
    chartGroup.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(xAxis);

    chartGroup.append("g")
        .call(yAxis);


    //create circle plot
    let circle = chartGroup.selectAll("circle")
        .data(Jdata)
        .enter()
        .append("circle")
        .attr("cx", d => xObesity(d.obesity))
        .attr("cy", (d, i) => { console.log(i); return yIncome(d.income) })
        .attr("r", "15")
        .attr("fill", "teal")
        .attr("stroke", "black")
        .attr("stroke-width", "3")
        .attr("opacity", ".75");



    //Initialize d3 tool tip with event listeners for display/hiding of tooltip
    let tool_tip = d3.tip()
        .attr('class', 'd3-tip')
        .offset([-8, 10])
        .html((d) => { return d.abbr; });
    svg.call(tool_tip);

    circle.on("mouseover", function (data) {
        tool_tip.show(data, this);
    })
        // onmouseout event
        .on("mouseout", function (data) {
            tool_tip.hide(data);
        });


    //label bubbles

    let text = chartGroup.selectAll(".chart")
        .data(Jdata)
        .enter()
        .append("text")
        .classed("", true);

    let textLabels = text.attr("x", d => xObesity(d.obesity))
        .attr("y", d => yIncome(d.income))
        .attr("font-family", "sans-serif")
        .attr("font-size", "10px")
        .attr("fill", "black")
        .attr("font-weight", "bold")
        .attr("text-anchor", "middle")
        .text((d, i) => { console.log(i); return d.abbr; });

    //label axes

    chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - chartMargin.left + 40)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .attr("class", "axisText")
        .attr("font-weight", "bold")
        .text("Income");

    chartGroup.append("text")
        .attr("transform", `translate(${width / 2}, ${height + chartMargin.top + 30})`)
        .attr("class", "axisText")
        .attr("font-weight", "bold")
        .text("Obesity");
}).catch(function (error) {
    console.log(error);


});
