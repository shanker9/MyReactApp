import React from 'react';
import TableCell from './TableCell.jsx';
import TableRow from './TableRow.jsx'
import styles from '../../styles/AppStyles.css'

class TableAggregatedRow extends React.Component {

    constructor() {
        super();
        this.state = {
            isSelected: false,
            shouldAnimate: false,
            showBucketData: false
        }
        this.dynamicBackgroundColor = undefined;
        this.handleRowClick = this.handleRowClick.bind(this);
        this.displayBucketData = this.displayBucketData.bind(this);
    }

    displayBucketData(bucketData) {
        let result = [];
        if (this.state.showBucketData) {
            // return bucketData.map((value, k) =>
            // <TableRow
            //     key={value.rowID}
            //     data={value.data}
            //     indexVal={value.data.swapId}
            //     dataUpdateHandler={this.props.selectionDataUpdateHandler}
            //     selectState={value.isSelected} />)
            bucketData.forEach((value, key, mapObj) => {
                result.push(
                    <TableRow
                        key={value.rowID}
                        data={value.data}
                        indexVal={value.data.swapId}
                        dataUpdateHandler={this.props.selectionDataUpdateHandler}
                        selectState={value.isSelected} />)
            })
        }
        return result;
    }

    handleRowClick(e) {
        e.preventDefault();
        // this.setState({ showBucketData: !this.state.showBucketData })
        this.props.updateAggregatedRowExpandStatus(this.props.aggregatedRowKey);
    }


    render() {

        return (
            <div>
                <tr ref={"tableRow"}
                    className={styles.tableRow}
                    onClick={this.handleRowClick}
                    style={{ backgroundColor: '#b8e3ef' }}>
                    <TableCell parentBackgroundColor={this.dynamicBackgroundColor} cellData={'> ' + this.props.data.customer} childStyle={{ textAlign: 'left', paddingLeft: '10px' }}></TableCell>
                    <TableCell parentBackgroundColor={this.dynamicBackgroundColor} cellData={this.props.data.swapId}></TableCell>
                    <TableCell parentBackgroundColor={this.dynamicBackgroundColor} cellData={this.props.data.interest}></TableCell>
                    <TableCell parentBackgroundColor={this.dynamicBackgroundColor} cellData={this.props.data.swap_rate}></TableCell>
                    <TableCell parentBackgroundColor={this.dynamicBackgroundColor} cellData={this.props.data.yearsIn}></TableCell>
                    <TableCell parentBackgroundColor={this.dynamicBackgroundColor} cellData={this.props.data.payFixedRate}></TableCell>
                    <TableCell parentBackgroundColor={this.dynamicBackgroundColor} cellData={this.props.data.payCurrency}></TableCell>
                    <TableCell parentBackgroundColor={this.dynamicBackgroundColor} cellData={this.props.data.yearsIn * 2}></TableCell>
                    <TableCell parentBackgroundColor={this.dynamicBackgroundColor} cellData={this.props.data.interest * 2}></TableCell>
                    <TableCell parentBackgroundColor={this.dynamicBackgroundColor} cellData={this.props.data.payCurrency}></TableCell>
                    <TableCell parentBackgroundColor={this.dynamicBackgroundColor} cellData={this.props.data.customer} childStyle={{ textAlign: 'left', paddingLeft: '10px' }}></TableCell>
                    <TableCell parentBackgroundColor={this.dynamicBackgroundColor} cellData={this.props.data.swapId}></TableCell>
                    <TableCell parentBackgroundColor={this.dynamicBackgroundColor} cellData={this.props.data.interest}></TableCell>
                    <TableCell parentBackgroundColor={this.dynamicBackgroundColor} cellData={this.props.data.yearsIn * 3}></TableCell>
                    <TableCell parentBackgroundColor={this.dynamicBackgroundColor} cellData={this.props.data.yearsIn}></TableCell>
                    <TableCell parentBackgroundColor={this.dynamicBackgroundColor} cellData={this.props.data.payCurrency}></TableCell>
                </tr>
            </div>
        )
    }

}



export default TableAggregatedRow;