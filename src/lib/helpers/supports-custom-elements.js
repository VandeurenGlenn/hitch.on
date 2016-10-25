'use strict';
// prefix version for now
export default (version=1) => {

  return new Promise((resolve, reject) => {
    try {
      const supportsCustomElementsV1 = 'customElements' in window;

      // Lazy load the polyfill if necessary.
      if (!supportsCustomElementsV1) {
          return resolve(false);
      } else {
        return resolve(true);
      }
    } catch (error) {
      reject(error);
    }
  });
}
