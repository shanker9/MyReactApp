import React, { Component } from 'react';
import dagre from 'dagre';
import * as dagreD3 from 'dagre-d3';
import * as d3Local from 'd3';
import styles from '../../styles/AppStyles.css'
import dagreStyles from '../../styles/Dagre.css'
import format from 'format-number';

class DagreD3 extends Component {

    constructor(props) {
        super(props);

        this.state = {
            parentNodeData: this.props.qGraphData.parentNodeData,
            parentNodeSources: this.props.qGraphData.parentNodeSources,
            childNodesArray: this.props.qGraphData.childNodesArray,
        }

        this.dagreLayoutNodeInfo = undefined;
        this.dagreLayoutEdgeInfo = undefined;
        this.dagreD3Renderer = this.dagreD3Renderer.bind(this);
        this.dagreGraphTreeLayout = this.dagreGraphTreeLayout.bind(this);
        this.gLayout = undefined;
        this.svg = undefined;
        this.selectedNodeKey = undefined;
    }

    componentDidMount() {
        // this.dagreGraphTreeLayout();
    }

    componentDidUpdate() {
        this.dagreGraphTreeLayout();
    }

    formatNumber(number){
        let myFormat = format({prefix: '$',integerSeparator :','});
        let formattedNum = myFormat(number);
        return formattedNum;
    }

