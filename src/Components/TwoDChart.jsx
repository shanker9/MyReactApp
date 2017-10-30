import React, { Component } from 'react';
import { 
    AreaChart,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Area
 } from 'recharts';
 import chartData from './testData.js'; 

class TwoDChart extends Component {

    constructor(){
        super();

        this.state={
            dataObject : {}
        }
        this.entriesDatePathComponent = undefined;
        this.monthNames = [ "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ];
    }

    componentDidMount(){

    }

    getChartData(testData){
        let chartData = [];
        let dataMin , dataMax;
        testData.forEach(item=>{
            let object,xVal = this.getFormatedDate(item),
            yVal=item.value*100;

            dataMin =  dataMin==undefined? yVal : (dataMin>yVal? yVal : dataMin);
            dataMax =  dataMax==undefined? yVal : (dataMax<yVal? yVal : dataMax);

            chartData.push({time:xVal,rate:yVal});
        })

        return {chartData,dataMin,dataMax};
    }

    getFormatedDate(item){
        let d = new Date(parseInt(item[this.entriesDatePathComponent].value*1000));
        // return `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`;
        return `${d.getDate()} ${this.monthNames[d.getMonth()]} ${d.getFullYear()}`;
    }

    renderChartWithData(data,datePathComponent){
        this.entriesDatePathComponent = datePathComponent;
        let formatedDataForAreaChart = this.getChartData(data);
        this.setState({dataObject : formatedDataForAreaChart});
    }

    render() {

        // const this.state.dataObject = this.getChartData(chartData);
        return (
            <AreaChart width={570} height={420} data={this.state.dataObject.chartData}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <XAxis dataKey="time" scale='auto'/>
                <YAxis domain={['auto', this.state.dataObject.dataMax]}/>
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
        );
    }
}

export default TwoDChart;