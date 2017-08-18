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
        this.newDataForScroll = this.newDataForScroll.bind(this);
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

    refreshInterval() {
        // setInterval(() => {
        //     this.forceUpdate();
        // }, 5000)
        // this.forceUpdate();
        console.log('DATA SIZE',this.state.data.length);
    }

    tableRefresh(){
        this.forceUpdate();
    }

    updateTableView(updatedData) {
        // this.state.data.push(updatedData);
        console.log('NEW DATA: \n' + this.printNewData(updatedData));
        // this.setState({ data: this.state.data.concat(updatedData) }, () => {
        //     this.props.recordsHandler(this.state.data.length);
        // });
            this.props.scrollHandler();
            this.setState({ data: this.state.data.concat(updatedData) }, () => {
                this.props.recordsHandler(this.state.data.length,this.state.viewableData.length);
            });
        // this.state.data.push(updatedData);
    }

    printNewData(data) {
        return 'Customer: ' + data.customer + ' swapId: ' + data.swapId + ' interest: ' + data.interest;
    }

    newDataForScroll(initialIndex,rowCount) {
        let tempArr = Array.from(this.state.data);
        this.state.viewableData = tempArr.slice(initialIndex,rowCount);
        console.log("VIEWABLE DATA",this.state.viewableData.length);
    }

    render() {
        let tempArr = Array.from(this.state.viewableData);
        let viewableRows = tempArr.slice(0);
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
                <tbody className={styles.tableBody}>
                    {this.state.viewableData.map((item, i) => <TableRow key={i} data={item} />)}
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