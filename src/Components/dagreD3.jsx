import React, { Component } from 'react';
import dagre from 'dagre';
import * as dagreD3 from 'dagre-d3';
import * as d3Local from 'd3';
import styles from '../../styles/AppStyles.css'
import dagreStyles from '../../styles/Dagre.css'

class DagreD3 extends Component {

    constructor(props) {
        super(props);

        this.state = {
            parentNodeData: this.props.qGraphData.parentNodeData,
            parentNodeSources: this.props.qGraphData.parentNodeSources,
            childNodesArray: this.props.qGraphData.childNodesArray
        }

        this.dagreLayoutNodeInfo = undefined;
        this.dagreLayoutEdgeInfo = undefined;
        this.dagreD3Renderer = this.dagreD3Renderer.bind(this);
        this.dagreGraphTreeLayout = this.dagreGraphTreeLayout.bind(this);
        this.gLayout = undefined;
    }

    componentDidMount() {
        this.dagreGraphTreeLayout();
    }

    componentDidUpdate() {
        this.props.objectBrowserComponentReference().updateData({});
        this.dagreGraphTreeLayout();
    }

    dagreGraphTreeLayout() {
        // Create a new directed graph 
        var g = new dagre.graphlib.Graph();

        // Prep TestData
        // let rootNode = qGraphData.parentNodeData;
        // let parentNodeSources = qGraphData.parentNodeSources.sources;
        // let childeNodesArray = qGraphData.childeNodesArray;

        let parentNodeData = this.state.parentNodeData
        let parentNodeSources = this.state.parentNodeSources;
        let childNodesArray = this.state.childNodesArray;

        // Set an object for the graph label
        g.setGraph({ rankdir: "BT" });

        console.log(g.rankdir);

        // Default to assigning a new object as a label for each new edge.
        g.setDefaultEdgeLabel(function () { return {}; });

        //setting ParentNode
        g.setNode(parentNodeData.id, {
            shape: "ellipse",
            label: parentNodeData.shortId,
            width: 200,
            height: 40,
            data: parentNodeData,
            labelStyle: "font-size: 1.5em",
            style: "stroke-width: 2px"
        });
        parentNodeData.sources.forEach(source => {
            // g.setEdge(rootNode.id, source.source);
            g.setEdge(source.source, parentNodeData.id, {
                style: "stroke-width: 1px",
                // lineInterpolate: 'basis'
            });
        });
        this.setNodesAndEdges(g, parentNodeSources, childNodesArray);

        dagre.layout(g);

        this.gLayout = g;
        this.dagreD3Renderer();
    }

    setNodesAndEdges(gElement, nodeIdArray, nodeDataArray) {
        let nodeData, nodeSources;

        nodeIdArray.forEach(nodeId => {
            nodeData = nodeDataArray.find(item => {
                return item.id == nodeId;
            });

            if (nodeData.hasOwnProperty('func')) {
                gElement.setNode(nodeId, {
                    shape: "ellipse",
                    label: nodeData.shortId,
                    width: 200,
                    height: 40,
                    data: nodeData,
                    labelStyle: "font-size: 1.5em",
                    style: "stroke-width: 2px"
                });
            } else {
                gElement.setNode(nodeId, {
                    label: nodeData.shortId,
                    width: 200,
                    height: 40,
                    data: nodeData,
                    labelStyle: "font-size: 1.5em",
                    style: "stroke-width: 2px"
                });
            }

            if (nodeData.sources != undefined) {
                nodeData.sources.forEach(source => {
                    // gElement.setEdge(nodeData.id, source.source);
                    gElement.setEdge(source.source, nodeData.id, {
                        style: "stroke-width: 1px",
                        // lineInterpolate: 'basis'
                    });
                })
            }
        });
        return gElement;
    }

    dagreD3Renderer() {
        // Create a new directed graph
        // var g = new dagreD3.graphlib.Graph().setGraph(this.gLayout);
        var g = this.gLayout;

        g.nodes().forEach(function (v) {
            var node = g.node(v);
            // Round the corners of the nodes
            node.rx = node.ry = 5;
        });

        // d3Local.selectAll("g")
        //     .attr("stroke", "black");

        var svg = d3Local.select("svg")
            .attr("width", document.getElementById("dagreContainer").clientWidth)
            .attr("height", document.getElementById("dagreContainer").clientHeight)
            .attr("fill", "white");
        let inner = svg.select("g").attr("stroke", "black");

        // Set up zoom support
        var zoom = d3Local.behavior.zoom().on("zoom", function () {
            inner.attr("transform", "translate(" + d3.event.translate + ")" +
                "scale(" + d3.event.scale + ")");
        });
        svg.call(zoom);

        // Create the renderer
        var render = new dagreD3.render();

        // Run the renderer. This is what draws the final graph.
        render(inner, g);

        var selectedNode = inner.selectAll("g.node");
        selectedNode.on('click', this.updateObjectBrowserData.bind(this));

        d3Local.selectAll("text")
            .attr("fill", "black")
            .style("font")

        // d3Local.selectAll("g")
        //     .attr("stroke", "black");

        // Center the graph
        var initialScale = 0.90;

        if (g.graph().width > svg.attr("width")) {
            initialScale = (svg.attr("width")-20) / g.graph().width;

            let temp = zoom
                .translate([10, 50])
                .scale(initialScale);
            temp.event(svg);
        } else {
            let temp = zoom
                .translate([(svg.attr("width") - g.graph().width * initialScale) / 2, 50])
                .scale(initialScale);
            temp.event(svg);
        }
        svg.attr('height', g.graph().height * initialScale + 100);
    }

    updateGraphData(graphData) {
        const { parentNodeData, parentNodeSources, childNodesArray } = graphData;
        this.setState({ parentNodeData: parentNodeData, parentNodeSources: parentNodeSources, childNodesArray: childNodesArray });
    }

    updateObjectBrowserData(nodeKey) {
        let nodeData = this.gLayout.node(nodeKey);
        console.dir(nodeData);
        this.props.objectBrowserComponentReference().updateData(nodeData.data);
    }



    render() {
        return (
            <div>
                <div className={styles.ComponentTitle}><tspan>Graph Tree</tspan></div>
                <svg>
                    <g></g>
                </svg>
            </div>
        );
    }

}

export default DagreD3;