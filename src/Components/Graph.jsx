import React, { Component } from 'react';
import styles from '../../styles/AppStyles.css'

class Graph extends Component {
    constructor() {
        super();
        this.moveAt = this.moveAt.bind(this);
        this.mouseMove = this.mouseMove.bind(this);
    }

    mouseDown(ev) {
        ev.preventDefault();
        ev.target.style.position = 'absolute';
        // ev.target.style.zIndex = '1000';
        // document.body.append(ev.target);
        document.addEventListener('mousemove', this.mouseMove);
        this.moveAt(this.refs.draggableNode, ev.pageX, ev.pageY);
    }

    mouseMove(ev) {
        console.log(ev.pageX);
        this.moveAt(this.refs.draggableNode, ev.pageX, ev.pageY);
    }

    moveAt(target, pageX, pageY) {
        // if(target.nodeType==3)
        //     return;
        target.style.left = pageX - target.offsetWidth / 2 + 'px';
        target.style.top = pageY - target.offsetHeight / 2 + 'px';

        // target.childNodes.forEach((item,i)=>{this.moveAt(item,pageX,pageY)});
    }

    mouseUp(ev) {
        this.moveAt(this.refs.draggableNode, ev.pageX, ev.pageY);
        document.removeEventListener('mousemove', this.mouseMove);
    }

    render() {
        return (
            <div ref='draggableNode'
                className={styles.draggableDiv}
                onMouseUp={this.mouseUp.bind(this)}
                onMouseDown={this.mouseDown.bind(this)}>
                <div>Libor_3M</div>
            </div>
        )
    }
}

export default Graph