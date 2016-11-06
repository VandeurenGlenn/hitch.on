'use strict';
// import hammer from 'hammerjs';

export default class MouseListener extends HTMLElement {

  attachedCallback() {

    this._parent = this.parentNode;
    this._onMousemove = this._onMousemove.bind(this);
    this._onTap = this._onTap.bind(this);
    this._onDoubleClick = this._onDoubleClick.bind(this);

    if (this.auto || this.alwaysOn) {
      this.start();
    }
  }

  detachedCallback() {
    stop();
  }

  get _hammer() {
    return new Hammer.Manager(this.parentNode);
  }

  get auto() {
    return this.hasAttribute('auto');
  }

  get alwaysOn() {
    return this.hasAttribute('always-on');
  }

  get client() {
    return window.hitchon.client;
  }

  start() {
    if (!this.running) {
      this._parent.addEventListener('mousemove', this._onMousemove);
      this._parent.addEventListener('tap', this._onTap);
      this._parent.addEventListener('dblclick', this._onDoubleClick);
      this.running = true;
    }
  }

  stop() {
    if (this.running) {
      this._parent.removeEventListener('mousemove', this._onMousemove);
      this._parent.removeEventListener('tap', this._onTap);
      this._parent.removeEventListener('dblclick', this._onDoubleClick);
      this.running = false;
    }
  }

  _onTap(event) {
    hitchon.client.writeMouse('tap', {taps: 1});
  }

  _onDoubleClick(event) {
    hitchon.client.writeMouse('tap', {taps: 2});
    // console.log(event);
  }

  _onMousemove(event) {
    let move = this._constructMove(event);
    this.client.writeMouse(JSON.stringify({type: 'move', data: move}));
  }

  _constructMove(event) {
    return {
      clientX: new String(event.clientX),
      clientY: new String(event.clientY),
      movementX: new String(event.movementX),
      movementY: new String(event.movementY)
    }

  }
}

document.registerElement('mouse-listener', MouseListener);
