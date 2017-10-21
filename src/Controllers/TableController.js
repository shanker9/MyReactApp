import AmpsController from '../Amps/AmpsData.js';
import AppDataModelSingleton from '../DataModel/AppDataModel.js';
import SubscriptionController from './SubscriptionController.js';
import GroupSubscriptionController from './GroupSubscriptionController.js';

export default class TableController {
    constructor(componentRef,subscriptionTopic) {
        this.uiRef = componentRef;
        this.subscriptionTopic = subscriptionTopic;
        this.ampsController = new AmpsController();
        // this.isGroupedView = undefined;
        this.appDataModel = AppDataModelSingleton.getInstance();
        // this.groupingColumnKeyMap = undefined;
        // this.aggregatedRowsData = undefined;
        // this.subscriptionData = new Map();
        this.groupingColumnsByLevel = [];
        // this.multiLevelData = new Map();
        // this.valueKeyMapSecondLevel = new Map();
        // this.multiGroupingDataMap = new Map();
        // this.groupedData = undefined;

        // this.subscriptionControllersMap = new Map();
        this.columnSubscriptionMapper = new Map();
        this.setGroupingColumnKeyMapper = undefined;
    }

    /** FOR DEFAULT VIEW DATA SUBSCRIPTION */
    ampsSubscribe1(commandObject, columnName) {
        let subController = new SubscriptionController(this);
        this.ampsController.connectAndSubscribe(subController.defaultSubscriptionDataHandler1.bind(subController),
            subController.defaultSubscriptionDetailsHandler.bind(subController),
            commandObject, columnName);
    }

    unsubscribe(subscriptionId, successCallback, subscriptionColumnReference) {
        this.ampsController.unsubscribe(subscriptionId, successCallback, subscriptionColumnReference);
    }

    updateUIWithDefaultViewData() {
        this.uiRef.loadDataGridWithDefaultView();
    }

    updateUIRowWithData(newData, rowReference) {
        this.uiRef.rowUpdate(newData, rowReference);
    }

    getDefaultViewData(startIndex, endIndex, rowHeight) {
        let gridDataSource = this.appDataModel.getDataMapInRangeFromDefaultData(startIndex, endIndex);
        let topDivHeight = startIndex * rowHeight;
        let bottomDivHeight = (this.appDataModel.getdefaultDataViewSize() - (startIndex + gridDataSource.length)) * rowHeight;
        return { gridDataSource, topDivHeight, bottomDivHeight };
    }

    updateRowDataInGroupedData(message) {
        let columnKeyMapper = this.appDataModel.getGroupColumnKeyMapper();
        let columnValue = this.groupingColumnsByLevel.map((val, k) => this.getJsonValAtPath(this.appDataModel.dataKeysJsonpathMapper[val],message.data)).join('-');
        let groupKey = columnKeyMapper.get(columnValue);
        let groupData = this.appDataModel.getDataFromGroupedData(groupKey);
        let existingData = groupData.bucketData.get(message.k);
        existingData.data = message.data;
    }

    getJsonValAtPath(path,jsonObject){
        let pathComponents = path.split('/').slice(1), tempJson = jsonObject, temp;
        for(let i=0; i<pathComponents.length;i++){
            temp = tempJson[pathComponents[i]];
            if(temp==undefined){
                return null;
            }
            tempJson = temp;
        }
        return tempJson;
    }


    getDatamapSize(){
        return this.appDataModel.getDataMap().size;
    }

    /** GROUP SUBSCRIPTION DATAHANDLER **/

    groupDataByColumnKey(columnName) {
        let subId = this.columnSubscriptionMapper.get(columnName);
            this.clearGroupSubscriptions();
            
            let index = this.groupingColumnsByLevel.indexOf(columnName);
            if(index!=-1){
                let newGroupingColumnsOrderArray = this.groupingColumnsByLevel.slice(0, index);
                this.groupingColumnsByLevel = newGroupingColumnsOrderArray;
            }else{
                this.groupingColumnsByLevel.push(columnName);
            }

            this.groupingColumnsByLevel.length != 0 ? 
                this.ampsGroupSubscribe(this.groupingColumnsByLevel.slice(-1)[0])
                : this.updateUIWithDefaultViewData();
    }

    getGroupingColumnsArray(columnName){
        return this.groupingColumnsByLevel;
    }

    ampsGroupSubscribe(columnName) {
        let commandObject = this.formCommandObjectForGroupSubscription(columnName);
        let subController = new GroupSubscriptionController(this, this.groupingColumnsByLevel, commandObject);

        this.ampsController.connectAndSubscribe(subController.groupingSubscriptionDataHandler.bind(subController),
            subController.groupingSubscriptionDetailsHandler.bind(subController),
            commandObject, columnName);
    }

