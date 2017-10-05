import AmpsController from '../Amps/AmpsData.js';
import AppDataModelSingleton from '../DataModel/AppDataModel.js';
import SubscriptionController from './SubscriptionController.js';
import GroupSubscriptionController from './GroupSubscriptionController.js';

export default class TableController {
    constructor(componentRef) {
        this.uiRef = componentRef;
        this.ampsController = new AmpsController();
        this.isGroupedView = undefined;
        this.appDataModel = AppDataModelSingleton.getInstance();
        this.groupingColumnKeyMap = undefined;
        this.aggregatedRowsData = undefined;
        this.subscriptionData = new Map();
        this.groupingColumnsByLevel = [];
        this.multiLevelData = new Map();
        this.valueKeyMapSecondLevel = new Map();
        this.multiGroupingDataMap = new Map();
        this.groupedData = undefined;

        this.subscriptionControllersMap = new Map();
        this.columnSubscriptionMapper = new Map();
        this.setGroupingColumnKeyMapper = undefined;
    }
    
    /** FOR DEFAULT VIEW DATA SUBSCRIPTION */
    ampsSubscribe(commandObject, columnName) {
        let subController = new SubscriptionController(this);
        this.ampsController.connectAndSubscribe(subController.defaultSubscriptionDataHandler.bind(subController),
                                                subController.defaultSubscriptionDetailsHandler.bind(subController),
                                                commandObject, columnName);
    }

    unsubscribe(subscriptionId,successCallback,subscriptionColumnReference) {
        this.ampsController.unsubscribe(subscriptionId,successCallback,subscriptionColumnReference);
    }

    updateUIWithDefaultViewData(){
        this.uiRef.loadDataGridWithDefaultView();
    }

    updateUIRowWithData(newData, rowReference){
        this.uiRef.rowUpdate(newData,rowReference);
    }

    getDefaultViewData(startIndex, endIndex, rowHeight) {
        let gridDataSource = this.appDataModel.getDataMapInRangeFromDefaultData(startIndex, endIndex);
        let topDivHeight = startIndex * rowHeight;
        let bottomDivHeight = (this.appDataModel.getdefaultDataViewSize() - (startIndex + gridDataSource.length)) * rowHeight;
        return { gridDataSource, topDivHeight, bottomDivHeight };
    }

    updateRowDataInGroupedData(message){
        let columnKeyMapper = this.appDataModel.getGroupColumnKeyMapper();
        let columnValue = this.groupingColumnsByLevel.map((val,k)=>message.data[val]).join('-');
        let groupKey = columnKeyMapper.get(columnValue);
        let groupData = this.appDataModel.getDataFromGroupedData(groupKey);
        let existingData = groupData.bucketData.get(message.k);
        existingData.data = message.data;
    }

    /** GROUP SUBSCRIPTION DATAHANDLER **/

    ampsGroupSubscribe(commandObject, columnName) {
        this.groupingColumnsByLevel.push(columnName);
        let subController = new GroupSubscriptionController(this,this.groupingColumnsByLevel,commandObject);
        
        this.ampsController.connectAndSubscribe(subController.groupingSubscriptionDataHandler.bind(subController),
                                                subController.groupingSubscriptionDetailsHandler.bind(subController),
                                                commandObject, columnName);
    }

    addColumnSubscriptionMapper(subscriptionId,columnName){
        this.columnSubscriptionMapper.set(columnName,subscriptionId);
    }

    updateUIWithGroupedViewData(){
        this.uiRef.loadDataGridWithGroupedView();
    }

    setGroupingColumnKeyMap(groupingColumnKeyMapper){
        this.setGroupingColumnKeyMapper = groupingColumnKeyMapper;
    }

    isSubscriptionExists(groupByColumn) {
        let subscriptionId = this.subscriptionData.get(groupByColumn);
        if (subscriptionId != undefined) {
            return true;
        }
        return false;
    }

    getGroupedViewData(startIndex, endIndex, rowHeight) {
        let gridDataSource = this.appDataModel.getDataMapInRangeFromGroupedData(startIndex, endIndex);
        let topDivHeight = startIndex * rowHeight;
        let bottomDivHeight = (this.appDataModel.getGroupedViewDataSize() - (startIndex + gridDataSource.length)) * rowHeight;
        return { gridDataSource, topDivHeight, bottomDivHeight };
    }

    updateGroupExpansionStatus(groupKey) {
        let expandStatus = this.appDataModel.getDataFromGroupedData(groupKey).showBucketData;
        this.appDataModel.getDataFromGroupedData(groupKey).showBucketData = !expandStatus;

        let groupedViewData = this.appDataModel.createGroupedViewedData(this.appDataModel.getGroupedData());
        this.appDataModel.setGroupedViewData(groupedViewData);
        this.uiRef.updateDataGridWithGroupedView();
    }

    /** Clearing Grouping subscriptions */

    clearGroupSubscriptions(){
        if(this.columnSubscriptionMapper.size==0){
            return;
        }
        this.columnSubscriptionMapper.forEach((value,key)=>{
           this.unsubscribe(value, (subId,columnRef)=>this.columnSubscriptionMapper.delete(columnRef),key);
        });
        this.clearArray(this.groupingColumnsByLevel);
        this.appDataModel.getGroupedData().clear();
        this.appDataModel.setGroupedData(undefined);
        this.appDataModel.getGroupColumnKeyMapper().clear();
        this.appDataModel.setGroupColumnKeyMapper(undefined);
        this.clearArray(this.appDataModel.getGroupedViewData());
        this.appDataModel.setGroupedViewData(undefined);
        this.uiRef.loadDataGridWithDefaultView();
    }

    clearArray(array){
        while(array.length>0){
            array.pop();
        }
    }
}

