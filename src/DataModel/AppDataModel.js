import AmpsController from '../Amps/AmpsData.js';

var AppDataModelSingleton = (function () {
    var instance;
    return {
        getInstance: function () {
            if (instance != undefined) {
                return instance;
            } else {
                instance = new AppDataModel();
                return instance;
            }
        }
    }
})();

class AppDataModel {
    constructor() {
        this.dataMap = new Map();
        this.selectedRows = new Map();
        this.groupedData = undefined;
        this.groupColumnKeyMapper = undefined;
        this.groupedViewData = undefined;

        // this.dataKeysJsonpathMapper = {
        //     "label": "/key/label",
        //     "name": "/key/name",
        //     "source": "/key/source",
        //     "amerEuro": "/values/values/amerEuro/strVal",
        //     "contractSize": "/values/values/contractSize/strVal",
        //     "counterparty": "/values/values/counterparty/strVal",
        //     "error": "/values/values/error/strVal",
        //     "id": "/values/values/id/strVal",
        //     "lastUpdate": "/values/values/lastUpdate/dtVal/str",
        //     "maturityDate": "/values/values/maturityDate/dtVal/str",
        //     "payCurrency": "/values/values/payCurrency/strVal",
        //     "payDiscountCurve": "/values/values/payDiscountCurve/strVal",
        //     "payFixedRate": "/values/values/payFixedRate/dblVal",
        //     "payNotional": "/values/values/payNotional/dblVal",
        //     "payPrice": "/values/values/payPrice/dblVal",
        //     "price": "/values/values/price/dblVal",
        //     "putCall": "/values/values/putCall/strVal",
        //     "receiveCurrency": "/values/values/receiveCurrency/strVal",
        //     "receiveDiscountCurve": "/values/values/receiveDiscountCurve/strVal",
        //     "receiveIndex": "/values/values/receiveIndex/strVal",
        //     "receiveNotional": "/values/values/receiveNotional/dblVal",
        //     "receivePrice": "/values/values/receivePrice/dblVal",
        //     "receiveSpread": "/values/values/receiveSpread/dblVal",
        //     "strike": "/values/values/strike/dblVal",
        //     "underlier": "/values/values/underlier/strVal",
        //     "volatility": "/values/values/volatility/dblVal"
        // }

        this.dataKeysJsonpathMapper = {
            "label": "/key/label",
            "name": "/key/name",
            "source": "/key/source",
            "amerEuro": "/values/values/amerEuro/strVal",
            "contractSize": "/values/values/contractSize/strVal",
            "counterparty": "/values/values/counterparty/strVal",
            "error": "/values/values/error/strVal",
            "id": "/values/values/id/strVal",
            "lastUpdate": "/values/values/lastUpdate/dtVal/str",
            "maturityDate": "/values/values/maturityDate/dtVal/str",
            "payCurrency": "/values/values/payCurrency/strVal",
            "payDiscountCurve": "/values/values/payDiscountCurve/strVal",
            "payFixedRate": "/values/values/payFixedRate/dblVal",
            "payNotional": "/values/values/payNotional/dblVal",
            "payPrice": "/values/values/payPrice/dblVal",
            "price": "/values/values/price/dblVal",
            "putCall": "/values/values/putCall/strVal",
            "receiveCurrency": "/values/values/receiveCurrency/strVal",
            "receiveDiscountCurve": "/values/values/receiveDiscountCurve/strVal",
            "receiveIndex": "/values/values/receiveIndex/strVal",
            "receiveNotional": "/values/values/receiveNotional/dblVal",
            "receivePrice": "/values/values/receivePrice/dblVal",
            "receiveSpread": "/values/values/receiveSpread/dblVal",
            "strike": "/values/values/strike/dblVal",
            "underlier": "/values/values/underlier/strVal",
            "volatility": "/values/values/volatility/dblVal"
        }
    }

    /** dataMap methods */

    getDataMap() { return this.dataMap; }

    addorUpdateRowData(rowkey, rowdata) { this.dataMap.set(rowkey, rowdata); }

    getDataFromDefaultData(rowkey) { return this.dataMap.get(rowkey); }

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

    getdefaultDataViewSize() { return this.dataMap.size; }

    addSelectedRow(rowKey, rowData) { this.selectedRows.set(rowKey, rowData); }
    removeSelectedRow(rowKey) {return this.selectedRows.delete(rowKey); }
    getSelectedRows(){return this.selectedRows;}
    clearSelectedRows(){this.selectedRows.clear()};
    clearSelectionStateData(){
        this.selectedRows.forEach((item,key)=>{
            this.getDataFromDefaultData(key).isSelected = false;
        })
    }

    /** groupedData methods */

    getGroupedData() { return this.groupedData; }

    setGroupedData(groupedData) { this.groupedData = groupedData; }

    getDataFromGroupedData(groupKey) { return this.groupedData.get(groupKey); }

    setDataInGroupedData(groupRowkey, groupRowData) { this.groupedData.set(groupRowkey, groupRowData); }

    getDataMapInRangeFromGroupedData(startIndex, endIndex) { return this.groupedViewData.slice(startIndex, endIndex); }

    /** groupedViewData methods */

    getGroupedViewData() { return this.groupedViewData; }

    setGroupedViewData(groupedViewData) { this.groupedViewData = groupedViewData; }

    getGroupedViewDataSize() { return this.groupedViewData.length; }


    /** groupColumnKeyMapper methods */

    getGroupColumnKeyMapper() { return this.groupColumnKeyMapper; }

    setGroupColumnKeyMapper(groupColumnKeyMapper) { this.groupColumnKeyMapper = groupColumnKeyMapper; }

    /** MULTI-LEVEL GROUPING METHODS**/

    // getMultiLevelGroupedData() {
    //     return this.multiLevelGroupedData;
    // }

    // setMultiLevelGroupedData(groupedMap) {
    //     this.multiLevelGroupedData = groupedMap;
    // }

    createGroupedViewedData(multiLevelGroupedData) {
        let result = [];
        multiLevelGroupedData.forEach((item, key) => {
            result.push({ "key": key, "data": item, "isAggregatedRow": true });
            if (item.isBuckedDataAggregated) {
                result.concat(this.createGroupedViewedData(item.bucketData));
            } else if (item.showBucketData) {
                item.bucketData.forEach((val, k) => { result.push({ "key": k, "data": val, "isAggregatedRow": false }) });
            }
        });
        // this.multiLevelGroupedData = result;
        return result;
    }


}

export default AppDataModelSingleton;