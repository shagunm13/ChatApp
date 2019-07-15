import firebase from 'firebase/app';
import "firebase/auth";
import "firebase/database";
import "firebase/storage";


const firebaseConfig = {
    apiKey: "AIzaSyC-w7qT3xS-382Fzpq0BWzyxlitNpfd4Q8",
    authDomain: "react-slack-clone-33b54.firebaseapp.com",
    databaseURL: "https://react-slack-clone-33b54.firebaseio.com",
    projectId: "react-slack-clone-33b54",
    storageBucket: "react-slack-clone-33b54.appspot.com",
    messagingSenderId: "18393672701",
    appId: "1:18393672701:web:aca90f89f6e590ed"
};

firebase.initializeApp(firebaseConfig)

export default firebase;