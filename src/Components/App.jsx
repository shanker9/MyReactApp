import React from 'react';
import AppController from '../Controllers/TableController.js';
import TableRow from './TableRow.jsx';
import TableView from './TableView.jsx';
import styles from '../../styles/AppStyles.css'
import GridView from './GridView.jsx'
var scrollUpdateDelay = true;
class App extends React.Component {

    constructor() {
        super();
        this.state = {
            rowHeight: 20,
            subscribedTopic: 'Price'
        }
    }

    clearGrouping() {
        this.refs.tableViewRef.clearGrouping();
    }

    render() {
        return (
            <div>
                <div>
                    <TableView ref='tableViewRef'
                        subscribedTopic={this.state.subscribedTopic}
                        rowHeight={this.state.rowHeight} />
                </div>
            </div>
        );

    }

}

export default App;