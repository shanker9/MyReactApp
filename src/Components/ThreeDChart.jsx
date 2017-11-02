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
        this.graph3d = undefined;
        this.dataSet = undefined;
    }

    componentDidMount() {

        let boundingDiv = document.getElementById('chartBoundingDiv');
        this.chartHeight = boundingDiv.clientHeight;
        this.chartWidth = boundingDiv.clientWidth;
        this.render3DChart();
        this.volsurfaceData = [
            {
                "maturity": {
                    "value": "1489104000",
                    "str": "20170310 00:00:00"
                },
                "strikes": [
                    0.9099999999999999,
                    1.04,
                    1.1700000000000002,
                    1.3,
                    1.4300000000000002,
                    1.56,
                    1.6900000000000002
                ],
                "vols": [
                    0.24000000000000002,
                    0.18999999999999997,
                    0.15999999999999998,
                    0.15,
                    0.16,
                    0.18999999999999997,
                    0.24000000000000002
                ]
            },
            {
                "maturity": {
                    "value": "1520640000",
                    "str": "20180310 00:00:00"
                },
                "strikes": [
                    0.9099999999999999,
                    1.04,
                    1.1700000000000002,
                    1.3,
                    1.4300000000000002,
                    1.56,
                    1.6900000000000002
                ],
                "vols": [
                    0.21750000000000003,
                    0.18,
                    0.1575,
                    0.15,
                    0.1575,
                    0.18,
                    0.21750000000000003
                ]
            },
            {
                "maturity": {
                    "value": "1552176000",
                    "str": "20190310 00:00:00"
                },
                "strikes": [
                    0.9099999999999999,
                    1.04,
                    1.1700000000000002,
                    1.3,
                    1.4300000000000002,
                    1.56,
                    1.6900000000000002
                ],
                "vols": [
                    0.195,
                    0.16999999999999998,
                    0.155,
                    0.15,
                    0.155,
                    0.16999999999999998,
                    0.195
                ]
            }
        ]
    }

    render3DChart() {
        // Create and populate a data table.
        this.dataSet = new vis.DataSet();
        // create some nice looking data with sin/cos
        let steps = 50;  // number of datapoints will be steps*steps
        let axisMax = 314;
        let axisStep = axisMax / steps;
        for (let x = 0; x < axisMax; x += axisStep) {
            for (let y = 0; y < axisMax; y += axisStep) {
                let value = this.custom(x, y);
                this.dataSet.add({
                    x: x,
                    y: y,
                    z: value,
                    style: value
                });
            }
        }

        //width: this.chartWidth.toString(),
        // height: (this.chartHeight).toString(),
        // specify options
        let options = {
            width: '95%',
            height: '95%',
            style: 'surface',
            showPerspective: false,
            showGrid: true,
            showShadow: false,
            keepAspectRatio: false,
            showLegend: true,
            verticalRatio: 0.5,
            tooltip: true,
            backgroundColor : 'black',
        };

        // create a graph3d
        let container = document.getElementById('chartBoundingDiv');
        this.graph3d = new vis.Graph3d(container, this.dataSet, options);
    }

    custom(x, y) {
        return (Math.sin(x / 50) * Math.cos(y / 50) * 50 + 50);
    }

    formatData(volsurfaceData) {
        let data = new vis.DataSet();
        let formatedArray = [], id = 0;
        this.volsurfaceData.forEach(item => {
            item.strikes.forEach((val, index) => {
                formatedArray.push({ x: val, y: item.vols[index], z: item.maturity.value });
                id++;
            })
        });

        data.add(formatedArray);
        this.graph3d.setData(data);
        this.graph3d.redraw();
    }

    render() {
        return (
            <div id="chartBoundingDiv" style={{ flex: 1 }} />
        );
    }
}

export default ThreeDChart;