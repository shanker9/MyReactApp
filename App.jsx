import React from 'react';
import AmpsClientData from './AmpsData.js';
import TableRow from './TableRow.jsx';
import TableView from './TableView.jsx';
import styles from './AppStyles.css'

class App extends React.Component {

    constructor() {
        super();

        this.state = {
            data: [],
            totalRecords: 0,
            subscriberId : ''
        }
        this.handleClick = this.handleClick.bind(this);
        this.updateTable = this.updateTable.bind(this);
        this.child = undefined;
    }

    updateTable(updateData,subId) {
        if (typeof updateData == 'object') {
            this.state.data.unshift(updateData); // pushing the data without any update logic
            // let latestData = this.state.data;
            let latestRecords = this.state.totalRecords + 1;
            console.log('total records: ' + latestRecords);
            this.setState({ data: this.state.data.unshift(updateData), totalRecords: latestRecords, subscriberId : '  Subscriber Id: '+ subId })
        }
    }

    updateSubId(subId){
        this.setState({subscriberId : subId})
    }

    handleClick() {
        let controller = new AmpsClientData();
        // controller.connectAndSubscribe(this.child.updateTableView.bind(this.child),this.updateSubId.bind(this));
        controller.testData(this.child.updateTableView.bind(this.child));
        // controller.connectAndPublish();
        // if (result) {
        //     controller.connectAndSubscribe();
        //     console.log('Operation completed Successfully');
        // }
        // else {
        //     console.log('Error Occured. See details below...');
        // }
    }



    render() {

        return (
            <div className={styles.container}>
                <h1 className={styles.header}>Random Data from AMPS</h1>
                <button className={styles.button} onClick={this.handleClick.bind(this)}>Subscribe</button>
                {/* <label>Total Records: {this.state.totalRecords}</label> */}
                <label>  Subscriber Id : {this.state.subscriberId}</label>
                <table className={styles.table}>
                    <div className={styles.tableDiv}>
                        <TableView onRef={ref => (this.child = ref)}/>
                    </div>
                </table>

            </div>
        );

    }


}


// export const myStyles = {
//     container : {
//         alignItems : 'center'
//     },
//     header: {
//         fontSize: 25,
//         color: '#c00000'
//     },
//     button: {
//         flex: 1,
//         flexDirection: 'row',
//         height: 25,
//         marginBottom: 10,
//         marginRight: 10,
//         backgroundcolor: 'grey'
//     },
//     td: {
//         border: '1px solid black',
//         width: 100,
//         flexDirection: 'row',
//         fontSize: 15,
//         textAlign: 'center'
//     },
//     table: {
//         borderCollapse: 'collapse',
//         overflow: 'auto'
//     },
//     tableDiv: {
//         height: 500,
//         overflow: 'auto',
//         border: '1px solid grey'
//     }
// }

export default App;