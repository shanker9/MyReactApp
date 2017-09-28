import AmpsController from '../Amps/AmpsData.js';

export default class AmpsData {
    constructor(){
        this.controller = new AmpsController();
    }

    ampsSubscribe(commandObject,sowDataHandler,subscriptionDataHandler, columnName){
        this.controller.connectAndSubscribe(sowDataHandler, subscriptionDataHandler, commandObject, columnName);
    }

    unsubscribe(subscriptionId){
        this.controller.unsubscribe(subscriptionId);
    }
}