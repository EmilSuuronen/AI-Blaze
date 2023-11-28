import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";

export async function saveProjectName(docId, projectName) {
  const docRef = doc(db, "wireframe", docId);
  try {
    await updateDoc(docRef, {
      projectName: projectName, // Update the 'projectName' field
    });
    console.log("Project name updated successfully");
  } catch (error) {
    console.error("Error updating project name: ", error);
  }
}
