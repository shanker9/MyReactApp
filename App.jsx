import React from 'react';
import AmpsClientData from './AmpsData.js';
import TableRow from './TableRow.jsx';

class App extends React.Component {

    constructor() {
        super();

        this.state = {
            data:
            [
                {
                    "id": 1,
                    "name": "Foo",
                    "age": "20"
                },

                {
                    "id": 2,
                    "name": "Bar",
                    "age": "30"
                },

                {
                    "id": 3,
                    "name": "Shaz",
                    "age": "40"
                }
            ]
        }
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick() {
        let controller = new AmpsClientData();
        let result = controller.connectAndPublish();
        if (result) {
            controller.connectAndSubscribe();
            console.log('Operation completed Successfully');
        }
        else {
            console.log('Error Occured. See details below...');
        }

    }

    render() {

        return (
            <div>
                <h1 style={myStyles.header}>Random Data</h1>
                <button style={myStyles.button} onClick={this.handleClick.bind(this)}>GetAmpsMessages</button>
                <table >
                    <tbody>
                        {this.state.data.map((person, i) => <TableRow key={i} data={person} />)}
                    </tbody>
                </table>
            </div>
        );

    }


}


export const myStyles = {
    header: {
        fontSize: 25,
        color: '#c00000'
    },
    button: {
        flex: 1,
        flexDirection: 'row',
        height: 20,
        marginBottom: 10,
        backgroundcolor: 'grey'
    }
}

export default App;