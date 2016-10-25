'use strict';

import supportsCustomElements from './lib/helpers/supports-custom-elements';
import loadScript from './lib/helpers/load-script';
import Hitchon from './lib/hitch-on';

// check if browser has native customElements v1 support & import when not supported
supportsCustomElements().then(supported => {
  if (!supported) {
    let src = './bower_components/custom-elements/custom-elements.min.js';
    loadScript(src).then(() => {
      new Hitchon();
    });
  } else {
    new Hitchon();
  }
});
