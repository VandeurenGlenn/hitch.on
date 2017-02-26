'use strict';
import BaseController from './base-controller';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';

export default class FirebaseController extends BaseController {
  constructor() {
    super();
    // bind methods
    this._onAuthStateChanged = this._onAuthStateChanged.bind(this);
    // Initialize Firebase
    this.config = {
      apiKey: "AIzaSyD7PPhYwaZ2Wz2qKeYqf-R06kBTtbQaIOA",
      authDomain: "hitchon-d9a93.firebaseapp.com",
      databaseURL: "https://hitchon-d9a93.firebaseio.com",
      storageBucket: "hitchon-d9a93.appspot.com",
      messagingSenderId: "844416389017"
    };
    firebase.initializeApp(this.config);

    firebase.auth().onAuthStateChanged(this._onAuthStateChanged);

    window.firebase = firebase;
  }

  get firebase() {
    return window.firebase;
  }

  set _user(user) {
    if (user && user.isAnonymous) {
    }
  }

  get user() {
    this._user = firebase.auth().currentUser;
    return this._user || JSON.parse(localStorage.getItem(`firebase:authUser:${this.config.apiKey}:[DEFAULT]`));
  }

  /**
   * @arg {string} provider default's to anonymous, options: 'anonymous', 'google'
   */
  login() {
    if (this.user === null) {
      firebase.auth().signInAnonymously().catch(error => {
        this.errorHandler(error);
      });
    }
  }

  _onAuthStateChanged(user) {
    if (user) {
      // User is signed in.
      var isAnonymous = user.isAnonymous;
      var uid = user.uid;

      if (isAnonymous && user.email === null) {
        let newPassword = Math.random().toString(36).slice(-8);
        let newName = Math.random().toString(36).slice(-8);
        let newEmail = `${newName}@hitch.on`;

        user.updatePassword(newPassword).then(() => {
          console.log(newPassword);
          // Update successful.
        }, (error) => {
          this.error(error);
        });

        user.updateEmail(newEmail).then(() => {
          console.log(newEmail);
          // Update successful.
        }, (error) => {
          this.error(error);
        });

        this.writeUserData(uid, newName, newEmail, this.randomAvatar());
      } else {
        firebase.database().ref('users/' + uid).once('value', (snapshot) => {
          if (!new Boolean(snapshot.val())) {
            this.writeUserData(uid, user.displayName, user.email, user.photoURL);
          }
        })

      }

      this.dispatchEvent('user-login', uid);
    } else {
      // User is signed out.
      // ...
    }
  }

  randomAvatar() {
    let num = Math.floor((Math.random() * 10) + 1); // Get a number between 1 & 10
    return `sources/avatar-${num}.png`;
  }

  writeUserData(userId, name, email, imageUrl) {
    let user = {
      username: name,
      email: email,
      profile_picture : imageUrl
    };
    if (user.name && user.email && user.profile_picture) {
      firebase.database().ref('users/' + userId).set(user);
    }

    // localStorage.setItem('hitchon-user-uid', userId);
  }
}
