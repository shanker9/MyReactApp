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

var scrollUpdateDelay = true;
class App extends React.Component {

    constructor() {
        super();
        this.state = {
            rowHeight: 20,
            subscriptionTopic: 'ProductAll2',
            vertexData : undefined
        }
    }

    componentDidMount() {
    }

    getObjectBrowserComponentReference(){
        return this.refs.objectBrowser;
    }

    render() {
        return (
            <div>
                <div className={styles.gridAndChartContainer}>
                    <div className={styles.tablecontainer}>
                        <TableView ref='tableViewRef'
                            subscriptionTopic={this.state.subscriptionTopic}
                            rowHeight={this.state.rowHeight} />
                    </div>

                    <div className={styles.chartContainer}>
                        Space for vol surface
                    </div>
                </div>
                <div className={styles.graphAndObjectBrowserContainer}>
                    <div id="dagreContainer" className={styles.graphContainer}>
                        <DagreD3 parent={this} qGraphData={qGraphData}/>
                    </div>
                    <div className={styles.objectBrowserContainer}>
                        <ObjectBrowser ref="objectBrowser"/>
                    </div>
                </div>
            </div>

        );
    }

}

export default App;