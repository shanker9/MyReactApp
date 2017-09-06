import React from 'react';
import * as Amps from 'amps';

var ampsServerUri = "ws://192.168.2.119:9008/amps/json";
var ampsClient = new Amps.Client('shankersClient');
var i = 0;
export default class AmpsData {

    connectAndPublish() {
        ampsClient.connect(ampsServerUri)
            .then(() => {
                console.log("Connection successful");
                console.log("AMPS Version " + ampsClient.Client);

                for (var i = 0; i < 10; i++) {
                    ampsClient.publish('Price', { localWeather: 'Sunny day in Hyd ' + i, globalWeather: 'chilled in US' })
                    ampsClient.publish('Price', { localWeather: 'Chilled in Hyd' + i, globalWeather: 'chilled in US' })
                    ampsClient.publish('Price', { localWeather: 'Its heavy down pouring' + i, globalWeather: 'heavy snowfall in US' })
                    ampsClient.publish('Price', { localWeather: 'Hot and humid' + i, globalWeather: 'Sunny day in US' })
                }

                ampsClient.disconnect();
                console.log('Published Data successfully!');
            })
            .catch((error) => {
                console.log('Error Occured. See details below...');
                console.log(error);
            })
    }

    connectAndSubscribe(dataUpdateCallback, subscriberInfoCallback) {
        var subscriberId;
        ampsClient.connect(ampsServerUri)
            .then(() => {
                return ampsClient.subscribe((message) => {
                    // console.log(message.data);
                    // console.log(message.data.customer);
                    dataUpdateCallback(message.data);
                    // console.log(Date.now());
                }, 'Price')
            }).then((subId) => {
                console.log("Subscription ID: " + subId);
                subscriberInfoCallback(subId);
            })
    }

    testData(callback) {
        // let i=0;
        // let dataFire = setInterval(()=>{
        let j = i + 500000;
        var counterParty = ["Goldman Sachs", "Bank of America", "JP Morgan", "PIMCO", "Bridgewater", "Morgan Stanley", "General Electric",
            "General Motors", "Deutsche Bank", "Fidelity"];
        var interest = ["2.5", "3", "4.5", "5.6", "3.3", "6.5", "2.3", "3.4", "4.2", "3.2"];
        for (; i < j; i++) {
            // if(i==100){
            //     clearInterval(dataFire);
            // }
            callback({
                "swapId": i + 1, "customer": counterParty[i % 10], "interest": interest[i % 10], "swap_rate": (interest[i % 10] * 2.3).toFixed(2),
                "yearsIn": i * 2, "payFixedRate": (i * 2.123).toFixed(2), "payCurrency": "USD"
            });
        }
        // callback({
        //         "swapId": 1, "customer": counterParty[8], "interest": interest[7], "swap_rate": (interest[7] * 2.3).toFixed(2),
        //         "yearsIn": 2, "payFixedRate": (2.123).toFixed(2), "payCurrency": "USD"
        // });

        // setInterval(() => {
        //     let k = 0;
        //     for (; k < 10; k++) {
        //         // if(i==100){
        //         //     clearInterval(dataFire);
        //         // }
        //         callback({
        //             "swapId": Math.floor((Math.random() * 100) + 1) + 1, "customer": counterParty[k % 10], "interest": interest[k % 10], "swap_rate": (interest[k % 10] * 2.3).toFixed(2),
        //             "yearsIn": k * 2, "payFixedRate": (k * 2.123).toFixed(2), "payCurrency": "USD"
        //         });
        //     }
        // },1000);


    }

}
