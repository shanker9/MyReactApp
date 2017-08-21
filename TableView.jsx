import React from 'react';
import TableRow from './TableRow.jsx';
import styles from './AppStyles.css';

class TableView extends React.Component {

    constructor() {
        super();

        this.state = {
            data: [],
            viewableData: []
        }
        this.printNewData = this.printNewData.bind(this);
        this.newDataForScroll = this.sliceLoadableData.bind(this);
        this.topDivHeight = 0;
        this.bottomDivHeight = 0;
        this.rowIndex = 0;
    }

    // shouldComponentUpdate(nextProps, nextState) {
    //     return true;
    // }

    componentDidMount() {
        this.props.onRef(this);
        // this.props.recordsHandler(this.state.data.size);
    }

    componentDidUpdate() {
        this.props.rowIndexHandler(this.state.viewableData.length);
    }


    tableRefresh() {
        this.forceUpdate();
    }

    updateTableView(updatedData) {
        // console.log('NEW DATA: \n' + this.printNewData(updatedData));
        let rowData = {"rowID":this.rowIndex++,"data":updatedData};
        this.state.data = this.state.data.concat(rowData); // Adding the received row data to the data array

        this.props.scrollStateHandler();

        // if (this.state.data.length <= 100) {  // Checking the available records length
            this.setState({ data: this.state.data }, () => {
                this.props.recordsHandler(this.state.data.length, this.state.viewableData.length); //For Debugging Purpose
            });

    }

    printNewData(data) {
        return 'Customer: ' + data.customer + ' swapId: ' + data.swapId + ' interest: ' + data.interest;
    }

    sliceLoadableData(initialIndex, lastDisplayRow) {
        this.state.viewableData = this.state.data.slice(initialIndex, lastDisplayRow);
        this.topDivHeight = initialIndex==0 ? 0 : (initialIndex-1)*20; // 20 is the height of each row

        let lastDisplayableRowIndex = this.state.viewableData[this.state.viewableData.length-1];
        this.bottomDivHeight = (this.state.data.length-(lastDisplayableRowIndex.rowID+1))*20;
        // this.bottomDivHeight = scrollHeight-(this.state.viewableData.length*20 + this.topDivHeight);

        this.props.recordsHandler(this.state.data.length, this.state.viewableData.length); // For debugging purposes
    }

    render() {
        // let tempArr = Array.from(this.state.viewableData);
        // let viewableRows = tempArr.slice(0);
        // console.log('Viewable Data Count:' + viewableRows);
        return (
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
                <tbody className={styles.tableBody} >
                    <div style={{ height: this.topDivHeight }}></div>
                    {this.state.viewableData.map((item, i) => <TableRow key={item.rowID} data={item.data} />)}
                    <div style={{ height: this.bottomDivHeight }}></div>
                </tbody>
            </table>

        );
    }
}
// export const tableViewStyles = {
//     td: {
//         border: '1px solid black',
//         width: '100px',
//         fontSize: 15
//     }
// }

export default TableView;