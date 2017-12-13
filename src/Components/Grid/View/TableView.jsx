import React from 'react';
import TableController from '../../../Controllers/TableController.js';
import BlotterInfo from './BlotterInfo.jsx';
import TableRow from './TableRow.jsx';
import TableHeaderCell from './TableHeaderCell.jsx';
import GridView from './GridView.jsx';
import ReactSimpleRange from 'react-simple-range';
import styles from '../../../../styles/AppStyles.css'

// var flag = false, skipcount = 0;
class TableView extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            gridDataSource: [],
            topDivHeight: 0,
            bottomDivHeight: 0,
            isGroupedView: false
        }
        this.controller = undefined;
        this.sliderValue = 15;
        this.columns = [
            {
                columnkey: "counterparty",
                columnvalue: "counterparty"
            },
            {
                columnkey: "name",
                columnvalue: "Name"
            },
            {
                columnkey: "receiveIndex",
                columnvalue: "receiveIndex"
            },
            {
                columnkey: "rho10bps",
                columnvalue: "rho10bps"
            },
            {
                columnkey: "gamma1pct",
                columnvalue: "gamma1pct"
            },
            {
                columnkey: "delta1pct",
                columnvalue: "delta1pct"
            },
            {
                columnkey: "vega1pt",
                columnvalue: "vega1pt"
            },
            {
                columnkey: "lastUpdated",
                columnvalue: "lastUpdated"
            },
            {
                columnkey: "receiveLeg",
                columnvalue: "receiveLeg"
            },
            {
                columnkey: "vertex",
                columnvalue: "vertex"
            },
            {
                columnkey: "price",
                columnvalue: "price"
            },
            {
                columnkey: "payLeg",
                columnvalue: "payLeg"
            },
            {
                columnkey: "volatility",
                columnvalue: "volatility"
            },
            {
                columnkey: "payCurrency",
                columnvalue: "payCurrency"
            },
            {
                columnkey: "payDiscountCurve",
                columnvalue: "payDiscountCurve"
            },
            {
                columnkey: "payFixedRate",
                columnvalue: "payFixedRate"
            },
            {
                columnkey: "maturityDate",
                columnvalue: "maturityDate"
            },
            {
                columnkey: "payNotional",
                columnvalue: "payNotional"
            },
            {
                columnkey: "receiveDiscountCurve",
                columnvalue: "receiveDiscountCurve"
            },
            {
                columnkey: "receiveNotional",
                columnvalue: "receiveNotional"
            },
            {
                columnkey: "receiveCurrency",
                columnvalue: "receiveCurrency"
            },
            {
                columnkey: "receiveSpread",
                columnvalue: "receiveSpread"
            },
            {
                columnkey: "amerOrEuro",
                columnvalue: "amerOrEuro"
            },
            {
                columnkey: "putOrCall",
                columnvalue: "putOrCall"
            },
            {
                columnkey: "contractSize",
                columnvalue: "contractSize"
            },
            {
                columnkey: "strike",
                columnvalue: "strike"
            },
            {
                columnkey: "underlier",
                columnvalue: "underlier"
            }
        ];

        this.subscriptionTopic = this.props.subscriptionTopic;

        this.updateDataGridWithDefaultView = this.updateDataGridWithDefaultView.bind(this);
        this.updateDataGridWithGroupedView = this.updateDataGridWithGroupedView.bind(this);
        this.loadDataGridWithGroupedView = this.loadDataGridWithGroupedView.bind(this);
        this.rowUpdate = this.rowUpdate.bind(this);
        this.aggRowUpdate = this.aggRowUpdate.bind(this);
        this.scrollEventHandler = this.scrollEventHandler.bind(this);
        this.makeDefaultSubscription = this.makeDefaultSubscription.bind(this);
        this.makeGroupSubscription = this.makeGroupSubscription.bind(this);
        this.updateAggregatedRowExpandStatus = this.updateAggregatedRowExpandStatus.bind(this);
    }

    componentDidMount() {
        this.controller = new TableController(this, this.subscriptionTopic);
        // this.makeDefaultSubscription();
        this.makeGroupSubscription('name');
    }

    /*** EventHandler for scrolling of Tabledata ***/
    scrollEventHandler() {
        let headerNode = document.getElementById('scrollableHeaderDiv');
        let tableNode = document.getElementById('scrollableTableDiv');
        headerNode.scrollLeft = tableNode.scrollLeft;
        if (this.state.isGroupedView) {
            this.updateDataGridWithGroupedView();
        } else {
            this.updateDataGridWithDefaultView();
        }
    }

    /** NON-GROUPING METHODS**/

    makeDefaultSubscription() {
        // this.controller = new TableController(this, this.subscriptionTopic);
        let commandObject1 = {
            "command": "sow_and_subscribe",
            "topic": this.subscriptionTopic,
            "orderBy": "/product",
        }

        this.controller.ampsSubscribe(commandObject1);
    }

    loadDataGridWithDefaultView() {
        let gridDiv = document.getElementById('scrollableTableDiv');
        let startIndex = 0;
        let endIndex = startIndex + 50;
        gridDiv.scrollTop = 0;
        let { gridDataSource, topDivHeight, bottomDivHeight } = this.controller.getDefaultViewData(startIndex, endIndex, this.props.rowHeight);
        this.setState({
            gridDataSource: gridDataSource,
            topDivHeight: topDivHeight,
            bottomDivHeight: bottomDivHeight,
            isGroupedView: false
        });

        let viewableUpperLimit = Math.round(gridDiv.clientHeight / this.props.rowHeight);
        let lowerLimit = startIndex + 1;

        let upperLimit = viewableUpperLimit > gridDataSource.length ? startIndex + gridDataSource.length : startIndex + viewableUpperLimit;
        this.refs.blotterInfo.updateGroupedViewStateTo(false);
        this.refs.blotterInfo.updateRowViewInfo(lowerLimit, upperLimit, this.controller.getDatamapSize());
    }

    updateDataGridWithDefaultView() {
        let gridDiv = document.getElementById('scrollableTableDiv');

        let startIndex = Math.round(gridDiv.scrollTop / this.props.rowHeight);
        let endIndex = startIndex + 50;
        let viewableUpperLimit = Math.round(gridDiv.clientHeight / this.props.rowHeight);
        let lowerLimit = startIndex + 1;

        let { gridDataSource, topDivHeight, bottomDivHeight } = this.controller.getDefaultViewData(startIndex, endIndex, this.props.rowHeight);
        this.setState({
            gridDataSource: gridDataSource,
            topDivHeight: topDivHeight,
            bottomDivHeight: bottomDivHeight,
        });

        let upperLimit = viewableUpperLimit > gridDataSource.length ? startIndex + gridDataSource.length : startIndex + viewableUpperLimit;
        this.refs.blotterInfo.updateRowViewInfo(lowerLimit, upperLimit, this.controller.getDatamapSize());
    }


    /** GROUPING METHODS  **/

    makeGroupSubscription(columnName) {
        this.controller.groupDataByColumnKey(columnName);
    }

    loadDataGridWithGroupedView() {
        let startIndex = 0;
        let endIndex = startIndex + 50;
        document.getElementById('scrollableTableDiv').scrollTop = 0;
        let { gridDataSource, topDivHeight, bottomDivHeight } = this.controller.getGroupedViewData(startIndex, endIndex, this.props.rowHeight, this.state.isGroupedView);
        this.setState({
            gridDataSource: gridDataSource,
            topDivHeight: topDivHeight,
            bottomDivHeight: bottomDivHeight,
            isGroupedView: true
        });
        this.refs.blotterInfo.updateGroupedViewStateTo(true);
    }

    updateDataGridWithGroupedView() {
        let startIndex = Math.round(document.getElementById('scrollableTableDiv').scrollTop / this.props.rowHeight);
        let endIndex = startIndex + 50;
        this.setState(this.controller.getGroupedViewData(startIndex, endIndex, this.props.rowHeight, this.state.isGroupedView));
    }

    clearGrouping() {
        this.controller.clearGroupSubscriptions();
        this.controller.clearArray(this.controller.groupingColumnsByLevel);
        // this.loadDataGridWithDefaultView();
        this.makeDefaultSubscription();
        let columnDragToBar = this.refs.dragToBar;
        while (columnDragToBar.firstChild) {
            columnDragToBar.removeChild(columnDragToBar.firstChild);
        }
        columnDragToBar.appendChild(document.createTextNode("DRAG COLUMNS HERE TO START GROUPING"));
    }

    onColumnDrop(event) {
        let columnData = JSON.parse(event.dataTransfer.getData("groupingColumnData"));
        let columnIndexInGroupedList = this.controller.getGroupingColumnsArray().indexOf(columnData.cellId);

        if (columnIndexInGroupedList == -1) {
            if (this.refs.dragToBar.firstChild.nodeName == '#text') {
                this.refs.dragToBar.removeChild(this.refs.dragToBar.firstChild);
            }
            let clonedColumnElement = document.getElementById(columnData.cellId).cloneNode(true);
            clonedColumnElement.style.color = "#1E0B06";
            clonedColumnElement.style.backgroundColor = "#ffeb89";
            clonedColumnElement.style.boxSizing = "border-box";
            clonedColumnElement.style.height = this.refs.dragToBar.offsetHeight + "px";
            this.refs.dragToBar.appendChild(clonedColumnElement);
            this.makeGroupSubscription(columnData.cellId);
        }
    }

    selectionDataUpdateHandler(rowIndexValue, parentRowKey, event) {
        this.controller.updateRowSelectionData(rowIndexValue, parentRowKey);
        this.updateGraphData(rowIndexValue, parentRowKey);
    }

    /** ROW UPDATE HANDLER **/

    rowUpdate(data, selectState, rowReference) {
        let rowElem = this.refs.gridViewRef.refs['ref' + rowReference];
        if (rowElem != undefined) {
            rowElem.triggerUpdate(data, selectState);
        }
    }

    aggRowUpdate(data, rowReference) {
        let rowElem = this.refs.gridViewRef.refs['ref' + rowReference];
        if (rowElem != undefined) {
            rowElem.triggerUpdate(data);
        }
    }

    updateAggregatedRowExpandStatus(groupKey) {
        this.controller.updateGroupExpansionStatus(groupKey);
    }


    /** GRAPH METHODS **/

    updateGraphData(rowIndexValue, parentRowKey) {
        this.controller.fetchAndFormatGraphData(rowIndexValue, parentRowKey, (updateData) => {
            this.props.graphTreeComponentReference().updateParentNodeData(updateData);
        });
    }

    updateGraphUIWithData(graphData) {
        this.props.graphTreeComponentReference().updateGraphData(graphData);
    }

    /** TEMPORAL METHODS **/

    sliderChangeHandler(e) {
        console.dir(15 - e.value);
        this.changeSliderValue(e.value);
        this.controller.getDataAtBeforeMins(15 - e.value);
    }

    changeSliderValue(value) {
        this.sliderValue = value;
    }

    getLivePrices() {
        this.changeSliderValue(15);
        // this.makeDefaultSubscription();
        this.makeGroupSubscription('name');
    }

    render() {
        return (
            <div className={styles.blottercontainer}>
                <div className={styles.temporalUIblock}>
                    <div className={styles.temporalslider}>
                        <ReactSimpleRange
                            disableTrack
                            min={0}
                            max={15}
                            step={5}
                            defaultValue={this.sliderValue}
                            sliderSize={4}
                            thumbSize={15}
                            sliderColor="#61a9f9"
                            trackColor="#307dd4"
                            thumbColor="#307dd4"
                            onChange={this.sliderChangeHandler.bind(this)} />
                    </div>
                    <button className={styles.temporalButton} onClick={this.getLivePrices.bind(this)}> Live Prices </button>
                </div>
                <BlotterInfo ref="blotterInfo"
                    subscribedTopic={this.props.subscriptionTopic}
                    clearGrouping={this.clearGrouping.bind(this)} />
                <div ref="dragToBar"
                    className={styles.dragtobar}
                    onDragOver={event => event.preventDefault()}
                    onDrop={this.onColumnDrop.bind(this)}>
                    DRAG COLUMNS HERE TO START GROUPING
                </div>
                <div className={styles.gridContainerDiv}>
                    {this.state.isGroupedView ?
                        <div id="scrollableHeaderDiv" className={styles.headerDiv}>
                            <table className={styles.table}>
                                <thead className={styles.tableHead}>
                                    <tr className={styles.tableHeaderRow}>
                                        <th style={{ minWidth: '18px' }} />
                                        {this.columns.map((item, i) =>
                                            <TableHeaderCell
                                                key={i}
                                                groupingHandler={this.makeGroupSubscription}
                                                cellKey={item.columnkey}
                                                cellData={item.columnvalue} />
                                        )}
                                    </tr>
                                </thead>
                            </table>
                        </div> :
                        <div id="scrollableHeaderDiv" className={styles.headerDiv}>
                            <table className={styles.table}>
                                <thead className={styles.tableHead}>
                                    <tr className={styles.tableHeaderRow}>
                                        {this.columns.map((item, i) =>
                                            <TableHeaderCell
                                                key={i}
                                                groupingHandler={this.makeGroupSubscription}
                                                cellKey={item.columnkey}
                                                cellData={item.columnvalue} />
                                        )}
                                    </tr>
                                </thead>
                            </table>
                        </div>
                    }
                    <div id="scrollableTableDiv" className={styles.tableDiv} onScroll={this.scrollEventHandler}>
                        <GridView isGroupedView={this.state.isGroupedView}
                            ref='gridViewRef'
                            viewableData={this.state.gridDataSource}
                            topDivHeight={this.state.topDivHeight}
                            bottomDivHeight={this.state.bottomDivHeight}
                            columnKeyValues={this.columns}
                            selectionDataUpdateHandler={this.selectionDataUpdateHandler.bind(this)}
                            dataUpdateStatus={this.props.rowDataUpdateStatus}
                            updateAggregatedRowExpandStatus={this.updateAggregatedRowExpandStatus} />
                    </div>
                </div>
            </div>
        );
    }
}


export default TableView;