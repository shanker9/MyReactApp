import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import styles from '../../styles/AppStyles.css'
var data = [
  {
    x: ['0', '1', '2', '3', '4', '5'],
    y: ['0', '1', '2', '3', '4', '5'],
    z: [['0.2', '1.2', '2.1', '3.2', '4.2', '5.2'], ['0.4', '1.4', '2.6', '3.4', '4.4', '5.4'], ['0.8', '1.6', '2.8', '3.6', '4.8', '5.8'], ['1', '2', '3', '4', '5']],
    autocolorscale: false,
    type: 'surface',
    colorscale: [['0', 'rgb(71, 17, 100)'], ['0.35', 'rgb(53, 92, 140)'], ['0.5', 'rgb(37, 130, 141)'], ['0.6', 'rgb(66, 189, 112)'], ['0.7', 'rgb(141, 214, 68)'], ['1', 'rgb(221, 226, 24)']],
  }
];

class Plot extends React.Component {
  componentDidMount() {

    let containerDiv = document.getElementById("plotly-div");
    Plotly.newPlot('plotly-div', { data: data, layout: this.getLayout(containerDiv.clientWidth, containerDiv.clientHeight) });
    document.getElementById('plotly-div').on('plotly_click', this.props.onPlotClick);
    x: this.props.xdata;
    y: this.props.ydata;
    z: this.props.zdata;
  }

  getLayout(layoutWidth, layoutHeight) {
    return (
      {
        autosize: false,
        height: layoutHeight,
        hovermode: 'closest',
        scene: {
          aspectmode: 'auto',
          aspectratio: {
            x: 1.01136460927,
            y: 1.01136460927,
            z: 0.977652455625
          },
          camera: {
            center: {
              x: 0,
              y: 0,
              z: 0
            },
            eye: {
              x: 2.05591537651,
              y: 0.674077045088,
              z: 0.294030626567
            },
            up: {
              x: 0,
              y: 0,
              z: 1
            }
          }
        },
        width: layoutWidth,
        xaxis: { title: 'A' },
        yaxis: { title: 'B' },
        zaxis: { title: 'C' }
      });
  }

  render() {
    return (
      <div id="plotly-div" className={styles.chartContainer}>
      </div>
    );
  }
}

export default Plot;
