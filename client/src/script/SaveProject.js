import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";

export default async function saveProject(docId, contentData) {
  const docRef = doc(db, "wireframe", docId);
  try {
    await updateDoc(docRef, {
      contentData: contentData,
    });
    console.log("Document updated successfully");
  } catch (error) {
    console.error("Error updating document: ", error);
  }
}