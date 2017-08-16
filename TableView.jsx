import React from 'react';
import TableRow from './TableRow.jsx';
import styles from './AppStyles.css';

class TableView extends React.Component {

    constructor() {
        super();

        this.state = {
            data: []
        }
        this.printNewData = this.printNewData.bind(this);
    }

    componentDidMount() {
        this.props.onRef(this);
    }

    updateTableView(updatedData) {
        // this.state.data.push(updatedData);
        console.log('NEW DATA: \n' + this.printNewData(updatedData));
        this.setState({ data: this.state.data.concat(updatedData) })
    }

    printNewData(data){
       return 'id: ' + data.id + ' name: ' + data.name + ' age: ' + data.age;
    }

    render() {
        return (
            <div>
                {/* <button onClick={this.updateTableView.bind(this)}>UpdateDataTable</button> */}
                <tbody>
                    <tr>
                        <td className={styles.td}>Customer</td>
                        <td className={styles.td}>SwapId</td>
                        <td className={styles.td}>Interest</td>
                        <td className={styles.td}>SwapRate</td>
                        <td className={styles.td}>YearsIn</td>
                        <td className={styles.td}>PayFixedRate</td>
                        <td className={styles.td}>PayCurrency</td>
                        <td className={styles.td}>YearsIn</td>
                        <td className={styles.td}>PayFixedRate</td>
                        <td className={styles.td}>PayCurrency</td>

                    </tr>
                    {this.state.data.map((item, i) => <TableRow key={i} data={item} />)}
                </tbody>
            </div>
        );
    }
}
// export const tableViewStyles = {
//     td: {
//         border: '1px solid black',
//         width: '100px',
//         fontSize: 15
//     }
// }

export default TableView;