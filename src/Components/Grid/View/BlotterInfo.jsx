import React from 'react';
import styles from '../../../../styles/AppStyles.css'

class BlotterInfo extends React.Component {
    constructor() {
        super();
        this.state = {
            lowerLimit : 0,
            upperLimit : 0,
            dataMapsize : 0,
            isGroupedView : false
        }
    }

    updateRowViewInfo(lowerLimit,upperLimit,dataMapSize){
        this.setState({
            lowerLimit : lowerLimit,
            upperLimit : upperLimit,
            dataMapsize : dataMapSize
        })
    }

    updateGroupedViewStateTo(isGroupedView){
        this.setState({isGroupedView:isGroupedView});
    }

    render() {
        return (
            <div className={styles.blotterinfocontainer}>
                {/* <label className={styles.label}>  SUBSCRIPTION TOPIC : {this.props.subscribedTopic}</label> */}
                {this.state.isGroupedView ?
                <button className={styles.button} onClick={this.props.clearGrouping}>CLEAR GROUPING</button> : ''}
                <label style={{ float: 'right' }}>{this.state.isGroupedView ?'' : `Showing ${this.state.lowerLimit}-${this.state.upperLimit} of ${this.state.dataMapsize}`}</label>
            </div>
        );
    }
}

export default BlotterInfo;