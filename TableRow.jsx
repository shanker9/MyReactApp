import React from 'react';
// import { myStyles } from './App.jsx';
import styles from './AppStyles.css';

class TableRow extends React.Component {

    componentWillMount() {
        // console.log(this.props.data);
    }

    render() {
        return (
            // <tr>
            //     <td style={tableRowStyles.td}>{this.props.data.customer}</td>
            //     <td style={tableRowStyles.td}>{this.props.data.swapId}</td>
            //     <td style={tableRowStyles.td}>{this.props.data.interest}</td>
            //     <td style={tableRowStyles.td}>{this.props.data.swap_rate}</td>
            //     <td style={tableRowStyles.td}>{this.props.data.YearsIn}</td>
            //     <td style={tableRowStyles.td}>{this.props.data.PayFixedRate}</td>
            //     <td style={tableRowStyles.td}>{this.props.data.PayCurrency}</td>
            //     <td style={tableRowStyles.td}>{this.props.data.YearsIn}</td>
            //     <td style={tableRowStyles.td}>{this.props.data.PayFixedRate}</td>
            //     <td style={tableRowStyles.td}>{this.props.data.PayCurrency}</td>                
            // </tr>
            <tr>
                <td className={styles.td}>{this.props.data.id}</td>
                <td className={styles.td}>{this.props.data.name}</td>
                <td className={styles.td}>{this.props.data.age}</td>
            </tr>
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