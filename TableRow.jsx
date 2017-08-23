import React from 'react';
// import { myStyles } from './App.jsx';
import styles from './AppStyles.css';

class TableRow extends React.Component {

    constructor(){
        super();
        this.handleClick = this.handleClick.bind(this);
    }

    componentWillMount() {
        // console.log(this.props.data);
    }

    handleClick(){
        // this.refs.tableRow.style.backgroundColor = '#92A3B0';
    }

    render() {
        return (
            <tr ref={"tableRow"} className={styles.tableRow} onClick={this.handleClick}>
                <td className={styles.td}>{this.props.data.customer}</td>
                <td className={styles.td}>{this.props.data.swapId}</td>
                <td className={styles.td}>{this.props.data.interest}</td>
                <td className={styles.td}>{this.props.data.swap_rate}</td>
                <td className={styles.td}>{this.props.data.yearsIn}</td>
                <td className={styles.td}>{this.props.data.payFixedRate}</td>
                <td className={styles.td}>{this.props.data.payCurrency}</td>
                <td className={styles.td}>{this.props.data.yearsIn * 2}</td>
                <td className={styles.td}>{this.props.data.payFixedRate}</td>
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