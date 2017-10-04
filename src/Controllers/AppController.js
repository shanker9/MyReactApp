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
        this.groupingColumnsByLevel = [];
        this.multiLevelData = new Map();
        this.valueKeyMapSecondLevel = new Map();
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
            this.appDataModel.addorUpdateRowData(rowKey, { "rowID": rowKey, "data": newData, "isSelected": false, "isUpdated": false });
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

    ampsGroupSubscribe(commandObject, sowDataHandler, subscriptionDataHandler, columnName) {
        this.groupingColumnsByLevel.push(columnName);
        this.ampsController.connectAndSubscribe(sowDataHandler, subscriptionDataHandler, commandObject, columnName);
    }

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

    /** GROUP SUBSCRIPTION DATAHANDLER **/

    multiGroupingDataHandler(message) {
        let multiGroupingDataMap;
        if (message.data != undefined) {
            this.multiLevelData.set(message.k,message.data);
            let level1Column = message.data.customer, level2Column = message.data.receiveIndex;
            let groupingKey;
            groupingKey = this.groupingColumnsByLevel.map((item,k)=>message.data[item]);
            this.valueKeyMapSecondLevel.set(groupingKey.join('-'), message.k);
        }
        if (message.c == 'group_end') {
            // this.multiLevelData.map((item, i) => console.log(item));
            multiGroupingDataMap = new Map();
            this.appDataModel.getGroupedData().forEach((value,key)=>{
                let groupingResultMap = this.getGroupBuckets(value.bucketData,this.groupingColumnsByLevel.slice(-1));
                let bucketDataMap = new Map();
                groupingResultMap.forEach((val,kk)=>{
                    let secondLevelGroupKey = this.valueKeyMapSecondLevel.get(
                        this.groupingColumnsByLevel.slice(0,this.groupingColumnsByLevel.length-1).map((item,k)=>value.groupData[item]).concat(kk).join('-'));
                    bucketDataMap.set(secondLevelGroupKey,{groupData:this.multiLevelData.get(secondLevelGroupKey),bucketData:val});
                })
                multiGroupingDataMap.set(key,{groupData:value.groupData,bucketData:bucketDataMap});
                
            })
        }
        console.log(JSON.stringify(multiGroupingDataMap));
    }

    getGroupBuckets(dataMap, groupByColumnKey) {
        let resultMap = new Map();
        let resultMapIterationData;
        dataMap.forEach((item,key)=>{
            resultMapIterationData = resultMap.get(item.data[groupByColumnKey]);
            if(resultMapIterationData==undefined){
                let bucketData = new Map();
                bucketData.set(key,item);
                resultMap.set(item.data[groupByColumnKey],bucketData);
            }else{
                resultMapIterationData.set(key,item);
            }
        })
        return resultMap;
    }

    multiGroupingSubscriptionDetailsHandler(subscriptionId) {
        console.log('subID :', subscriptionId);
    }
}

