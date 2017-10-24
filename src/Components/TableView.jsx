import React from 'react';
import TableController from '../Controllers/TableController.js';
import BlotterInfo from './BlotterInfo.jsx';
import TableRow from './TableRow.jsx';
import TableHeaderCell from './TableHeaderCell.jsx';
import GridView from './GridView.jsx';
import styles from '../../styles/AppStyles.css'
var flag = false, skipcount = 0;
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
        this.columns = [
            {
                columnkey: "counterparty",
                columnvalue: "counterparty"
            },
            {
                columnkey: "receiveIndex",
                columnvalue: "receiveIndex"
            },
            {
                columnkey: "lastUpdate",
                columnvalue: "lastUpdate"
            },
            {
                columnkey: "receivePrice",
                columnvalue: "receivePrice"
            },
            {
                columnkey: "id",
                columnvalue: "id"
            },
            {
                columnkey: "price",
                columnvalue: "price"
            },
            {
                columnkey: "payPrice",
                columnvalue: "payPrice"
            },
            {
                columnkey: "name",
                columnvalue: "name"
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
                columnkey: "amerEuro",
                columnvalue: "amerEuro"
            },
            {
                columnkey: "putCall",
                columnvalue: "putCall"
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

        /** Event Handlers */
        this.updateDataGrid = this.updateDataGridWithDefaultView.bind(this);
        this.updateDataGridWithGroupedView = this.updateDataGridWithGroupedView.bind(this);
        this.loadDataGridWithGroupedView = this.loadDataGridWithGroupedView.bind(this);
        this.rowUpdate = this.rowUpdate.bind(this);
        this.scrollEventHandler = this.scrollEventHandler.bind(this);
        this.makeDefaultSubscription = this.makeDefaultSubscription.bind(this);
        this.makeGroupSubscription = this.makeGroupSubscription.bind(this);
        this.updateAggregatedRowExpandStatus = this.updateAggregatedRowExpandStatus.bind(this);
    }

    componentWillMount() {

    }

    componentDidMount() {
        this.makeDefaultSubscription();
    }

    componentDidUpdate() {
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
        this.controller = new TableController(this,this.subscriptionTopic);
        let commandObject1 = {
            "command": "sow_and_subscribe",
            "topic": this.subscriptionTopic,
            "orderBy": "/name"
        }

        this.controller.ampsSubscribe1(commandObject1);
       
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
        let upperLimit = startIndex + viewableUpperLimit < endIndex ? startIndex + viewableUpperLimit : endIndex;
        this.refs.blotterInfo.updateGroupedViewStateTo(false);
        this.refs.blotterInfo.updateRowViewInfo(lowerLimit, upperLimit, this.controller.getDatamapSize());
    }

    updateDataGridWithDefaultView() {
        let gridDiv = document.getElementById('scrollableTableDiv');

        let startIndex = Math.round(gridDiv.scrollTop / this.props.rowHeight);
        let endIndex = startIndex + 50;
        let viewableUpperLimit = Math.round(gridDiv.clientHeight / this.props.rowHeight);
        let lowerLimit = startIndex + 1;
        let upperLimit = startIndex + viewableUpperLimit < endIndex ? startIndex + viewableUpperLimit : endIndex;

        this.setState(this.controller.getDefaultViewData(startIndex, endIndex, this.props.rowHeight, this.state.isGroupedView));
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


    /** ROW DATA UI UPDATE HANDLER **/
    rowUpdate(data, rowReference) {
        let rowElem = this.refs.gridViewRef.refs[rowReference];
        if (rowElem != undefined) {
            rowElem.triggerUpdate(data);
        }
    }

    updateAggregatedRowExpandStatus(groupKey) {
        this.controller.updateGroupExpansionStatus(groupKey);
    }

    // subscribeForMultiLevelGrouping() {

    //     let commandObject = {
    //         "command": "sow_and_subscribe",
    //         "topic": "Price",
    //         "filter": "/swapId >=0",
    //         "orderBy": "/customer",
    //         "options": "projection=[/customer,/receiveIndex,/swapId,/interest,sum(/swap_rate) as /swap_rate,/yearsIn,/payFixedRate,/payCurrency],grouping=[/customer,/receiveIndex]"
    //     }
    //     let columnName = 'receiveIndex';
    //     this.controller.ampsGroupSubscribe(commandObject, this.controller.multiGroupingDataHandler.bind(this.controller), this.controller.multiGroupingSubscriptionDetailsHandler.bind(this.controller), columnName);
    // }

    clearGrouping() {
        this.controller.clearGroupSubscriptions();
        this.controller.clearArray(this.controller.groupingColumnsByLevel);
        this.loadDataGridWithDefaultView();
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
            if (this.controller.getGroupingColumnsArray().length == 0) {
                this.refs.dragToBar.removeChild(this.refs.dragToBar.firstChild);
            }
            let clonedColumnElement = document.getElementById(columnData.cellId).cloneNode(true);
            clonedColumnElement.style.color = "#1E0B06";
            clonedColumnElement.style.backgroundColor = "yellow";
            clonedColumnElement.style.height = this.refs.dragToBar.offsetHeight + "px";
            this.refs.dragToBar.appendChild(clonedColumnElement);
            this.makeGroupSubscription(columnData.cellId);
        }
    }

    render() {
        return (
            <div>
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
                    <div id="scrollableTableDiv" className={styles.tableDiv} onScroll={this.scrollEventHandler}>
                        <GridView isGroupedView={this.state.isGroupedView}
                            ref='gridViewRef'
                            viewableData={this.state.gridDataSource}
                            topDivHeight={this.state.topDivHeight}
                            bottomDivHeight={this.state.bottomDivHeight}
                            columnKeyValues={this.columns}
                            selectionDataUpdateHandler={this.props.selectionDataUpdateHandler}
                            dataUpdateStatus={this.props.rowDataUpdateStatus}
                            updateAggregatedRowExpandStatus={this.updateAggregatedRowExpandStatus} />
                    </div>
                </div>
            </div>
        );
    }
}


export default TableView;