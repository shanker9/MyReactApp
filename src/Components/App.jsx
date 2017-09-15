import React from 'react';
import AmpsClientData from '../Amps/AmpsData.js';
import TableRow from './TableRow.jsx';
import TableView from './TableView.jsx';
import styles from '../../styles/AppStyles.css'
import GridView from './GridView.jsx'
var values=0;
class App extends React.Component {

    constructor() {
        super();

        this.state = {
            data: [],
            sortedData: [],
            viewableData: [],
            groupedData: [],
            selectedData: undefined,
            subscriberId: '',
            totalRecords: 0,
            lastRow: 0,
            loadedRows: 0,
            loadTime: 0,
            currentSelectedRowIndex: undefined
        }
        this.handleClick = this.handleClick.bind(this);
        this.handleScroll = this.handleScroll.bind(this);
        this.updateLoadData = this.updateLoadData.bind(this);
        this.sliceLoadableData = this.sliceLoadableData.bind(this);
        this.updateSelected = this.updateSelected.bind(this);
        this.rowDataUpdateStatus = this.rowDataUpdateStatus.bind(this);
        this.sliceHashmap = this.sliceHashmap.bind(this);
        this.triggerConditionalUIUpdate = this.triggerConditionalUIUpdate.bind(this);
        this.handleDataPricingResults = this.handleDataPricingResults.bind(this);
        this.createGroupBuckets = this.createGroupBuckets.bind(this);
        this.addScrollOffset = true;
        this.previousScrollTop = 0;
        this.rowIndex = 0;
        this.rowHeight = 30;
        this.lowerLimit = undefined;
        this.upperLimit = undefined;
        this.scrollableDivClientHeight = undefined;
        this.selectStart = undefined;
        this.selectEnd = undefined;
        this.isSorted = true;
        this.tempArr = [];
        this.dataMap = new Map();
        this.sowDataEnd = false;
        this.controller = undefined;
        this.groupedDataColumns = new Map();
        this.sowGroupDataEnd = false;
        this.valueKeyMap = new Map();
        // this.currentSelectedRowIndex = undefined;
    }

    componentWillMount() {
        this.handleClick();
    }

    componentDidMount() {
        // this.state.lastRow = 30;
        let tableNode = document.getElementById('scrollableTableDiv');
        this.scrollableDivClientHeight = tableNode.clientHeight;
    }

    updateSubId(subId) {
        this.setState({ subscriberId: subId })
    }

    updateSelected(index, isMultiSelect) {
        let i, selectedStart, selectedEnd;

        if (this.state.currentSelectedRowIndex !== undefined && isMultiSelect) {
            if (this.state.currentSelectedRowIndex < index)
                for (i = this.state.currentSelectedRowIndex; i <= index; i++) {
                    this.tempArr[i].isSelected = true;
                }
            else
                for (i = index; i <= this.state.currentSelectedRowIndex; i++) {
                    this.tempArr[i].isSelected = true;
                }
        } else {

            /* Deselecting the multiselected rows */
            if (this.state.selectedData !== undefined) {
                // this.state.data[this.state.currentSelectedRowIndex].isSelected = !this.state.data[this.state.currentSelectedRowIndex].isSelected;
                // selectedStart = this.state.data.indexOf(this.state.selectedData[0]);
                // selectedEnd = this.state.data.indexOf(this.state.selectedData[this.state.selectedData.length-1]);
                if (this.state.selectedData.length == 1 && this.state.selectedData[0] == this.tempArr[index]) {

                }
                else {
                    selectedStart = this.selectStart;
                    selectedEnd = this.selectEnd;
                    for (; selectedStart <= selectedEnd; selectedStart++) {
                        this.tempArr[selectedStart].isSelected = false;
                    }
                }
            }

            this.tempArr[index].isSelected = !this.tempArr[index].isSelected;

        }
        this.state.selectedData = this.tempArr.filter((row) => { return row.isSelected == true });
        this.selectStart = this.state.selectedData[0].rowID;
        this.selectEnd = this.state.selectedData[this.state.selectedData.length - 1].rowID;
        this.state.currentSelectedRowIndex = index;
        // this.setState({ currentSelectedRowIndex: index }, () => { console.log('stateUpdated'); });
        let loadableData = this.updateLoadData(this.tempArr);
        this.setState({ viewableData: loadableData, currentSelectedRowIndex: index });

    }

