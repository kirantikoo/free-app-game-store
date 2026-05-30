import { collection, getDocs, query, where } from "firebase/firestore"
import { db } from "../firebase/config"

export async function getApprovedApps() {
  const q = query(collection(db, "apps"), where("status", "==", "approved"))
  const snapshot = await getDocs(q)

  return snapshot.docs.map((item) => ({
    id: item.id,
    ...item.data(),
  }))
}

export async function getApprovedGames() {
  const q = query(collection(db, "games"), where("status", "==", "approved"))
  const snapshot = await getDocs(q)

  return snapshot.docs.map((item) => ({
    id: item.id,
    ...item.data(),
  }))
}

export async function getFeaturedApps() {
  const q = query(
    collection(db, "apps"),
    where("status", "==", "approved"),
    where("featured", "==", true)
  )

  const snapshot = await getDocs(q)

  return snapshot.docs.map((item) => ({
    id: item.id,
    ...item.data(),
  }))
}

export async function getTrendingGames() {
  const q = query(
    collection(db, "games"),
    where("status", "==", "approved"),
    where("trending", "==", true)
  )

  const snapshot = await getDocs(q)

  return snapshot.docs.map((item) => ({
    id: item.id,
    ...item.data(),
  }))
}