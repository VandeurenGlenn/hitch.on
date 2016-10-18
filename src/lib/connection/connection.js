'use strict';
import findOpenPort from './find-open-port'

export default class Connection {

  info() {
    return new Promise((resolve, reject) => {
      this.getAddressInfo().then((response) => {
        this.ip = response.ip;
        this.country = response.country;
        this.hostname = response.hostname;
        findOpenPort().then((port) => {
          this.port = port;
          resolve({
            ip: this.ip,
            port: this.port,
            hostname: this.hostname,
            country: this.country
          });
        });
      })
    });
  }

  getAddressInfo() {
    return new Promise((resolve, reject) => {
      fetch('https://v4.ifconfig.co/json')
        .then(response => {return response.json()})
        .then(response => {resolve(response)});
    });
  }
}
