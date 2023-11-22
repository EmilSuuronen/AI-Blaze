// Fetch image data from firestore. Returns the document data as an object
import {collection, getDocs, query, where} from "firebase/firestore";
import {db} from "../firebaseConfig";

export default async function fetchImagesByUser(uid) {
    try {
        const q = query(collection(db, 'wireframe'), where('uid', '==', uid));
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => doc.data().imageUrl);
    } catch (error) {
        console.error("Error fetching documents: ", error);
    }
};

