import React from 'react';
import Tree from 'react-d3-tree';
import * as d3 from 'd3';

const myTreeData = [
    {
        name: 'Top Level',
        children: [
            {
                name: 'Level 2: A',
                children: [
                    {
                        name: 'Level 3: AA',
                    },
                    {
                        name: 'Level 3: AB',
                    },
                ],
            },
            {
                name: 'Level 2: B',
                children: [
                    {
                        name: 'Level 3: BA',
                    },
                    {
                        name: 'Level 3: BB',
                        children: [
                            {
                                name: 'Level 4: BBA',
                            },
                            {
                                name: 'Level 4: BBB',
                            },
                        ],
                    },
                ],
            },
        ]
    }
];

const svgSquare = {
    shape: 'rect',
    shapeProps: {
        width: 120,
        height: 30,
        x: -10,
        y: -20,
    }
}

const styl = {
    links: {
        stroke: 'black',
        strokeWidth: 3,
    },
    nodes: {
        node: {
            circle: {},
            name: {},
            attributes: {},
        },
        leafNode: {
            circle: { fill: 'grey' },
            name: {},
            attributes: {},
        },
    },
}
//7B9C7B
class MyComponent extends React.Component {

    constructor() {
        super();
        this.state = {
            backgroundColor: '#779CBB',
            toggle: false
        }

        this.translateGraphOrigin = { x: 320, y: 100 };
        this.nodeClickHandler = this.nodeClickHandler.bind(this);
    }

    componentDidMount() {
        const svg = d3.select('.rd3t-svg');
        const g = d3.select('.rd3t-g');
        const treeWrapper = document.getElementById("treeWrapper");
        const x= treeWrapper.clientWidth/3,
                y=treeWrapper.clientHeight/4;
        g.attr(
              'transform',
              `translate(${x},${y})`,
            );
        svg.attr('width',treeWrapper.clientWidth);
        svg.attr('height',treeWrapper.clientHeight);
    }

    nodeClickHandler(nodeData) {
        console.log(nodeData);
    }

    forceUpdate() {
        this.setState({ toggle: !this.state.toggle });
    }

    render() {
        return (
            <div id="treeWrapper" style={{ width: '70%', height: '20em', backgroundColor: this.state.toggle ? 'green' : this.state.backgroundColor }}>
                <Tree data={myTreeData}
                    nodeSvgShape={svgSquare}
                    orientation="vertical"
                    collapsible={false}
                    styles={styl}
                    pathFunc="straight"
                    onClick={this.nodeClickHandler} 
                    depthFactor={60} />
            </div>
        );
    }
}

export default MyComponent