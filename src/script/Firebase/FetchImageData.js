import { db } from '../../firebaseConfig';
import {doc, getDoc} from 'firebase/firestore';

// Fetch image data from firestore. Returns the document data as an object
export default async function fetchImageData(docId) {
    const docRef = doc(db, "wireframe", docId);
    try {
        const doc = await getDoc(docRef);
        if (doc.exists()) {
            return doc.data().imageUrl;
        } else {
            console.log("No document with this ID found");
        }
    } catch (error) {
        console.error("Error fetching document:", error);
    }
};