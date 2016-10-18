'use strict';
import {find} from 'openport';

export default () => {
  return new Promise((resolve, reject) => {
    find(
      {
        startingPort: 22,
        endingPort: 2000,
        avoid: [ 25, 1025, 1500 ]
      },
      (err, port) => {
        if(err) { reject(err) }
        resolve(port);
      }
    );
  });
};
