'use strict';
import {desktopCapturer} from 'electron';
import Events from 'events';

export default class DesktopCapturer extends Events {
  constructor() {
    super();
  }

  getSources(types) {
    return new Promise((resolve, reject) => {
      desktopCapturer.getSources({types: types}, (error, sources) => {
        if (error) throw error
        var _sources = [];
        for (let i = 0; i < sources.length; ++i) {
          _sources.push(sources[i]);
        }
        resolve(_sources);
      });
    });
  }

  handleError (e) {
    console.log(e)
  }

  openChooseScreenDialog() {
    document.dispatchEvent(new CustomEvent('open-choose-screen', {detail: this.screensCatalog}))
  }

  stream(id) {
      navigator.webkitGetUserMedia({
        audio: false,
        video: {
          mandatory: {
            chromeMediaSource: 'desktop',
            chromeMediaSourceId: id,
            minWidth: 1280,
            maxWidth: 1280,
            minHeight: 720,
            maxHeight: 720
          }
        }
      }, this.handleStream.bind(this), this.handleError.bind(this))
    }

    handleStream(stream) {
      this.emit('stream-update', window.URL.createObjectURL(stream));

    }
}
