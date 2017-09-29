import React from 'react';
import PropTypes from 'prop-types';
import TableRow from './TableRow.jsx';
import TableAggregatedRow from './TableAggregatedRow.jsx';
import styles from '../../styles/AppStyles.css'

class GridView extends React.Component {

    constructor() {
        super();
        this.groupedView = this.groupedView.bind(this);
        this.normalview = this.normalview.bind(this);
        this.returnGroupedViewLazyLoaded = this.returnGroupedViewLazyLoaded.bind(this);
        this.returngroupedData = this.returngroupedData.bind(this);
        this.topDivHeight = 0;
        this.bottomDivHeight = 0;
        this.displayableRows = undefined;
        this.displayableRowsData = [];
    }

    componentDidMount() {
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.isGroupedView) {
            // this.displayableRows = this.returnGroupedViewLazyLoaded(nextProps.groupedData);
            this.returnGroupedViewLazyLoaded(nextProps.groupedData);
        }
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

    /*** calculating and setting displayableRowsData, topDivHeight, bottomDivHeight ***/
    returnGroupedViewLazyLoaded(mapData) {
        let rowArray = this.returngroupedData(mapData);
        let startIndex = this.props.viewableStartIndex;
        this.displayableRowsData = rowArray.slice(startIndex, startIndex + 50);
        this.topDivHeight = startIndex*30;
        this.bottomDivHeight = (rowArray.length - (startIndex + this.displayableRowsData.length)) * 30;
    }

    returngroupedData(mapData) {
        let result = [];
        mapData.forEach((item, key, mapObj) => {
            result.push({ "key": key, "data": item, "isAggregatedRow": true });
            if (item.showBucketData) {
                item.bucketData.forEach((val, k, mapObj) => result.push({ "key":k, "data": val, "isAggregatedRow": false }));
            }
        });
        return result;
    }

    groupedView() {
        return (
            <div>
                <table className={styles.table}>
                    <tbody className={styles.tableBody} >
                        <div style={{ height: this.topDivHeight }}></div>
                        <div>
                            {this.displayableRowsData.map((item, i) => {
                                if (item.isAggregatedRow) {
                                    return (<TableAggregatedRow data={item.data.groupData}
                                        ref={'ref' + item.key}
                                        key={item.key}
                                        aggregatedRowKey={item.key}
                                        indexVal={item.data.groupData.swapId}
                                        dataUpdateHandler={this.props.selectionDataUpdateHandler}
                                        selectState={false}
                                        bucketData={item.data.bucketData}
                                        updateAggregatedRowExpandStatus={this.props.updateAggregatedRowExpandStatus} />)
                                } else {
                                    return (
                                        <TableRow
                                            ref={'ref' + item.data.rowID}
                                            key={item.data.rowID}
                                            data={item.data.data}
                                            indexVal={item.data.data.swapId}
                                            dataUpdateHandler={this.props.selectionDataUpdateHandler}
                                            selectState={item.data.isSelected} />)
                                }

                            })}
                        </div>
                        <div style={{ height: this.bottomDivHeight }}></div>
                    </tbody>
                </table>
            </div>

        );
    }

    normalview() {
        return (
            <div>
                <table className={styles.table}>
                    <tbody className={styles.tableBody} >
                        <div style={{ height: this.props.topDivHeight }}></div>
                        {this.props.viewableData.map((item, i) =>
                            <TableRow
                                ref={'ref' + item.rowID}
                                key={item.rowID}
                                data={item.data}
                                indexVal={item.data.swapId}
                                dataUpdateHandler={this.props.selectionDataUpdateHandler}
                                selectState={item.isSelected} />
                        )}
                        <div style={{ height: this.props.bottomDivHeight }}></div>
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