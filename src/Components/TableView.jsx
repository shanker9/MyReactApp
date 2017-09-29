import React from 'react';
import TableController from '../Controllers/AppController.js';
import TableRow from './TableRow.jsx';
import TableHeaderCell from './TableHeaderCell.jsx';
import GridView from './GridView.jsx';
import styles from '../../styles/AppStyles.css'
var flag = false, skipcount=0;
class TableView extends React.Component {

    constructor(props) {
        super(props);
        this.state={
            gridDataSource : [],
            topDivHeight : 0,
            bottomDivHeight : 0
        }
        this.controller = undefined;
        this.columns = ['Counter Party',
                        'SwapId',
                        'Interest',
                        'SwapRate',
                        'YearsIn',
                        'PayFixedRate',
                        'PayCurrency',
                        'YearsLeft',
                        'NewInterest',
                        'SecondaryCurrency',
                        'Customer',
                        'SwapId',
                        'Interest',
                        'YearsPay',
                        'YearsIn',
                        'FixedRate'];


            /** Event Handlers */
            this.updateDataGrid = this.updateDataGrid.bind(this);
            this.rowUpdate = this.rowUpdate.bind(this);            
            this.scrollEventHandler = this.scrollEventHandler.bind(this);
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
    scrollEventHandler(){
        let headerNode = document.getElementById('scrollableHeaderDiv');
        let tableNode = document.getElementById('scrollableTableDiv');
        headerNode.scrollLeft = tableNode.scrollLeft;
        this.updateDataGrid();
    }

    updateDataGrid(){
        let startIndex = Math.round(document.getElementById('scrollableTableDiv').scrollTop / this.props.rowHeight);
        let endIndex = startIndex+50;
        this.setState(this.controller.getDefaultViewData(startIndex,endIndex,this.props.rowHeight));
        
        // this.setState({gridDataSource : gridDataSource, topDivHeight : topDivHeight, bottomDivHeight : bottomDivHeight})
    }

    rowUpdate(data, rowReference) {
        let rowElem = this.refs.gridViewRef.refs[rowReference];
        if (rowElem != undefined) {
            rowElem.triggerUpdate(data);
        }
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
                                        groupingHandler={this.props.groupingHandler}
                                        cellData={item} />
                                )}
                            </tr>
                        </thead>
                    </table>
                </div>
                <div id="scrollableTableDiv" className={styles.tableDiv} onScroll={this.scrollEventHandler}>
                    <GridView isGroupedView={this.props.isGroupedData}
                        ref='gridViewRef'
                        groupedData={this.props.groupedData}
                        viewableData={this.state.gridDataSource}
                        topDivHeight={this.state.topDivHeight}
                        bottomDivHeight={this.state.bottomDivHeight}
                        selectionDataUpdateHandler={this.props.selectionDataUpdateHandler}
                        dataUpdateStatus={this.props.rowDataUpdateStatus}
                        updateAggregatedRowExpandStatus={this.props.updateAggregatedRowExpandStatus}
                        viewableStartIndex={this.props.viewableStartIndex} />
                </div>
            </div>
        );
    }
}


export default TableView;