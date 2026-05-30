import {
    deleteObject,
    getDownloadURL,
    ref,
    uploadBytes,
  } from "firebase/storage"
  
  import { storage } from "../firebase/config"
  
  export async function uploadFile(file: File, path: string) {
    const storageRef = ref(storage, path)
  
    const snapshot = await uploadBytes(storageRef, file)
  
    return await getDownloadURL(snapshot.ref)
  }
  
  export async function uploadAppIcon(
    file: File,
    slug: string
  ) {
    return uploadFile(
      file,
      `apps/${slug}/icon-${Date.now()}-${file.name}`
    )
  }
  
  export async function uploadScreenshots(
    files: File[],
    slug: string
  ) {
    return await Promise.all(
      files.map((file, index) =>
        uploadFile(
          file,
          `apps/${slug}/screenshots/${index}-${Date.now()}-${file.name}`
        )
      )
    )
  }
  
  export async function uploadGameAssets(
    files: File[],
    slug: string
  ) {
    return await Promise.all(
      files.map((file, index) =>
        uploadFile(
          file,
          `games/${slug}/assets/${index}-${Date.now()}-${file.name}`
        )
      )
    )
  }
  
  export async function deleteFile(path: string) {
    const storageRef = ref(storage, path)
  
    await deleteObject(storageRef)
  }