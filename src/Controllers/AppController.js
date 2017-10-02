import AmpsController from '../Amps/AmpsData.js';
import AppDataModel from '../DataModel/AppDataModel.js';

export default class TableController {
    constructor(componentRef) {
        this.uiRef = componentRef;
        this.controller = new AmpsController();
        this.isGroupedView = undefined;
        this.appDataModel = new AppDataModel();
    }

    ampsSubscribe(commandObject, sowDataHandler, subscriptionDataHandler, columnName) {
        this.controller.connectAndSubscribe(sowDataHandler, subscriptionDataHandler, commandObject, columnName);
    }

    unsubscribe(subscriptionId) {
        this.controller.unsubscribe(subscriptionId);
    }

    /*** DATA HANDLERS ***/

    defaultSubscriptionDataHandler(message) {
        if (message.c == 'group_begin') {
            console.log(message.c);
            return;
        } else if (message.c == 'group_end') {
            // this.sowDataEnd = true;
            console.log(message.c);
            this.uiRef.updateDataGrid();
            return;
        }

        let newData = message.data;
        let rowKey = message.k;
        let item = this.appDataModel.getDataFromDefaultData(rowKey);

        if (item == undefined) {
            this.appDataModel.addorUpdateRowData(rowKey, { "rowID": newData.swapId - 1, "data": newData, "isSelected": false, "isUpdated": false });
        } else {
            this.appDataModel.addorUpdateRowData(rowKey, { "rowID": item.rowID, "data": newData, "isSelected": item.isSelected, "isUpdated": true });

            if (this.isGroupedView) {
                let grpObject = this.groupedData.get(this.valueKeyMap.get(newData.customer));
                let existingData = grpObject.bucketData.get(rowKey);
                existingData.data = newData;
            }
            this.uiRef.rowUpdate(newData, 'ref' + item.rowID);
        }


    }

    defaultSubscriptionDetailsHandler(subscriptionId) {
        console.log('Default Subscription ID:', subscriptionId);
    }

    getDefaultViewData(startIndex, endIndex, rowHeight) {
        let gridDataSource = this.appDataModel.getDataMapInRange(startIndex, endIndex);
        let topDivHeight = startIndex * rowHeight;
        let bottomDivHeight = (this.appDataModel.getdefaultDataSourceSize() - (startIndex + gridDataSource.length)) * rowHeight;
        return { gridDataSource, topDivHeight, bottomDivHeight };
    }


    /** GROUP SUBSCRIPTION DATAHANDLER **/

    
}