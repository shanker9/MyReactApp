import React, { Component } from 'react';
import styles from '../../styles/AppStyles.css'

class BlotterInfo extends Component() {
    constructor(props) {
        super(props);
        this.state = {
            lowerLimit : 0,
            upperLimit : 0,
            dataMapsize : 0
        }
    }

    updateRowViewInfo(lowerLimit,upperLimit,dataMapSize){
        this.setState({
            lowerLimit : lowerLimit,
            upperLimit : upperLimit,
            dataMapsize : dataMapSize
        })
    }

    render() {
        return (
            <div className={styles.container}>
                <h1 className={styles.header}>Random Data from AMPS</h1>
                <label className={styles.label}>  SUBSCRIPTION TOPIC : {this.props.subscribedTopic}</label>
                <button className={styles.button} onClick={this.props.clearGrouping}>CLEAR GROUPING</button>
                <label style={{ float: 'right' }}>{!this.isGroupedView ? 'Showing ' + this.state.lowerLimit + '-' + this.state.upperLimit + ' of ' + this.state.dataMapsize : ''}</label>
            </div>
        );
    }
}

export default BlotterInfo