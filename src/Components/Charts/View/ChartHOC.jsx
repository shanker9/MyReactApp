import React, { Component } from 'react';
import TwoDChart from './TwoDChart.jsx';
import ThreeDChart from './ThreeDChart.jsx';

class ChartHOC extends Component {

    constructor() {
        super();

        this.state = {
            chartType: '',
            displayChart: false,
            chartData: {}
        }
        this.twoDChart = undefined;
        this.threeDChart = undefined;
    }

    drawChartWithData(params) {
        this.setState({
            chartType: params.chartType,
            chartData: params.chartData
        }, () => {
            switch (params.chartType) {
                case '2D':
                    this.refs.twoDChart.renderChartWithData(params.chartData);
                    break;

                case '3D':
                    this.refs.threeDChart.renderChartWithData(params.chartData);
                    break;

                default:
                    console.log('Invalid Chart Type supplied to the draw method')
            }
        })
    }

    render() {

        if (this.state.chartType === '2D') {
            return (<TwoDChart ref="twoDChart" />);
        } else if (this.state.chartType === '3D') {
            return (<ThreeDChart ref="threeDChart" />);
        } else {
            return (<div />)
        }
    }

}

export default ChartHOC;