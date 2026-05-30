import { GithubAuthProvider, GoogleAuthProvider } from 'firebase/auth'
import { collection, doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore'
import { ref } from 'firebase/storage'
import { auth, db, storage } from '../firebase/config'

export type UserRole = 'user' | 'developer' | 'admin'

export interface UserProfileRecord {
  uid: string
  displayName: string
  username?: string
  email: string
  photoURL?: string | null
  providerId?: string
  role?: UserRole
  createdAt?: unknown
  updatedAt?: unknown
}

export const googleAuthProvider = new GoogleAuthProvider()
export const githubAuthProvider = new GithubAuthProvider()

githubAuthProvider.addScope('read:user')
githubAuthProvider.addScope('user:email')

export const firestoreCollections = {
  users: collection(db, 'users'),
  submissions: collection(db, 'submissions'),
  apps: collection(db, 'apps'),
  games: collection(db, 'games'),
  categories: collection(db, 'categories'),
  reviews: collection(db, 'reviews'),
  analytics: collection(db, 'analytics'),
  settings: collection(db, 'settings'),
  appSubmissions: collection(db, 'appSubmissions'),
  userProfiles: collection(db, 'userProfiles'),
  marketplaceApps: collection(db, 'marketplaceApps'),
  marketplaceGames: collection(db, 'marketplaceGames'),
}

function sanitizePathSegment(segment: string): string {
  return segment.replace(/[^a-zA-Z0-9._-]/g, '_').replace(/\.\./g, '_')
}

export const storagePaths = {
  avatar: (fileName: string) => ref(storage, `avatars/${sanitizePathSegment(fileName)}`),
  appIcon: (fileName: string) => ref(storage, `app-icons/${sanitizePathSegment(fileName)}`),
  screenshot: (fileName: string) => ref(storage, `screenshots/${sanitizePathSegment(fileName)}`),
}

export async function ensureUserRecord(profile: UserProfileRecord) {
  const userRef = doc(firestoreCollections.users, profile.uid)
  const snapshot = await getDoc(userRef)
  const nextRecord: UserProfileRecord = {
    ...profile,
    role: snapshot.exists() ? (snapshot.data().role as UserRole | undefined) ?? profile.role ?? 'user' : profile.role ?? 'user',
    updatedAt: serverTimestamp(),
  }

  await setDoc(userRef, nextRecord, { merge: true })
  return nextRecord
}

export async function getUserRole(uid: string): Promise<UserRole> {
  const snapshot = await getDoc(doc(firestoreCollections.users, uid))
  return (snapshot.data()?.role as UserRole | undefined) ?? 'user'
}

export { auth }