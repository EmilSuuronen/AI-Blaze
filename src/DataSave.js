import React, { useEffect, useState } from "react";
import { db } from "./firebaseConfig";
import { getDocs, collection, addDoc } from "firebase/firestore";

export default function DataSave() {
  const projectCollectionRef = collection(db, "project");
  const [newHtml, setNewHtml] = useState("");
  const [newCss, setNewCss] = useState("");
  const [jokeData, setJokeData] = useState(null);

  useEffect(() => {
    const getProject = async () => {
      try {
        const data = await getDocs(projectCollectionRef);
        const filteredData = data.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        console.log("data", filteredData);
      } catch (err) {
        console.log(err);
      }
    };
    getProject();
  }, []);

  useEffect(() => {
    fetch("https://official-joke-api.appspot.com/random_joke")
      .then((response) => response.json())
      .then((data) => {
        setJokeData(data);
        console.log("API data", data);

        saveDataToFirebase(data);
      })
      .catch((error) => {
        console.error("Error fetching data from API:", error);
      });
  }, []);

  const saveDataToFirebase = async (apiData) => {
    try {
      await addDoc(projectCollectionRef, {
        html: newHtml,
        css: newCss,
        apiData: apiData,
      });

      console.log("Data saved to Firebase:", apiData);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      <input placeholder="html" onChange={(e) => setNewHtml(e.target.value)} />
      <input placeholder="css" onChange={(e) => setNewCss(e.target.value)} />
      <button onClick={saveDataToFirebase}>Save</button>

      {jokeData && (
        <div>
          {/* Render the API data */}
          <h2>Joke:</h2>
          <p>{jokeData.setup}</p>
          <p>{jokeData.punchline}</p>
        </div>
      )}
    </div>
  );
}
