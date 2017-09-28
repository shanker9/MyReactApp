import AmpsController from '../Amps/AmpsData.js';

export default class AppDataModel {
    constructor() {
        this.dataMap = new Map();
        this.groupedData = new Map();
    }

    addorUpdateRowData(rowkey,rowdata){
        this.dataMap.set(rowkey,rowdata);
    }

    addorUpdateGroupedData(rowkey,rowdata){
        this.dataMap.set(rowkey,rowdata);
    }
}