import React from 'react';
import styles from '../../../../styles/AppStyles.css'

class TableCell extends React.Component {

    constructor() {
        super();
        this.state = {
            animateColor: '#fff7a5'
        }
        this.conditionalAnimateColor = undefined;
        this.detectTheEnd = this.detectTheEnd.bind(this);
    }

    componentDidMount() {
        let tableCell = this.refs.tableCell;

        tableCell.addEventListener("transitionend", this.detectTheEnd, false);
        tableCell.addEventListener("webkitTransitionEnd", this.detectTheEnd, false);
        tableCell.addEventListener("mozTransitionEnd", this.detectTheEnd, false);
        tableCell.addEventListener("msTransitionEnd", this.detectTheEnd, false);
        tableCell.addEventListener("oTransitionEnd", this.detectTheEnd, false);
    }

    componentWillMount() {
    }

    componentWillReceiveProps(nextProps) {
        this.conditionalAnimateColor = nextProps.cellData > this.props.cellData ? '#b7ffb5' : '#ff8372';
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (this.props.cellData != nextProps.cellData) {
            return true;
        } else
            return false;
    }

    componentWillUpdate() {
    }

    componentDidUpdate() {

        this.refs.tableCell.style.backgroundColor = this.state.animateColor;
        // this.refs.tableCell.style.backgroundColor = this.conditionalAnimateColor;
    }

    detectTheEnd(e) {
        this.refs.tableCell.style.backgroundColor = "";
    }

    render() {

        return (
            <td ref={"tableCell"} className={styles.td} >
                {this.props.cellData}
            </td>
        )
    }

}


export default TableCell;