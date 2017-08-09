import React from 'react';
// import { myStyles } from './App.jsx';

class TableRow extends React.Component {
    render() {

        var myStyles = {
            border: '2px solid black',
            width: '100px'
        }
        return (
            <tr>
                <td style={myStyles}>{this.props.data.id}</td>
                <td style={myStyles}>{this.props.data.name}</td>
                <td style={myStyles}>{this.props.data.age}</td>
            </tr>
        );
    }
}

export default TableRow;