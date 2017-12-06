import AmpsControllerSingleton from '../Amps/AmpsController.js';
import AppDataModelSingleton from '../DataModel/AppDataModel.js';
import AggDetailsDataQueryController from './AggDetailsDataQueryController.js';

var AggregateDataQueryManagerSingleton = function(){
    let instance = null;
    return {
        getInstance : function(){
            if(instance == null){
                instance = new AggregateDataQueryManager();
                return instance;
            }else{
                return instance;
            }
        }
    };
}();

class AggregateDataQueryManager {
    constructor() {
        this.subscriptionsMapper = new Map();
        this.ampsController = AmpsControllerSingleton.getInstance();
        this.appDataModel = AppDataModelSingleton.getInstance();
    }

    subscribeToIndividualDataOfAggregatedRowWithKey(aggregatedRowKey,subscriptionCommand,initialUIupdateCallback,uiUpdateCallback){
        let aggDetailsDataQueryController = new AggDetailsDataQueryController(aggregatedRowKey,subscriptionCommand,initialUIupdateCallback,uiUpdateCallback);
        aggDetailsDataQueryController.subscribe((subId)=>{
            this.subscriptionsMapper.set(aggregatedRowKey,subId);
        })
    }

    unsubscribeToIndividualDataOfAggregatedRowWithKey(aggregatedRowKey){
        let subId = this.subscriptionsMapper.get(aggregatedRowKey);
        if(subId!==undefined){
            this.ampsController.unsubscribe(subId,(subWithId)=>{
                console.log('Unsubscribed the Individual data with ID:',subWithId)
            })
        }
    }
}

export default AggregateDataQueryManagerSingleton;