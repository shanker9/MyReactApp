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

        this.dataKeysJsonpathMapper = {
            "amerOrEuro": "/data/amerOrEuro",
            "contractSize":"/data/contractSize",
            "counterparty": "/data/counterparty",

            "maturityDate": "/data/maturityDate/str",

            "payCurrency": "/data/pay/currency",
            "payDiscountCurve": "/data/pay/discountCurve",
            "payFixedRate": "/data/pay/fixedRate",
            "payNotional": "/data/pay/notional",

            "putOrCall":"/data/putOrCall",            

            "receiveCurrency": "/data/receive/currency",
            "receiveDiscountCurve": "/data/receive/discountCurve",
            "receiveIndex": "/data/receive/index",
            "receiveNotional": "/data/receive/notional",

            "strike":"/data/strike",

            "lastUpdated": "/lastUpdated/str",

            "payLeg": "/output/componentPrices/payLeg",
            "receiveLeg": "/output/componentPrices/receiveLeg",

            "price": "/output/price",
            "rho10bps": "/output/rho10bps",
            "volatility":"/output/volatility",

            "product": "/product",
            "underlier": "/underlier",
            "vertex": "/vertex"
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