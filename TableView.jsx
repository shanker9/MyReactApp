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


    componentDidMount() {

    }

    componentDidUpdate() {
    }


    tableRefresh() {
        this.forceUpdate();
    }

    updateTableView(updatedData) {
        // console.log('NEW DATA: \n' + this.printNewData(updatedData));
        let rowData = { "rowID": this.rowIndex++, "data": updatedData };
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
        this.topDivHeight = initialIndex == 0 ? 0 : (initialIndex - 1) * 20; // 20 is the height of each row

        let lastDisplayableRowIndex = this.state.viewableData[this.state.viewableData.length - 1];
        this.bottomDivHeight = (this.state.data.length - (lastDisplayableRowIndex.rowID + 1)) * 20;
        // this.bottomDivHeight = scrollHeight-(this.state.viewableData.length*20 + this.topDivHeight);

        this.props.recordsHandler(this.state.data.length, this.state.viewableData.length); // For debugging purposes
    }

    render() {
        // let tempArr = Array.from(this.state.viewableData);
        // let viewableRows = tempArr.slice(0);
        // console.log('Viewable Data Count:' + viewableRows);
        return (
            <div>
                <table className={styles.table}>
                    <tbody className={styles.tableBody} >
                        <div style={{ height: this.props.topDivHeight }}></div>
                        {this.props.viewableData.map((item, i) => <TableRow key={item.rowID} data={item.data} indexVal ={item.rowID}/>)}
                        <div style={{ height: this.props.bottomDivHeight }}></div>
                    </tbody>
                </table>
            </div>

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