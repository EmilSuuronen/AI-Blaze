// Fetch image data from firestore. Returns the document data as an object
import {collection, getDocs, query, where, deleteDoc, doc, updateDoc} from "firebase/firestore";
import {db} from "../firebaseConfig";

export default async function fetchImagesByUser(uid) {
    try {
        const q = query(collection(db, 'wireframe'), where('uid', '==', uid));
        const querySnapshot = await getDocs(q);

        const updatePromises = [];
        const validDocs = [];

        querySnapshot.forEach(docSnapshot => {
            const data = docSnapshot.data();

            // Check if the document has the "contentData" field or if its value is empty
            if (!data.hasOwnProperty('contentData') || data.contentData === "") {
                // If the condition is met, add the deletion promise to the array
                const deletionPromise = deleteDoc(doc(db, 'wireframe', docSnapshot.id));
                updatePromises.push(deletionPromise);
            } else {
                // If the document is valid, add the Firestore document ID to the data
                const docWithId = { ...data, documentId: docSnapshot.id };
                validDocs.push(docWithId);

                // Update the document with the added property
                const updatePromise = updateDoc(doc(db, 'wireframe', docSnapshot.id), docWithId);
                updatePromises.push(updatePromise);
            }
        });

        // Wait for all deletion promises to complete
        await Promise.all(updatePromises);

        // Return the remaining valid documents
        return validDocs;
    } catch (error) {
        console.error("Error fetching documents: ", error);
    }
};

