import AmpsController from '../Amps/AmpsData.js';
import AppDataModelSingleton from '../DataModel/AppDataModel.js';
import BinDataFetchSubscriber from './BinDataFetchSubscriber.js';

export default class GroupSubscriptionController {
    constructor(controllerRef, groupingColumnsArray, commandObject) {
        this.parentControllerRef = controllerRef;
        this.ampsController = new AmpsController();
        this.appDataModel = AppDataModelSingleton.getInstance();
        this.columnName = groupingColumnsArray;
        this.commandObject = commandObject
        this.groupingColumnKeyMap = undefined;
        this.aggregatedRowsData = undefined;
        this.groupingColumnArray = groupingColumnsArray;
    }


    /** GROUP SUBSCRIPTION DATAHANDLER **/

    groupingSubscriptionDataHandler(message) {
        if (message.c == 'group_begin') {
            this.groupingColumnKeyMap = new Map();
            this.aggregatedRowsData = new Map();
            return;
        } else if (message.c == 'group_end') {
            this.sowGroupDataEnd = true;
            let keyBinMapper = this.getGroupBuckts(this.appDataModel.getDataMap(),this.groupingColumnArray);
            let groupedDat = this.mapBinDataToAggregatedRows(this.aggregatedRowsData,keyBinMapper);
            this.appDataModel.setGroupedData(groupedDat);
            let groupedViewData = this.appDataModel.getMultiLevelGroupedViewData(groupedDat);
            this.appDataModel.setGroupedViewData(groupedViewData);

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
            this.groupingColumnKeyMap.set(this.groupingColumnArray.map((val,k)=>message.data[val]).join('-'), message.k);
        }
    }

    groupingSubscriptionDetailsHandler(subscriptionId, groupByColumn) {
        console.log('GROUPING SUBSCRIPTION SUCCESSFUL, ID:', subscriptionId);
        this.parentControllerRef.addColumnSubscriptionMapper(this.columnName, subscriptionId);
    }

    createFirstLevelGrouping(valueKeyMap, aggregatedRowsData, dataMap) {
        let resultMap = new Map();
        let groupedDataByColumnKey = this.getGroupBuckets(dataMap, this.columnName);
        aggregatedRowsData.forEach((value, key) => {
            resultMap.set(key, {
                "groupData": value,
                "bucketData": groupedDataByColumnKey.get(value[this.columnName]),
                "showBucketData": false,
                "isBuckedDataAggregated": false
            });
        });
        return resultMap;
    }

    mapBinDataToAggregatedRows(aggregatedRowsData,keyBinMapper){
        let resultMap = new Map();
        
        aggregatedRowsData.forEach((item,key)=>{
            // let groupingKey = groupingColumnArray.map((val,k)=>item.data[val]).join('-');
            let binData = keyBinMapper.get(key);
            resultMap.set(key, {
                "groupData": item,
                "bucketData": binData,
                "showBucketData": false,
                "isBuckedDataAggregated": false
            });
        })
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

    // getGroupBuckets(groupingColumnArray,aggregatedRowsData){
    //     aggregatedRowsData.forEach((value,key)=>{
    //         let filterConditions = groupingColumnArray.map((item,k)=>'/'+item+'='+value[item])
    //         let filterString = filterConditions.join('AND');
    //         let bucketData = this.fetchBucketData(filterString);
    //         value = {
    //             "groupData": value,
    //             "bucketData": bucketData,
    //             "showBucketData": false,
    //             "isBuckedDataAggregated": false
    //         }
    //     })
    //     return aggregatedRowsData; 
    // }

    // fetchBucketData(filterString){
    //     let commandObject = this.commandObject;
    //     commandObject.filter = commandObject.filter + 'AND' +filterString;
    //     let binFetcher = new BinDataFetchSubscriber(commandObject);
    //     let result;
    //     binFetcher.getBucketData(mapData=>{result = mapData});
    //     return result;
    // }

    // dataCallBack(mapData){

    // }

    getGroupBuckts(dataMap, groupingColumnArray) {
        let resultMap = new Map();
        dataMap.forEach((item, key) => {
            let groupingKey = groupingColumnArray.map((val,k)=>item.data[val]).join('-');
            let resultMapIterationData = resultMap.get(this.groupingColumnKeyMap.get(groupingKey));
            if (resultMapIterationData == undefined) {
                let bucketData = new Map();
                bucketData.set(key, item);
                resultMap.set(this.groupingColumnKeyMap.get(groupingKey), bucketData);
            } else {
                resultMapIterationData.set(key, item);
            }
        });
        return resultMap;
    }

}