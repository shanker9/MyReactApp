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
        // this.returnGroupedView = this.returnGroupedView.bind(this);
        this.returnGroupedViewLazyLoaded = this.returnGroupedViewLazyLoaded.bind(this);
        this.getBucketRows = this.getBucketRows.bind(this);
        this.returngroupedData = this.returngroupedData.bind(this);
        this.getDisplayableRows = this.getDisplayableRows.bind(this);
        this.topDivHeight = 0;
        this.bottomDivHeight = 0;
        this.displayableRows = undefined;
    }

    componentDidMount() {
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.isGroupedView) {
            this.displayableRows = this.returnGroupedViewLazyLoaded(nextProps.groupedData);
        }
    }

    componentDidUpdate() {
    }

    getAggregatedRowRef(valueRef) {
        return this.refs.valueRef;
    }

    render() {
        if (this.props.isGroupedView) {
            return this.groupedView();
        } else {
            return this.normalview();
        }
    }

    returngroupedData(mapData) {
        let result = [];
        mapData.forEach((item, key, mapObj) => {
            result.push({ "key": key, "data": item, "isAggregatedRow": true });
            if (item.showBucketData) {
                let res = this.getBucketRowsLazyLoad(item.bucketData);
                result.push(...res);
            }
        });
        return result;
    }

    returnGroupedViewLazyLoaded(mapData) {
        let rowArray;
        // mapData.forEach((item, key, mapObj) => {
        // rowArray.push(<TableAggregatedRow data={item.groupData}
        //     key={key}
        //     ref={'ref' + key}
        //     aggregatedRowKey={key}
        //     indexVal={item.groupData.swapId}
        //     dataUpdateHandler={this.props.selectionDataUpdateHandler}
        //     selectState={false}
        //     bucketData={item.bucketData}
        //     updateAggregatedRowExpandStatus={this.props.updateAggregatedRowExpandStatus} />);
        //     if (item.showBucketData) {
        //         let res = this.getBucketRows(item.bucketData);
        //         rowArray.push(...res);
        //     }
        // });
        rowArray = this.returngroupedData(mapData);
        let startIndex = this.props.viewableStartIndex;
        let displayableRowsData = rowArray.slice(startIndex, startIndex + 50);
        this.topDivHeight = startIndex > 10 ? 30 * (startIndex - 10) : 0;
        this.bottomDivHeight = (rowArray.length - (startIndex + displayableRowsData.length)) * 30;
        let groupedViewElements = this.getDisplayableRows(displayableRowsData);
        return groupedViewElements;
    }

    getDisplayableRows(data) {
        return data.map((item, i) => {
            if (item.isAggregatedRow) {
                return (<TableAggregatedRow data={item.data.groupData}
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
                        key={item.data.rowID}
                        data={item.data.data}
                        indexVal={item.data.data.swapId}
                        dataUpdateHandler={this.props.selectionDataUpdateHandler}
                        selectState={item.data.isSelected} />)
            }

        })
    }

    getBucketRows(bucketData) {
        let result = [];
        bucketData.forEach((item, key, mapObj) => {
            result.push(
                <TableRow
                    key={item.rowID}
                    data={item.data}
                    indexVal={item.data.swapId}
                    dataUpdateHandler={this.props.selectionDataUpdateHandler}
                    selectState={item.isSelected} />)
        });
        return result;
    }

    getBucketRowsLazyLoad(bucketData) {
        let result = [];
        bucketData.forEach((value, key, mapObj) => {
            result.push({ "key": key, "data": value, "isAggregatedRow": false })
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
                            {this.displayableRows}
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