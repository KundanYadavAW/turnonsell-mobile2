import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

const firebaseConfig = {
 


// apiKey: "AIzaSyCCxwi8H2VDLqrMaQrKa0iHJBjte182kNc",
// authDomain: "react-search-app-f9112.firebaseapp.com",
// projectId: "react-search-app-f9112",
// storageBucket: "react-search-app-f9112.appspot.com",
// messagingSenderId: "86477221134",
// appId: "1:86477221134:web:bade6f09240737918cbb5f",
// measurementId: "G-EGL4RX19LW"


 apiKey: "AIzaSyBupHTyiXPrg5JLAUhPnas6Xnvdxut0fDg",
  authDomain: "turnonsell-8738c.firebaseapp.com",
  projectId: "turnonsell-8738c",
  storageBucket: "turnonsell-8738c.firebasestorage.app",
  messagingSenderId: "43213790677",
  appId: "1:43213790677:web:f56b2f46184fbfba32715c",
  measurementId: "G-8QWPRXWWFF"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider, signInWithPopup };
