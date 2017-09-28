import React from 'react';
import AppController from '../Controllers/AppController.js';
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
            subscriberId: '',
            totalRecords: 0,
            lastRow: 0,
            loadedRows: 0,
            loadTime: 0,
            currentSelectedRowIndex: undefined,
            viewableStartIndex: 0
        }
        this.handleClick = this.handleClick.bind(this);
        this.handleScroll = this.handleScroll.bind(this);
        this.updateLoadData = this.updateLoadData.bind(this);
        this.sliceLoadableData = this.sliceLoadableData.bind(this);
        this.rowDataUpdateStatus = this.rowDataUpdateStatus.bind(this);
        this.sliceHashmap = this.sliceHashmap.bind(this);
        this.triggerConditionalUIUpdate = this.triggerConditionalUIUpdate.bind(this);
        this.createGroupBuckets = this.createGroupBuckets.bind(this);
        this.updateAggregatedRowExpandStatus = this.updateAggregatedRowExpandStatus.bind(this);
        this.getViewableStartIndex = this.getViewableStartIndex.bind(this);
        this.formGroupedData = this.formGroupedData.bind(this);
        this.rowUpdate = this.rowUpdate.bind(this);
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
        // this.viewableStartIndex=0;
        // this.currentSelectedRowIndex = undefined;
    }

    /** START OF LIFE CYCLE METHODS */

    componentWillMount() {
        this.handleClick();
    }

    componentDidMount() {
        this.scrollableDivClientHeight = document.getElementById('scrollableTableDiv').clientHeight;
    }

    /** END OF LIFE CYCLE METHODS */



    updateSubId(subId) {
        this.setState({ subscriberId: subId })
    }


    handleClick() {
        this.controller = new AppController(this);
        let commandObject = {
            "command": "sow_and_subscribe",
            "topic": "Price",
            "filter": "/swapId >=0 AND /swapId<=5000",
            "orderBy": "/swapId"
        }

        // this.controller.connectAndSubscribe(this.handleNewData.bind(this), this.updateSubId.bind(this), commandObject);
        this.controller.ampsSubscribe(commandObject,this.handleNewData.bind(this), this.updateSubId.bind(this));
    }

    rowDataUpdateStatus(index, updateStatus) {
        this.tempArr[index].isUpdated = updateStatus;
        this.setState({ data: this.state.data });
    }

    /* New Data from AMPS will be handled here first */

    handleNewData(message) {
        if (message.c == 'group_begin') {
            console.log(message.c);
            return;
        } else if (message.c == 'group_end') {
            this.sowDataEnd = true;
            this.triggerConditionalUIUpdate();
            return;
        }

        let newData = message.data;
        let rowKey = message.k;
        let item = this.dataMap.get(rowKey);
        if (item == undefined) {
            this.dataMap.set(rowKey, { "rowID": newData.swapId - 1, "data": newData, "isSelected": false, "isUpdated": false });
        } else {
            this.dataMap.set(rowKey, { "rowID": item.rowID, "data": newData, "isSelected": item.isSelected, "isUpdated": true });
            this.rowUpdate(newData, 'ref' + item.rowID);
        }
        if (this.isGroupedView) {
            let grpObject = this.groupedData.get(this.valueKeyMap.get(message.data.customer));
            let existingData = grpObject.bucketData.get(message.k);
            existingData.data = message.data;
            // this.rowUpdate(rowKey);
        }

        // if (this.sowDataEnd)
        //     this.triggerConditionalUIUpdate();
    }

    triggerConditionalUIUpdate() {
        let startIndex;
        if (this.isGroupedView) {
            startIndex = this.getViewableStartIndex();
            this.setState({ viewableStartIndex: startIndex });
        } else {
            let loadableData = this.sliceLoadableData(this.dataMap);
            this.setState({ viewableData: loadableData });
        }
    }

    /* Event Handler for scroll */
    handleScroll() {

        let headerNode = document.getElementById('scrollableHeaderDiv');
        let tableNode = document.getElementById('scrollableTableDiv');

        headerNode.scrollLeft = tableNode.scrollLeft;

        this.triggerConditionalUIUpdate();
    }

    updateLoadData(map) {
        let approximateNumberOfRowsHidden = Math.round(document.getElementById('scrollableTableDiv').scrollTop / this.rowHeight)
        return this.sliceLoadableData(approximateNumberOfRowsHidden, approximateNumberOfRowsHidden + 50, map);
    }

    getViewableStartIndex() {
        return Math.round(document.getElementById('scrollableTableDiv').scrollTop / this.rowHeight);
    }

    sliceLoadableData(map) {
        let approximateNumberOfRowsHidden = this.getViewableStartIndex();

        let loadableData = this.sliceHashmap(approximateNumberOfRowsHidden, approximateNumberOfRowsHidden+50, map);
        this.topDivHeight = approximateNumberOfRowsHidden * this.rowHeight;
        this.bottomDivHeight = (map.size - (approximateNumberOfRowsHidden + loadableData.length)) * this.rowHeight;
        this.lowerLimit = approximateNumberOfRowsHidden + 1;
        let displayableRecordCount = Math.floor((this.scrollableDivClientHeight - 1 * this.rowHeight) / this.rowHeight);
        let upperRowLimit = this.lowerLimit + displayableRecordCount;
        this.upperLimit = displayableRecordCount > loadableData.length ? loadableData.length : upperRowLimit;

        return loadableData;
    }

    sliceHashmap(startIndex, endIndex, map) {

        let iter = map.keys();
        let i = 0, result = [], availableEndIndex;
        availableEndIndex = endIndex > map.size ? map.size : endIndex;

        for (; i < startIndex; i++) {
            iter.next();
        }
        for (; i < availableEndIndex; i++) {
            result.push(map.get(iter.next().value));
        }

        return result;
    }

    /*** GROUP DATA HANDLING ***/

    groupedDataHandle(message) {

        if (message.c == 'group_begin') {
            return;
        } else if (message.c == 'group_end') {
            this.sowGroupDataEnd = true;
            this.createGroupBuckets();
            this.isGroupedView = true;
            this.triggerConditionalUIUpdate();
            return;
        }

        if (this.sowGroupDataEnd) {
            let val = this.groupedData.get(message.k);
            let groupHeaderRow = JSON.parse(JSON.stringify(val.groupData));
            groupHeaderRow.swap_rate = message.data.swap_rate;
            groupHeaderRow.payFixedRate = message.data.payFixedRate;
            val.groupData = groupHeaderRow;
            // this.triggerConditionalUIUpdate();
            this.rowUpdate(val.groupData, 'ref' + message.k);
        } else {
                this.groupedData.set(message.k, message.data);
                this.valueKeyMap.set(message.data.customer, message.k);
        }
    }

    createGroupBuckets() {
        let resultMap = new Map();
        let uniqueColumnValueBuckets = new Map();
        // let columnKeyIterator = this.valueKeyMap.keys();

        this.valueKeyMap.forEach(function (item, key, mapObj) {
            uniqueColumnValueBuckets.set(key, new Map());
        });
        let groupKey, groupVal;
        this.dataMap.forEach((item, key, mapObj) => {
            groupKey = this.valueKeyMap.get(item.data.customer);
            groupVal = this.groupedData.get(groupKey).groupData == undefined ? this.groupedData.get(groupKey) : this.groupedData.get(groupKey).groupData;
            uniqueColumnValueBuckets.get(item.data.customer).set(key, item)
            this.groupedData.set(groupKey, { "groupData": groupVal, "bucketData": uniqueColumnValueBuckets.get(item.data.customer), "showBucketData": false });
        })

    }

    groupedDataSubscription(subId, groupingColumnName) {
        console.log('GROUPEDSUBSCRIPTION ID:', subId);
        this.subscriptionData.set(groupingColumnName, subId);
    }

    updateAggregatedRowExpandStatus(groupKey) {
        let expandStatus = this.groupedData.get(groupKey).showBucketData;
        this.groupedData.get(groupKey).showBucketData = !expandStatus;
        this.triggerConditionalUIUpdate();
    }

    formGroupedData(columnName) {
        let commandObject, groupingColumnKey;
        let subscriptionId = this.subscriptionData.get(columnName);
        if (subscriptionId != undefined) {
            this.controller.unsubscribe(subscriptionId);
            this.subscriptionData.delete(columnName);
            this.toggleNormalView();
            return;
        }

        switch (columnName) {
            case 'Counter Party':
                commandObject = {
                    "command": "sow_and_subscribe",
                    "topic": "Price",
                    "filter": "/swapId >=0",
                    "orderBy": "/swapId",
                    "options": "projection=[/customer,/swapId,/interest,sum(/swap_rate) as /swap_rate,/yearsIn,/payFixedRate,/payCurrency],grouping=[/customer]"
                }
                groupingColumnKey = 'customer';
                break;
            case 'SwapId':
                commandObject = {
                    "command": "sow_and_subscribe",
                    "topic": "Price",
                    "filter": "/swapId >=0",
                    "orderBy": "/swapId",
                    "options": "projection=[/customer,/swapId,/interest,sum(/swap_rate) as /swap_rate,/yearsIn,/payFixedRate,/payCurrency],grouping=[/swapId]"
                }
                groupingColumnKey = 'swapId';
                break;
            default:
                console.log('Grouping cannot be done with the selected column');
                return;
        }
        // let commandObject = {
        //     "command": "sow_and_subscribe",
        //     "topic": "Price",
        //     "filter": "/swapId >=0",
        //     "orderBy": "/swapId",
        //     "options": "projection=[/customer,/swapId,/interest,sum(/swap_rate) as /swap_rate,/yearsIn,/payFixedRate,/payCurrency],grouping=[/customer]"
        // }

        this.controller.ampsSubscribe(commandObject, this.groupedDataHandle.bind(this), this.groupedDataSubscription.bind(this), columnName);
    }

    toggleNormalView() {
        this.isGroupedView = false;
        this.sowGroupDataEnd = false;
        this.triggerConditionalUIUpdate();
    }

    rowUpdate(data, rowReference) {
        // let newdata = this.dataMap.get(rowKey);
        // let rowReference = 'ref' + newdata.rowID;
        let rowElem = this.refs.tableViewRef.refs.gridViewRef.refs[rowReference];
        if (rowElem != undefined) {
            rowElem.triggerUpdate(data);
        }
    }



    render() {
        return (
            <div>
                <div className={styles.container}>
                    <h1 className={styles.header}>Random Data from AMPS</h1>
                    <label>  Subscriber Id : {this.state.subscriberId}</label>
                    <label> | Total Records: {this.dataMap.size}</label>
                    <label> | Loaded Records: {this.state.viewableData.length}</label>
                    <label onClick={this.formGroupedData.bind(this)}> | Grouped View </label>
                    <label onClick={this.toggleNormalView.bind(this)}> | Normal View</label>
                    <label style={{ float: 'right' }}>{!this.isGroupedView ? 'Showing ' + this.lowerLimit + '-' + this.upperLimit + ' of ' + this.dataMap.size : ''}</label>
                </div>
                <div>
                    <TableView viewableData={this.state.viewableData}
                        ref='tableViewRef'
                        isGroupedData={this.isGroupedView}
                        groupedData={this.groupedData}
                        topDivHeight={this.topDivHeight}
                        bottomDivHeight={this.bottomDivHeight}
                        selectionDataUpdateHandler={this.updateSelected}
                        dataUpdateStatus={this.rowDataUpdateStatus}
                        handleScroll={this.handleScroll}
                        updateAggregatedRowExpandStatus={this.updateAggregatedRowExpandStatus}
                        viewableStartIndex={this.state.viewableStartIndex}
                        groupingHandler={this.formGroupedData} />
                </div>
            </div>
        );

    }

}

export default App;