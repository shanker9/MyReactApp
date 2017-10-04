import AmpsController from '../Amps/AmpsData.js';
import AppDataModelSingleton from '../DataModel/AppDataModel.js';

export default class BinDataFetchSubscriber {
    constructor(command) {
        this.commandObject = command;
        this.ampsController = new AmpsController();
        this.dataMap = new Map();
        this.subscriptionId = undefined;
        this.dataReturnCallback = undefined;
    }

    subscribeToAmps() {
        this.ampsController.connectAndSubscribe(this.subscriptionDataHandler.bind(this),this.subscriptionDetailsHandler.bind(this),this.commandObject);
    }

    subscriptionDataHandler(message) {

        if (message.c == 'group_end') {
            ampsController.unsubscribe(this.subscriptionId);
            this.dataReturnCallback(this.dataMap);
        }

        if (message.data != undefined) {
            this.dataMap.set(message.k, { "rowID": message.k, "data": message.data, "isSelected": false, "isUpdated": false })
        }
    }

    subscriptionDetailsHandler(subscriptionId) {
        console.log('Default Subscription ID:', subscriptionId);
        this.subscriptionId = subscriptionId;
    }

    getBucketData(callback) {
        this.dataReturnCallback = callback;
        this.subscribeToAmps();
    }

}