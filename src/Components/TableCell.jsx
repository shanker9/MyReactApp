import React from 'react';
import styles from '../../styles/AppStyles.css'

class TableCell extends React.Component {

    constructor() {
        super();
        

    }

    componentWillMount() {
    }

    componentWillReceiveProps(nextProps) {
    }

    shouldComponentUpdate(nextProps, nextState) {
   }

    componentWillUpdate() {
    }

    componentDidUpdate() {
        
        this.refs.tableRow.style.backgroundColor = 'yellow';

        let blueCircle = this.refs.tableRow;
        
       blueCircle.addEventListener("transitionend", this.detectTheEnd, false);
       blueCircle.addEventListener("webkitTransitionEnd", this.detectTheEnd, false);
       blueCircle.addEventListener("mozTransitionEnd", this.detectTheEnd, false);
       blueCircle.addEventListener("msTransitionEnd", this.detectTheEnd, false);
       blueCircle.addEventListener("oTransitionEnd", this.detectTheEnd, false);
        


    }

    detectTheEnd(e) {
        console.log('Transition End');
        this.refs.tableRow.style.backgroundColor = 'white';
    }




    render() {

        return (
            <td>{this.props.cellData}</td>
        )
    }

}

export default TableCell;