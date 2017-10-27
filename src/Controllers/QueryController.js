import AmpsControllerSingleton from '../Amps/AmpsData.js';
import AppDataModelSingleton from '../DataModel/AppDataModel.js';

export default class QueryController {
    constructor() {
        this.ampsController = AmpsControllerSingleton.getInstance();
    }

    getGraphDataWithId(queryTopic, filter, dataHandler, subscriptionIdHandler) {
        let subscriptionId, commandObject = {
            "command": "sow_and_subscribe",
            "topic": queryTopic,
            "filter": filter
        };
        this.ampsController.connectAndSubscribe(dataHandler, subscriptionIdHandler, commandObject);
    }

    getGraphDataForNodeWithId(queryTopic, nodeId, unsubscribeAfterSowData, callback) {
        let graphNodeData, subscriptionId, isSowDataEnd;
        return new Promise((resolve, reject) => {
            this.getGraphDataWithId(queryTopic, `/id=="${nodeId}"`, (message) => {
                if (message.c == 'group_begin') { return; }
                else if (message.c == 'group_end') {
                    if (unsubscribeAfterSowData) {
                        this.ampsController.unsubscribe(subscriptionId, unsubscribeId => console.log('Query Unsubscribed Id:', unsubscribeId))
                    }
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
            }, subId => subscriptionId = subId)
        })
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