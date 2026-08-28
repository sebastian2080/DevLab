import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyCCLoedeJ8XaKqQSekQRt6fAVHmO3bri7w",
    authDomain: "devlab-c128d.firebaseapp.com",
    projectId: "devlab-c128d",
    storageBucket: "devlab-c128d.firebasestorage.app",
    messagingSenderId: "850073979768",
    appId: "1:850073979768:web:f17a5820afc92ddb66568d"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);