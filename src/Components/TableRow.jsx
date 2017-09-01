import React from 'react';
import styles from '../../styles/AppStyles.css'

class TableRow extends React.Component {

    constructor() {
        super();
        this.state = {
            isSelected: undefined,
            shouldAnimate : false
        }

        this.handleRowClick = this.handleRowClick.bind(this);
    }

    componentWillMount() {
        this.state.isSelected = this.props.selectState;
    }

    componentWillReceiveProps(nextProps) {
        this.state.isSelected = nextProps.selectState;
    }

    shouldComponentUpdate(nextProps, nextState) {
        // console.log('currentPropsSwapRate',this.props.data.swap_rate);
        // console.log('nextPropsSwapRate',nextProps.data.swap_rate);
        if(this.props.data.swap_rate!=nextProps.data.swap_rate){
            console.log('propschanged');
            nextState.shouldAnimate = true;
        }
        return true;
    }

    componentWillUpdate() {
        // this.state.shouldAnimate = true;
    }

    componentDidUpdate() {

    }

    handleRowClick(e) {
        e.preventDefault();
        console.log('Is Ctrl Pressed: ' + e.shiftKey);
        this.props.dataUpdateHandler(this.props.indexVal, e.shiftKey); // Update the selection state in the data

    }


    render() {

        return (
            <tr ref={"tableRow"}
                className={this.state.shouldAnimate ? styles.animateTableRow : styles.tableRow}
                onClick={this.handleRowClick}
                style={{ backgroundColor: this.state.isSelected ? '#92A3B0' : 'white' }}>
                <td className={styles.td} >{this.props.data.customer}</td>
                <td className={styles.td} >{this.props.data.swapId}</td>
                <td className={styles.td} >{this.props.data.interest}</td>
                <td className={styles.td} >{this.props.data.swap_rate}</td>
                <td className={styles.td}>{this.props.data.yearsIn}</td>
                <td className={styles.td}>{this.props.data.payFixedRate}</td>
                <td className={styles.td}>{this.props.data.payCurrency}</td>
                <td className={styles.td}>{this.props.data.yearsIn * 2}</td>
                {/* <td className={styles.td}>{this.props.data.payFixedRate}</td> */}
                <td className={styles.td}>{this.props.data.payCurrency}</td>
                <td className={styles.td}>{this.props.data.customer}</td>
                <td className={styles.td}>{this.props.data.swapId}</td>
                <td className={styles.td}>{this.props.data.interest}</td>
                <td className={styles.td}>{this.props.data.swap_rate}</td>
                <td className={styles.td}>{this.props.data.yearsIn}</td>
                <td className={styles.td}>{this.props.data.payFixedRate}</td>
            </tr>
        )
    }

}

export default TableRow;