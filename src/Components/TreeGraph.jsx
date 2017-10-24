import React from 'react';
import Tree from 'react-d3-tree';
import * as d3 from 'd3';
import styles from '../../styles/AppStyles.css'


const myTreeData = [{
    name : "Root",
    children: [
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

                sourceData: {
                    attributes: {
                        keyA: 'val A',
                        keyB: 'val B',
                        keyC: 'val C',
                    }
                }
            },
            {
                name: 'Level 2: B',
                children: [
                    {
                        name: 'Level 3: BA',
                        children: [
                            {
                                name: 'Level 4: BAA',
                            },
                            {
                                name: 'Level 4: BAB',
                            },
                        ]
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
    },
    {
        name: 'second Level',
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

                sourceData: {
                    attributes: {
                        keyA: 'val A',
                        keyB: 'val B',
                        keyC: 'val C',
                    }
                }
            },
            {
                name: 'Level 2: B',
                children: [
                    {
                        name: 'Level 3: BA',
                        children: [
                            {
                                name: 'Level 4: BAA',
                            },
                            {
                                name: 'Level 4: BAB',
                            },
                        ]
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
]}];

const svgSquare = {
    shape: 'rect',
    shapeProps: {
        width: 120,
        height: 30,
        x: -50,
        y: -20,
    }
}

const textlayout = {
    textAnchor: 'start',
    x: -30,
    y: -5,
}

const styl = {
    links: {
        stroke: 'black',
        strokeWidth: 3,
    },
    nodes: {
        node: {
            circle: { fill: '#51748B' },
            name: {},
            attributes: {},
        },
        leafNode: {
            circle: { fill: 'lemonchiffon' },
            name: {},
            attributes: {},
        },
    },
}

class TreeGraph extends React.Component {

    constructor() {
        super();
        this.state = {
            backgroundColor: '#51748B',
            toggle: false,
            translateGraphOrigin: { x: 320, y: 100 }
        }

        this.nodeClickHandler = this.nodeClickHandler.bind(this);
    }


    componentDidMount() {

        // const svg = d3.select('.rd3t-svg');
        // const g = d3.select('.rd3t-g');
        const treeWrapper = document.getElementById("treeWrapper");
        const x = treeWrapper.clientWidth * 0.4,
            y = treeWrapper.clientHeight * 0.2;

        this.setState({ translateGraphOrigin: { x, y } })
        // let newx = this.state.translateGraphOrigin.x+100,
        //     newy = this.state.translateGraphOrigin.y,
        //     newTranslateOrigin = {x:newx,y:newy};

        // setTimeout(()=>{
        //     this.setState({translateGraphOrigin:newTranslateOrigin});
        // },3000);
    }

    nodeClickHandler(nodeData) {
        console.log(nodeData);
    }

    forceUpdate() {
        this.setState({ toggle: !this.state.toggle });
    }

    render() {
        return (
            <div id="treeWrapper" className={styles.graphContainer} >
                <Tree data={myTreeData}
                    nodeSvgShape={svgSquare}
                    orientation="vertical"
                    collapsible={false}
                    styles={styl}
                    pathFunc="straight"
                    onClick={this.nodeClickHandler}
                    depthFactor={60}
                    textLayout={textlayout}
                    translate={this.state.translateGraphOrigin} />
            </div>
        );
    }
}

export default TreeGraph