import React from 'react';
import AmpsClientData from './AmpsData.js';
import TableRow from './TableRow.jsx';
import TableView from './TableView.jsx';
import styles from './AppStyles.css'

class App extends React.Component {

    constructor() {
        super();

        this.state = {
            data: [],
            viewableData: [],
            subscriberId: '',
            totalRecords: 0,
            lastRow: 0,
            loadedRows: 0,
            loadTime: 0
        }
        this.handleClick = this.handleClick.bind(this);
        this.updateTable = this.updateTable.bind(this);
        this.handleScroll = this.handleScroll.bind(this);
        this.updateLoadData = this.updateLoadData.bind(this);
        this.sliceLoadableData = this.sliceLoadableData.bind(this);
        this.addScrollOffset = true;
        this.previousScrollTop = 0;
        this.rowIndex = 0;
        this.rowHeight = 30;
        this.lowerLimit = undefined;
        this.upperLimit = undefined;
        this.scrollableDivClientHeight = undefined;
    }

    componentDidMount() {
        // this.state.lastRow = 30;
        let tableNode = document.getElementById('scrollableTableDiv');
        this.scrollableDivClientHeight = tableNode.clientHeight;
        this.handleClick();
    }

    updateTable(updateData, subId) {
        if (typeof updateData == 'object') {
            // this.state.data.unshift(updateData); // pushing the data without any update logic
            // let latestData = this.state.data;
            let latestRecords = this.state.totalRecords + 1;
            console.log('total records: ' + latestRecords);
            this.setState({ data: this.state.data.unshift(updateData), totalRecords: latestRecords, subscriberId: '  Subscriber Id: ' + subId })
        }
    }

    updateSubId(subId) {
        this.setState({ subscriberId: subId })
        // this.state.subscriberId = subId;
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
        let startTimeVal = Date.now().toString();
        // console.log('Start Time: ', startTimeVal);
        let endTimeVal = controller.testData(this.handleNewData.bind(this));
        this.setState({
            loadTime: endTimeVal - startTimeVal
        })
    }

    // updateLastRow(lastRowIndex) {
    //     this.state.lastRow = lastRowIndex;
    // }

    /* New Data from AMPS will be handled here first */

    handleNewData(newData) {
        let rowData = { "rowID": this.rowIndex++, "data": newData };
        // this.state.data = this.state.data.concat(rowData); // Adding the received row data to the data array
        // var tempArr = this.state.data.slice(0);
        this.state.data[this.rowIndex - 1] = rowData;
        // this.state.data = tempArr;
        this.updateLoadData();

        // if (this.state.data.length <= 100) {  // Checking the available records length
        this.setState({ data: this.state.data });
    }

    handleScroll() {
        let headerNode = document.getElementById('scrollableHeaderDiv');
        let tableNode = document.getElementById('scrollableTableDiv');

        headerNode.scrollLeft = tableNode.scrollLeft;

        this.updateLoadData();
        this.forceUpdate();
    }

    updateLoadData() {
        let node = document.getElementById('scrollableTableDiv');
        // console.log('ScrollTop Value: ' + node.scrollTop);
        let scrolledDistance = node.scrollTop;
        // this.rowHeight = 30;
        let approximateNumberOfRowsHidden = Math.floor(scrolledDistance / this.rowHeight) == 0 ? 0 : Math.floor(scrolledDistance / this.rowHeight);// NEED TO DO THIS -1 FROM CALCULATION ONCE HEADERROW GOES OUT OF SCROLLAREA
        this.sliceLoadableData(approximateNumberOfRowsHidden, approximateNumberOfRowsHidden + 50);

    }

    sliceLoadableData(initialIndex, lastDisplayRow) {
        this.state.viewableData = this.state.data.slice(initialIndex, lastDisplayRow);
        this.topDivHeight = initialIndex * this.rowHeight;
        let lastDisplayableRowIndex = this.state.viewableData[this.state.viewableData.length - 1];
        this.bottomDivHeight = (this.state.data.length - (lastDisplayableRowIndex.rowID + 1)) * this.rowHeight;
        this.lowerLimit = this.state.viewableData[0].rowID+1;
        this.upperLimit = this.lowerLimit + Math.floor((this.scrollableDivClientHeight-1*this.rowHeight)/this.rowHeight);
        // this.udpateTotalRecords(this.state.data.length, this.state.viewableData.length); // For debugging purposes
    }


    render() {

        return (
            <div>
                <div className={styles.container}>
                    <h1 className={styles.header}>Random Data from AMPS</h1>
                    {/* <button className={styles.button} onClick={this.handleClick.bind(this)}>Subscribe</button> */}
                    <label>  Subscriber Id : {this.state.subscriberId}</label>
                    <label> | Total Records: {this.state.data.length}</label>
                    <label> | Loaded Records: {this.state.viewableData.length}</label>
                    {/* <label> | Load Time : {this.state.loadTime}ms</label> */}
                    <label style={{ float: 'right'}}>Showing {this.lowerLimit}-{this.upperLimit} of {this.state.data.length}</label>
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
                                <TableView viewableData={this.state.viewableData} topDivHeight={this.topDivHeight} bottomDivHeight={this.bottomDivHeight} />
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        );

    }

}

export default App;