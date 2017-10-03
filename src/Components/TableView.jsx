import React from 'react';
import TableController from '../Controllers/AppController.js';
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
                columnvalue: "Counter Party"
            },
            {
                columnkey: "receiveindex",
                columnvalue: "Receive Index"
            },            
            {
                columnkey: "swapid",
                columnvalue: "Swap Id"
            },
            {
                columnkey: "interest",
                columnvalue: "Interest"
            },
            {
                columnkey: "swaprate",
                columnvalue: "Swap Rate"
            },
            {
                columnkey: "yearsin",
                columnvalue: "Years In"
            },
            {
                columnkey: "payfixedrate",
                columnvalue: "Pay FixedRate"
            },
            {
                columnkey: "paycurrency",
                columnvalue: "Pay Currency"
            },
            {
                columnkey: "yearsleft",
                columnvalue: "Years Left"
            },
            {
                columnkey: "newinterest",
                columnvalue: "New Interest"
            },
            {
                columnkey: "secondarycurrency",
                columnvalue: "Secondary Currency"
            },
            {
                columnkey: "customer",
                columnvalue: "Customer"
            },
            {
                columnkey: "swapid",
                columnvalue: "Swap Id2"
            },
            {
                columnkey: "interest",
                columnvalue: "Interest"
            },
            {
                columnkey: "yearspay",
                columnvalue: "Years Pay"
            },
            {
                columnkey: "yearsin",
                columnvalue: "Years In"
            },
            {
                columnkey: "paycurrency",
                columnvalue: "Pay Currency"
            }
        ];


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
        this.makeDefaultSubscription();
    }

    componentDidMount() {

    }

    componentDidUpdate() {
    }

    makeDefaultSubscription() {
        this.controller = new TableController(this);
        let commandObject = {
            "command": "sow_and_subscribe",
            "topic": "Price",
            "filter": "/swapId >=0 AND /swapId<=5000",
            "orderBy": "/swapId"
        }

        this.controller.ampsSubscribe(commandObject,
            this.controller.defaultSubscriptionDataHandler.bind(this.controller),
            this.controller.defaultSubscriptionDetailsHandler.bind(this.controller));
    }

    /*** EventHandler for scrolling of Tabledata ***/
    scrollEventHandler() {
        let headerNode = document.getElementById('scrollableHeaderDiv');
        let tableNode = document.getElementById('scrollableTableDiv');
        headerNode.scrollLeft = tableNode.scrollLeft;
        if(this.state.isGroupedView){
            this.updateDataGridWithGroupedView();
        }else{
            this.updateDataGridWithDefaultView();            
        }
    }

    /** SINGLE VIEW METHODS**/
    loadDataGridWithDefaultView(){
        let startIndex = 0;
        let endIndex = startIndex + 50;
        document.getElementById('scrollableTableDiv').scrollTop = 0;
        let {gridDataSource,topDivHeight,bottomDivHeight} = this.controller.getDefaultViewData(startIndex, endIndex, this.props.rowHeight, this.state.isGroupedView);
        this.setState({
            gridDataSource: gridDataSource,
            topDivHeight: topDivHeight,
            bottomDivHeight: bottomDivHeight,
            isGroupedView: false
        });
    }

    updateDataGridWithDefaultView() {
        let startIndex = Math.round(document.getElementById('scrollableTableDiv').scrollTop / this.props.rowHeight);
        let endIndex = startIndex + 50;
        this.setState(this.controller.getDefaultViewData(startIndex, endIndex, this.props.rowHeight, this.state.isGroupedView));
    }


    /** GROUPED VIEW METHODS  **/

    loadDataGridWithGroupedView() {
        let startIndex = 0;
        let endIndex = startIndex + 50;
        document.getElementById('scrollableTableDiv').scrollTop = 0;
        let {gridDataSource,topDivHeight,bottomDivHeight} = this.controller.getGroupedViewData(startIndex, endIndex, this.props.rowHeight, this.state.isGroupedView);
        this.setState({
            gridDataSource: gridDataSource,
            topDivHeight: topDivHeight,
            bottomDivHeight: bottomDivHeight,
            isGroupedView: true
        });
    }

    updateDataGridWithGroupedView() {
        let startIndex = Math.round(document.getElementById('scrollableTableDiv').scrollTop / this.props.rowHeight);
        let endIndex = startIndex + 50;
        this.setState(this.controller.getGroupedViewData(startIndex, endIndex, this.props.rowHeight, this.state.isGroupedView));
    }

    rowUpdate(data, rowReference) {
        let rowElem = this.refs.gridViewRef.refs[rowReference];
        if (rowElem != undefined) {
            rowElem.triggerUpdate(data);
        }
    }

    makeGroupSubscription(columnName) {
        let commandObject, groupingColumnKey;
        if(this.controller.isSubscriptionExists(columnName)){
            if(this.state.isGroupedView){
                this.loadDataGridWithDefaultView();
                return;                
            }else{
                this.loadDataGridWithGroupedView();
                return;
            }
        }

        switch (columnName) {
            case 'Counter Party':
                commandObject = {
                    "command": "sow_and_subscribe",
                    "topic": "Price",
                    "filter": "/swapId >=0",
                    "orderBy": "/swapId",
                    "options": "projection=[/customer,/receiveIndex,/swapId,/interest,sum(/swap_rate) as /swap_rate,/yearsIn,/payFixedRate,/payCurrency],grouping=[/customer]"
                }
                groupingColumnKey = 'customer';
                break;
            case 'SwapId':
                commandObject = {
                    "command": "sow_and_subscribe",
                    "topic": "Price",
                    "filter": "/swapId >=0",
                    "orderBy": "/swapId",
                    "options": "projection=[/customer,/receiveIndex,/swapId,/interest,sum(/swap_rate) as /swap_rate,/yearsIn,/payFixedRate,/payCurrency],grouping=[/swapId]"
                }
                groupingColumnKey = 'swapId';
                break;
            default:
                console.log('Grouping cannot be done with the selected column');
                return;
        }

        this.controller.ampsSubscribe(commandObject, this.controller.groupingSubscriptionDataHandler.bind(this.controller), this.controller.groupingSubscriptionDetailsHandler.bind(this.controller), columnName);
    }

    updateAggregatedRowExpandStatus(groupKey) {
        this.controller.updateGroupExpansionStatus(groupKey);
    }

    subscribeForMultiLevelGrouping(){
        
        let commandObject = {
                    "command": "sow_and_subscribe",
                    "topic": "Price",
                    "filter": "/swapId >=0",
                    "orderBy": "/customer",
                    "options": "projection=[/customer,/receiveIndex,/swapId,/interest,sum(/swap_rate) as /swap_rate,/yearsIn,/payFixedRate,/payCurrency],grouping=[/customer,/receiveIndex]"
                }
        let columnName = 'multiColumn';
        this.controller.ampsSubscribe(commandObject, this.controller.multiGroupingDataHandler.bind(this.controller), this.controller.multiGroupingSubscriptionDetailsHandler.bind(this.controller), columnName);
    }

    render() {
        return (
            <div className={styles.gridContainerDiv}>
                <div id="scrollableHeaderDiv" className={styles.headerDiv}>
                    <table className={styles.table}>
                        <thead className={styles.tableHead}>
                            <tr className={styles.tableRow}>
                                {this.columns.map((item, i) =>
                                    <TableHeaderCell
                                        key={i}
                                        groupingHandler={this.makeGroupSubscription}
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
                        selectionDataUpdateHandler={this.props.selectionDataUpdateHandler}
                        dataUpdateStatus={this.props.rowDataUpdateStatus}
                        updateAggregatedRowExpandStatus={this.updateAggregatedRowExpandStatus} />
                </div>
            </div>
        );
    }
}


export default TableView;