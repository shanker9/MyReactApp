import AmpsController from '../Amps/AmpsData.js';
import AppDataModelSingleton from '../DataModel/AppDataModel.js';
import binFetchSubscriber from './BinDataFetchSubscriber.js';

export default class GroupSubscriptionController {
    constructor(controllerRef, columnName, commandObject) {
        this.parentControllerRef = controllerRef;
        this.ampsController = new AmpsController();
        this.appDataModel = AppDataModelSingleton.getInstance();
        this.columnName = columnName;
        this.commandObject = commandObject
        this.groupingColumnKeyMap = undefined;
        this.aggregatedRowsData = undefined;
    }


    /** GROUP SUBSCRIPTION DATAHANDLER **/

    groupingSubscriptionDataHandler(message) {
        if (message.c == 'group_begin') {
            this.groupingColumnKeyMap = new Map();
            this.aggregatedRowsData = new Map();
            return;
        } else if (message.c == 'group_end') {
            this.sowGroupDataEnd = true;
            this.getGroupBuckets(['customer'],this.aggregatedRowsData);
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

            // this.isGroupedView = true;
            this.parentControllerRef.updateUIWithGroupedViewData();
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
        console.log('GROUPING SUBSCRIPTION SUCCESSFUL, ID:', subscriptionId);
        this.parentControllerRef.addColumnSubscriptionMapper(this.columnName,subscriptionId);
    }

    createFirstLevelGrouping(valueKeyMap, aggregatedRowsData, dataMap) {
        let resultMap = new Map();
        let groupedDataByColumnKey = this.getGroupBuckets(dataMap,this.columnName);
        aggregatedRowsData.forEach((value,key)=>{
            resultMap.set(key,{
                "groupData": value,
                "bucketData": groupedDataByColumnKey.get(value[this.columnName]),
                "showBucketData": false,
                "isBuckedDataAggregated": false
            });
        });
        return resultMap;
    }

    // getGroupBuckets(dataMap, groupByColumnKey) {
    //     let resultMap = new Map();
    //     let resultMapIterationData;
    //     dataMap.forEach((item, key) => {
    //         resultMapIterationData = resultMap.get(item.data[groupByColumnKey]);
    //         if (resultMapIterationData == undefined) {
    //             let bucketData = new Map();
    //             bucketData.set(key, item);
    //             resultMap.set(item.data[groupByColumnKey], bucketData);
    //         } else {
    //             resultMapIterationData.set(key, item);
    //         }
    //     })
    //     return resultMap;
    // }

    getGroupBuckets(groupingColumnArray,aggregatedRowsData){
        aggregatedRowsData.forEach((value,key)=>{
            let filterConditions = groupingColumnArray.map((item,k)=>'/'+item+'='+value[item])
            let filterString = filterConditions.join('AND');
            let bucketData = this.fetchBucketData(filterString);
            value = {
                "groupData": value,
                "bucketData": bucketData,
                "showBucketData": false,
                "isBuckedDataAggregated": false
            }
        })
        return aggregatedRowsData; 
    }

    fetchBucketData(filterString){
        let commandObject = this.commandObject;
        commandObject.filter = commandObject.filter + 'AND' +filterString;
        let binFetcher = new binFetchSubscriber(commandObject);
        let result;
        binFetcher.getBucketData(mapData=>{result = mapData});
        return result;
    }
    
}