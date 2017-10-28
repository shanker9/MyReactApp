import AmpsControllerSingleton from '../Amps/AmpsData.js';
import AppDataModelSingleton from '../DataModel/AppDataModel.js';
import SubscriptionController from './SubscriptionController.js';
import GroupSubscriptionController from './GroupSubscriptionController.js';
import QueryController from './QueryController.js';

export default class TableController {
    constructor(componentRef, subscriptionTopic) {
        this.uiRef = componentRef;
        this.subscriptionTopic = subscriptionTopic;
        this.ampsController = AmpsControllerSingleton.getInstance();
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
        this.queryController = new QueryController();
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

    updateUIRowWithData(newData, selectState, rowReference) {
        this.uiRef.rowUpdate(newData, selectState, rowReference);
    }

    getDefaultViewData(startIndex, endIndex, rowHeight) {
        let gridDataSource = this.appDataModel.getDataMapInRangeFromDefaultData(startIndex, endIndex);
        let topDivHeight = startIndex * rowHeight;
        let bottomDivHeight = (this.appDataModel.getdefaultDataViewSize() - (startIndex + gridDataSource.length)) * rowHeight;
        return { gridDataSource, topDivHeight, bottomDivHeight };
    }

    updateRowDataInGroupedData(message) {
        let columnKeyMapper = this.appDataModel.getGroupColumnKeyMapper();
        let columnValue = this.groupingColumnsByLevel.map((val, k) => this.getJsonValAtPath(this.appDataModel.dataKeysJsonpathMapper[val], message.data)).join('-');
        let groupKey = columnKeyMapper.get(columnValue);
        let groupData = this.appDataModel.getDataFromGroupedData(groupKey);
        let existingData = groupData.bucketData.get(message.k);
        existingData.data = message.data;
    }

    getJsonValAtPath(path, jsonObject) {
        let pathComponents = path.split('/').slice(1), tempJson = jsonObject, temp;
        for (let i = 0; i < pathComponents.length; i++) {
            temp = tempJson[pathComponents[i]];
            if (temp == undefined) {
                return null;
            }
            tempJson = temp;
        }
        return tempJson;
    }


    getDatamapSize() {
        return this.appDataModel.getDataMap().size;
    }

    /** GROUP SUBSCRIPTION DATAHANDLER **/

    groupDataByColumnKey(columnName) {
        let subId = this.columnSubscriptionMapper.get(columnName);
        this.clearGroupSubscriptions();

        let index = this.groupingColumnsByLevel.indexOf(columnName);
        if (index != -1) {
            let newGroupingColumnsOrderArray = this.groupingColumnsByLevel.slice(0, index);
            this.groupingColumnsByLevel = newGroupingColumnsOrderArray;
        } else {
            this.groupingColumnsByLevel.push(columnName);
        }

        this.groupingColumnsByLevel.length != 0 ?
            this.ampsGroupSubscribe(this.groupingColumnsByLevel.slice(-1)[0])
            : this.updateUIWithDefaultViewData();
    }

    getGroupingColumnsArray(columnName) {
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
        let projectionColumnSet = new Set();
        let numericValueColumns = ['receivePrice', 'price', 'payPrice', 'payNotional', 'receiveNotional'];
        let dateValueColumns = ['lastUpdate'];

        let groupingString = this.groupingColumnsByLevel.map((item, i) => `${this.getJSONPathForColumnKey(item)}`).join(',');

        // let projectionString = "/key/name,/values/values/lastUpdate/dtVal/str,SUM(/values/values/receivePrice/dblVal) AS /values/values/receivePrice/dblVal,/values/values/id/strVal,SUM(/values/values/price/dblVal) AS /values/values/price/dblVal,/values/values/payPrice/dblVal,/values/values/volatility/dblVal,/values/values/payCurrency/strVal,/values/values/payDiscountCurve/strVal,/values/values/payFixedRate/dblVal,/values/values/maturityDate/dtVal/str,/values/values/payNotional/dblVal,/values/values/receiveDiscountCurve/strVal,/values/values/receiveNotional/dblVal,/values/values/receiveIndex/strVal,/values/values/receiveCurrency/strVal,/values/values/receiveSpread/dblVal,/values/values/counterparty/strVal,/values/values/amerEuro/strVal,/values/values/putCall/strVal,/values/values/contractSize/strVal,/values/values/strike/dblVal,/values/values/underlier/strVal";

        let groupingColumnsCopy = this.groupingColumnsByLevel.slice(0);

        if (groupingColumnsCopy.indexOf('name') != -1) {
            groupingColumnsCopy.splice(projectionArray.indexOf('name'), 1);
            groupingColumnsCopy.push('name');
            groupingColumnsCopy.reverse();
        }

        let groupingColumnsProjectionString = groupingColumnsCopy.map(item => this.getJSONPathForColumnKey(item)).join(',');
        let aggregateColumnsProjectionString = numericValueColumns.map(item => this.getJSONPathForColumnKey(item))
            .map(path => `SUM(${path}) AS ${path}`).join(',');
        // let dateValueColumnsProjectionString = dateValueColumns.map(item => this.getJSONPathForColumnKey(item)).join(',');

        let projArray = [groupingColumnsProjectionString, aggregateColumnsProjectionString];
        // let projArray = [groupingColumnsProjectionString,dateValueColumnsProjectionString,aggregateColumnsProjectionString];
        let projectionString = projArray.join(',');


        let options = `projection=[${projectionString}],grouping=[${groupingString}]`;

        let commandObject = { command, topic, orderby, options };
        return commandObject;
    }

    getJSONPathForColumnKey(key) {
        return this.appDataModel.dataKeysJsonpathMapper[key];
    }

    addColumnSubscriptionMapper(subscriptionId, columnName) {
        this.columnSubscriptionMapper.set(columnName, subscriptionId);
    }

    updateUIAggRowWithData(newData, rowReference) {
        this.uiRef.aggRowUpdate(newData, rowReference);
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

    /** DATA ROW SELECTION */

    updateRowSelectionData(indexValue) {
        this.appDataModel.clearSelectionStateData();
        // Updating selectionstate in the rowData for later use in lazyloading
        let dataForSelectedRow = this.appDataModel.getDataFromDefaultData(indexValue);
        if (dataForSelectedRow != undefined) {
            dataForSelectedRow.isSelected = !dataForSelectedRow.isSelected;
        } else {
            console.log('Data pertaining to the selected row does not exist in the appData');
        }

        //deselecting selected Rows
        let selectedRows = this.appDataModel.getSelectedRows();
        selectedRows.forEach((item, key) => {
            let dataFromDataMap = this.appDataModel.getDataFromDefaultData(key);
            this.updateUIRowWithData(dataFromDataMap.data, dataFromDataMap.isSelected, key);
        })

        // updating selectedRows data
        if (dataForSelectedRow.isSelected) {
            this.appDataModel.addSelectedRow(indexValue, dataForSelectedRow);
        } else {
            this.appDataModel.removeSelectedRow(indexValue);
        }

        // update the UI for the selected row      
        this.updateUIRowWithData(dataForSelectedRow.data, dataForSelectedRow.isSelected, indexValue);
    }

    fetchAndFormatGraphData(rowIndexValue, graphUpdateCallback) {
        let dataForSelectedRow = this.appDataModel.getDataFromDefaultData(rowIndexValue);
        const id = dataForSelectedRow.data.values.values.id.strVal;
        let parentNodeData, parentNodeSources, childNodesArray;

        this.queryController.unsubscribeParentNodeData();

        let parentNodeDataQueryRequest = this.queryController.getParentNodeData('Graph', id, graphUpdateCallback);
        let parentNodeSourcesQueryRequest = this.queryController.getGraphDataForNodeWithId('GraphSources', id);


        Promise.all([parentNodeDataQueryRequest, parentNodeSourcesQueryRequest]).then(values => {
            console.log(values);
            parentNodeData = values[0];
            parentNodeSources = values[1].sources;
            let nodeDataArray = this.queryController.getGraphNodesDataArrayWithIds('Graph', parentNodeSources);
            nodeDataArray.then(result => {
                console.log(result);
                childNodesArray = result;
                this.uiRef.updateGraphUIWithData({ parentNodeData, parentNodeSources, childNodesArray });
            })
        })

        // Promise.all([parentNodeDataQueryRequest])
        //         .then(values=>{
        //             values.forEach(item=>console.log(item));
        //             new Promise((resolve, reject) => {
        //                 let result = this.queryController.getGraphDataForNodeWithId('Graph', id);
        //                 resolve(result);
        //             }).then(nodesData=>{
        //                 console.log(nodesData.length);
        //             })
        //         });
    }
}
