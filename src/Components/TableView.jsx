import React from 'react';
import TableRow from './TableRow.jsx';
import styles from '../../styles/AppStyles.css'

class TableView extends React.Component {

    componentDidMount() {

    }

    componentDidUpdate() {
    }

    render() {

        return (
            <div>
                <table className={styles.table}>
                    <tbody className={styles.tableBody} >
                        <div style={{ height: this.props.topDivHeight }}></div>
                        {this.props.viewableData.map((item, i) =>
                            <TableRow
                                key={i}
                                data={item.data}
                                indexVal={item.data.swapId}
                                dataUpdateHandler={this.props.selectionDataUpdateHandler}
                                selectState={item.isSelected}
                                />)}
                        <div style={{ height: this.props.bottomDivHeight }}></div>
                    </tbody>
                </table>
            </div>

        );
    }
}


export default TableView;