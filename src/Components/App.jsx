import React from 'react';
import AppController from '../Controllers/TableController.js';
import TableRow from './TableRow.jsx';
import TableView from './TableView.jsx';
import styles from '../../styles/AppStyles.css'
import GridView from './GridView.jsx'
import AmpsController from '../Amps/AmpsData.js';
import DagreD3 from './dagreD3.jsx';
import ObjectBrowser from './ObjectBrowser.jsx';
import ThreeDChart from './ThreeDChart.jsx';
import ChartHOC from './ChartHOC.jsx';

var scrollUpdateDelay = true;
class App extends React.Component {

    constructor() {
        super();
        this.state = {
            rowHeight: 20,
            subscriptionTopic: 'ProductAll',
            vertexData: undefined
        }
    }

    componentDidMount() {
    }

    getObjectBrowserComponentReference() {
        return this.refs.objectBrowser;
    }

    getGraphTreeComponentReference() {
        return this.refs.graphTree;
    }

    getChartComponentReference() {
        return this.refs.chartHOC;
    }

    get3DChartComponentReference(){
        return this.refs.threeDchart;
    }

    passNewDatato3DChart(){
        this.get3DChartComponentReference().formatData();
    }

    render() {
        return (
            <div className={styles.appEnclosingDiv}>
                <div className={styles.appContainer}>
                    <div className={styles.gridAndChartContainer}>
                        <div className={styles.tablecontainer}>
                            <div className={styles.ComponentTitle}><tspan>Blotter</tspan></div>
                            <TableView ref='tableViewRef'
                                graphTreeComponentReference={this.getGraphTreeComponentReference.bind(this)}
                                subscriptionTopic={this.state.subscriptionTopic}
                                rowHeight={this.state.rowHeight} />
                        </div>

                        <div className={styles.chartContainer}>
                            <div className={styles.ComponentTitle}><tspan>Chart</tspan></div>
                            {/* <ThreeDChart /> */}
                            <ChartHOC ref='chartHOC'/>
                        </div>
                    </div>
                    <div className={styles.graphAndObjectBrowserContainer}>
                        <div className={styles.graphContainer}>
                            <div className={styles.ComponentTitle}><tspan>Graph Sources</tspan></div>
                            <DagreD3 ref="graphTree"
                                objectBrowserComponentReference={this.getObjectBrowserComponentReference.bind(this)}
                                chartComponentReference={this.getChartComponentReference.bind(this)}
                                qGraphData={{}} />
                            {/* <button style={{ height: '20px' }} onClick={this.passNewDatato3DChart.bind(this)} /> */}
                        </div>
                        <div className={styles.objectBrowserContainer}>
                            <div className={styles.ComponentTitle}><tspan>Object Browser</tspan></div>
                            <ObjectBrowser ref="objectBrowser" />
                        </div>
                    </div>
                </div>
            </div>

        );
        // return(
        //     <ThreeDChart/>          
        // )
    }

}

export default App;