    dagreGraphTreeLayout() {
        // Create a new directed graph 
        var g = new dagre.graphlib.Graph();

        let parentNodeData = this.state.parentNodeData,
            parentNodeSources = this.state.parentNodeSources,
            childNodesArray = this.state.childNodesArray;

        // Set an object for the graph label
        g.setGraph({ rankdir: "BT" });

        // Default to assigning a new object as a label for each new edge.
        g.setDefaultEdgeLabel(function () { return {}; });

        //setting ParentNode
        g.setNode(parentNodeData.id, {
            shape: "rect",
            label: `${parentNodeData.shortId}\n ${this.formatNumber(parentNodeData.result.data.values.values.price.dblVal.toFixed(2))}`,
            // label: `${parentNodeData.shortId}`,
            width: 180,
            height: 50,
            data: parentNodeData,
            labelStyle: "font-size: 1.5em",
            style: "stroke-width: 4px; stroke:#650922; fill:white"
        });

        //setting edges to parentNode
        parentNodeData.sources.forEach(source => {
            // g.setEdge(rootNode.id, source.source);
            g.setEdge(source.source, parentNodeData.id, {
                style: "stroke-width: 3px; fill-opacity: 0; stroke:lightgrey",
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
                    shape: "rect",
                    label: nodeData.shortId,
                    // width: 180,
                    // height: 40,
                    data: nodeData,
                    labelStyle: "font-size: 1.5em",
                    style: "stroke-width: 4px; stroke:#650922; fill:white"
                });
            } else {
                gElement.setNode(nodeId, {
                    label: nodeData.shortId,
                    // width: 180,
                    // height: 40,
                    data: nodeData,
                    labelStyle: "font-size: 1.5em",
                    style: "stroke-width: 4px; stroke:#650922; fill:white"
                });
            }

            if (nodeData.sources != undefined) {
                nodeData.sources.forEach(source => {
                    // gElement.setEdge(nodeData.id, source.source);
                    gElement.setEdge(source.source, nodeData.id, {
                        style: "stroke-width: 3px; fill-opacity: 0; stroke:lightgrey",
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
            let node = g.node(v);
            if (node.data.hasOwnProperty('func')) {
                // Round the corners of the nodes
                node.rx = node.ry = 40;
            }
        });

        // d3Local.selectAll("g")
        //     .attr("stroke", "black");

        // this.svg = d3Local.select('.dagreContainer').append('svg');
        let isInitialSVGRender = true, translateX, translateY, scale;
        if (this.svg == undefined) {
            this.svg = d3Local.select("svg.treeSvg")
                .attr("width", document.getElementById("dagreContainer").clientWidth)
                .attr("height", document.getElementById("dagreContainer").clientHeight)
                .attr("fill", "white");
        } else {
            translateX = d3Local.transform(this.svg.select('g').attr("transform")).translate[0];
            translateY = d3Local.transform(this.svg.select('g').attr("transform")).translate[1];
            scale = d3Local.transform(this.svg.select('g').attr("transform")).scale[0];
            isInitialSVGRender = false;
        }
        let inner = this.svg.select("g").attr("stroke", "black");

        // Set up zoom support
        var zoom = d3Local.behavior.zoom().on("zoom", function () {
            inner.attr("transform", "translate(" + d3.event.translate + ")" +
                "scale(" + d3.event.scale + ")");
        });
        this.svg.call(zoom);



        // Create the renderer
        var render = new dagreD3.render();

        // Run the renderer. This is what draws the final graph.
        render(inner, g);

        if (this.selectedNodeKey) {
            let nodeData = this.gLayout.node(this.selectedNodeKey);
            let selectedNodeElem = nodeData.elem;
            selectedNodeElem.style.fill = "lightblue";
            selectedNodeElem.children[0].style.stroke = "red";
            this.updateObjectBrowserData(nodeData);
        }

        let selectedNode = inner.selectAll("g.node");
        selectedNode.on('click', this.nodeClickHandler.bind(this));

        d3Local.selectAll("text")
            .attr("fill", "black")
            .style("font")

        // d3Local.selectAll("g")
        //     .attr("stroke", "black");

        // Center the graph
        if (isInitialSVGRender) {
            let initialScale = 0.90;

            if (g.graph().width > this.svg.attr("width")) {
                initialScale = (this.svg.attr("width") - 100) / g.graph().width;

                let temp = zoom
                    .translate([50, 50])
                    .scale(initialScale);
                temp.event(this.svg);
            } else {
                let temp = zoom
                    .translate([(this.svg.attr("width") - g.graph().width * initialScale) / 2, 50])
                    .scale(initialScale);
                temp.event(this.svg);
            }
        } else {
            let temp = zoom
                .translate([translateX, translateY])
                .scale(scale);
            temp.event(this.svg);
        }
        // this.svg.attr('height', g.graph().height * initialScale + 100);
    }



    updateGraphData(graphData) {
        this.props.objectBrowserComponentReference().updateData({});
        // this.clearSvg();

        const { parentNodeData, parentNodeSources, childNodesArray } = graphData;
        this.gLayout = undefined;
        // this.svg = undefined;
        this.selectedNodeKey = undefined;
        this.setState({ parentNodeData: parentNodeData, parentNodeSources: parentNodeSources, childNodesArray: childNodesArray });
    }

    updateParentNodeData(parentNodeData) {
        // this.clearSvg();
        this.setState({ parentNodeData: parentNodeData });
    }

    clearSvg() {
        if (this.svg != undefined) {
            let containter = document.getElementById("dagreContainer");
            containter.removeChild(containter.childNodes[0]);
            this.svg = d3Local.select('#dagreContainer').append('svg');
            this.svg.append('g');
        }
    }

    nodeClickHandler(nodeKey) {

        if (this.selectedNodeKey) {
            let selectedNodeElem = this.gLayout.node(this.selectedNodeKey).elem;
            selectedNodeElem.style.fill = "";
            selectedNodeElem.children[0].style.stroke = "#650922";
        }

        this.selectedNodeKey = nodeKey;

        let nodeData = this.gLayout.node(this.selectedNodeKey);
        let g = nodeData.elem;
        g.style.fill = "lightblue";
        g.children[0].style.stroke = "red";

        this.updateObjectBrowserData(nodeData);
        this.updateChartComponent(nodeData);
    }

    updateObjectBrowserData(nodeData) {
        this.props.objectBrowserComponentReference().updateData(nodeData.data);
    }

    updateChartComponent(nodeData) {
        let datePathComponent, dataArrayKey;
        if (nodeData.data.shortId.startsWith('TS')) {
            datePathComponent = 'dateTime';
            dataArrayKey = 'entries';
            this.props.chartComponentReference().renderChartWithData(nodeData.data.data[dataArrayKey], datePathComponent);
        }
        else if (nodeData.data.shortId.startsWith('RC')) {
            datePathComponent = 'date';
            dataArrayKey = 'points';
            this.props.chartComponentReference().renderChartWithData(nodeData.data.data[dataArrayKey], datePathComponent);            
        }
        // if (datePathComponent && dataArrayKey) {
        //     this.props.chartComponentReference().renderChartWithData(nodeData.data.data[dataArrayKey], datePathComponent);
        // }
    }

    render() {
        return (

            <div id="dagreContainer" className={styles.dagreContainer}>
                <svg className='treeSvg'>
                    <g></g>
                </svg>
            </div>
        );
    }

}

export default DagreD3;