import AmpsController from '../Amps/AmpsData.js';
import AppDataModelSingleton from '../DataModel/AppDataModel.js';
import SubscriptionController from './SubscriptionController.js';

export default class TableController {
    constructor(componentRef) {
        this.uiRef = componentRef;
        this.ampsController = new AmpsController();
        this.isGroupedView = undefined;
        this.appDataModel = AppDataModelSingleton.getInstance();
        this.groupingColumnKeyMap = undefined;
        this.aggregatedRowsData = undefined;
        this.subscriptionData = new Map();
        this.groupingColumnsByLevel = [];
        this.multiLevelData = new Map();
        this.valueKeyMapSecondLevel = new Map();
        this.multiGroupingDataMap = new Map();
        this.groupedData = undefined;

        this.subscriptionControllersMap = new Map();
    }
    
    /** FOR DEFAULT VIEW DATA SUBSCRIPTION */
    ampsSubscribe(commandObject, columnName) {
        let subController = new SubscriptionController(this);
        this.ampsController.connectAndSubscribe(subController.defaultSubscriptionDataHandler.bind(subController),
                                                subController.defaultSubscriptionDetailsHandler.bind(subController),
                                                commandObject, columnName);
    }

    unsubscribe(subscriptionId) {
        this.ampsController.unsubscribe(subscriptionId);
    }

    updateUIWithDefaultViewData(){
        this.uiRef.loadDataGridWithDefaultView();
    }

    getDefaultViewData(startIndex, endIndex, rowHeight) {
        let gridDataSource = this.appDataModel.getDataMapInRangeFromDefaultData(startIndex, endIndex);
        let topDivHeight = startIndex * rowHeight;
        let bottomDivHeight = (this.appDataModel.getdefaultDataViewSize() - (startIndex + gridDataSource.length)) * rowHeight;
        return { gridDataSource, topDivHeight, bottomDivHeight };
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

    createFirstLevelGrouping(valueKeyMap, aggregatedRowsData, dataMap) {
        let resultMap = new Map();
        let uniqueColumnValueBuckets = new Map();
        // let columnKeyIterator = this.valueKeyMap.keys();

        valueKeyMap.forEach(function (item, key, mapObj) {
            uniqueColumnValueBuckets.set(key, new Map());
        });
        let groupKey, groupVal;
        dataMap.forEach((item, key, mapObj) => {
            groupKey = valueKeyMap.get(item.data.customer);
            groupVal = aggregatedRowsData.get(groupKey).groupData == undefined ? aggregatedRowsData.get(groupKey) : aggregatedRowsData.get(groupKey).groupData;
            uniqueColumnValueBuckets.get(item.data.customer).set(key, item)
            aggregatedRowsData.set(groupKey, {
                "groupData": groupVal,
                "bucketData": uniqueColumnValueBuckets.get(item.data.customer),
                "showBucketData": false,
                "isBuckedDataAggregated": false
            });
        })
        return aggregatedRowsData;
        // this.setGroupedViewData();
    }

    multiGroupingDataHandler(message) {
        if (message.data != undefined) {
            this.multiLevelData.set(message.k, message.data);
            let level1Column = message.data.customer, level2Column = message.data.receiveIndex;
            let groupingKey;
            groupingKey = this.groupingColumnsByLevel.map((item, k) => message.data[item]);
            this.valueKeyMapSecondLevel.set(groupingKey.join('-'), message.k);
        }
        if (message.c == 'group_end') {
            if (this.groupedData == undefined) {
                this.groupedData = this.appDataModel.getGroupedData();
            }
            let resultMap = this.recursiveFunction(this.groupedData, this.groupingColumnsByLevel.slice(-1));
            this.appDataModel.getMultiLevelGroupedViewData(resultMap);
            let result = this.appDataModel.getDataMapInRangeFromMultiGroupedData(0);
            this.uiRef.loadDataGridWithMultiGroupedView(result);

        }
        console.log(JSON.stringify(resultMap));
    }

    recursiveFunction(groupedData, columnKey) {
        groupedData.forEach((value, key) => {
            if (value.isBuckedDataAggregated) {
                this.recursiveFunction(value.bucketData, columnKey);
            } else {
                /** groupedData With UniqueColumn as keys */
                let groupingResultMap = this.getGroupBuckets(value.bucketData, columnKey);
                if (groupingResultMap.size == 1) {
                    return;
                }
                /** Converting groupedData keys from UniqueColumnKeys to SOWKeys */
                let bucketDataMap = new Map();
                groupingResultMap.forEach((val, kk) => {
                    let secondLevelGroupKey = this.valueKeyMapSecondLevel.get(
                        this.groupingColumnsByLevel.slice(0, this.groupingColumnsByLevel.length - 1).map((item, k) => value.groupData[item]).concat(kk).join('-'));
                    bucketDataMap.set(secondLevelGroupKey, { groupData: this.multiLevelData.get(secondLevelGroupKey), bucketData: val, showBucketData: false, isBuckedDataAggregated: false });
                })
                value.bucketData = bucketDataMap;
                value.isBuckedDataAggregated = true;
                /** Adding the modified groupedData as new bucketData to the parentRow */
                // this.multiGroupingDataMap.set(key, { groupData: value.groupData, bucketData: bucketDataMap, showBucketData : false, isBuckedDataAggregated : true });

            }
        })
        return groupedData;
    }

    getGroupBuckets(dataMap, groupByColumnKey) {
        let resultMap = new Map();
        let resultMapIterationData;
        dataMap.forEach((item, key) => {
            resultMapIterationData = resultMap.get(item.data[groupByColumnKey]);
            if (resultMapIterationData == undefined) {
                let bucketData = new Map();
                bucketData.set(key, item);
                resultMap.set(item.data[groupByColumnKey], bucketData);
            } else {
                resultMapIterationData.set(key, item);
            }
        })
        return resultMap;
    }

    multiGroupingSubscriptionDetailsHandler(subscriptionId) {
        console.log('subID :', subscriptionId);
    }
}

