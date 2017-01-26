import * as firebase from 'firebase/app';
import 'firebase/database';

const config = {
  apiKey: 'AIzaSyBYCemR2_W47ZUjtgnbFtCInOuSYd0i5g4',
  authDomain: 'telefonify-100b7.firebaseapp.com',
  databaseURL: 'https://telefonify-100b7.firebaseio.com',
  storageBucket: 'telefonify-100b7.appspot.com',
  messagingSenderId: '339504682445'
};

firebase.initializeApp(config);

export const db = firebase.database();

export const awnsers = db.ref('awnsers');
export const users = db.ref('users');
export const question = db.ref('question');

export type Awnser = {user: string, index: number};
export type User = {id: string, name: string};
export type Question = {id: string, question: string, options: Option[]};
export type Option = string;

export const registerUser = (db: firebase.database.Database, name: string) => {
  const user = users.push();

  user.set({id: user.key, name: name});

  return user;
};
