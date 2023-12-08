import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";

export default async function saveNotes(docId, notes) {
  const docRef = doc(db, "wireframe", docId);
  const lastUpdated = new Date();

  // Extract day, month, and year
  const day = lastUpdated.getDate();
  const month = lastUpdated.getMonth() + 1; // Month is zero-based, so we add 1
  const year = lastUpdated.getFullYear();

  const dateString = `${year}-${month.toString().padStart(2, "0")}-${day
    .toString()
    .padStart(2, "0")}`;

  try {
    await updateDoc(docRef, {
      notes: notes,
      lastUpdated: dateString,
    });
    console.log("Notes updated successfully");
  } catch (error) {
    console.error("Error updating notes: ", error);
  }
}