    handleClick() {
        this.controller = new AmpsClientData();
        // controller.connectAndSubscribe(this.handleNewData.bind(this), this.updateSubId.bind(this));
        // let commandObject = {
        //     "command": "sow_and_subscribe",
        //     "topic": "Price",
        //     "filter": "/swapId >=0",
        //     "orderBy": "/swapId",
        //     "options": "projection=[/customer,/swapId,/interest,sum(/swap_rate) as /swap_rate,/yearsIn,/payFixedRate,/payCurrency],grouping=[/customer]"
        // }

        let commandObject = {
            "command": "sow_and_subscribe",
            "topic": "Price",
            "filter": "/swapId >=0",
            "orderBy": "/swapId"
        }

        this.controller.connectAndSubscribe(this.handleNewData.bind(this), this.updateSubId.bind(this), commandObject);

    }

    rowDataUpdateStatus(index, updateStatus) {
        this.tempArr[index].isUpdated = updateStatus;
        this.setState({ data: this.state.data });
    }

    /* New Data from AMPS will be handled here first */

    handleNewData(message) {
        let messageStatus = this.handleDataPricingResults(message);

        if (messageStatus == 'group_end' || this.sowDataEnd == true) {
            this.triggerConditionalUIUpdate();
        }
    }

    handleDataPricingResults(message) {

        if (message.c == 'group_begin' || message.c == 'group_end') {
            console.log(message.c);
            return message.c;
        }

        let newData = message.data;
        // console.log('NEWDATA',JSON.stringify(newData));
        let rowKey = message.k;
        let item = this.dataMap.get(rowKey);
        if (item == undefined) {
            this.dataMap.set(rowKey, { "rowID": newData.swapId - 1, "data": newData, "isSelected": false, "isUpdated": false });
        } else {
            // if(values%100==0){
            //     console.log("====================================================================");
            // }
            this.dataMap.set(rowKey, { "rowID": item.rowID, "data": newData, "isSelected": item.isSelected, "isUpdated": true });
            values++;
        } 
    }


    triggerConditionalUIUpdate() {
        let loadableData = this.updateLoadData(this.dataMap);
        this.setState({ viewableData: loadableData });
        this.sowDataEnd = true;
    }

    /* Event Handler for scroll */
    handleScroll() {
        let headerNode = document.getElementById('scrollableHeaderDiv');
        let tableNode = document.getElementById('scrollableTableDiv');

        headerNode.scrollLeft = tableNode.scrollLeft;

        this.triggerConditionalUIUpdate();

    }

    updateLoadData(map) {
        let node = document.getElementById('scrollableTableDiv');
        // console.log('ScrollTop Value: ' + node.scrollTop);
        let scrolledDistance = node.scrollTop;
        let approximateNumberOfRowsHidden = Math.round(scrolledDistance / this.rowHeight) == 0 ? 0 : Math.round(scrolledDistance / this.rowHeight);// NEED TO DO THIS -1 FROM CALCULATION ONCE HEADERROW GOES OUT OF SCROLLAREA
        return this.sliceLoadableData(approximateNumberOfRowsHidden, approximateNumberOfRowsHidden + 50, map);

    }

    sliceLoadableData(initialIndex, lastDisplayRow, map) {


        let loadableData = this.sliceHashmap(initialIndex, lastDisplayRow, map);
        this.topDivHeight = initialIndex * this.rowHeight;
        this.bottomDivHeight = (map.size - (initialIndex + loadableData.length)) * this.rowHeight;
        this.lowerLimit = initialIndex + 1;
        let displayableRecordCount = Math.floor((this.scrollableDivClientHeight - 1 * this.rowHeight) / this.rowHeight);
        let upperRowLimit = this.lowerLimit + displayableRecordCount;
        this.upperLimit = displayableRecordCount > loadableData.length ? loadableData.length : upperRowLimit;

        return loadableData;
    }

    sliceHashmap(initialIndex, endIndex, map) {

        let iter = map.keys();
        let i = 0, result = [], availableEndIndex;
        availableEndIndex = endIndex > map.size ? map.size : endIndex;

        for (; i < initialIndex; i++) {
            iter.next();
        }
        for (; i < availableEndIndex; i++) {
            result.push(map.get(iter.next().value));
        }

        return result;
    }

    groupedDataHandle(message){

        if(message.c=='group_begin'){
            return ;
        }

        if(message.c=='group_end'){
            this.sowGroupDataEnd = true;
            this.createGroupBuckets();
            return ;
        }

        if(!this.sowGroupDataEnd){
            this.groupedDataColumns.set(message.k,message.data);
            this.valueKeyMap.set(message.data.customer,message.k);
        }

    }

