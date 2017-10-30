import React from 'react';
import AppController from '../Controllers/TableController.js';
import TableRow from './TableRow.jsx';
import TableView from './TableView.jsx';
import styles from '../../styles/AppStyles.css'
import GridView from './GridView.jsx'
import TreeGraph from './TreeGraph.jsx';
import AmpsController from '../Amps/AmpsData.js';
import DagreD3 from './dagreD3.jsx';
import ObjectBrowser from './ObjectBrowser.jsx';
import qGraphData from './qGraphData.js';
import Plot from './Surface.jsx';
import TwoDChart from './TwoDChart.jsx';

var scrollUpdateDelay = true;
class App extends React.Component {

    constructor() {
        super();
        this.state = {
            rowHeight: 20,
            subscriptionTopic: 'ProductAll2',
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

    render() {
        return (
            <div>
                <div className={styles.appContainer}>
                    <div className={styles.gridAndChartContainer}>
                        <div className={styles.tablecontainer}>
                            <div className={styles.ComponentTitle}><tspan>Blotter Info</tspan></div>
                            <TableView ref='tableViewRef'
                                graphTreeComponentReference={this.getGraphTreeComponentReference.bind(this)}
                                subscriptionTopic={this.state.subscriptionTopic}
                                rowHeight={this.state.rowHeight} />
                        </div>

                        <div className={styles.chartContainer}>
                            <div className={styles.ComponentTitle}><tspan>Vol Surface Chart</tspan></div>
                            <TwoDChart/>
                        </div>
                    </div>
                    <div className={styles.graphAndObjectBrowserContainer}>
                        <div className={styles.graphContainer}>
                        <div className={styles.ComponentTitle}><tspan>Graph Tree</tspan></div>
                            <DagreD3 ref="graphTree"
                                objectBrowserComponentReference={this.getObjectBrowserComponentReference.bind(this)}
                                qGraphData={qGraphData} />
                        </div>
                        <div className={styles.objectBrowserContainer}>
                            <div className={styles.ComponentTitle}><tspan>Object Browser</tspan></div>
                            <ObjectBrowser ref="objectBrowser" />
                        </div>
                    </div>
                </div>
            </div>

        );
    }

}

export default App;