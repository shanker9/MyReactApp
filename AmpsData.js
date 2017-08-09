import React from 'react';
import * as Amps from 'amps';

export default class AmpsData {


    connectAndPublish() {
        let ampsServerUri = 'tcp://54.165.50.179:9007/amps/json';
        let ampsClient = new Amps.Client('shankersClient');

        ampsClient.connect(ampsServerUri)
            .then(() => {
                ampsClient.publish('newsUpdate', { localWeather: 'Sunny day in Hyd', globalWeather: 'chilled in US' })
                ampsClient.publish('newsUpdate', { localWeather: 'Chilled in Hyd', globalWeather: 'chilled in US' })
                ampsClient.publish('newsUpdate', { localWeather: 'Its heavy down pouring', globalWeather: 'heavy snowfall in US' })
                ampsClient.publish('newsUpdate', { localWeather: 'Hot and humid', globalWeather: 'Sunny day in US' })

                ampsClient.disconnect();
                console.log('Published Data successfully!');
                return true;
            })
            .catch((error) => {
                console.log(error);
            })
            
    }

    connectAndSubscribe() {
        let ampsServerUri = 'tcp://54.165.50.179:9007/amps/json';
        let ampsClient = new Amps.Client('shankersClient');

        ampsClient.connect(ampsServerUri)
            .then(() => {
                ampsClient.subscribe((message) => {
                    console.log(message);
                })
            })
    }
}
