import React from 'react';
import styles from '../../styles/AppStyles.css'

class TableCell extends React.Component {

    constructor() {
        super();
        this.state = {
            animateColor: 'yellow'
        }

        this.detectTheEnd = this.detectTheEnd.bind(this);
    }

    componentWillMount() {
    }

    componentWillReceiveProps(nextProps) {

    }

    shouldComponentUpdate(nextProps, nextState) {
        if (this.props.cellData != nextProps.cellData) {
            console.log('propschanged');
            // nextState.animateColor = parseInt(this.props.cellData.toString()) > parseInt(nextProps.cellData.toString()) ? '#D94C4C' : 'green';
            nextState.animateColor = 'yellow';
            return true;
        } else
            return false;
    }

    componentWillUpdate() {
    }

    componentDidUpdate() {

        this.refs.tableCell.style.backgroundColor = this.state.animateColor;

        let blueCircle = this.refs.tableCell;

        blueCircle.addEventListener("transitionend", this.detectTheEnd, false);
        blueCircle.addEventListener("webkitTransitionEnd", this.detectTheEnd, false);
        blueCircle.addEventListener("mozTransitionEnd", this.detectTheEnd, false);
        blueCircle.addEventListener("msTransitionEnd", this.detectTheEnd, false);
        blueCircle.addEventListener("oTransitionEnd", this.detectTheEnd, false);



    }

    detectTheEnd(e) {
        console.log('Transition End');
        this.refs.tableCell.style.backgroundColor = 'white';
    }




    render() {

        return (
            <td ref={"tableCell"} className={styles.td} style={this.props.childStyle}>
                {this.props.cellData}
            </td>
        )
    }

}

export const tableRowStyles = {
    tableCell: {
        textAlign: 'left'
    }
}

export default TableCell;