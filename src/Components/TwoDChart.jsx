import React, { Component } from 'react';
import {
  AreaChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Area,
  Label
} from 'recharts';
import chartData from './testData.js';

class TwoDChart extends Component {

  constructor() {
    super();

    this.state = {
      dataObject: {}
    }
    this.entriesDatePathComponent = undefined;
    this.monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    this.chartWidth = 0;
    this.chartHeight = 0;
  }

  componentDidMount() {
    let boundingDiv = document.getElementById('chartBoundingDiv');
    this.chartHeight = boundingDiv.clientHeight;
    this.chartWidth = boundingDiv.clientWidth;
  }

  componentWillUpdate() {
    let boundingDiv = document.getElementById('chartBoundingDiv');
    this.chartHeight = boundingDiv.clientHeight;
    this.chartWidth = boundingDiv.clientWidth;
  }

  getChartData(testData) {
    let chartData = [];
    let dataMin, dataMax;
    testData.forEach(item => {
      let object, xVal = this.getFormatedDate(item),
        yVal = item.value * 100;

      dataMin = dataMin == undefined ? yVal : (dataMin > yVal ? yVal : dataMin);
      dataMax = dataMax == undefined ? yVal : (dataMax < yVal ? yVal : dataMax);

      chartData.push({ time: xVal, rate: yVal });
    })
    let ticksInterval = ((dataMax - dataMin) / chartData.length).toFixed(2);
    return { chartData, dataMin, dataMax, ticksInterval };
  }

  getFormatedDate(item) {
    let d = new Date(parseInt(item[this.entriesDatePathComponent].value * 1000));
    // return `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`;
    return `${d.getDate()} ${this.monthNames[d.getMonth()]} ${d.getFullYear()}`;
  }

  renderChartWithData(data, datePathComponent) {
    this.entriesDatePathComponent = datePathComponent;
    let formatedDataForAreaChart = this.getChartData(data);
    this.setState({ dataObject: formatedDataForAreaChart });
  }

  render() {

    // const this.state.dataObject = this.getChartData(chartData);
    return (
      // <div>
      //   <button style={{ height: '40px', width: '150px' }} />
        <div id='chartBoundingDiv' style={{ flex: 1 }}>
          <AreaChart width={this.chartWidth} height={this.chartHeight} data={this.state.dataObject.chartData}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <XAxis dataKey="time" scale='auto' />
            <YAxis domain={['auto', this.state.dataObject.dataMax]}>
              <Label/>
              <Text scaleToFit={true}/>
            </YAxis>
            <CartesianGrid strokeDasharray="3 3" />
            <Tooltip />
            <Area
              type='monotone'
              dataKey='rate'
              dot={true}
              stroke='#316086'
              fill='#bfe2ff'
            />
          </AreaChart>
        </div>
      // </div>
    );
  }
}

class CustomizedLabel extends Component {
  render() {
    const { x, y, stroke, value } = this.props;
    return <text x={x} y={y} dy={-4} fill={stroke} fontSize={5} transform="rotate(-90)" textAnchor="end">{value}</text>
  }
}

export default TwoDChart;