import React from 'react';
import TableView from './Grid/View/TableView.jsx';
import styles from '../../styles/AppStyles.css'
import DagreD3 from './Graph/View/dagreD3.jsx';
import ObjectBrowser from './ObjectBrowser/View/ObjectBrowser.jsx';
import ChartHOC from './Charts/View/ChartHOC.jsx';

class App extends React.Component {

    constructor() {
        super();
        this.state = {
            rowHeight: 20,
            subscriptionTopic: 'ProductAllTopic'
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

    // passNewDatato3DChart() {
    //     this.get3DChartComponentReference().formatData();
    // }


    render() {
        return (
            <div className={styles.appEnclosingDiv}>
                <div className={styles.appContainer}>
                    <div className={styles.gridAndChartContainer}>
                        <div className={styles.tablecontainer}>
                            <div className={styles.ComponentTitle}>Blotter</div>
                            <TableView ref='tableViewRef'
                                graphTreeComponentReference={this.getGraphTreeComponentReference.bind(this)}
                                subscriptionTopic={this.state.subscriptionTopic}
                                rowHeight={this.state.rowHeight} />
                        </div>

                        <div className={styles.chartContainer}>
                            <div className={styles.ComponentTitle}>Chart</div>
                            <ChartHOC ref='chartHOC'/>
                        </div>
                    </div>
                    <div className={styles.graphAndObjectBrowserContainer}>
                        <div className={styles.graphContainer}>
                            <div className={styles.ComponentTitle}>Graph Sources</div>
                            <DagreD3 ref="graphTree"
                                objectBrowserComponentReference={this.getObjectBrowserComponentReference.bind(this)}
                                chartComponentReference={this.getChartComponentReference.bind(this)}
                                qGraphData={{}} />
                        </div>
                        <div className={styles.objectBrowserContainer}>
                            <div className={styles.ComponentTitle}>Object Browser</div>
                            <ObjectBrowser ref="objectBrowser" />
                        </div>
                    </div>
                </div>
            </div>

        );
    }

}

export default App;