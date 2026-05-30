import {
    collection,
    addDoc,
    getDocs,
    query,
    where,
    serverTimestamp,
  } from "firebase/firestore"
  import { db } from "../firebase/config"
  
  export async function createSubmission(data: any) {
    return await addDoc(collection(db, "submissions"), {
      ...data,
      status: "pending",
      createdAt: serverTimestamp(),
    })
  }
  
  export async function getApprovedApps() {
    const q = query(collection(db, "apps"), where("status", "==", "approved"))
    const snapshot = await getDocs(q)
  
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))
  }
  
  export async function getApprovedGames() {
    const q = query(collection(db, "games"), where("status", "==", "approved"))
    const snapshot = await getDocs(q)
  
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))
  }
  
  export async function getPendingSubmissions() {
    const q = query(collection(db, "submissions"), where("status", "==", "pending"))
    const snapshot = await getDocs(q)
  
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))
  }