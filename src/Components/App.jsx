import React from 'react';
import AppController from '../Controllers/TableController.js';
import TableRow from './TableRow.jsx';
import TableView from './TableView.jsx';
import styles from '../../styles/AppStyles.css'
import GridView from './GridView.jsx'
import Graph from './Graph.jsx';
// import * as d3 from 'd3';
import D3Tree from './D3Tree.jsx'
import MyComponent from './D3React.jsx';

var scrollUpdateDelay = true;
class App extends React.Component {

    constructor() {
        super();
        this.state = {
            rowHeight: 20,
            subscribedTopic: 'Price'
        }
        this.renderD3Chart = this.renderD3Chart.bind(this);
        this.treeData = [
            {
                "name": "Top Level",
                "parent": "null",
                "children": [
                    {
                        "name": "Level 2: A",
                        "parent": "Top Level",
                        "children": [
                            {
                                "name": "Level 3: A",
                                "parent": "Level 2: A"
                            },
                            {
                                "name": "Level 3: B",
                                "parent": "Level 2: A"
                            }
                        ]
                    },
                    {
                        "name": "Level 2: B",
                        "parent": "Top Level"
                    }
                ]
            }
        ];
    }

    componentDidMount() {
        this.renderD3Chart();
    }

    renderD3Chart() {
        // let data = [30, 86, 168, 281, 303, 365, 900];

        // let container = d3.select("#graphContainer");

        // let allDivs = container.selectAll("div");
        // let createdDivs = allDivs.data(data)
        //     .enter()
        //     .append("div");

        // var x = d3.scaleLinear()
        //     .domain([0, d3.max(data)])
        //     .range([0, 500]);

        // createdDivs.style("width", function (d) { return `${x(d)}px`; })
        //     .text(function (d) { return `$${d}`; });
    }

    refreshTree() {
        this.refs.tree.forceUpdate();
    }

    render() {
        return (
            <div>
                <button onClick={this.refreshTree.bind(this)} style={{height:'30px',width:'120px'}}>Refresh Tree</button>
                <div>
                    <TableView ref='tableViewRef'
                        subscribedTopic={this.state.subscribedTopic}
                        rowHeight={this.state.rowHeight} />
                </div>
                <div>
                    <MyComponent ref="tree"/>
                </div>
            </div>

        );

    }

}

export default App;