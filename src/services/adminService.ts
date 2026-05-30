import {
    collection,
    doc,
    getDocs,
    query,
    where,
    addDoc,
    updateDoc,
    serverTimestamp,
  } from "firebase/firestore"
  import { db } from "../firebase/config"
  
  export async function getPendingSubmissions() {
    const q = query(
      collection(db, "submissions"),
      where("status", "in", ["pending", "pending-review"])
    )
  
    const snapshot = await getDocs(q)
  
    return snapshot.docs.map((item) => ({
      id: item.id,
      ...item.data(),
    }))
  }
  
  export async function approveSubmission(submission: any) {
    const targetCollection = submission.type === "game" ? "games" : "apps"
  
    await addDoc(collection(db, targetCollection), {
      ...submission,
      status: "approved",
      approvedAt: serverTimestamp(),
    })
  
    await updateDoc(doc(db, "submissions", submission.id), {
      status: "approved",
      approvedAt: serverTimestamp(),
    })
  }
  
  export async function rejectSubmission(id: string) {
    await updateDoc(doc(db, "submissions", id), {
      status: "rejected",
      rejectedAt: serverTimestamp(),
    })
  }