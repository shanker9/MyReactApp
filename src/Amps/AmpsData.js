import * as Amps from 'amps';

// var ampsServerUri = "ws://192.168.2.119:9008/amps/json";
var ampsServerUri = "ws://182.71.244.27:9008/amps/json";
// var ampsServerUri = "ws://10.0.0.3:9008/amps/json";
var ampsClient = new Amps.Client('AmpsWebClient');
var i = 0;

var AmpsControllerSingleton = (function () {
    var instance;
    return {
        getInstance: function () {
            if (instance != undefined) {
                return instance;
            } else {
                instance = new AmpsData();
                return instance;
            }
        }
    }
})();


 class AmpsData {

    constructor() {
        this.ampsconnectObject = undefined;
    }

    connectAndSubscribe(dataUpdateCallback, subscriberInfoCallback, commandObject, groupingColumnKey) {
        var subscriberId;
        let ampsCommandObject, tryCount = 0;
        if (this.ampsconnectObject == undefined) {
            try {
                this.ampsconnectObject = ampsClient.connect(ampsServerUri);
            } catch (e) {
                if (tryCount == 5) {
                    console.log('multiple connnection timeouts');
                } else {
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

    unsubscribe(subId, successCallback) {
        ampsClient.unsubscribe(subId)
            .then(() => {
                successCallback(subId);
            });
    }

    unsubscribe(subId, successCallback, subscriptionColumnReference) {
        ampsClient.unsubscribe(subId)
            .then(() => {
                console.log('Unsubscribed the subscription with ID : ' + subId);
                successCallback(subId, subscriptionColumnReference);
            });
    }

}

export default AmpsControllerSingleton;