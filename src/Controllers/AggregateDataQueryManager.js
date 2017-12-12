import AmpsControllerSingleton from '../Amps/AmpsController.js';
import AppDataModelSingleton from '../DataModel/AppDataModel.js';
import AggDetailsDataQueryController from './AggDetailsDataQueryController.js';

var AggregateDataQueryManager = function () {
    let instance = null;
    return {
        getInstance: function () {
            if (instance == null) {
                instance = new AggregateDataQueryManagerPrivate();
                return instance;
            } else {
                return instance;
            }
        }
    };
}();

class AggregateDataQueryManagerPrivate {
    constructor() {
        this.subscriptionsMapper = new Map();
        this.subscriptionControllers = new Map();
        this.ampsController = AmpsControllerSingleton.getInstance();
        this.appDataModel = AppDataModelSingleton.getInstance();
    }

    subscribeToDetailsOfAggRow(aggregatedRowKey, subscriptionCommand, initialUIupdateCallback, uiUpdateCallback) {
        let aggDetailsDataQueryController = new AggDetailsDataQueryController(aggregatedRowKey, subscriptionCommand, initialUIupdateCallback, uiUpdateCallback);
        aggDetailsDataQueryController.subscribe(() => {
            this.subscriptionControllers.set(aggregatedRowKey, aggDetailsDataQueryController);
        })
    }

    unsubscribeToDetailsOfAggRow(aggregatedRowKey) {
        let subId = this.subscriptionsMapper.get(aggregatedRowKey);
        let controllerInstance = this.subscriptionControllers.get(aggregatedRowKey);
        if (controllerInstance !== undefined) {
            controllerInstance.unsubscribe();
        }
    }
}

export default AggregateDataQueryManager;