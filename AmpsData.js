import React from 'react';
import * as Amps from 'amps';

var ampsServerUri = "ws://10.0.0.19:9008/amps/json";
var ampsClient = new Amps.Client('shankersClient'); 
export default class AmpsData {
 
    connectAndPublish() {
        ampsClient.connect(ampsServerUri)
            .then(() => {
                console.log("Connection successful");
                console.log("AMPS Version "+ ampsClient.Client);

                for(var i=0;i<10;i++){
                ampsClient.publish('Price', { localWeather: 'Sunny day in Hyd '+ i, globalWeather: 'chilled in US' })
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
                },'Price')
            }).then((subId)=>{
                console.log("Subscription ID: "+ subId);
                subscriberInfoCallback(subId);
            })
    }

    testData(callback){
        // let i=0;
        // let dataFire = setInterval(()=>{
            for(let i=0;i<=20000;i++){
                // if(i==10000){
                //     clearInterval(dataFire);
                // }
              callback({ "swapId": i, "customer": "Shaz", "interest": Math.floor((Math.random() * 50) + 1), "swap_rate": Math.random()*50,
                         "YearsIn": i*2, "PayFixedRate": i*2.123, "PayCurrency": "USD"});
            }
        // },0.0001);
    }

}
