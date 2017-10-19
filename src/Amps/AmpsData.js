import * as Amps from 'amps';

// var ampsServerUri = "ws://192.168.2.119:9008/amps/json";
var ampsServerUri = "ws://182.71.244.27:9008/amps/json";
var ampsClient = new Amps.Client('AmpsWebClient');
var i = 0;
export default class AmpsData {

    constructor() {
        this.ampsconnectObject = undefined;
    }

    connectAndSubscribe(dataUpdateCallback, subscriberInfoCallback) {
        var subscriberId;
        ampsClient.connect(ampsServerUri)
            .then(() => {
                return ampsClient.execute(
                    new Amps.Command('sow_and_subscribe')
                        .topic('Price')
                        .filter('/swapId >=0')
                        .orderBy('/swapId')
                        .options('projection=[/customer,/swapId,/interest,sum(/swap_rate) as /swap_rate,/yearsIn,/payFixedRate,/payCurrency],grouping=[/customer]')
                    , dataUpdateCallback
                );

            }).then((subId) => {
                console.log("Subscription ID: " + subId);
                subscriberInfoCallback(subId);
            })
    }

    connectAndSubscribe(dataUpdateCallback, subscriberInfoCallback, commandObject, groupingColumnKey) {
        var subscriberId;
        let ampsCommandObject, tryCount=0;
        if (this.ampsconnectObject == undefined) {
            try {
                this.ampsconnectObject = ampsClient.connect(ampsServerUri);
            }catch(e){
                if(tryCount==5){
                    console.log('multiple connnection timeouts');
                }else{
                    tryCount++;
                    this.ampsconnectObject = ampsClient.connect(ampsServerUri);
                }
            }
        }

        this.ampsconnectObject
            .then(() => {
                if (commandObject.command != undefined) {
                    ampsCommandObject = new Amps.Command(commandObject.command);
                }

                if (commandObject.topic != undefined) {
                    ampsCommandObject = ampsCommandObject.topic(commandObject.topic);
                }

                if (commandObject.filter != undefined) {
                    ampsCommandObject = ampsCommandObject.filter(commandObject.filter);
                }

                if (commandObject.orderBy != undefined) {
                    ampsCommandObject = ampsCommandObject.orderBy(commandObject.orderBy);
                }

                if (commandObject.options != undefined) {
                    ampsCommandObject = ampsCommandObject.options(commandObject.options);
                }

                return ampsClient.execute(ampsCommandObject, dataUpdateCallback);

            }).then((subId) => {
                console.log("Subscription ID: " + subId);
                if (groupingColumnKey == undefined) {
                    subscriberInfoCallback(subId);
                } else {
                    subscriberInfoCallback(subId, groupingColumnKey);
                }
            })
    }

    unsubscribe(subId, successCallback, subscriptionColumnReference) {
        ampsClient.unsubscribe(subId)
            .then(() => {
                console.log('Unsubscribed the subscription with ID : ' + subId);
                successCallback(subId, subscriptionColumnReference);
            });
    }

    testData(callback) {

        let publishedData = [];
        let iterData;
        let j = i + 500;
        var counterParty = ["Goldman Sachs", "Bank of America", "JP Morgan", "PIMCO", "Bridgewater", "Morgan Stanley", "General Electric",
            "General Motors", "Deutsche Bank", "Fidelity"];
        var interest = ["2.5", "3", "4.5", "5.6", "3.3", "6.5", "2.3", "3.4", "4.2", "3.2"];

        for (; i < j; i++) {
            iterData = {
                "swapId": i + 1, "customer": counterParty[i % 10], "interest": interest[i % 10], "swap_rate": (interest[i % 10] * 2.3).toFixed(2),
                "yearsIn": i * 2, "payFixedRate": (i * 2.123).toFixed(2), "payCurrency": "USD"
            };
            publishedData.push(iterData);
            callback(iterData);
        }

        // setInterval(() => {
        //     let k = 0, updateData;
        //     for (; k < 1000; k++) {
        //         updateData = publishedData[(Math.floor((Math.random() * 499) + 1) + 1)];
        //         updateData.swap_rate = (interest[k % 10] * 2.3).toFixed(2);
        //         updateData.payFixedRate = (k * 2.123).toFixed(2);
        //         callback(updateData);
        //     }
        // }, 5000);

    }

}
