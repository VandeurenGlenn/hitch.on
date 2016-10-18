'use strict';
import {clipboard} from 'electron';

export default class Clipboard {

  copy(text, type) {
    clipboard.writeText(text, type);
  }

  paste(type) {
    return clipboard.readText(type);
  }
}
