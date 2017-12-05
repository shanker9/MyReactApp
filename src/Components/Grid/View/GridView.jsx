import React from 'react';
import PropTypes from 'prop-types';
import TableRow from './TableRow.jsx';
import TableAggregatedRow from './TableAggregatedRow.jsx';
import styles from '../../../../styles/AppStyles.css'

class GridView extends React.Component {

    constructor() {
        super();
        this.groupedView = this.groupedView.bind(this);
        this.normalview = this.normalview.bind(this);
    }

    componentDidMount() {
    }

    componentDidUpdate() {
    }

    render() {
        if (this.props.isGroupedView) {
            return this.groupedView();
        } else {
            return this.normalview();
        }
    }

    groupedView() {
        let rowColorBoolean = false;
        return (
            <div>
                <table className={styles.table}>
                    <tbody className={styles.tableBody} >
                        <tr>
                            <th>
                                <div style={{ height: this.props.topDivHeight }}></div>
                            </th>
                        </tr>
                        {this.props.viewableData.map((item, i) => {
                            // rowColorBoolean = !rowColorBoolean;
                            if (item.isAggregatedRow) {
                                return <TableAggregatedRow data={item.data.groupData}
                                    ref={'ref' + item.key}
                                    key={item.key}
                                    aggregatedRowKey={item.key}
                                    indexVal={item.data.groupData.swapId}
                                    dataUpdateHandler={this.props.selectionDataUpdateHandler}
                                    selectState={item.data.showBucketData}
                                    bucketData={item.data.bucketData}
                                    updateAggregatedRowExpandStatus={this.props.updateAggregatedRowExpandStatus}
                                    columnKeyValues={this.props.columnKeyValues} />
                            } else {
                                return <TableRow
                                    ref={'ref' + item.data.rowID}
                                    key={item.data.rowID}
                                    data={item.data.data}
                                    indexVal={item.data.rowID}
                                    selectionDataUpdateHandler={this.props.selectionDataUpdateHandler}
                                    selectState={item.data.isSelected}
                                    columnKeyValues={this.props.columnKeyValues}
                                    isGroupedView={this.props.isGroupedView}
                                    isRowColored={rowColorBoolean} />
                            }
                        })}
                        <tr>
                            <th>
                                <div style={{ height: this.props.bottomDivHeight }}></div>
                            </th>
                        </tr>
                    </tbody>
                </table>
            </div>

        );
    }

    normalview() {
        let rowColorBoolean = true;
        return (
            <div>
                <table className={styles.table}>
                    <tbody className={styles.tableBody} >
                        <tr>
                            <th>
                                <div style={{ height: this.props.topDivHeight }}></div>
                            </th>
                        </tr>
                        {this.props.viewableData.map((item, i) => {
                            rowColorBoolean = !rowColorBoolean;
                            return <TableRow
                                ref={'ref' + item.rowID}
                                key={item.rowID}
                                data={item.data}
                                indexVal={item.rowID}
                                selectionDataUpdateHandler={this.props.selectionDataUpdateHandler}
                                selectState={item.isSelected}
                                columnKeyValues={this.props.columnKeyValues}
                                isRowColored={rowColorBoolean} />
                        }
                        )}
                        <tr>
                            <th>
                                <div style={{ height: this.props.bottomDivHeight }}></div>
                            </th>
                        </tr>
                    </tbody>
                </table>
            </div>

        );
    }
}

GridView.propTypes = {
    isGroupedView: PropTypes.bool,
    groupedData: PropTypes.object,
    viewableData: PropTypes.array,
    topDivHeight: PropTypes.number,
    bottomDivHeight: PropTypes.number,
    selectionDataUpdateHandler: PropTypes.func,
    dataUpdateStatus: PropTypes.func
}

export default GridView;