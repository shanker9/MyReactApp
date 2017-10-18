import React from 'react';
import AppController from '../Controllers/TableController.js';
import TableRow from './TableRow.jsx';
import TableView from './TableView.jsx';
import styles from '../../styles/AppStyles.css'
import GridView from './GridView.jsx'
import MyComponent from './D3React.jsx';

var scrollUpdateDelay = true;
class App extends React.Component {

    constructor() {
        super();
        this.state = {
            rowHeight: 20,
            subscribedTopic: 'ProductDetails'
        }
    }

    componentDidMount() {
    }

    render() {
        return (
            <div>
                <div className={styles.gridAndChartContainer}>
                    <div className={styles.tablecontainer}>
                        <TableView ref='tableViewRef'
                            subscribedTopic={this.state.subscribedTopic}
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