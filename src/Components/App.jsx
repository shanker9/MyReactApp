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

    // componentWillMount() {
    //     // this.handleClick();
    // }

    // componentDidMount() {
    //     this.scrollableDivClientHeight = document.getElementById('scrollableTableDiv').clientHeight;
    // }

    // /** END OF LIFE CYCLE METHODS */

    // rowDataUpdateStatus(index, updateStatus) {
    //     this.tempArr[index].isUpdated = updateStatus;
    //     this.setState({ data: this.state.data });
    // }

    clearGrouping(){
        // this.refs.tableViewRef.subscribeForMultiLevelGrouping();
        this.refs.tableViewRef.clearGrouping();
    }

    render() {
        return (
            <div>
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