import {
    deleteObject,
    getDownloadURL,
    ref,
    uploadBytes,
  } from "firebase/storage"
  
  import { storage } from "../firebase/config"

  const ALLOWED_IMAGE_TYPES = new Set([
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/webp",
    "image/svg+xml",
  ])

  const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10 MB

  function sanitizePathSegment(segment: string): string {
    return segment.replace(/[^a-zA-Z0-9._-]/g, "_").replace(/\.\./g, "_")
  }

  function validateImageFile(file: File): void {
    if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
      throw new Error(
        `Invalid file type "${file.type}". Allowed: ${[...ALLOWED_IMAGE_TYPES].join(", ")}`
      )
    }
    if (file.size > MAX_FILE_SIZE) {
      throw new Error(
        `File size ${(file.size / 1024 / 1024).toFixed(1)} MB exceeds the 10 MB limit.`
      )
    }
  }

  export async function uploadFile(file: File, path: string) {
    validateImageFile(file)

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
      `apps/${sanitizePathSegment(slug)}/icon-${Date.now()}-${sanitizePathSegment(file.name)}`
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
          `apps/${sanitizePathSegment(slug)}/screenshots/${index}-${Date.now()}-${sanitizePathSegment(file.name)}`
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
          `games/${sanitizePathSegment(slug)}/assets/${index}-${Date.now()}-${sanitizePathSegment(file.name)}`
        )
      )
    )
  }
  
  export async function deleteFile(path: string) {
    const storageRef = ref(storage, path)
  
    await deleteObject(storageRef)
  }