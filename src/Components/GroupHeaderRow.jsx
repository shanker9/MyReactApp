import React from 'react';
import TableCell from './TableCell.jsx';
import styles from '../../styles/AppStyles.css'

class GroupHeaderRow extends React.Component {

    constructor() {
        super();
        this.state = {
            isSelected: false,
            shouldAnimate: false
        }
        this.dynamicBackgroundColor = 'grey';
        this.handleRowClick = this.handleRowClick.bind(this);
    }

    componentWillMount() {
        this.state.isSelected = this.props.selectState;
        // this.dynamicBackgroundColor = this.state.isSelected ? '#8593A4' : 'white';
    }

    componentWillReceiveProps(nextProps) {
        this.state.isSelected = nextProps.selectState;
    }

    componentWillUpdate() {
        // this.state.shouldAnimate = true;
        this.dynamicBackgroundColor = this.state.isSelected ? '#8593A4' : 'grey';
    }

    handleRowClick(e) {
        e.preventDefault();
        console.log('Is Ctrl Pressed: ' + e.shiftKey);
        this.props.dataUpdateHandler(this.props.indexVal, e.shiftKey); // Update the selection state in the data

    }


    render() {

        return (
            // <tr ref={"tableRow"}
            //     className={styles.tableRow}
            //     onClick={this.handleRowClick}
            //     style={{ backgroundColor: this.dynamicBackgroundColor }}>
            //     <TableCell parentBackgroundColor={this.dynamicBackgroundColor} cellData={this.props.data.customer} childStyle={{ textAlign: 'left', paddingLeft: '10px' }}></TableCell>
            //     <TableCell parentBackgroundColor={this.dynamicBackgroundColor} cellData={this.props.data.swapId}></TableCell>
            //     <TableCell parentBackgroundColor={this.dynamicBackgroundColor} cellData={this.props.data.interest}></TableCell>
            //     <TableCell parentBackgroundColor={this.dynamicBackgroundColor} cellData={this.props.data.swap_rate}></TableCell>
            //     <TableCell parentBackgroundColor={this.dynamicBackgroundColor} cellData={this.props.data.yearsIn}></TableCell>
            //     <TableCell parentBackgroundColor={this.dynamicBackgroundColor} cellData={this.props.data.payFixedRate}></TableCell>
            //     <TableCell parentBackgroundColor={this.dynamicBackgroundColor} cellData={this.props.data.payCurrency}></TableCell>
            //     <TableCell parentBackgroundColor={this.dynamicBackgroundColor} cellData={this.props.data.yearsIn * 2}></TableCell>
            //     <TableCell parentBackgroundColor={this.dynamicBackgroundColor} cellData={this.props.data.interest * 2}></TableCell>
            //     <TableCell parentBackgroundColor={this.dynamicBackgroundColor} cellData={this.props.data.payCurrency}></TableCell>
            //     <TableCell parentBackgroundColor={this.dynamicBackgroundColor} cellData={this.props.data.customer} childStyle={{ textAlign: 'left', paddingLeft: '10px' }}></TableCell>
            //     <TableCell parentBackgroundColor={this.dynamicBackgroundColor} cellData={this.props.data.swapId}></TableCell>
            //     <TableCell parentBackgroundColor={this.dynamicBackgroundColor} cellData={this.props.data.interest}></TableCell>
            //     <TableCell parentBackgroundColor={this.dynamicBackgroundColor} cellData={this.props.data.yearsIn * 3}></TableCell>
            //     <TableCell parentBackgroundColor={this.dynamicBackgroundColor} cellData={this.props.data.yearsIn}></TableCell>
            //     <TableCell parentBackgroundColor={this.dynamicBackgroundColor} cellData={this.props.data.payCurrency}></TableCell>
            // </tr>
            <div>
                <tr ref={"tableRow"}
                    onClick={this.handleRowClick}
                    style={{ backgroundColor: this.dynamicBackgroundColor }}>
                    {this.props.data.customer}
                </tr>
            </div>
        )
    }

}



export default GroupHeaderRow;