    formCommandObjectForGroupSubscription(columnName) {
        let command = 'sow_and_subscribe';
        let topic = this.subscriptionTopic;
        let orderby = `/${this.groupingColumnsByLevel[0]}`;

        let groupingString = this.groupingColumnsByLevel.map((item, i) => `${this.getJSONPathForColumnKey(item)}`).join(',');

        // let projectionString = this.uiRef.columns.map((item)=>{return this.getJSONPathForColumnKey(item.columnkey)}).join(',');

        // let options = 'projection=[/customer,/receiveIndex,/swapId,/interest,sum(/swap_rate) as /swap_rate,/yearsIn,/payFixedRate,/payCurrency],'
        //     + `grouping=[${groupingObject}]`;

        let projectionString = "/key/name,/values/values/lastUpdate/dtVal/str,/values/values/receivePrice/dblVal,/values/values/id/strVal,/values/values/price/dblVal,/values/values/payPrice/dblVal,/values/values/volatility/dblVal,/values/values/payCurrency/strVal,/values/values/payDiscountCurve/strVal,/values/values/payFixedRate/dblVal,/values/values/maturityDate/dtVal/str,/values/values/payNotional/dblVal,/values/values/receiveDiscountCurve/strVal,/values/values/receiveNotional/dblVal,/values/values/receiveIndex/strVal,/values/values/receiveCurrency/strVal,/values/values/receiveSpread/dblVal,/values/values/counterparty/strVal,/values/values/amerEuro/strVal,/values/values/putCall/strVal,/values/values/contractSize/strVal,/values/values/strike/dblVal,/values/values/underlier/strVal";

        // let projectionString = "/key/name,/values/values/counterparty/strVal,/values/values/receivePrice/dblVal,/values/values/volatility/dblVal";
        // let projectionString = "/values/values/lastUpdate/dtVal/str as /lastUpdate, /values/values/receivePrice/dblVal as /receivePrice, /values/values/id/strVal as /id, /values/values/price/dblVal as /price, /values/values/payPrice/dblVal as /payPrice, /key/name as /name, /values/values/volatility/dblVal as /volatility, /values/values/payCurrency/strVal as /payCurrency, /values/values/payDiscountCurve/strVal as /payDiscountCurve, /values/values/payFixedRate/dblVal as /payFixedRate, /values/values/maturityDate/dtVal/str as /maturityDate, /values/values/payNotional/dblVal as /payNotional, /values/values/receiveDiscountCurve/strVal as /receiveDiscountCurve, /values/values/receiveNotional/dblVal as /receiveNotional, /values/values/receiveIndex/strVal as /receiveIndex, /values/values/receiveCurrency/strVal as /receiveCurrency, /values/values/receiveSpread/dblVal as /receiveSpread, /values/values/counterparty/strVal as /counterparty, /values/values/amerEuro/strVal as /amerEuro, /values/values/putCall/strVal as /putCall, /values/values/contractSize/strVal as /contractSize, /values/values/strike/dblVal as /strike, /values/values/underlier/strVal] as /underlier";

        let options = `projection=[${projectionString}],grouping=[${groupingString}]`;

        let commandObject = { command, topic, orderby, options };
        return commandObject;
    }

    getJSONPathForColumnKey(key){
        return this.appDataModel.dataKeysJsonpathMapper[key];
    }

    addColumnSubscriptionMapper(subscriptionId, columnName) {
        this.columnSubscriptionMapper.set(columnName, subscriptionId);
    }

    updateUIWithGroupedViewData() {
        this.uiRef.loadDataGridWithGroupedView();
    }

    setGroupingColumnKeyMap(groupingColumnKeyMapper) {
        this.setGroupingColumnKeyMapper = groupingColumnKeyMapper;
    }

    isSubscriptionExists(groupByColumn) {
        let subscriptionId = this.columnSubscriptionMapper.get(groupByColumn);
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

    clearGroupSubscriptions() {
        if (this.columnSubscriptionMapper.size == 0) {
            return;
        }
        this.columnSubscriptionMapper.forEach((value, key) => {
            this.unsubscribe(value, (subId, columnRef) => this.columnSubscriptionMapper.delete(columnRef), key);
        });
        this.appDataModel.getGroupedData().clear();
        this.appDataModel.setGroupedData(undefined);
        this.appDataModel.getGroupColumnKeyMapper().clear();
        this.appDataModel.setGroupColumnKeyMapper(undefined);
        this.clearArray(this.appDataModel.getGroupedViewData());
        this.appDataModel.setGroupedViewData(undefined);
    }

    clearGroupSubscription(subscriptionId, groupingColumnKey) {
        this.unsubscribe(subscriptionId, (subId, columnRef) => this.columnSubscriptionMapper.delete(columnRef), groupingColumnKey);

        this.appDataModel.getGroupedData().clear();
        this.appDataModel.setGroupedData(undefined);

        this.appDataModel.getGroupColumnKeyMapper().clear();
        this.appDataModel.setGroupColumnKeyMapper(undefined);

        this.clearArray(this.appDataModel.getGroupedViewData());
        this.appDataModel.setGroupedViewData(undefined);

    }

    clearArray(array) {
        while (array.length > 0) {
            array.pop();
        }
    }
}

