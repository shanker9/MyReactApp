import AmpsController from '../Amps/AmpsData.js';
import AppDataModel from '../DataModel/AppDataModel.js';

export default class TableController {
    constructor(componentRef) {
        this.uiRef = componentRef;
        this.ampsController = new AmpsController();
        this.isGroupedView = undefined;
        this.appDataModel = new AppDataModel();
        this.groupingColumnKeyMap = undefined;
        this.aggregatedRowsData = undefined;
        this.subscriptionData = new Map();
    }

    ampsSubscribe(commandObject, sowDataHandler, subscriptionDataHandler, columnName) {
        this.ampsController.connectAndSubscribe(sowDataHandler, subscriptionDataHandler, commandObject, columnName);
    }

    unsubscribe(subscriptionId) {
        this.ampsController.unsubscribe(subscriptionId);
    }

    /*** DATA HANDLERS ***/

    defaultSubscriptionDataHandler(message) {
        if (message.c == 'group_begin') {
            console.log(message.c);
            return;
        } else if (message.c == 'group_end') {
            // this.sowDataEnd = true;
            console.log(message.c);
            this.uiRef.loadDataGridWithDefaultView();
            return;
        }

        let newData = message.data;
        let rowKey = message.k;
        let item = this.appDataModel.getDataFromDefaultData(rowKey);

        if (item == undefined) {
            this.appDataModel.addorUpdateRowData(rowKey, { "rowID": newData.swapId - 1, "data": newData, "isSelected": false, "isUpdated": false });
        } else {
            this.appDataModel.addorUpdateRowData(rowKey, { "rowID": item.rowID, "data": newData, "isSelected": item.isSelected, "isUpdated": true });

            if (this.isGroupedView) {
                let grpObject = this.appDataModel.getDataFromGroupedData(this.groupingColumnKeyMap.get(newData.customer));
                let existingData = grpObject.bucketData.get(rowKey);
                existingData.data = newData;
            }
            this.uiRef.rowUpdate(newData, 'ref' + item.rowID);
        }


    }

    defaultSubscriptionDetailsHandler(subscriptionId) {
        console.log('Default Subscription ID:', subscriptionId);
    }

    getDefaultViewData(startIndex, endIndex, rowHeight) {
        let gridDataSource = this.appDataModel.getDataMapInRangeFromDefaultData(startIndex, endIndex);
        let topDivHeight = startIndex * rowHeight;
        let bottomDivHeight = (this.appDataModel.getdefaultDataViewSize() - (startIndex + gridDataSource.length)) * rowHeight;
        return { gridDataSource, topDivHeight, bottomDivHeight };
    }


    /** GROUP SUBSCRIPTION DATAHANDLER **/

    groupingSubscriptionDataHandler(message) {
        if (message.c == 'group_begin') {
            this.groupingColumnKeyMap = new Map();
            this.aggregatedRowsData = new Map();
            return;
        } else if (message.c == 'group_end') {
            this.sowGroupDataEnd = true;
            this.appDataModel.createGroupBuckets(this.groupingColumnKeyMap, this.aggregatedRowsData);
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
        this.subscriptionData.set(groupByColumn, subscriptionId);
        console.log('GROUPING SUBSCRIPTION SUCCESSFUL, ID:', subscriptionId);
    }

    isSubscriptionExists(groupByColumn) {
        let subscriptionId = this.subscriptionData.get(groupByColumn);
        if (subscriptionId != undefined) {
            // this.unsubscribe(subscriptionId);
            // this.subscriptionData.delete(groupByColumn);
            return true;
        }
        return false;
    }

    getGroupedViewData(startIndex, endIndex, rowHeight) {
        let gridDataSource = this.appDataModel.getDataMapInRangeFromGroupedData(startIndex, endIndex);
        let topDivHeight = startIndex * rowHeight;
        let bottomDivHeight = (this.appDataModel.getGroupedDataViewSize() - (startIndex + gridDataSource.length)) * rowHeight;
        return { gridDataSource, topDivHeight, bottomDivHeight };
    }

    updateGroupExpansionStatus(groupKey) {
        let expandStatus = this.appDataModel.getDataFromGroupedData(groupKey).showBucketData;
        this.appDataModel.getDataFromGroupedData(groupKey).showBucketData = !expandStatus;
        this.appDataModel.setGroupedViewData();
        this.uiRef.updateDataGridWithGroupedView();
    }
}