import React from 'react';
import TableCell from './TableCell.jsx';
import styles from '../../styles/AppStyles.css'

class TableRow extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isSelected: false,
            shouldAnimate: false,
            data : props.data
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
        if(this.props.isGroupedRow){

        }
    }

    triggerUpdate(newdata){
        this.setState({data: newdata})
    }

    render() {

        return (
            <tr ref={"tableRow"}
                className={styles.tableRow}
                onClick={this.handleRowClick}
                style={{backgroundColor : this.props.isGroupedRow ? '#144C5A' : this.dynamicBackgroundColor}}>
                <TableCell parentBackgroundColor={this.dynamicBackgroundColor} cellData={this.state.data.customer} childStyle={{textAlign : 'left',paddingLeft : '10px'}}></TableCell>
                <TableCell parentBackgroundColor={this.dynamicBackgroundColor} cellData={this.state.data.receiveIndex}></TableCell>
                <TableCell parentBackgroundColor={this.dynamicBackgroundColor} cellData={this.state.data.swapId}></TableCell>
                <TableCell parentBackgroundColor={this.dynamicBackgroundColor} cellData={this.state.data.interest}></TableCell>
                <TableCell parentBackgroundColor={this.dynamicBackgroundColor} cellData={this.state.data.swap_rate}></TableCell>
                <TableCell parentBackgroundColor={this.dynamicBackgroundColor} cellData={this.state.data.yearsIn}></TableCell>
                <TableCell parentBackgroundColor={this.dynamicBackgroundColor} cellData={this.state.data.payFixedRate}></TableCell>
                <TableCell parentBackgroundColor={this.dynamicBackgroundColor} cellData={this.state.data.payCurrency}></TableCell>
                <TableCell parentBackgroundColor={this.dynamicBackgroundColor} cellData={this.state.data.yearsIn * 2}></TableCell>
                <TableCell parentBackgroundColor={this.dynamicBackgroundColor} cellData={this.state.data.interest*2}></TableCell>
                <TableCell parentBackgroundColor={this.dynamicBackgroundColor} cellData={this.state.data.payCurrency}></TableCell>
                <TableCell parentBackgroundColor={this.dynamicBackgroundColor} cellData={this.state.data.customer} childStyle={{textAlign : 'left',paddingLeft : '10px'}}></TableCell>
                <TableCell parentBackgroundColor={this.dynamicBackgroundColor} cellData={this.state.data.swapId}></TableCell>
                <TableCell parentBackgroundColor={this.dynamicBackgroundColor} cellData={this.state.data.interest}></TableCell>
                <TableCell parentBackgroundColor={this.dynamicBackgroundColor} cellData={this.state.data.yearsIn*3}></TableCell>
                <TableCell parentBackgroundColor={this.dynamicBackgroundColor} cellData={this.state.data.yearsIn}></TableCell>
                <TableCell parentBackgroundColor={this.dynamicBackgroundColor} cellData={this.state.data.payCurrency}></TableCell>

            </tr>
        )
    }

}



export default TableRow;