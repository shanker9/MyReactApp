import AmpsController from '../Amps/AmpsData.js';

export default class AppDataModel {
    constructor() {
        this.dataMap = new Map();
        this.groupedData = new Map();
    }

    addorUpdateRowData(rowkey,rowdata){
        this.dataMap.set(rowkey,rowdata);
    }

    getDataFromDefaultData(rowkey){
        return this.dataMap.get(rowkey);
    }

    getDataMapInRange(startIndex,endIndex) {
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

    getdefaultDataSourceSize(){
        return this.dataMap.size;
    }



    addorUpdateGroupedData(rowkey,rowdata){
        this.dataMap.set(rowkey,rowdata);
    }

}