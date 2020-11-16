import firebase from 'firebase';

const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyAmEsHfHRJXQcfhgewQd9biOwhiMt8Mvnw",
    authDomain: "instagram-clone-542cf.firebaseapp.com",
    databaseURL: "https://instagram-clone-542cf.firebaseio.com",
    projectId: "instagram-clone-542cf",
    storageBucket: "instagram-clone-542cf.appspot.com",
    messagingSenderId: "45817243592",
    appId: "1:45817243592:web:0f580a62c37f496d5182fd",
    measurementId: "G-54NLHWBEV8"
  });

const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export { db, auth, storage };
