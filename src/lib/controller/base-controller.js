'use strict';

export default class BaseController {
  dispatchEvent(type=String, detail=Object, target=document) {
    target.dispatchEvent(new CustomEvent(type, {detail: detail || null}));
  }

  error(error=Object) {
    var errorCode = error.code;
    var errorMessage = error.message;
    console.log(`error-${errorCode}::${errorMessage}`);
  }
}
