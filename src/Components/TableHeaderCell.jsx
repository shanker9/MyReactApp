import React from 'react';
import styles from '../../styles/AppStyles.css'

class TableHeaderCell extends React.Component {

    constructor() {
        super();
        this.state = {
            isSelected: false,
        }
        this.columnClickHandler = this.columnClickHandler.bind(this);
    }

    columnClickHandler() {
            this.props.groupingHandler(this.props.cellKey, this.state.isSelected);
    }

    render() {

        return (
            <th className={styles.th} onClick={this.columnClickHandler}>{this.props.cellData}</th>
        )
    }

}


export default TableHeaderCell;