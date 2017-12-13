import AmpsControllerSingleton from '../Amps/AmpsController.js';
import AppDataModelSingleton from '../DataModel/AppDataModel.js';

export default class SubscriptionController {
    constructor(controllerRef) {
        this.parentControllerRef = controllerRef;
        this.ampsController = AmpsControllerSingleton.getInstance();
        this.appDataModel = AppDataModelSingleton.getInstance();
    }


    defaultSubscriptionDataHandler1(message) {
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

            if (this.appDataModel.getGroupedData() != undefined) {
                this.parentControllerRef.updateRowDataInGroupedData(message);
            }
            this.parentControllerRef.updateUIRowWithData(newData,item.isSelected, item.rowID);
        }
    }

    defaultSubscriptionDataHandler(message) {

        let messageType = message.c;

        switch(messageType){
            case 'group_begin':
            console.log(message.c);
            break;

            case 'group_end':
            console.log(message.c);
            this.parentControllerRef.updateUIWithDefaultViewData();
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
                    this.parentControllerRef.updateRowDataInGroupedData(message);
                }
                this.parentControllerRef.updateUIRowWithData(newData,item.isSelected, item.rowID);
            }
            break;

            case Default:
            console.log('OOF message received');
        }


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

            if (this.appDataModel.getGroupedData() != undefined) {
                this.parentControllerRef.updateRowDataInGroupedData(message);
            }
            this.parentControllerRef.updateUIRowWithData(newData,item.isSelected, item.rowID);
        }
    }

    temporalDataMessageHandler(message){
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

            if (this.appDataModel.getGroupedData() != undefined) {
                this.parentControllerRef.updateRowDataInGroupedData(message);
            }
            this.parentControllerRef.updateUIRowWithData(newData,item.isSelected, item.rowID);
        }

    }


    defaultSubscriptionDetailsHandler(subscriptionId) {
        console.log('Default Subscription ID:', subscriptionId);
    }

    mergeJsonObjects(json1, json2) {
        for (var key in json2) {
            json1[key] = json2[key];
        }
        return json1;
    }

    dateFormatter(epochVal) {
        let d;
        if (typeof epochVal == 'string') {
            d = new Date(parseInt(epochVal) * 1000);
        }
        let hrVal = d.getHours();
        let ampmString = hrVal > 12 ? 'PM' : 'AM';
        hrVal = ampmString == 'PM' ? hrVal - 12 : hrVal;
        hrVal = hrVal < 10 ? `0${hrVal}` : hrVal;

        let minVal = d.getMinutes();
        minVal = minVal < 10 ? `0${minVal}` : minVal;

        let secVal = d.getSeconds();
        secVal = secVal < 10 ? `0${secVal}` : secVal;

        return `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()} ${hrVal}:${minVal}:${secVal} ${ampmString}`;
    }

}