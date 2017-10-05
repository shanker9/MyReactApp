import AmpsController from '../Amps/AmpsData.js';
import AppDataModelSingleton from '../DataModel/AppDataModel.js';

export default class SubscriptionController {
    constructor(controllerRef) {
        this.parentControllerRef = controllerRef;
        this.ampsController = new AmpsController();
        this.appDataModel = AppDataModelSingleton.getInstance();
    }


    defaultSubscriptionDataHandler(message) {
        if (message.c == 'group_begin') {
            console.log(message.c);
            return;
        } else if (message.c == 'group_end') {
            console.log(message.c);
            this.parentControllerRef.updateUIWithDefaultViewData();
            return;
        }

        let newData = message.data;
        let rowKey = message.k;
        let item = this.appDataModel.getDataFromDefaultData(rowKey);

        if (item == undefined) {
            this.appDataModel.addorUpdateRowData(rowKey, { "rowID": rowKey, "data": newData, "isSelected": false, "isUpdated": false });
        } else {
            this.appDataModel.addorUpdateRowData(rowKey, { "rowID": item.rowID, "data": newData, "isSelected": item.isSelected, "isUpdated": true });

            if (this.isGroupedView) {
                let grpObject = this.appDataModel.getDataFromGroupedData(this.groupingColumnKeyMap.get(newData.customer));
                let existingData = grpObject.bucketData.get(rowKey);
                existingData.data = newData;
            }
            this.uiRef.rowUpdate(newData, 'ref' + item.rowID);
        }
    }

    defaultSubscriptionDetailsHandler(subscriptionId) {
        console.log('Default Subscription ID:', subscriptionId);
    }

}