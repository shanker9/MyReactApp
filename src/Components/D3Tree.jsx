import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import * as d3 from 'd3';

class D3Tree extends Component {

    constructor() {
        super();

        this.renderTree = this.renderTree.bind(this);
        this.update = this.update.bind(this);
    }

    componentDidMount() {
        let mountNode = ReactDOM.findDOMNode(this);

        // Render the tree usng d3 after first component mount
        this.renderTree(this.props.treeData, mountNode);
    }

    shouldComponentUpdate(nextProps, nextState) {
        // Delegate rendering the tree to a d3 function on prop change
        this.renderTree(this.props.treeData, this.getDOMNode());

        // Do not allow react to render the component on prop change
        return false;
    }

    renderTree(treeData, svgDomNode) {
        // Add the javascript code that renders the tree from
        // http://bl.ocks.org/d3noob/8329404
        // And replace the line that reads
        // var svg = d3.select("body").append("svg")
        // with 
        // var svg = d3.select(svgDomNode)

        var margin = { top: 20, right: 120, bottom: 20, left: 120 },
            width = 960 - margin.right - margin.left,
            height = 500 - margin.top - margin.bottom;

        var i = 0;

        d3.select(svgDomNode).selectAll("*").remove();

        var tree = d3.tree().size([height, width]);

        var diagonal = d3.linkHorizontal()
            .x(function (d) { return d.y + 60; })
            .y(function (d) { return d.x; });
        
        // var diagonal = d3.diagonal()
        //     .projection(function (d) { return [d.y, d.x]; });

        var svg = d3.select(svgDomNode)
            .attr("width", width + margin.right + margin.left)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        let root = d3.hierarchy(treeData[0]);

        this.update(root, tree, svg, i, diagonal);


    }

    update(root, tree, svg, i, diagonal) {

        // Compute the new tree layout.

        tree(root);
        let nodes = root.descendants();
        let links = root.links();

        // Normalize for fixed-depth.
        nodes.forEach(function (d) { d.y = d.depth * 150; });

        // Declare the nodes…
        var node = svg.selectAll("g.node")
            .data(nodes, function (d) { return d.id || (d.id = ++i); });

        // Enter the nodes.
        var nodeEnter = node.enter().append("g")
            .attr("class", "node")
            .attr("transform", function (d) {
                return "translate(" + d.y + "," + d.x + ")";
            })
        // .attr("transform", function (d) {
        //     return "rotate(-90)";
        // });

        // nodeEnter.append("circle")
        //     .attr("r", 22)
        //     .style("fill", "grey");

        var rectangle = nodeEnter.append("rect")
            .attr("transform", function (d) {
                return "translate(0,0)";
            })
            // .attr("transform", function (d) {
            //     return "rotate(90)";
            // })
            .attr("width", 120)
            .attr("height", 30)
            .style("fill", "steelblue");

        nodeEnter.append("text")
            // .attr("x", function (d) {
            //     return d.children || d._children ? -13 : 13;
            // })
            .attr("x", function (d) { return 10; })
            .attr("y", function (d) { return 15; })
            // .attr("y", rectangle.height / 2)
            // .attr("dy", ".35em") 
            .attr("text-anchor", function (d) {
                return d.children || d._children ? "start" : "start";
            })
            // .attr("transform", function (d) {
            //     return "rotate(-90)";
            // })
            .text(function (d) { return d.data.name; })
            .style("fill", "black")
            .style("fill-opacity", 1);

        // Declare the links…
        var link = svg.selectAll("path.link")
            .data(links, function (d) { return d.target.id; });

        // Enter the links.
        link.enter().insert("path", "g")
            .attr("class", "link")
            .style("stroke", function(d) { return d.target.level; })
            .attr("d", diagonal)
            // .attr("transform", function (d) {
            //     return rotate(-90);
            // })

    }

    render() {
        // Render a blank svg node
        return (
            <svg></svg>
        );
    }

}

export default D3Tree;


