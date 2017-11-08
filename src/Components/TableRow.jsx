import React from 'react';
import TableCell from './TableCell.jsx';
import styles from '../../styles/AppStyles.css';
import format from 'format-number';

class TableRow extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isSelected: this.props.selectState,
            shouldAnimate: false,
            data: props.data,
            columnOrder: this.props.columnKeyValues,
        }
        this.dynamicBackgroundColor = undefined;
        this.handleRowClick = this.handleRowClick.bind(this);
    }

    handleRowClick(e) {
        e.preventDefault();
        console.log('Is Ctrl Pressed: ' + e.shiftKey);
        this.props.selectionDataUpdateHandler(this.props.indexVal, e); // Update the selection state in the data
    }

    triggerUpdate(newdata, selectState) {
        this.setState({ data: newdata, isSelected: selectState });
    }

    formatNumber(number) {
        let myFormat = format({ prefix: '$', integerSeparator: ',' });
        let formattedNum = myFormat(number);
        return formattedNum;
    }

    getCellDataForKey(data, key) {
        let result;
        if (data.values.values[key] == undefined) {
            if (data.key[key] == undefined) { return '' }
            else {
                result = data.key[key];
            }
        } else {
            let val = data.values.values[key];
            if (val.hasOwnProperty('strVal')) {
                result = val['strVal'];
            } else if (val.hasOwnProperty('dtVal')) {
                result = val['dtVal']['str'];
            } else if (val.hasOwnProperty('dblVal')) {
                result = val['dblVal'];
            }
        }

        if ((key === 'receivePrice' || key === 'price' || key === 'payPrice') && result !== null) {
            return this.formatNumber(result.toFixed(2));
        }
        return result;
    }

    render() {
        this.dynamicBackgroundColor = this.state.isSelected ? '#7cb6ff' : this.props.isRowColored ? '#edeff2':'#FFFFFF';

        return (
            <tr ref={"tableRow"}
                className={styles.tableGridRow}
                onClick={this.handleRowClick}
                style={{ backgroundColor: this.dynamicBackgroundColor }}>
                {this.props.isGroupedView ? <td className={styles.tdGroupedView}></td> : <tspan />}
                {
                    this.state.columnOrder.map((item, i) => {
                        return <TableCell parentBackgroundColor={this.dynamicBackgroundColor}
                            cellData={this.getCellDataForKey(this.state.data, item.columnkey)}></TableCell>
                    })
                }
            </tr>
        )
    }

}



export default TableRow;