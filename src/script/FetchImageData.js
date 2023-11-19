import { db } from '../firebaseConfig';
import {collection, getDocs, query, where} from 'firebase/firestore';

// Fetch image data from firestore. Returns the document data as an object
export default async function fetchImageData(userUid) {
    const imagesCollectionRef = collection(db, "wireframe");

    try {
         const q = query(imagesCollectionRef, where("uid", "==", userUid));
         const querySnapshot = await getDocs(q);

         const imageData = [];
         querySnapshot.forEach((doc) => {
             imageData.push(doc.data());
         });
 
         return imageData;
    } catch (error) {
        console.error("Error fetching document:", error);
        return [];
    }
};
