import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyAkWQ3N4mnhC7XLNheKSsdD_3bHXHSf7e4",
    authDomain: "curso-131f6.firebaseapp.com",
    projectId: "curso-131f6",
    storageBucket: "curso-131f6.firebasestorage.app",
    messagingSenderId: "163863189153",
    appId: "1:163863189153:web:896ca883990fb94ab402e0",
    measurementId: "G-LY2XLGYXEC",
};

const firebaseApp = initializeApp(firebaseConfig);

const db = getFirestore(firebaseApp);
const auth = getAuth(firebaseApp);

export { db, auth };
