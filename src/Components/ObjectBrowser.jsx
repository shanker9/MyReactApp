import React, { Component } from 'react';
import JSONTree from 'react-json-tree';
import ReactJson from 'react-json-view';
import JsonView from 'react-pretty-json';
import styles from '../../styles/AppStyles.css';

class ObjectBrowser extends Component {

    constructor(props) {
        super(props);

        this.state = {
            data: this.props.data
        }
        this.theme = {
            scheme: 'monokai',
            base00: '#ffffff',
            base01: '#383830',
            base02: '#49483e',
            base03: '#75715e',
            base04: '#a59f85',
            base05: '#f8f8f2',
            base06: '#f5f4f1',
            base07: '#f9f8f5',
            base08: '#f92672',
            base09: '#fd971f',
            base0A: '#f4bf75',
            base0B: '#000203',
            base0C: '#a1efe4',
            base0D: '#755b06',
            base0E: '#ae81ff',
            base0F: '#cc6633'
        };
    }

    updateData(vertextData) {
        this.setState({ data: vertextData });
    }

    render() {
        return (
                <div className={styles.objectBrowser}>
                    {/* <JSONTree data={this.state.data} theme={'monokai'} hideRoot={true} invertTheme={true} /> */}
                    {/* <ReactJson src={this.state.data} name={false} theme="Hopscotch"/> */}
                    <JsonView json={this.state.data} />
                </div>
        );
    }
}

ObjectBrowser.defaultProps = {
    data: {},
}

export default ObjectBrowser;