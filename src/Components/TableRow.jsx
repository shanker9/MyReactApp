import React from 'react';
import styles from '../../styles/AppStyles.css'

class TableRow extends React.Component {

    constructor() {
        super();
        this.state = {
            isSelected: undefined
        }

        this.handleRowClick = this.handleRowClick.bind(this);
        this.dataUpdateAnimation = this.dataUpdateAnimation.bind(this);
    }

    componentWillMount() {
        // console.log(this.props.data);
        this.state.isSelected = this.props.selectState;
    }

    componentWillReceiveProps(nextProps) {
        // console.log(nextProps.selectState);
        this.state.isSelected = nextProps.selectState;
    }

    shouldComponentUpdate(nextProps, nextState) {
        if(nextProps.isUpdate == true){
            return true;
        }
        else
            return false;
    }

    componentWillUpdate() {
        // this.state.isSelected = this.props.selectState;
        // this.refs.tableRow.style.animationName = true ? styles.example : 0;
        console.log('is Data Updated: ', this.props.isUpdate);
        if (this.props.isUpdate) {
            console.log('updated Row');
        }
    }

    componentDidUpdate() {
        // this.state.isSelected = this.props.selectState;
        // this.dataUpdateAnimation();
        // console.log('comp update');
        // this.props.isUpdate = false;
        if (this.props.isUpdate) {
            this.props.rowDataUpdateStatus(this.props.indexVal, false);
        }
    }

    handleRowClick(e) {
        e.preventDefault();
        // let isMultiSelect = true;
        console.log('Is Ctrl Pressed: ' + e.shiftKey);
        this.props.dataUpdateHandler(this.props.indexVal, e.shiftKey); // Update the selection state in the data
        // if(this.state.isSelected==undefined){
        //     this.state.isSelected = this.props.selectState;
        // }
        // if(isMultiSelect)

        // this.setState({ isSelected : !this.state.isSelected });
    }

    dataUpdateAnimation() {
        let id = setInterval(() => {
            if (this.style.backgroundColor == '#B0B020') {
                clearInterval(id);
            }
            this.style.backgroundColor = '#B0B020';
        }, 100);
    }

    render() {

        return (
            <tr ref={"tableRow"} className={this.props.isUpdate ? styles.animateTableRow : styles.tableRow} onClick={this.handleRowClick}
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
            // <tr>
            //     <td className={styles.td}>{this.props.data.id}</td>
            //     <td className={styles.td}>{this.props.data.name}</td>
            //     <td className={styles.td}>{this.props.data.age}</td>
            // </tr>
        )
    }

}
// export const tableRowStyles = {
//     td: {
//         border: '1px solid black',
//         width: '100px',
//         fontSize: 15
//     }
// }

export default TableRow;