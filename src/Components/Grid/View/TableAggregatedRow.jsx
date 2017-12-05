import React from 'react';
import TableCell from './TableCell.jsx';
import TableRow from './TableRow.jsx';
import styles from '../../../../styles/AppStyles.css'
import RowController from '../../../Controllers/RowController.js';

class TableAggregatedRow extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isSelected: false,
            shouldAnimate: false,
            showBucketData: false,
            data: props.data,
            columnOrder: this.props.columnKeyValues,
            expandStatus : this.props.selectState
        }

        this.controller = new RowController();

        this.dynamicBackgroundColor = undefined;
        this.handleRowClick = this.handleRowClick.bind(this);
        // this.displayBucketData = this.displayBucketData.bind(this);
    }

    handleRowClick(e) {
        e.preventDefault();
        // this.setState({ showBucketData: !this.state.showBucketData })
        this.props.updateAggregatedRowExpandStatus(this.props.aggregatedRowKey);
        this.setState({expandStatus: !this.state.expandStatus});
    }

    triggerUpdate(newdata) {
        this.setState({ data: newdata })
    }

    render() {
        return (
            <tr ref={"tableRow"}
                className={styles.tableRow}
                onClick={this.handleRowClick}
                style={{ backgroundColor: '#ededed' }}>
                <td className={styles.tdGroupedView}>{this.state.expandStatus?'-':'+'}</td>
                {
                    this.state.columnOrder.map((item, i) => {
                        return (
                            <TableCell key={i} parentBackgroundColor={this.dynamicBackgroundColor}
                                cellData={this.controller.getCellValueUsingColumnKeyFromData(item.columnkey, this.state.data)}></TableCell>
                        );
                    })
                }
            </tr>
        )
    }

}



export default TableAggregatedRow;