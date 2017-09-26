import React from 'react';
import TableRow from './TableRow.jsx';
import TableHeaderCell from './TableHeaderCell.jsx';
import GridView from './GridView.jsx';
import styles from '../../styles/AppStyles.css'

class TableView extends React.Component {

    constructor() {
        super();

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
    }

    componentDidMount() {

    }

    componentDidUpdate() {
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
                <div id="scrollableTableDiv" className={styles.tableDiv} onScroll={this.props.handleScroll}>
                    <GridView isGroupedView={this.props.isGroupedData}
                        ref='gridViewRef'
                        groupedData={this.props.groupedData}
                        viewableData={this.props.viewableData}
                        topDivHeight={this.props.topDivHeight}
                        bottomDivHeight={this.props.bottomDivHeight}
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