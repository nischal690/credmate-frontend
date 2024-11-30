const CAPTURED_PHOTO_KEY = 'captured_photo'

export function savePhotoToStorage(photoData: string) {
  localStorage.setItem(CAPTURED_PHOTO_KEY, photoData)
}

export function getPhotoFromStorage(): string | null {
  return localStorage.getItem(CAPTURED_PHOTO_KEY)
}

export function clearPhotoFromStorage() {
  localStorage.removeItem(CAPTURED_PHOTO_KEY)
}

