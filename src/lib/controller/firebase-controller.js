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

  set user(value) {
    this._user = value;
  }

  get user() {
    return firebase.auth().currentUser;
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
    firebase.database().ref(`users/${user.uid}`).once('value', snapshot => {
      let value = snapshot.val();
      if (value !== null) {
        this.user = value;
        this.dispatchEvent('user-login', value);
      } else {
        this.login();
        this.createUser(user);
      }
    });
  }

  randomAvatar() {
    let num = Math.floor((Math.random() * 10) + 1); // Get a number between 1 & 10
    return `sources/avatar-${num}.png`;
  }

  createUser(user) {
    if (user.isAnonymous) {
      let newPassword = Math.random().toString(36).slice(-8);
      let newName = Math.random().toString(36).slice(-8);
      let newEmail = `${newName}@hitch.on`;

      user.updatePassword(newPassword).then(() => {
        // Update successful.
      }, (error) => {
        this.error(error);
      });

      user.updateEmail(newEmail).then(() => {
        // Update successful.
      }, (error) => {
        this.error(error);
      });

      return this.writeUserData(user.uid, newName, newEmail, this.randomAvatar());
    }
  }

  writeUserData(uid, name, email, imageUrl) {
     if (name !== null && email !== null && imageUrl !== null) {
      firebase.database().ref('users/' + uid).set({
        displayName: name,
        email: email,
        profile_picture : imageUrl
      });
    }
  }
}
