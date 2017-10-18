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
        // this.detectTheEnd = this.detectTheEnd.bind(this);
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

    // componentDidUpdate() {

    //     // this.refs.tableRow.style.backgroundColor = 'yellow';

    //     // let blueCircle = this.refs.tableRow;

    //     // blueCircle.addEventListener("transitionend", this.detectTheEnd, false);
    //     // blueCircle.addEventListener("webkitTransitionEnd", this.detectTheEnd, false);
    //     // blueCircle.addEventListener("mozTransitionEnd", this.detectTheEnd, false);
    //     // blueCircle.addEventListener("msTransitionEnd", this.detectTheEnd, false);
    //     // blueCircle.addEventListener("oTransitionEnd", this.detectTheEnd, false);



    // }

    // detectTheEnd(e) {
    //     // console.log('Transition End');
    //     // this.refs.tableRow.style.backgroundColor = 'white';
    // }

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
                    cellData={dataValues.lastUpdate == undefined ? '' : dataValues.lastUpdate.dtVal.str}
                    childStyle={{ textAlign: 'left', paddingLeft: '10px' }}></TableCell>
                <TableCell parentBackgroundColor={this.dynamicBackgroundColor} cellData={"TBD-receivePrice"}></TableCell>
                <TableCell parentBackgroundColor={this.dynamicBackgroundColor} cellData={dataValues.id==undefined? '' : dataValues.id.strVal}></TableCell>
                <TableCell parentBackgroundColor={this.dynamicBackgroundColor} cellData={"TBD-Price"}></TableCell>
                <TableCell parentBackgroundColor={this.dynamicBackgroundColor} cellData={"TBD-PayPrice"}></TableCell>
                <TableCell parentBackgroundColor={this.dynamicBackgroundColor} cellData={dataKey.name}></TableCell>
                <TableCell parentBackgroundColor={this.dynamicBackgroundColor} cellData={"TBD-Volatility"}></TableCell>
                <TableCell parentBackgroundColor={this.dynamicBackgroundColor} cellData={dataValues[payCurrrency][strVal]}></TableCell>
                <TableCell parentBackgroundColor={this.dynamicBackgroundColor} cellData={dataValues.payDiscountCurve.strVal}></TableCell>
                <TableCell parentBackgroundColor={this.dynamicBackgroundColor} cellData={dataValues.payFixedRate.dblVal}></TableCell>
                <TableCell parentBackgroundColor={this.dynamicBackgroundColor} cellData={dataValues.maturityDate.dtVal.str}></TableCell>
                <TableCell parentBackgroundColor={this.dynamicBackgroundColor} cellData={dataValues.payNotional.dblVal} childStyle={{ textAlign: 'left', paddingLeft: '10px' }}></TableCell>
                <TableCell parentBackgroundColor={this.dynamicBackgroundColor} cellData={dataValues.receiveDiscountCurve.strVal}></TableCell>
                <TableCell parentBackgroundColor={this.dynamicBackgroundColor} cellData={dataValues.receiveNotional.dblVal}></TableCell>
                <TableCell parentBackgroundColor={this.dynamicBackgroundColor} cellData={dataValues.receiveIndex.strVal}></TableCell>
                <TableCell parentBackgroundColor={this.dynamicBackgroundColor} cellData={dataValues.receiveCurrency.strVal}></TableCell>
                <TableCell parentBackgroundColor={this.dynamicBackgroundColor} cellData={dataValues.receiveSpread.dblVal}></TableCell>
                <TableCell parentBackgroundColor={this.dynamicBackgroundColor} cellData={dataValues.counterparty.strVal}></TableCell>
                <TableCell parentBackgroundColor={this.dynamicBackgroundColor} cellData={"amerEuro"}></TableCell>
                <TableCell parentBackgroundColor={this.dynamicBackgroundColor} cellData={"putCall"}></TableCell>
                <TableCell parentBackgroundColor={this.dynamicBackgroundColor} cellData={"contractSize"}></TableCell>
                <TableCell parentBackgroundColor={this.dynamicBackgroundColor} cellData={"strike"}></TableCell>
                <TableCell parentBackgroundColor={this.dynamicBackgroundColor} cellData={"underlier"}></TableCell>

            </tr>
        )
    }

}



export default TableRow;