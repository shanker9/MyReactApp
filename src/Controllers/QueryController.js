import AmpsControllerSingleton from '../Amps/AmpsController.js';
import AppDataModelSingleton from '../DataModel/AppDataModel.js';

export default class QueryController {
    constructor() {
        this.ampsController = AmpsControllerSingleton.getInstance();
        this.parentNodeSubscriptionId = undefined;
    }

    getGraphDataWithId(queryTopic, filter, dataHandler, subscriptionIdHandler, queryId) {
        let subscriptionId, commandObject = {
            "command": "sow_and_subscribe",
            "topic": queryTopic,
            "filter": filter
        };
        this.ampsController.connectAndSubscribe(dataHandler, subscriptionIdHandler, commandObject);
    }

    getParentNodeData(queryTopic, nodeId, callback) {
        let graphNodeData, isSowDataEnd;
        return new Promise((resolve, reject) => {
            this.getGraphDataWithId(queryTopic, `/id=="${nodeId}"`, (message) => {

                // console.log("UPDATE: ",message.c,message.data);
                if (message.c == 'group_begin') { return; }
                else if (message.c == 'group_end') {
                    isSowDataEnd = true;
                    resolve(graphNodeData);
                }
                else {
                    if (isSowDataEnd) {
                        callback(message.data);
                        return;
                    }
                    graphNodeData = message.data;
                }
            }, subId => this.parentNodeSubscriptionId = subId)
        })
    }

    getGraphDataForNodeWithId(queryTopic, nodeId, unsubscribeAfterSowData, callback) {
        let graphNodeData, subscriptionId, isSowDataEnd;
        return new Promise((resolve, reject) => {
            this.getGraphDataWithId(queryTopic, `/id=="${nodeId}"`, (message) => {

                if (message.c == 'group_begin') { return; }
                else if (message.c == 'group_end') {
                    this.ampsController.unsubscribe(subscriptionId, unsubscribeId => console.log('Query Unsubscribed Id:', unsubscribeId))
                    resolve(graphNodeData);
                }
                graphNodeData = message.data;
            }, subId => subscriptionId = subId)
        })
    }

    unsubscribeParentNodeData() {
        if (this.parentNodeSubscriptionId != undefined) {
            this.ampsController.unsubscribe(this.parentNodeSubscriptionId, unsubscribeId => console.log('Query Unsubscribed Id:', unsubscribeId));
        }
    }

    getGraphNodesDataArrayWithIds(queryTopic, nodeIdArray) {
        let subscriptionId, graphNodesArray = [];
        let commaSeparatedNodeIds = nodeIdArray.map(item => `"${item}"`).join(',');
        let queryString = `/id in (${commaSeparatedNodeIds})`;

        return new Promise((resolve, reject) => {
            this.getGraphDataWithId(queryTopic, queryString, (message) => {
                if (message.c == 'group_begin') { return; }
                else if (message.c == 'group_end') {
                    this.ampsController.unsubscribe(subscriptionId, unsubscribeId => console.log('Query Unsubscribed Id:', unsubscribeId))
                    resolve(graphNodesArray);
                }
                else {
                    graphNodesArray.push(message.data);
                }
            }, subId => subscriptionId = subId)
        })
    }

}