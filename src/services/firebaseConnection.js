import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import {getFirestore} from 'firebase/firestore'
import {getStorage} from 'firebase/storage'

const firebaseConfig = {
    apiKey: "AIzaSyDkl5nfQ7kl3jwpkvYzMqaPZ4X965hqEV0",
    authDomain: "tickets-c5ca5.firebaseapp.com",
    projectId: "tickets-c5ca5",
    storageBucket: "tickets-c5ca5.appspot.com",
    messagingSenderId: "782080588881",
    appId: "1:782080588881:web:836c9e7d2a256445420c70",
    measurementId: "G-STBFPG2WWJ"
  };

    const firebaseApp = initializeApp(firebaseConfig);
    const auth = getAuth(firebaseApp);
    const db = getFirestore(firebaseApp)
    const storage = getStorage(firebaseApp)

    export {auth,db ,storage}