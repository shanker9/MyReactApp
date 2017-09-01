import React from 'react';
import AmpsClientData from '../Amps/AmpsData.js';
import TableRow from './TableRow.jsx';
import TableView from './TableView.jsx';
import styles from '../../styles/AppStyles.css'

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
        this.addScrollOffset = true;
        this.previousScrollTop = 0;
        this.rowIndex = 0;
        this.rowHeight = 30;
        this.lowerLimit = undefined;
        this.upperLimit = undefined;
        this.scrollableDivClientHeight = undefined;
        this.selectStart = undefined;
        this.selectEnd = undefined;
        this.isSorted = false;
        this.tempArr = [];
        // this.currentSelectedRowIndex = undefined;
    }

    componentDidMount() {
        // this.state.lastRow = 30;
        let tableNode = document.getElementById('scrollableTableDiv');
        this.scrollableDivClientHeight = tableNode.clientHeight;
        this.handleClick();
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
                    this.state.data[i].isSelected = true;
                }
            else
                for (i = index; i <= this.state.currentSelectedRowIndex; i++) {
                    this.state.data[i].isSelected = true;
                }
        } else {

            /* Deselecting the multiselected rows */
            if (this.state.selectedData !== undefined) {
                // this.state.data[this.state.currentSelectedRowIndex].isSelected = !this.state.data[this.state.currentSelectedRowIndex].isSelected;
                // selectedStart = this.state.data.indexOf(this.state.selectedData[0]);
                // selectedEnd = this.state.data.indexOf(this.state.selectedData[this.state.selectedData.length-1]);
                if (this.state.selectedData.length == 1 && this.state.selectedData[0] == this.state.data[index]) {

                }
                else {
                    selectedStart = this.selectStart;
                    selectedEnd = this.selectEnd;
                    for (; selectedStart <= selectedEnd; selectedStart++) {
                        this.state.data[selectedStart].isSelected = false;
                    }
                }
            }

            this.state.data[index].isSelected = !this.state.data[index].isSelected;

        }
        this.state.selectedData = this.state.data.filter((row) => { return row.isSelected == true });
        this.selectStart = this.state.selectedData[0].rowID;
        this.selectEnd = this.state.selectedData[this.state.selectedData.length - 1].rowID;
        this.state.currentSelectedRowIndex = index;
        this.setState({ data: this.state.data, currentSelectedRowIndex: index }, () => { console.log('stateUpdated'); });

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
        // controller.connectAndSubscribe(this.handleNewData.bind(this), this.updateSubId.bind(this));
        // controller.testData(this.child.updateTableView.bind(this.child));
        // let startTimeVal = Date.now().toString();
        // console.log('Start Time: ', startTimeVal);
        // let endTimeVal = 
        controller.testData(this.handleNewData.bind(this));
        // this.setState({
        //     loadTime: endTimeVal - startTimeVal
        // })
    }

    rowDataUpdateStatus(index,updateStatus) {
        this.tempArr[index].isUpdated = updateStatus;
        this.setState({data : this.state.data});
    }

    /* New Data from AMPS will be handled here first */

    handleNewData(newData) {
        // let rowData = { "rowID": this.rowIndex++, "data": newData, "isSelected": false };
        // this.tempArr = 
        if (this.tempArr[newData.swapId - 1] == undefined) {
            // if(this.state.data.findIndex((item)=>{item.data.swapId==newData.swapId}) == -1){
            let rowData = {
                "rowID": newData.swapId - 1, "data": newData,
                "isSelected": false, "isUpdated" : false
            };
            // this.state.data[newData.swapId - 1] = rowData;
            this.tempArr[newData.swapId-1] = rowData;
        }
        else {
            // const temp = this.state.data[newData.swapId - 1];
            const temp = JSON.parse(JSON.stringify(this.tempArr[newData.swapId-1]));
            temp.data.swap_rate = newData.swap_rate;
            temp.data.payFixedRate = newData.payFixedRate;
            temp.isUpdated = true;
            this.tempArr[newData.swapId-1] = temp;
        }
        let loadableData =  this.updateLoadData(this.tempArr);

        // if(this.state.data.length==50)
        this.setState({ viewableData : loadableData });
        // this.forceUpdate();
    }

    handleScroll() {
        let headerNode = document.getElementById('scrollableHeaderDiv');
        let tableNode = document.getElementById('scrollableTableDiv');

        headerNode.scrollLeft = tableNode.scrollLeft;

        this.updateLoadData();
        this.forceUpdate();
    }

    updateLoadData(array) {
        let node = document.getElementById('scrollableTableDiv');
        // console.log('ScrollTop Value: ' + node.scrollTop);
        let scrolledDistance = node.scrollTop;
        // this.rowHeight = 30;
        let approximateNumberOfRowsHidden = Math.round(scrolledDistance / this.rowHeight) == 0 ? 0 : Math.round(scrolledDistance / this.rowHeight);// NEED TO DO THIS -1 FROM CALCULATION ONCE HEADERROW GOES OUT OF SCROLLAREA
        return this.sliceLoadableData(approximateNumberOfRowsHidden, approximateNumberOfRowsHidden + 50,array);

    }

    sliceLoadableData(initialIndex, lastDisplayRow,dataArr) {

        // this.state.viewableData = this.isSorted ? this.state.sortedData.slice(initialIndex, lastDisplayRow) : this.state.data.slice(initialIndex, lastDisplayRow);
        // this.topDivHeight = initialIndex * this.rowHeight;
        // let lastDisplayableRowIndex = this.state.viewableData[this.state.viewableData.length - 1];
        // this.bottomDivHeight = (this.state.data.length - (lastDisplayableRowIndex.rowID + 1)) * this.rowHeight;
        // // this.lowerLimit = this.state.viewableData[0].rowID + 1;
        // this.lowerLimit = initialIndex + 1;
        // let upperRowLimit = this.lowerLimit + Math.floor((this.scrollableDivClientHeight - 1 * this.rowHeight) / this.rowHeight);
        // this.upperLimit = upperRowLimit > this.state.viewableData[this.state.viewableData.length - 1].rowID + 1 ? lastDisplayableRowIndex.rowID + 1 : upperRowLimit;
        // this.udpateTotalRecords(this.state.data.length, this.state.viewableData.length); // For debugging purposes

        let loadableData = this.isSorted ? this.state.sortedData.slice(initialIndex, lastDisplayRow) : dataArr.slice(initialIndex, lastDisplayRow);
        // loadableData = JSON.parse(JSON.stringify(loadableData));
        // loadableData[0].data.swap_rate = 10.45;
        this.topDivHeight = initialIndex * this.rowHeight;
        let lastDisplayableRowIndex = loadableData[loadableData.length - 1];
        this.bottomDivHeight = (dataArr.length - (lastDisplayableRowIndex.rowID + 1)) * this.rowHeight;
        // this.lowerLimit = this.state.viewableData[0].rowID + 1;
        this.lowerLimit = initialIndex + 1;
        let upperRowLimit = this.lowerLimit + Math.floor((this.scrollableDivClientHeight - 1 * this.rowHeight) / this.rowHeight);
        this.upperLimit = upperRowLimit > loadableData[loadableData.length - 1].rowID + 1 ? lastDisplayableRowIndex.rowID + 1 : upperRowLimit;

        return loadableData;
    }


    render() {
        // console.log('Parent Render Start');
        return (
            <div>
                <div className={styles.container}>
                    <h1 className={styles.header}>Random Data from AMPS</h1>
                    {/* <button className={styles.button} onClick={this.sortData.bind(this)}>Subscribe</button> */}
                    <label>  Subscriber Id : {this.state.subscriberId}</label>
                    <label> | Total Records: {this.tempArr.length}</label>
                    <label> | Loaded Records: {this.state.viewableData.length}</label>
                    {/* <label> | Load Time : {this.state.loadTime}ms</label> */}
                    <label style={{ float: 'right' }}>Showing {this.lowerLimit}-{this.upperLimit} of {this.tempArr.length}</label>
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
                                        <th className={styles.th}>PayFixedRate</th>
                                        <th className={styles.th}>SecondaryCurrency</th>
                                        <th className={styles.th}>Customer</th>
                                        <th className={styles.th}>SwapId</th>
                                        <th className={styles.th}>Interest</th>
                                        <th className={styles.th}>SwapRate</th>
                                        <th className={styles.th}>YearsIn</th>
                                        <th className={styles.th}>PayFixedRate</th>
                                    </tr>
                                </thead>
                            </table>
                        </div>
                        <div>
                            <div id="scrollableTableDiv" className={styles.tableDiv} onScroll={this.handleScroll.bind(this)}>
                                <TableView viewableData={this.state.viewableData} topDivHeight={this.topDivHeight} bottomDivHeight={this.bottomDivHeight} selectionDataUpdateHandler={this.updateSelected} dataUpdateStatus={this.rowDataUpdateStatus} />
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        );

    }

}

export default App;