import {initializeApp} from "firebase/app";
import {getAuth, GoogleAuthProvider} from 'firebase/auth';
// import {API_KEY, AUTH_DOMAIN, PROJECT_ID, STORAGE_BUCKET, MESSAGING_SENDER_ID, APP_ID,MEASUREMENT_ID} from '@env';

const firebaseConfig = {
  apiKey: "AIzaSyAIHXYW_jPetIeUj_nb5JGp0kXX4AfrE20",
  authDomain: "snap-project-31726.firebaseapp.com",
  projectId: "snap-project-31726",
  storageBucket: "snap-project-31726.appspot.com",
  messagingSenderId: "1004872490648",
  appId: "1:1004872490648:web:50538810963af027cd7aed",
  measurementId: "G-VDD6M8HV2R"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
export {auth, provider};

// ios: 73862430961-rvdp2o49shiugl5m3nmv6t5ijga69ri8.apps.googleusercontent.com
// android: 73862430961-lb7hiptm7kl64v8rte1e0rdhasfot80m.apps.googleusercontent.com