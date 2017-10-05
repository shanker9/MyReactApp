import AmpsController from '../Amps/AmpsData.js';
import AppDataModelSingleton from '../DataModel/AppDataModel.js';
import SubscriptionController from './SubscriptionController.js';
import GroupSubscriptionController from './GroupSubscriptionController.js';

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
        this.columnSubscriptionMapper = new Map();
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

    /** GROUP SUBSCRIPTION DATAHANDLER **/

    ampsGroupSubscribe(commandObject, columnName) {
        this.groupingColumnsByLevel.push(columnName);
        let subController = new GroupSubscriptionController(this,this.groupingColumnsByLevel,commandObject);
        
        this.ampsController.connectAndSubscribe(subController.groupingSubscriptionDataHandler.bind(subController),
                                                subController.groupingSubscriptionDetailsHandler.bind(subController),
                                                commandObject, columnName);
    }

    addColumnSubscriptionMapper(columnName,subscriptionId){
        this.columnSubscriptionMapper.set(columnName,subscriptionId);
    }

    updateUIWithGroupedViewData(){
        this.uiRef.loadDataGridWithGroupedView();
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
        let updatedGroupedViewData = this.getGroupedDataAsViewableArray(this.appDataModel.getGroupedData());
        this.appDataModel.setGroupedViewData(updatedGroupedViewData);
        this.uiRef.updateDataGridWithGroupedView();
    }

    getGroupedDataAsViewableArray(groupedData) {
        let result = [];
        groupedData.forEach((item, key) => {
            result.push({ "key": key, "data": item, "isAggregatedRow": true });
            if (item.isBuckedDataAggregated) {
                result.concat(this.getGroupedDataAsViewableArray(item.bucketData));
            } else if (item.showBucketData) {
                item.bucketData.forEach((val, k) => { result.push({ "key": k, "data": val, "isAggregatedRow": false }) });
            }
        });
        return result;
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


    /** MULTI GROUPING DATAHANDLERS **/
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

