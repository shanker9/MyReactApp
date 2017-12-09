import AmpsControllerSingleton from '../Amps/AmpsController.js';
import AppDataModelSingleton from '../DataModel/AppDataModel.js';

export default class AggDetailsDataQueryController {
    constructor(aggregatedRowKey, subscriptionCommand, initialUIupdateCallback, uiUpdateCallback) {
        this.ampsController = AmpsControllerSingleton.getInstance();
        this.appDataModel = AppDataModelSingleton.getInstance();

        this.rowKey = aggregatedRowKey;
        this.command = subscriptionCommand;
        this.initialUIupdateCallback = initialUIupdateCallback;
        this.uiUpdateCallback = uiUpdateCallback;
        this.aggRowData = undefined;
        this.subscriptionId = undefined;

    }

    subscribe(subscriptionSuccessCallback) {
        this.ampsController.connectAndSubscribe(this.defaultSubscriptionDataHandler.bind(this), subId => {
            this.subscriptionId = subId;
            subscriptionSuccessCallback();
        }, this.command);
    }

    defaultSubscriptionDataHandler(message) {
        if (message.c == 'group_begin') {
            console.log(message.c);
            this.data = new Map();
            this.aggRowData = this.appDataModel.getDataFromGroupedData(this.rowKey);
            return;
        } else if (message.c == 'group_end') {
            console.log(message.c);
            this.aggRowData.bucketData = this.data;
            let groupedViewData = this.appDataModel.createGroupedViewedData(this.appDataModel.getGroupedData());
            this.appDataModel.setGroupedViewData(groupedViewData);
            this.initialUIupdateCallback();
            return;
        } else if (message.c == 'sow') {
            this.data.set(message.k, { "rowID": message.k, "data": message.data, "isSelected": false, "isUpdated": false, "aggRowKey": this.rowKey });
        } else if (message.c == 'p') {
            let newData = message.data;
            let rowKey = message.k;
            let item = this.aggRowData.bucketData.get(rowKey);

            this.aggRowData.bucketData.set(rowKey, { "rowID": item.rowID, "data": newData, "isSelected": item.isSelected, "isUpdated": true, "aggRowKey": item.aggRowKey });

            this.uiUpdateCallback(newData, item.isSelected, item.rowID);
        }
    }

    unsubscribe() {
        this.ampsController.unsubscribe(this.subscriptionId, (subWithId) => {
            console.log('Unsubscribed the Individual data with ID:', subWithId)
        })
    }

}