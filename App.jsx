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
            subscriberId: '',
            totalRecords: 0,
            lastRow : 0,
            loadedRows: 0
        }
        this.handleClick = this.handleClick.bind(this);
        this.updateTable = this.updateTable.bind(this);
        this.handleScroll = this.handleScroll.bind(this);
        this.updateLoadData = this.updateLoadData.bind(this);
        this.refreshChildTable = this.refreshChildTable.bind(this);
        this.addScrollOffset = true;
        this.previousScrollTop = 0;
    }

    componentDidMount(){
        this.state.lastRow = 30;
    }

    updateTable(updateData, subId) {
        if (typeof updateData == 'object') {
            // this.state.data.unshift(updateData); // pushing the data without any update logic
            // let latestData = this.state.data;
            let latestRecords = this.state.totalRecords + 1;
            console.log('total records: ' + latestRecords);
            this.setState({ data: this.state.data.unshift(updateData), totalRecords: latestRecords, subscriberId: '  Subscriber Id: ' + subId })
        }
    }

    updateSubId(subId) {
        this.setState({ subscriberId: subId })
    }

    udpateTotalRecords(totalRecordsCount,loadedRecordsCount) {
        // this.setState({ 
            this.state.totalRecords = totalRecordsCount;
            this.state.loadedRows = loadedRecordsCount;
            this.state.lastRow = loadedRecordsCount;
        // });
    }

    handleClick() {
        let controller = new AmpsClientData();
        // controller.connectAndSubscribe(this.child.updateTableView.bind(this.child), this.updateSubId.bind(this),
            // this.udpateTotalRecords.bind(this));
        controller.testData(this.child.updateTableView.bind(this.child));
        // controller.testData(this.child.updateTableView.bind(this.child));

    }

    updateLastRow(lastRowIndex){
        this.state.lastRow = lastRowIndex;
    }

    handleNewData(newData) {
        
    }



    handleScroll(){
        // let node = document.getElementById('scrollableDiv');
        // if(this.addScrollOffset && node.scrollTop > this.previousScrollTop){
        // // if(this.addScrollOffset){
        //     node.scrollTop = node.scrollTop + Math.floor(node.scrollHeight/15);
        //     this.previousScrollTop = node.scrollTop;
        // }
        // else if(this.addScrollOffset && node.scrollTop < this.previousScrollTop){
        //     node.scrollTop = node.scrollTop - Math.floor(node.scrollHeight/15);
        //     this.previousScrollTop = node.scrollTop;
        // }
        // this.addScrollOffset = !this.addScrollOffset;
        this.updateLoadData();
    }

    updateLoadData(){
        let node = document.getElementById('scrollableDiv');
        console.log('ScrollTop Value: ' + node.scrollTop);
        let scrolledDistance = node.scrollTop;
        let rowHeight = 20;
        let approximateNumberOfRowsHidden = Math.floor(scrolledDistance/rowHeight)==0 ? 0 : Math.floor(scrolledDistance/rowHeight)  ;// NEED TO DO THIS -1 FROM CALCULATION ONCE HEADERROW GOES OUT OF SCROLLAREA
        // let lastRecord = this.state.lastRow < 50 ? 50 : this.state.lastRow;
        
        // if(node.scrollTop < Math.floor(node.scrollHeight/2)){
        //     this.child.sliceLoadableData(0,lastRecord);
        //     // console.log('Fetching records from 0 to 30');
        // }
        // else {
        //     this.child.sliceLoadableData(0,lastRecord + 20);
        //     console.log('Fetching records from 0 to' + (lastRecord+20));
        //     // this.state.lastRow = lastRecord + 20;
        //     // this.state.loadedRows = this.state.lastRow;
        // }
        this.child.sliceLoadableData(approximateNumberOfRowsHidden,approximateNumberOfRowsHidden+20);
        // node.scrollTop = node.scrollTop-approximateNumberOfRowsHidden*20;
        // node.scrollTop = 0;
        this.forceUpdate();
    }

    setScrollHeight(){
        var node = document.getElementById('scrollableDiv');
        console.log('Current Scroll height: ' + node.scrollHeight);
        
        node.scrollHeight = node.scrollHeight + 1;

        console.log('New Scroll height: ' + node.scrollHeight);

    }

    refreshChildTable(){
        var childRefresh = this.child.tableRefresh.bind(this.child);
        console.log('Calling child Refresh');
        childRefresh();
    }

    render() {

        return (
            <div className={styles.container}>
                <h1 className={styles.header}>Random Data from AMPS</h1>
                <button className={styles.button} onClick={this.handleClick.bind(this)}>Subscribe</button>
                <label>Total Records: {this.state.totalRecords}</label>
                <label>  Subscriber Id : {this.state.subscriberId}</label>
                 <label> Loaded Records: {this.state.loadedRows}</label> 
                {/* <button onClick={this.refreshChildTable.bind(this)}>setRefreshInterval</button>   */}
                <div id="scrollableDiv" className={styles.tableDiv} onScroll={this.handleScroll.bind(this)}>
                        <TableView onRef={ref => (this.child = ref)} recordsHandler={this.udpateTotalRecords.bind(this)}
                            scrollStateHandler = {this.updateLoadData} rowIndexHandler={this.updateLastRow.bind(this)}/>
                </div>


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