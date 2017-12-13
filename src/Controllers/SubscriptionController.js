import AmpsControllerSingleton from '../Amps/AmpsController.js';
import AppDataModelSingleton from '../DataModel/AppDataModel.js';

export default class SubscriptionController {
    constructor(controllerRef, sowEndCallback, updateCallback) {
        this.parentControllerRef = controllerRef;
        this.sowEndCallback = sowEndCallback;
        this.updateCallback = updateCallback;

        this.ampsController = AmpsControllerSingleton.getInstance();
        this.appDataModel = AppDataModelSingleton.getInstance();
    }

    defaultSubscriptionDataHandler(message) {

        let messageType = message.c;

        switch (messageType) {
            case 'group_begin':
                console.log(message.c);
                break;

            case 'group_end':
                console.log(message.c);
                // this.parentControllerRef.updateUIWithDefaultViewData();
                this.sowEndCallback();
                break;

            case 'sow':
            case 'p':
                let newData = message.data;
                let rowKey = message.k;
                let item = this.appDataModel.getDataFromDefaultData(rowKey);

                if (item == undefined) {
                    this.appDataModel.addorUpdateRowData(rowKey, { "rowID": rowKey, "data": newData, "isSelected": false, "isUpdated": false });
                } else {
                    this.appDataModel.addorUpdateRowData(rowKey, { "rowID": item.rowID, "data": newData, "isSelected": item.isSelected, "isUpdated": true });

                    if (this.appDataModel.getGroupedData() != undefined) {
                        // this.parentControllerRef.updateRowDataInGroupedData(message,true);
                        this.updateCallback(this.appDataModel.getDataFromDefaultData(rowKey), true);
                    }
                    // this.parentControllerRef.updateUIRowWithData(newData,item.isSelected, item.rowID);
                    this.updateCallback(this.appDataModel.getDataFromDefaultData(rowKey), false);
                }
                break;

            case Default:
                console.log('OOF message received');
        }
    }

    defaultSubscriptionDetailsHandler(subscriptionId) {
        console.log('Default Subscription ID:', subscriptionId);
    }

}