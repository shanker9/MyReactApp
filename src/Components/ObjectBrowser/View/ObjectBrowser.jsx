import React, { Component } from 'react';
import JsonView from 'react-pretty-json';
import styles from '../../../../styles/AppStyles.css';

class ObjectBrowser extends Component {

    constructor(props) {
        super(props);
        this.state = {
            data: this.props.data
        }
    }

    updateData(vertextData) {
        this.setState({ data: vertextData });
    }

    render() {
        return (
            <div className={styles.objectBrowser}>
                <JsonView json={this.state.data} />
            </div>
        );
    }
}

ObjectBrowser.defaultProps = {
    data: {},
}

export default ObjectBrowser;