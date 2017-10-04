import AmpsController from '../Amps/AmpsData.js';

var AppDataModelSingleton = (function(){
    var instance;
    return {
        getInstance : function(){
            if(instance!=undefined){
                return instance;
            }else{
                instance = new AppDataModel();
                return instance;
            }
        }
    }
})();

class AppDataModel {
    constructor() {
        this.dataMap = new Map();
        this.groupedData = undefined;
        this.multiLevelGroupedData = undefined;
        this.groupedViewData = undefined;
    }

    getAppDataModelInstance(){

    }

    addorUpdateRowData(rowkey, rowdata) {
        this.dataMap.set(rowkey, rowdata);
    }

    getDataFromDefaultData(rowkey) {
        return this.dataMap.get(rowkey);
    }

    getDataMapInRangeFromDefaultData(startIndex, endIndex) {
        let iter = this.dataMap.keys();
        let i = 0, result = [], availableEndIndex;
        availableEndIndex = endIndex > this.dataMap.size ? this.dataMap.size : endIndex;
        for (; i < startIndex; i++) {
            iter.next();
        }
        for (; i < availableEndIndex; i++) {
            result.push(this.dataMap.get(iter.next().value));
        }
        return result;
    }

    getdefaultDataViewSize() {
        return this.dataMap.size;
    }

    getDataMap() {
        return this.dataMap;
    }

    /*** GROUPING METHODS ***/
    createGroupBuckets(valueKeyMap, aggregatedRowsData) {
        let resultMap = new Map();
        let uniqueColumnValueBuckets = new Map();
        // let columnKeyIterator = this.valueKeyMap.keys();

        valueKeyMap.forEach(function (item, key, mapObj) {
            uniqueColumnValueBuckets.set(key, new Map());
        });
        let groupKey, groupVal;
        this.dataMap.forEach((item, key, mapObj) => {
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
        this.groupedData = aggregatedRowsData;
        this.setGroupedViewData();
    }

    settGroupedViewData() {
        let result = [];
        this.groupedData.forEach((item, key, mapObj) => {
            result.push({ "key": key, "data": item, "isAggregatedRow": true });
            if (item.showBucketData) {
                item.bucketData.forEach((val, k, mapObj) => result.push({ "key": k, "data": val, "isAggregatedRow": false }));
            }
        });
        this.groupedViewData = result;
    }

    getDataFromGroupedData(groupKey) {
        return this.groupedData.get(groupKey);
    }

    getDataMapInRangeFromGroupedData(startIndex, endIndex) {
        return this.groupedViewData.slice(startIndex, endIndex);
    }

    addorUpdateGroupedData(rowkey, rowdata) {
        this.dataMap.set(rowkey, rowdata);
    }

    getGroupedDataViewSize() {
        return this.groupedViewData.length;
    }

    setGroupedData(groupedData){
        this.groupedData = groupedData;
    }

    getGroupedData() {
        return this.groupedData;
    }

    setGroupedViewData(groupedViewData){
        this.groupedViewData = groupedViewData;
    }

    getGroupedViewData(){
        return this.groupedViewData;
    }

    /** MULTI-LEVEL GROUPING METHODS**/

    getMultiLevelGroupedData() {
        return this.multiLevelGroupedData;
    }

    setMultiLevelGroupedData(groupedMap) {
        this.multiLevelGroupedData = groupedMap;
    }

    getMultiLevelGroupedViewData(multiLevelGroupedData) {
        let result = [];
        multiLevelGroupedData.forEach((item, key) => {
            result.push({ "key": key, "data": item, "isAggregatedRow": true });
            if (item.isBuckedDataAggregated) {
                result.concat(this.getMultiLevelGroupedViewData(item.bucketData));
            } else if (item.showBucketData) {
                item.bucketData.forEach((val, k) => { result.push({ "key": k, "data": val, "isAggregatedRow": false }) });
            }
        });
        // this.multiLevelGroupedData = result;
        return result;
    }

    getDataMapInRangeFromMultiGroupedViewData(startIndex, endIndex) {
        return this.multiLevelGroupedData.slice(startIndex, endIndex);
    }

}

export default AppDataModelSingleton;