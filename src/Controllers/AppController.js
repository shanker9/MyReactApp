import AmpsController from '../Amps/AmpsData.js';
import AppDataModel from '../DataModel/AppDataModel.js';

export default class AmpsData {
    constructor(componentRef){
        this.uiRef = componentRef;
        this.controller = new AmpsController();
        this.isGroupedView = undefined;
    }

    ampsSubscribe(commandObject,sowDataHandler,subscriptionDataHandler, columnName){
        this.controller.connectAndSubscribe(sowDataHandler, subscriptionDataHandler, commandObject, columnName);
    }

    unsubscribe(subscriptionId){
        this.controller.unsubscribe(subscriptionId);
    }

    /*** DATA HANDLERS ***/

    handleNewData(message) {
        if (message.c == 'group_begin') {
            console.log(message.c);
            return;
        } else if (message.c == 'group_end') {
            this.sowDataEnd = true;
            this.uiRef.triggerConditionalUIUpdate();
            return;
        }

        let newData = message.data;
        let rowKey = message.k;
        let item = this.dataMap.get(rowKey);

        if (item == undefined) {
            this.AppDataModel.addorUpdateRowData(rowKey,{ "rowID": newData.swapId - 1, "data": newData, "isSelected": false, "isUpdated": false });
        } else {
            this.AppDataModel.addorUpdateRowData(rowKey,{ "rowID": item.rowID, "data": newData, "isSelected": item.isSelected, "isUpdated": true });
        }

        if (this.isGroupedView) {
            let grpObject = this.groupedData.get(this.valueKeyMap.get(newData.customer));
            let existingData = grpObject.bucketData.get(rowKey);
            existingData.data = newData;
        }
        this.uiRef.rowUpdate(newData, 'ref' + item.rowID);
    }

}