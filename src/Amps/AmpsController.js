import * as Amps from 'amps';
import serverconfig from '../../serverconfig.json';

var targetConfig 
for(var item in serverconfig){
    if(serverconfig[item].active){
        targetConfig = serverconfig[item];
        break;
    }
}

var ip = targetConfig.serverIP;
var port = targetConfig.serverPort;

var ampsServerUri = `ws://${ip}:${port}/amps/json`;
var ampsClient = new Amps.Client(`AmpsWebClient-${Date.now()}`);
var i = 0;

var AmpsControllerSingleton = (function () {
    var instance;
    return {
        getInstance: function () {
            if (instance != undefined) {
                return instance;
            } else {
                instance = new AmpsController();
                return instance;
            }
        }
    }
})();

 class AmpsController {

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

                if (commandObject.bookmark != undefined) {
                    ampsCommandObject = ampsCommandObject.bookmark(commandObject.bookmark);
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