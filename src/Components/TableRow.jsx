import React from 'react';
import TableCell from './TableCell.jsx';
import styles from '../../styles/AppStyles.css'

class TableRow extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isSelected: false,
            shouldAnimate: false,
            data: props.data
        }
        this.dynamicBackgroundColor = undefined;
        this.handleRowClick = this.handleRowClick.bind(this);
    }

    componentWillMount() {
        this.state.isSelected = this.props.selectState;
        // this.dynamicBackgroundColor = this.state.isSelected ? '#8593A4' : 'white';
        this.dynamicBackgroundColor = '#FCFCF5';
    }

    componentWillReceiveProps(nextProps) {
        this.state.isSelected = nextProps.selectState;
    }

    componentWillUpdate() {
        // this.state.shouldAnimate = true;
        this.dynamicBackgroundColor = this.state.isSelected ? '#8593A4' : '#FCFCF5';
    }

    handleRowClick(e) {
        e.preventDefault();
        console.log('Is Ctrl Pressed: ' + e.shiftKey);
        this.props.dataUpdateHandler(this.props.indexVal, e.shiftKey); // Update the selection state in the data
        if (this.props.isGroupedRow) {

        }
    }

    triggerUpdate(newdata) {
        this.setState({ data: newdata })
    }

    render() {
        let dataValues = this.state.data.values.values;
        let dataKey = this.state.data.key;
        return (
            <tr ref={"tableRow"}
                className={styles.tableGridRow}
                onClick={this.handleRowClick}
                style={{ backgroundColor: this.props.isGroupedRow ? '#144C5A' : this.dynamicBackgroundColor }}>
                <TableCell parentBackgroundColor={this.dynamicBackgroundColor}
                    cellData={dataValues.lastUpdate == undefined ? '' : dataValues.lastUpdate.dtVal.str}></TableCell>
                <TableCell parentBackgroundColor={this.dynamicBackgroundColor}
                    cellData={dataValues.receivePrice==undefined?'':dataValues.receivePrice.dblVal}></TableCell>
                <TableCell parentBackgroundColor={this.dynamicBackgroundColor}
                    cellData={dataValues.id == undefined ? '' : dataValues.id.strVal}></TableCell>
                <TableCell parentBackgroundColor={this.dynamicBackgroundColor}
                    cellData={dataValues.price==undefined?'':dataValues.price.dblVal}></TableCell>
                <TableCell parentBackgroundColor={this.dynamicBackgroundColor}
                    cellData={dataValues.payPrice==undefined?'':dataValues.payPrice.dblVal}></TableCell>
                <TableCell parentBackgroundColor={this.dynamicBackgroundColor}
                    cellData={dataKey == undefined ? '' : dataKey.name}></TableCell>
                <TableCell parentBackgroundColor={this.dynamicBackgroundColor}
                    cellData={dataValues.volatility == undefined ? '' : dataValues.volatility.dblVal}></TableCell>
                <TableCell parentBackgroundColor={this.dynamicBackgroundColor}
                    cellData={dataValues.payCurrency == undefined ? '' : dataValues.payCurrency.strVal}></TableCell>
                <TableCell parentBackgroundColor={this.dynamicBackgroundColor}
                    cellData={dataValues.payDiscountCurve == undefined ? '' : dataValues.payDiscountCurve.strVal}></TableCell>
                <TableCell parentBackgroundColor={this.dynamicBackgroundColor}
                    cellData={dataValues.payFixedRate == undefined ? '' : dataValues.payFixedRate.dblVal}></TableCell>
                <TableCell parentBackgroundColor={this.dynamicBackgroundColor}
                    cellData={dataValues.maturityDate == undefined ? '' : dataValues.maturityDate.dtVal.str}></TableCell>
                <TableCell parentBackgroundColor={this.dynamicBackgroundColor}
                    cellData={dataValues.payNotional == undefined ? '' : dataValues.payNotional.dblVal}></TableCell>
                <TableCell parentBackgroundColor={this.dynamicBackgroundColor}
                    cellData={dataValues.receiveDiscountCurve == undefined ? '' : dataValues.receiveDiscountCurve.strVal}></TableCell>
                <TableCell parentBackgroundColor={this.dynamicBackgroundColor}
                    cellData={dataValues.receiveNotional == undefined ? '' : dataValues.receiveNotional.dblVal}></TableCell>
                <TableCell parentBackgroundColor={this.dynamicBackgroundColor}
                    cellData={dataValues.receiveIndex == undefined ? '' : dataValues.receiveIndex.strVal}></TableCell>
                <TableCell parentBackgroundColor={this.dynamicBackgroundColor}
                    cellData={dataValues.receiveCurrency == undefined ? '' : dataValues.receiveCurrency.strVal}></TableCell>
                <TableCell parentBackgroundColor={this.dynamicBackgroundColor}
                    cellData={dataValues.receiveSpread == undefined ? '' : dataValues.receiveSpread.dblVal}></TableCell>
                <TableCell parentBackgroundColor={this.dynamicBackgroundColor}
                    cellData={dataValues.counterparty == undefined ? '' : dataValues.counterparty.strVal}></TableCell>
                <TableCell parentBackgroundColor={this.dynamicBackgroundColor}
                    cellData={dataValues.amerEuro == undefined ? '' : dataValues.amerEuro.strVal}></TableCell>
                <TableCell parentBackgroundColor={this.dynamicBackgroundColor}
                    cellData={dataValues.putCall == undefined ? '' : dataValues.putCall.strVal}></TableCell>
                <TableCell parentBackgroundColor={this.dynamicBackgroundColor}
                    cellData={dataValues.contractSize == undefined ? '' : dataValues.contractSize.dblVal}></TableCell>
                <TableCell parentBackgroundColor={this.dynamicBackgroundColor}
                    cellData={dataValues.strike == undefined ? '' : dataValues.strike.dblVal}></TableCell>
                <TableCell parentBackgroundColor={this.dynamicBackgroundColor}
                    cellData={dataValues.underlier == undefined ? '' : dataValues.underlier.strVal}></TableCell>
            </tr>
        )
    }

}



export default TableRow;