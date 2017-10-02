import React from 'react';
import TableCell from './TableCell.jsx';
import TableRow from './TableRow.jsx'
import styles from '../../styles/AppStyles.css'

class TableAggregatedRow extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isSelected: false,
            shouldAnimate: false,
            showBucketData: false,
            data : props.data
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

    triggerUpdate(newdata){
        this.setState({data: newdata})
    }

    render() {

        return (
                <tr ref={"tableRow"}
                    className={styles.tableRow}
                    onClick={this.handleRowClick}
                    style={{ backgroundColor: '#b8e3ef' }}>
                    <TableCell parentBackgroundColor={this.dynamicBackgroundColor} cellData={'> ' + this.state.data.customer} childStyle={{ textAlign: 'left', paddingLeft: '10px' }}></TableCell>
                    <TableCell parentBackgroundColor={this.dynamicBackgroundColor} cellData={this.state.data.swapId}></TableCell>
                    <TableCell parentBackgroundColor={this.dynamicBackgroundColor} cellData={this.state.data.interest}></TableCell>
                    <TableCell parentBackgroundColor={this.dynamicBackgroundColor} cellData={this.state.data.swap_rate}></TableCell>
                    <TableCell parentBackgroundColor={this.dynamicBackgroundColor} cellData={this.state.data.yearsIn}></TableCell>
                    <TableCell parentBackgroundColor={this.dynamicBackgroundColor} cellData={this.state.data.payFixedRate}></TableCell>
                    <TableCell parentBackgroundColor={this.dynamicBackgroundColor} cellData={this.state.data.payCurrency}></TableCell>
                    <TableCell parentBackgroundColor={this.dynamicBackgroundColor} cellData={this.state.data.yearsIn * 2}></TableCell>
                    <TableCell parentBackgroundColor={this.dynamicBackgroundColor} cellData={this.state.data.interest * 2}></TableCell>
                    <TableCell parentBackgroundColor={this.dynamicBackgroundColor} cellData={this.state.data.payCurrency}></TableCell>
                    <TableCell parentBackgroundColor={this.dynamicBackgroundColor} cellData={this.state.data.customer} childStyle={{ textAlign: 'left', paddingLeft: '10px' }}></TableCell>
                    <TableCell parentBackgroundColor={this.dynamicBackgroundColor} cellData={this.state.data.swapId}></TableCell>
                    <TableCell parentBackgroundColor={this.dynamicBackgroundColor} cellData={this.state.data.interest}></TableCell>
                    <TableCell parentBackgroundColor={this.dynamicBackgroundColor} cellData={this.state.data.yearsIn * 3}></TableCell>
                    <TableCell parentBackgroundColor={this.dynamicBackgroundColor} cellData={this.state.data.yearsIn}></TableCell>
                    <TableCell parentBackgroundColor={this.dynamicBackgroundColor} cellData={this.state.data.payCurrency}></TableCell>
                </tr>
        )
    }

}



export default TableAggregatedRow;