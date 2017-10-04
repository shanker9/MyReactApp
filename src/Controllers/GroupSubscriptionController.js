import AmpsController from '../Amps/AmpsData.js';
import AppDataModel from '../DataModel/AppDataModel.js';

export default class GroupSubscriptionController {
    constructor(componentRef) {
        this.uiRef = componentRef;
        this.ampsController = new AmpsController();
        this.appDataModel = new AppDataModel();
    }


    /** GROUP SUBSCRIPTION DATAHANDLER **/

    ampsGroupSubscribe(commandObject, sowDataHandler, subscriptionDataHandler, columnName) {
        // this.groupingColumnsByLevel.push(columnName);
        this.ampsController.connectAndSubscribe(sowDataHandler, subscriptionDataHandler, commandObject, columnName);
    }

    groupingSubscriptionDataHandler(message) {
        if (message.c == 'group_begin') {
            this.groupingColumnKeyMap = new Map();
            this.aggregatedRowsData = new Map();
            return;
        } else if (message.c == 'group_end') {
            this.sowGroupDataEnd = true;
            // this.appDataModel.createGroupBuckets(this.groupingColumnKeyMap, this.aggregatedRowsData);
            let groupedData = this.appDataModel.getGroupedData();
            if (groupedData == undefined) {
                let var1 = this.createFirstLevelGrouping(this.groupingColumnKeyMap, this.aggregatedRowsData,
                    this.appDataModel.getDataMap());
                this.appDataModel.setGroupedData(var1);
                let groupedViewData = this.appDataModel.getMultiLevelGroupedViewData(var1);
                this.appDataModel.setGroupedViewData(groupedViewData);
            } else {
                this.recursiveFunction(groupedData, this.groupingColumnsByLevel.slice(-1));
            }

            this.isGroupedView = true;
            this.uiRef.loadDataGridWithGroupedView();
            return;
        }

        if (this.sowGroupDataEnd) {
            let val = this.appDataModel.getDataFromGroupedData(message.k);
            let groupHeaderRow = JSON.parse(JSON.stringify(val.groupData));
            groupHeaderRow.swap_rate = message.data.swap_rate;
            groupHeaderRow.payFixedRate = message.data.payFixedRate;
            val.groupData = groupHeaderRow;
            // this.triggerConditionalUIUpdate();
            this.uiRef.rowUpdate(val.groupData, 'ref' + message.k);
        } else {
            this.aggregatedRowsData.set(message.k, message.data);
            this.groupingColumnKeyMap.set(message.data.customer, message.k);
        }
    }

    groupingSubscriptionDetailsHandler(subscriptionId, groupByColumn) {
        // this.subscriptionData.set(groupByColumn, subscriptionId);
        console.log('GROUPING SUBSCRIPTION SUCCESSFUL, ID:', subscriptionId);
    }

    
}