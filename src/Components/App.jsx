import React from 'react';
import AppController from '../Controllers/TableController.js';
import TableRow from './TableRow.jsx';
import TableView from './TableView.jsx';
import styles from '../../styles/AppStyles.css'
import GridView from './GridView.jsx'
var scrollUpdateDelay = true;
class App extends React.Component {

    constructor() {
        super();

        this.state = {
            data: [],
            sortedData: [],
            viewableData: [],
            selectedData: undefined,
            subscriberId: ' ',
            totalRecords: 0,
            lastRow: 0,
            loadedRows: 0,
            loadTime: 0,
            currentSelectedRowIndex: undefined,
            viewableStartIndex: 0
        }
        // this.handleClick = this.handleClick.bind(this);
        // this.handleScroll = this.handleScroll.bind(this);
        // this.sliceLoadableData = this.sliceLoadableData.bind(this);
        // this.rowDataUpdateStatus = this.rowDataUpdateStatus.bind(this);
        // this.sliceHashmap = this.sliceHashmap.bind(this);
        // this.triggerConditionalUIUpdate = this.triggerConditionalUIUpdate.bind(this);
        // this.createGroupBuckets = this.createGroupBuckets.bind(this);
        // this.updateAggregatedRowExpandStatus = this.updateAggregatedRowExpandStatus.bind(this);
        // this.getViewableStartIndex = this.getViewableStartIndex.bind(this);
        // this.formGroupedData = this.formGroupedData.bind(this);
        // this.rowUpdate = this.rowUpdate.bind(this);
        this.addScrollOffset = true;
        this.previousScrollTop = 0;
        this.rowIndex = 0;
        this.rowHeight = 30;
        this.lowerLimit = 0;
        this.upperLimit = 0;
        this.scrollableDivClientHeight = undefined;
        this.selectStart = undefined;
        this.selectEnd = undefined;
        this.isSorted = true;
        this.tempArr = [];
        this.dataMap = new Map();
        this.sowDataEnd = false;
        this.controller = undefined;
        this.groupedData = new Map();
        this.sowGroupDataEnd = false;
        this.valueKeyMap = new Map();
        this.isGroupedView = false;
        this.subscriptionData = new Map();
        this.subscribedTopic = 'Price';
        // this.viewableStartIndex=0;
        // this.currentSelectedRowIndex = undefined;
    }

    /** START OF LIFE CYCLE METHODS */

    componentWillMount() {
        // this.handleClick();
    }

    componentDidMount() {
        this.scrollableDivClientHeight = document.getElementById('scrollableTableDiv').clientHeight;
    }

    /** END OF LIFE CYCLE METHODS */

    rowDataUpdateStatus(index, updateStatus) {
        this.tempArr[index].isUpdated = updateStatus;
        this.setState({ data: this.state.data });
    }

    subscribeForMultiLevelGrouping(){
        // this.refs.tableViewRef.subscribeForMultiLevelGrouping();
        this.refs.tableViewRef.clearGrouping();
    }

    render() {
        return (
            <div>
                <div className={styles.container}>
                    <h1 className={styles.header}>Random Data from AMPS</h1>
                    <label className={styles.label}>  SUBSCRIPTION TOPIC : {this.subscribedTopic}</label>
                    <button className={styles.button} onClick={this.subscribeForMultiLevelGrouping.bind(this)}>CLEAR GROUPING</button>
                    <label style={{ float: 'right' }}>{!this.isGroupedView ? 'Showing ' + this.lowerLimit + '-' + this.upperLimit + ' of ' + this.dataMap.size : ''}</label>
                </div>
                <div>
                    <TableView viewableData={this.state.viewableData}
                        ref='tableViewRef'
                        subscribedTopic={this.subscribedTopic}
                        rowHeight={this.rowHeight} />
                </div>
            </div>
        );

    }

}

export default App;