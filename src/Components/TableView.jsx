import React from 'react';
import TableRow from './TableRow.jsx';
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
                                    <th key={i} className={styles.th}>{item}</th>
                                )}
                            </tr>
                        </thead>
                    </table>
                </div>
                <div>
                    <div id="scrollableTableDiv" className={styles.tableDiv} onScroll={this.props.handleScroll}>
                        <GridView isGroupedView= {this.props.isGroupedData}
                            groupedData={this.props.groupedData}
                            viewableData={this.props.viewableData}
                            topDivHeight={this.props.topDivHeight}
                            bottomDivHeight={this.props.bottomDivHeight}
                            selectionDataUpdateHandler={this.props.updateSelected}
                            dataUpdateStatus={this.props.rowDataUpdateStatus} />
                    </div>
                </div>
            </div>

        );
    }
}


export default TableView;