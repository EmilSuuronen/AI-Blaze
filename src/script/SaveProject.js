import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";

export default async function saveProject(docId, contentData, projectName) {
  const docRef = doc(db, "wireframe", docId);
  try {
    await updateDoc(docRef, {
      contentData: contentData, // Update the 'contentData' field
      projectName: projectName, // Update the 'projectName' field
    });
    console.log("Document updated successfully");
  } catch (error) {
    console.error("Error updating document: ", error);
  }
}
