import React from 'react';
import AppController from '../Controllers/TableController.js';
import TableRow from './TableRow.jsx';
import TableView from './TableView.jsx';
import styles from '../../styles/AppStyles.css'
import GridView from './GridView.jsx'
import Graph from './Graph.jsx';
var scrollUpdateDelay = true;
class App extends React.Component {

    constructor() {
        super();
        this.state = {
            rowHeight: 20,
            subscribedTopic: 'Price'
        }
    }

    divDropped(ev){
        console.log(ev.target);
    }

    render() {
        return (
            <div>
                <div>
                    <TableView ref='tableViewRef'
                        subscribedTopic={this.state.subscribedTopic}
                        rowHeight={this.state.rowHeight} />
                </div>
                <div className={styles.graphcontainer}
                    onDragOver={event => event.preventDefault()}
                    onDrop={this.divDropped.bind(this)}>
                    <Graph />
                </div>
            </div>

        );

    }

}

export default App;