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
                                key={item.rowID}
                                data={item.data}
                                indexVal={item.rowID}
                                dataUpdateHandler={this.props.selectionDataUpdateHandler}
                                selectState={item.isSelected}
                                isUpdate={item.isUpdated}
                                rowDataUpdateStatus={this.props.dataUpdateStatus} />)}
                        <div style={{ height: this.props.bottomDivHeight }}></div>
                    </tbody>
                </table>
            </div>

        );
    }
}


export default TableView;