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
        this.returnGroupedView = this.returnGroupedView.bind(this);
        this.getBucketRows = this.getBucketRows.bind(this);
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

    returnGroupedView(mapData) {
        let rowArray = [];
        let randToggle = false;
        mapData.forEach((item, key, mapObj) => {
            rowArray.push(<TableAggregatedRow data={item.groupData}
                key={key}
                indexVal={item.groupData.swapId}
                dataUpdateHandler={this.props.selectionDataUpdateHandler}
                selectState={false}
                showBucketData={!randToggle}
                bucketData={item.bucketData} />);
            randToggle = true;
        });
        return rowArray;
    }

    returnGroupedViewLazyLoaded(mapData) {
        let rowArray = [];
        mapData.forEach((item, key, mapObj) => {
            rowArray.push(<TableAggregatedRow data={item.groupData}
                key={key}
                aggregatedRowKey={key}
                indexVal={item.groupData.swapId}
                dataUpdateHandler={this.props.selectionDataUpdateHandler}
                selectState={false}
                bucketData={item.bucketData} 
                updateAggregatedRowExpandStatus={this.props.updateAggregatedRowExpandStatus}/>);
            if (item.showBucketData) {
                let res = this.getBucketRows(item.bucketData);
                rowArray.push(...res);
            }
        });
        let startIndex = this.props.getViewableStartIndex();
        let displayableRows = rowArray.slice(startIndex,startIndex+50);
        return displayableRows;
        // return rowArray;
    }

    getBucketRows(bucketData) {
        let result= [];
        bucketData.forEach((value, key, mapObj) => { 
            result.push(
                <TableRow
                    key={value.rowID}
                    data={value.data}
                    indexVal={value.data.swapId}
                    dataUpdateHandler={this.props.selectionDataUpdateHandler}
                    selectState={value.isSelected} />)
        });
        return result;
    }


    groupedView() {
        return (
            <div>
                <table className={styles.table}>
                    <tbody className={styles.tableBody} >
                        <div>
                            {this.returnGroupedViewLazyLoaded(this.props.groupedData)}
                        </div>
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