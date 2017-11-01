import React, { Component } from 'react';
import vis from 'vis';

class ThreeDChart extends Component {
    constructor() {
        super();

        this.data = null;
        this.graph = null;
        this.custom = this.custom.bind(this);
        this.render3DChart = this.render3DChart.bind(this);
        this.chartWidth = 0;
        this.chartHeight = 0;
    }

    componentDidMount(){

        let boundingDiv = document.getElementById('chartBoundingDiv');
        this.chartHeight = boundingDiv.clientHeight;
        this.chartWidth = boundingDiv.clientWidth;
        this.render3DChart();
    }

    render3DChart() {
        // Create and populate a data table.
        let data = new vis.DataSet();
        // create some nice looking data with sin/cos
        let steps = 50;  // number of datapoints will be steps*steps
        let axisMax = 314;
        let axisStep = axisMax / steps;
        for (let x = 0; x < axisMax; x += axisStep) {
            for (let y = 0; y < axisMax; y += axisStep) {
                let value = this.custom(x, y);
                data.add({
                    x: x,
                    y: y,
                    z: value,
                    style: value
                });
            }
        }


        // specify options
        let options = {
            width: this.chartWidth.toString(),
            height: (this.chartHeight*2).toString(),
            style: 'surface',
            showPerspective: false,
            showGrid: true,
            showShadow: false,
            keepAspectRatio: false,
            verticalRatio: 0.5
        };

        // create a graph3d
        let container = document.getElementById('chartBoundingDiv');
        let graph3d = new vis.Graph3d(container, data, options);
    }

    custom(x, y) {
        return (Math.sin(x / 50) * Math.cos(y / 50) * 50 + 50);
    }

    render() {
        return (
            <div id="chartBoundingDiv" style={{ flex: 1 }}/>
        );
    }
}

export default ThreeDChart;