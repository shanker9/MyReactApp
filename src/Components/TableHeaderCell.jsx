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
            // this.props.groupingHandler(this.props.cellKey, this.state.isSelected);
    }

    dragStart(event){
        // console.log('Dragged Element: ',event.target);
        const cellId = this.props.cellKey;
        const isSelected = this.state.isSelected;
        event.dataTransfer.setData("groupingColumnData",JSON.stringify({cellId:cellId,isSelected:isSelected}));
    }

    render() {

        return (
            <th id={this.props.cellKey}
                className={styles.th} 
                onClick={this.columnClickHandler}
                onDragStart={this.dragStart.bind(this)}
                draggable="true">{this.props.cellData}</th>
        )
    }

}


export default TableHeaderCell;