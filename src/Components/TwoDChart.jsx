import React, { Component } from 'react';
import { AreaStackChart } from 'react-d3-basic';

class TwoDChart extends Component {
    constructor() {
        super();

        this.state={
            chartData : [],
            chartLayout : {
                width:0,
                height:0,
                chartSeries:[],
                x:undefined,
                xScale:undefined
            }
        }
    }

    componentWillMount(){
        // this.setupLayout();
    }

    componentDidMount(){
        this.setupLayout();        
    }

    setupLayout() {

        let data = [
            {
              "dateTime": {
                "value": "1486339200",
                "str": "20170206 00:00:00"
              },
              "value": 0.0103844
            },
            {
              "dateTime": {
                "value": "1486425600",
                "str": "20170207 00:00:00"
              },
              "value": 0.0103817
            },
            {
              "dateTime": {
                "value": "1486512000",
                "str": "20170208 00:00:00"
              },
              "value": 0.0103372
            },
            {
              "dateTime": {
                "value": "1486598400",
                "str": "20170209 00:00:00"
              },
              "value": 0.0103372
            },
            {
              "dateTime": {
                "value": "1486684800",
                "str": "20170210 00:00:00"
              },
              "value": 0.010362199999999998
            },
            {
              "dateTime": {
                "value": "1486944000",
                "str": "20170213 00:00:00"
              },
              "value": 0.01039
            },
            {
              "dateTime": {
                "value": "1487030400",
                "str": "20170214 00:00:00"
              },
              "value": 0.0103733
            },
            {
              "dateTime": {
                "value": "1487116800",
                "str": "20170215 00:00:00"
              },
              "value": 0.0104178
            },
            {
              "dateTime": {
                "value": "1487203200",
                "str": "20170216 00:00:00"
              },
              "value": 0.010565
            },
            {
              "dateTime": {
                "value": "1487289600",
                "str": "20170217 00:00:00"
              },
              "value": 0.0105233
            },
            {
              "dateTime": {
                "value": "1487548800",
                "str": "20170220 00:00:00"
              },
              "value": 0.010501100000000001
            },
            {
              "dateTime": {
                "value": "1487635200",
                "str": "20170221 00:00:00"
              },
              "value": 0.0105344
            },
            {
              "dateTime": {
                "value": "1487721600",
                "str": "20170222 00:00:00"
              },
              "value": 0.01054
            },
            {
              "dateTime": {
                "value": "1487808000",
                "str": "20170223 00:00:00"
              },
              "value": 0.0105233
            },
            {
              "dateTime": {
                "value": "1487894400",
                "str": "20170224 00:00:00"
              },
              "value": 0.01054
            },
            {
              "dateTime": {
                "value": "1488153600",
                "str": "20170227 00:00:00"
              },
              "value": 0.010545599999999999
            },
            {
              "dateTime": {
                "value": "1488240000",
                "str": "20170228 00:00:00"
              },
              "value": 0.01064
            },
            {
              "dateTime": {
                "value": "1488326400",
                "str": "20170301 00:00:00"
              },
              "value": 0.010927800000000001
            },
            {
              "dateTime": {
                "value": "1488412800",
                "str": "20170302 00:00:00"
              },
              "value": 0.011000000000000001
            },
            {
              "dateTime": {
                "value": "1488499200",
                "str": "20170303 00:00:00"
              },
              "value": 0.011016699999999999
            },
            {
              "dateTime": {
                "value": "1488758400",
                "str": "20170306 00:00:00"
              },
              "value": 0.0110622
            },
            {
              "dateTime": {
                "value": "1488844800",
                "str": "20170307 00:00:00"
              },
              "value": 0.0110622
            },
            {
              "dateTime": {
                "value": "1488931200",
                "str": "20170308 00:00:00"
              },
              "value": 0.01109
            },
            {
              "dateTime": {
                "value": "1489017600",
                "str": "20170309 00:00:00"
              },
              "value": 0.011195600000000002
            }
          ];
        // var parseDate = d3.time.format("%m/%d/%y").parse;
        let containerElem = document.getElementById('2dchartContainer');

        let width = containerElem.clientWidth,
            height = containerElem.clientHeight,
            title = "Stack Area Chart",
            chartSeries = [
                {
                    field: "value",
                    name: "Rate"
                }
            ],
            x = this.parseDateFormat.bind(this),
            xScale = 'time',
            y = this.multiplierForRateValues.bind(this)
            ;

        let chartLayout = {width,height,title,chartSeries,x,xScale};
        this.setState({
            chartData : data,
            chartLayout : chartLayout
        })
    }

    parseDateFormat(d) {
        // let parseDate = d3.time.format("%m/%d/%y").parse;
        let dateObj = new Date(parseInt(d.dateTime.value*1000));
        // return parseDate(d.birthday);
        return dateObj;
    }

    multiplierForRateValues(d){
        return d.value*100;
    }

    render() {
        return (
            <div id='2dchartContainer' style={{flex:1}}>
                <AreaStackChart
                    data={this.state.chartData}
                    width={this.state.chartLayout.width}
                    height={this.state.chartLayout.height}
                    chartSeries={this.state.chartLayout.chartSeries}
                    x={this.state.chartLayout.x}
                    xScale={this.state.chartLayout.xScale}
                />
            </div>
        );
    }

}

export default TwoDChart;