import React from 'react';
import AmpsClientData from '../Amps/AmpsData.js';
import TableRow from './TableRow.jsx';
import TableView from './TableView.jsx';
import styles from '../../styles/AppStyles.css'
var values;
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
        // this.currentSelectedRowIndex = undefined;
    }

    componentWillMount(){
        this.handleClick();        
    }

    componentDidMount() {
        // this.state.lastRow = 30;
        let tableNode = document.getElementById('scrollableTableDiv');
        this.scrollableDivClientHeight = tableNode.clientHeight;
    }

    // updateTable(updateData, subId) {
    //     if (typeof updateData == 'object') {
    //         // this.state.data.unshift(updateData); // pushing the data without any update logic
    //         // let latestData = this.state.data;
    //         let latestRecords = this.state.totalRecords + 1;
    //         console.log('total records: ' + latestRecords);
    //         this.setState({ data: this.state.data.unshift(updateData), totalRecords: latestRecords, subscriberId: '  Subscriber Id: ' + subId })
    //     }
    // }

    updateSubId(subId) {
        this.setState({ subscriberId: subId })
        // this.state.subscriberId = subId;
    }

    sortData() {
        let sortedData = this.state.data.sort((a, b) => { return a.data.customer.toString().localeCompare(b.data.customer.toString()) });
        this.state.sortedData = sortedData;
        this.isSorted = true;
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

    // udpateTotalRecords(totalRecordsCount, loadedRecordsCount) {
    //     // this.setState({ 
    //     this.state.totalRecords = totalRecordsCount;
    //     this.state.loadedRows = loadedRecordsCount;
    //     this.state.lastRow = loadedRecordsCount;
    //     // });
    // }

    handleClick() {
        let controller = new AmpsClientData();
        controller.connectAndSubscribe(this.handleNewData.bind(this), this.updateSubId.bind(this));
        // let startTimeVal = Date.now().toString();
        // console.log('Start Time: ', startTimeVal);
        // let endTimeVal = 
        // controller.testData(this.handleNewData.bind(this));
        // this.setState({
        //     loadTime: endTimeVal - startTimeVal
        // })
    }

    rowDataUpdateStatus(index, updateStatus) {
        this.tempArr[index].isUpdated = updateStatus;
        this.setState({ data: this.state.data });
    }

    /* New Data from AMPS will be handled here first */

    handleNewData(message) {
        let messageStatus = this.handleDataPricingResults(message);
        // let newData = message;
        // let item = this.dataMap.get(newData.swapId);
        // if (item == undefined) {
        //     this.dataMap.set(newData.swapId, { "rowID": newData.swapId - 1, "data": newData, "isSelected": false, "isUpdated": false });
        // } else {
        //     this.dataMap.set(newData.swapId, { "rowID": item.rowID, "data": newData, "isSelected": item.isSelected, "isUpdated": true });
        // }
        if (messageStatus == 'group_end' || this.sowDataEnd==true){
            // if(this.dataMap.size==50)
            this.triggerConditionalUIUpdate();
        }
    }

    handleDataPricingResults(message) {

        if (message.c == 'group_begin') {
            console.log('Group Begin...');
            return;
        }
        if (message.c == 'group_end') {
            console.log('Group End...');
            return message.c;
        }
        let newData = message.data;
        let rowKey = message.k;
        let item = this.dataMap.get(rowKey);
        if (item == undefined) {
            this.dataMap.set(rowKey, { "rowID": newData.swapId - 1, "data": newData, "isSelected": false, "isUpdated": false });
        } else {
            this.dataMap.set(rowKey, { "rowID": item.rowID, "data": newData, "isSelected": item.isSelected, "isUpdated": true });
        }
    }


    triggerConditionalUIUpdate() {
        let loadableData = this.updateLoadData(this.dataMap);
        this.setState({ viewableData: loadableData });
        this.sowDataEnd = true;
    }


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
        // let keys = Array.from(hashMap.keys());
        // let availableEndIndex, i, result = [];
        // availableEndIndex = endIndex > keys.length ? keys.length : endIndex;

        // for (i = initialIndex; i < availableEndIndex; i++) {
        //     result.push(hashMap.get(keys[i]));
        // }

        // values = Array.from(hashMap.values());
        // let result = values.slice(initialIndex, endIndex);

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


    render() {
        return (
            <div>
                <div className={styles.container}>
                    <h1 className={styles.header}>Random Data from AMPS</h1>
                    {/* <button className={styles.button} onClick={this.sortData.bind(this)}>Subscribe</button> */}
                    <label>  Subscriber Id : {this.state.subscriberId}</label>
                    <label> | Total Records: {this.dataMap.size}</label>
                    <label> | Loaded Records: {this.state.viewableData.length}</label>
                    {/* <label> | Load Time : {this.state.loadTime}ms</label> */}
                    <label style={{ float: 'right' }}>Showing {this.lowerLimit}-{this.upperLimit} of {this.dataMap.size}</label>
                </div>
                <div>
                    <div className={styles.gridContainerDiv}>
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
                    </div>

                </div>
            </div>
        );

    }

}

export default App;