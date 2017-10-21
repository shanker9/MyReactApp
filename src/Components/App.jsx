import React from 'react';
import AppController from '../Controllers/TableController.js';
import TableRow from './TableRow.jsx';
import TableView from './TableView.jsx';
import styles from '../../styles/AppStyles.css'
import GridView from './GridView.jsx'
import MyComponent from './D3React.jsx';
import AmpsController from '../Amps/AmpsData.js';


var scrollUpdateDelay = true;
class App extends React.Component {

    constructor() {
        super();
        this.state = {
            rowHeight: 20,
            subscriptionTopic: 'ProductAll2'
        }
    }

    componentDidMount() {
    }

    groupSubscription(){
        let command = 'sow_and_subscribe';
        let topic = 'ProductAll2';
        // let filter = '/swapId >=0';

        let groupingObject = '/values/values/counterparty/strVal';

        let options = `projection=[/values/values/counterparty/strVal,/key/name],grouping=[${groupingObject}]`;

        let commandObject = { command, topic, options };

        let ampsController = new AmpsController();
        var groupedData = new Map();
        ampsController.connectAndSubscribe((message)=>{
            if (message.c == 'group_begin') {
                console.log('groupbegin');
            } else if (message.c == 'group_end') {
                console.log('groupend');
            }
                let data = message.data;
            groupedData.set(message.k,data);
        },
        (subId,column)=>console.log('GROUPING SUBID:',subId),
        commandObject, 'counterparty');
    }

    render() {
        return (
            <div>
                <button style={{width:'120px',height:'30px'}} onClick={this.groupSubscription.bind(this)}>GroupSub</button>
                <div className={styles.gridAndChartContainer}>
                    <div className={styles.tablecontainer}>
                        <TableView ref='tableViewRef'
                        subscriptionTopic={this.state.subscriptionTopic}
                            rowHeight={this.state.rowHeight} />
                    </div>

                    <div className={styles.chartContainer}>
                        Space for vol surface
                    </div>
                </div>
                <div className={styles.graphAndObjectBrowserContainer}>
                    <MyComponent />

                    <div className={styles.objectBrowserContainer}>
                        Space for object browser
                    </div>
                </div>
            </div>

        );
    }

}

export default App;