    createGroupBuckets(){
        let resultMap = new Map();
        let uniqueColumnValueBuckets = new Map();
        let columnKeyIterator = this.valueKeyMap.keys();

        this.valueKeyMap.forEach(function (item, key, mapObj) {  
            uniqueColumnValueBuckets.set(key,[]);
        });
        let groupKey,groupVal;
        this.dataMap.forEach((item, key, mapObj) => {  
            groupKey = this.valueKeyMap.get(item.data.customer);
            groupVal = this.groupedDataColumns.get(groupKey).groupData == undefined ? this.groupedDataColumns.get(groupKey) : this.groupedDataColumns.get(groupKey).groupData;
            uniqueColumnValueBuckets.get(item.data.customer).push(item)
            this.groupedDataColumns.set(groupKey,{"groupData":groupVal, "bucketData":uniqueColumnValueBuckets.get(item.data.customer)});
        })
        console.log(this.groupedDataColumns);
    }

    groupedDataSubscription(subId){
        console.log('GROUPEDSUBSCRIPTION ID:',subId);
    }

    formGroupedData(){
        let commandObject = {
            "command": "sow",
            "topic": "Price",
            "filter": "/swapId >=0",
            "orderBy": "/swapId",
            "options": "projection=[/customer,/swapId,/interest,sum(/swap_rate) as /swap_rate,/yearsIn,/payFixedRate,/payCurrency],grouping=[/customer]"
        }

        this.controller.connectAndSubscribe(this.groupedDataHandle.bind(this),this.groupedDataSubscription.bind(this),commandObject);
    }

    render() {
        return (
            <div>
                <div className={styles.container}>
                    <h1 className={styles.header}>Random Data from AMPS</h1>
                    {/* <button className={styles.button} onClick={this.sortData.bind(this)}>Subscribe</button> */}
                    <label>  Subscriber Id : {this.state.subscriberId}</label>
                    <label> | Total Records: {this.dataMap.size}</label>
                    <label> | Loaded Records: {this.state.viewableData.length}</label>
                    <label onClick={this.formGroupedData.bind(this)}> | Grouped View </label>
                    <label style={{ float: 'right' }}>Showing {this.lowerLimit}-{this.upperLimit} of {this.dataMap.size}</label>
                </div>
                <div>
                    {/* <div className={styles.gridContainerDiv}>
                        <div id="scrollableHeaderDiv" className={styles.headerDiv}>
                            <table className={styles.table}>
                                <thead className={styles.tableHead}>
                                    <tr className={styles.tableRow}>
                                        <th className={styles.th}>Counter Party</th>
                                        <th className={styles.th}>SwapId</th>
                                        <th className={styles.th}>Interest</th>
                                        <th className={styles.th}>SwapRate</th>
                                        <th className={styles.th}>YearsIn</th>
                                        <th className={styles.th}>PayFixedRate</th>
                                        <th className={styles.th}>PayCurrency</th>
                                        <th className={styles.th}>YearsLeft</th>
                                        <th className={styles.th}>NewInterest</th>
                                        <th className={styles.th}>SecondaryCurrency</th>
                                        <th className={styles.th}>Customer</th>
                                        <th className={styles.th}>SwapId</th>
                                        <th className={styles.th}>Interest</th>
                                        <th className={styles.th}>YearsPay</th>
                                        <th className={styles.th}>YearsIn</th>
                                        <th className={styles.th}>FixedRate</th>
                                    </tr>
                                </thead>
                            </table>
                        </div>
                        <div>
                            <div id="scrollableTableDiv" className={styles.tableDiv} onScroll={this.handleScroll.bind(this)}>
                                <TableView viewType="GroupedView" viewableData={this.state.viewableData} topDivHeight={this.topDivHeight} bottomDivHeight={this.bottomDivHeight} selectionDataUpdateHandler={this.updateSelected} dataUpdateStatus={this.rowDataUpdateStatus} />
                            </div>
                        </div>
                    </div> */}
                    <TableView viewableData={this.state.viewableData}
                        groupedData={this.state.groupedData}
                        topDivHeight={this.topDivHeight}
                        bottomDivHeight={this.bottomDivHeight}
                        selectionDataUpdateHandler={this.updateSelected}
                        dataUpdateStatus={this.rowDataUpdateStatus}
                        handleScroll={this.handleScroll} />
                </div>
            </div>
        );

    }

}

export default App;