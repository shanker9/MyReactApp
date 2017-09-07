import React from 'react';
import TableCell from './TableCell.jsx';
import styles from '../../styles/AppStyles.css'

class TableRow extends React.Component {

    constructor() {
        super();
        this.state = {
            isSelected: false,
            shouldAnimate: false
        }
        this.dynamicBackgroundColor = undefined;
        this.handleRowClick = this.handleRowClick.bind(this);
        this.detectTheEnd = this.detectTheEnd.bind(this);
    }

    componentWillMount() {
        this.state.isSelected = this.props.selectState;
        // this.dynamicBackgroundColor = this.state.isSelected ? '#8593A4' : 'white';
        this.dynamicBackgroundColor = 'white';
    }

    componentWillReceiveProps(nextProps) {
        this.state.isSelected = nextProps.selectState;
    }

    componentWillUpdate() {
        // this.state.shouldAnimate = true;
        this.dynamicBackgroundColor = this.state.isSelected ? '#8593A4' : 'white';
    }

    componentDidUpdate() {

        // this.refs.tableRow.style.backgroundColor = 'yellow';

        // let blueCircle = this.refs.tableRow;

        // blueCircle.addEventListener("transitionend", this.detectTheEnd, false);
        // blueCircle.addEventListener("webkitTransitionEnd", this.detectTheEnd, false);
        // blueCircle.addEventListener("mozTransitionEnd", this.detectTheEnd, false);
        // blueCircle.addEventListener("msTransitionEnd", this.detectTheEnd, false);
        // blueCircle.addEventListener("oTransitionEnd", this.detectTheEnd, false);



    }

    detectTheEnd(e) {
        // console.log('Transition End');
        // this.refs.tableRow.style.backgroundColor = 'white';
    }

    handleRowClick(e) {
        e.preventDefault();
        console.log('Is Ctrl Pressed: ' + e.shiftKey);
        this.props.dataUpdateHandler(this.props.indexVal, e.shiftKey); // Update the selection state in the data

    }


    render() {
        // if (!this.props.isHeaderRow) {
            return (
                <tr ref={"tableRow"}
                    className={styles.tableRow}
                    onClick={this.handleRowClick}
                    style={{ backgroundColor: this.props.isHeaderRow ? 'grey' : this.dynamicBackgroundColor }}>
                    <TableCell isHeaderCell={this.props.isHeaderRow} parentBackgroundColor={this.dynamicBackgroundColor} cellData={this.props.data.customer} childStyle={{ textAlign: 'left', paddingLeft: '10px' }}></TableCell>
                    <TableCell isHeaderCell={this.props.isHeaderRow} parentBackgroundColor={this.dynamicBackgroundColor} cellData={this.props.data.swapId}></TableCell>
                    <TableCell isHeaderCell={this.props.isHeaderRow} parentBackgroundColor={this.dynamicBackgroundColor} cellData={this.props.data.interest}></TableCell>
                    <TableCell isHeaderCell={this.props.isHeaderRow} parentBackgroundColor={this.dynamicBackgroundColor} cellData={this.props.data.swap_rate}></TableCell>
                    <TableCell isHeaderCell={this.props.isHeaderRow} parentBackgroundColor={this.dynamicBackgroundColor} cellData={this.props.data.yearsIn}></TableCell>
                    <TableCell isHeaderCell={this.props.isHeaderRow} parentBackgroundColor={this.dynamicBackgroundColor} cellData={this.props.data.payFixedRate}></TableCell>
                    <TableCell isHeaderCell={this.props.isHeaderRow} parentBackgroundColor={this.dynamicBackgroundColor} cellData={this.props.data.payCurrency}></TableCell>
                    <TableCell isHeaderCell={this.props.isHeaderRow} parentBackgroundColor={this.dynamicBackgroundColor} cellData={this.props.data.yearsIn * 2}></TableCell>
                    <TableCell isHeaderCell={this.props.isHeaderRow} parentBackgroundColor={this.dynamicBackgroundColor} cellData={this.props.data.interest * 2}></TableCell>
                    <TableCell isHeaderCell={this.props.isHeaderRow} parentBackgroundColor={this.dynamicBackgroundColor} cellData={this.props.data.payCurrency}></TableCell>
                    <TableCell isHeaderCell={this.props.isHeaderRow} parentBackgroundColor={this.dynamicBackgroundColor} cellData={this.props.data.customer} childStyle={{ textAlign: 'left', paddingLeft: '10px' }}></TableCell>
                    <TableCell isHeaderCell={this.props.isHeaderRow} parentBackgroundColor={this.dynamicBackgroundColor} cellData={this.props.data.swapId}></TableCell>
                    <TableCell isHeaderCell={this.props.isHeaderRow} parentBackgroundColor={this.dynamicBackgroundColor} cellData={this.props.data.interest}></TableCell>
                    <TableCell isHeaderCell={this.props.isHeaderRow} parentBackgroundColor={this.dynamicBackgroundColor} cellData={this.props.data.yearsIn * 3}></TableCell>
                    <TableCell isHeaderCell={this.props.isHeaderRow} parentBackgroundColor={this.dynamicBackgroundColor} cellData={this.props.data.yearsIn}></TableCell>
                    <TableCell isHeaderCell={this.props.isHeaderRow} parentBackgroundColor={this.dynamicBackgroundColor} cellData={this.props.data.payCurrency}></TableCell>

                </tr>
            )
        // } else {
            // return (
            //     <tr ref={"tableRow"}
            //         className={styles.tableRow}
            //         style={{ backgroundColor: 'grey' }}>
            //         <TableCell parentBackgroundColor='grey' ></TableCell>
            //         <TableCell parentBackgroundColor='grey' ></TableCell>
            //         <TableCell parentBackgroundColor='grey' ></TableCell>
            //         <TableCell parentBackgroundColor='grey' ></TableCell>
            //         <TableCell parentBackgroundColor='grey' ></TableCell>
            //         <TableCell parentBackgroundColor='grey' ></TableCell>
            //         <TableCell parentBackgroundColor='grey' ></TableCell>
            //         <TableCell parentBackgroundColor='grey' ></TableCell>
            //         <TableCell parentBackgroundColor='grey' ></TableCell>
            //         <TableCell parentBackgroundColor='grey' ></TableCell>
            //         <TableCell parentBackgroundColor='grey' ></TableCell>
            //         <TableCell parentBackgroundColor='grey' ></TableCell>
            //         <TableCell parentBackgroundColor='grey' ></TableCell>
            //         <TableCell parentBackgroundColor='grey' ></TableCell>
            //         <TableCell parentBackgroundColor='grey' ></TableCell>
            //         <TableCell parentBackgroundColor='grey' ></TableCell>
            //     </tr>
            // )
        // }
    }

}



export default TableRow;