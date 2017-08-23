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
            loadedRows: 0
        }
        this.handleClick = this.handleClick.bind(this);
        this.updateTable = this.updateTable.bind(this);
        this.handleScroll = this.handleScroll.bind(this);
        this.updateLoadData = this.updateLoadData.bind(this);
        this.sliceLoadableData = this.sliceLoadableData.bind(this);
        this.udpateTotalRecords = this.udpateTotalRecords.bind(this);
        this.addScrollOffset = true;
        this.previousScrollTop = 0;
        this.rowIndex = 0;
    }

    componentDidMount() {
        this.state.lastRow = 30;
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
    }

    udpateTotalRecords(totalRecordsCount, loadedRecordsCount) {
        // this.setState({ 
        this.state.totalRecords = totalRecordsCount;
        this.state.loadedRows = loadedRecordsCount;
        this.state.lastRow = loadedRecordsCount;
        // });
    }

    handleClick() {
        let controller = new AmpsClientData();
        // controller.connectAndSubscribe(this.child.updateTableView.bind(this.child), this.updateSubId.bind(this),
        // this.udpateTotalRecords.bind(this));
        // controller.testData(this.child.updateTableView.bind(this.child));
        controller.testData(this.handleNewData.bind(this));

    }

    updateLastRow(lastRowIndex) {
        this.state.lastRow = lastRowIndex;
    }

    /* New Data from AMPS will be handled here first */

    handleNewData(newData) {
        let rowData = { "rowID": this.rowIndex++, "data": newData };
        // this.state.data = this.state.data.concat(rowData); // Adding the received row data to the data array
        // var tempArr = this.state.data.slice(0);
        this.state.data[this.rowIndex-1] = rowData;
        // this.state.data = tempArr;
        this.updateLoadData();

        // if (this.state.data.length <= 100) {  // Checking the available records length
        this.setState({ data: this.state.data }, () => {
            // this.props.recordsHandler(this.state.data.length, this.state.viewableData.length); //For Debugging Purpose
            this.udpateTotalRecords(this.state.data.length, this.state.viewableData.length); //For Debugging Purpose
        });
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
        console.log('ScrollTop Value: ' + node.scrollTop);
        let scrolledDistance = node.scrollTop;
        let rowHeight = 30;
        let approximateNumberOfRowsHidden = Math.floor(scrolledDistance / rowHeight) == 0 ? 0 : Math.floor(scrolledDistance / rowHeight);// NEED TO DO THIS -1 FROM CALCULATION ONCE HEADERROW GOES OUT OF SCROLLAREA
        this.sliceLoadableData(approximateNumberOfRowsHidden, approximateNumberOfRowsHidden + 20);

    }

    sliceLoadableData(initialIndex, lastDisplayRow) {
        this.state.viewableData = this.state.data.slice(initialIndex, lastDisplayRow);
        this.topDivHeight = initialIndex * 30;
        let lastDisplayableRowIndex = this.state.viewableData[this.state.viewableData.length - 1];
        this.bottomDivHeight = (this.state.data.length - (lastDisplayableRowIndex.rowID + 1)) * 30;
        // this.udpateTotalRecords(this.state.data.length, this.state.viewableData.length); // For debugging purposes
    }


    render() {

        return (
            <div className={styles.container}>
                <h1 className={styles.header}>Random Data from AMPS</h1>
                <button className={styles.button} onClick={this.handleClick.bind(this)}>Subscribe</button>
                <label>Total Records: {this.state.totalRecords}</label>
                <label>  Subscriber Id : {this.state.subscriberId}</label>
                <label> Loaded Records: {this.state.loadedRows}</label>
                {/* <button onClick={this.refreshChildTable.bind(this)}>setRefreshInterval</button>   */}
                {/* <div> */}
                    <div id="scrollableHeaderDiv" className={styles.containerDiv}>
                            <table className={styles.table}>
                                <thead className={styles.tableHead}>
                                    <tr className={styles.tableRow}>
                                        <th className={styles.th}>Customer</th>
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
                {/* </div> */}
                <div>
                    <div id="scrollableTableDiv" className={styles.tableDiv} onScroll={this.handleScroll.bind(this)}>
                        <TableView viewableData={this.state.viewableData} topDivHeight={this.topDivHeight} bottomDivHeight={this.bottomDivHeight} />
                    </div>
                </div>

            </div>
        );

    }

}

export default App;