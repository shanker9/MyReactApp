import React from 'react';
import styles from '../../styles/AppStyles.css'

class TableCell extends React.Component {

    constructor() {
        super();
        this.state = {
            animateColor: '#EAF188'
        }

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
    }

    detectTheEnd(e) {
        this.refs.tableCell.style.backgroundColor = "";
    }

    render() {

        return (
            <td ref={"tableCell"} className={styles.td} style={this.props.childStyle}>
                {this.props.cellData}
            </td>
        )
    }

}


export default TableCell;