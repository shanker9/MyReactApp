import AmpsControllerSingleton from '../Amps/AmpsController.js';
import AppDataModelSingleton from '../DataModel/AppDataModel.js';

export default class AggDetailsDataQueryController {
    constructor(aggregatedRowKey, subscriptionCommand,initialUIupdateCallback,uiUpdateCallback) {
        this.rowKey = aggregatedRowKey;
        this.command = subscriptionCommand;
        this.initialUIupdateCallback = initialUIupdateCallback;
        this.uiUpdateCallback = uiUpdateCallback;
        this.aggRowData = undefined;
        this.ampsController = AmpsControllerSingleton.getInstance();
        this.appDataModel = AppDataModelSingleton.getInstance();
    }

    subscribe(subscriptionSuccessCallback) {
        this.ampsController.connectAndSubscribe(this.defaultSubscriptionDataHandler.bind(this), subscriptionSuccessCallback, this.command);
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
            this.data.set(message.k, { "rowID": message.k, "data": message.data, "isSelected": false, "isUpdated": false });
        } else if (message.c == 'p') {
            let newData = message.data;
            let rowKey = message.k;
            let item = this.aggRowData.bucketData.get(rowKey);
            
            this.aggRowData.bucketData.set(rowKey, { "rowID": item.rowID, "data": newData, "isSelected": item.isSelected, "isUpdated": true });

            this.uiUpdateCallback(newData, item.isSelected, item.rowID);
        }
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