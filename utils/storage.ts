import { UserProfile } from 'firebase/auth';

const CAPTURED_PHOTO_KEY = 'captured_photo';

export function savePhotoToStorage(photoData: string) {
  localStorage.setItem(CAPTURED_PHOTO_KEY, photoData);
}

export function getPhotoFromStorage(): string | null {
  return localStorage.getItem(CAPTURED_PHOTO_KEY);
}

export function clearPhotoFromStorage() {
  localStorage.removeItem(CAPTURED_PHOTO_KEY);
}

export const STORAGE_KEY = 'user_profile';
export const PROFILE_TIMESTAMP_KEY = 'profile_last_fetched';

export function setStoredProfile(profile: UserProfile): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
}

export function getStoredProfile(): UserProfile | null {
  const storedProfile = localStorage.getItem(STORAGE_KEY);
  return storedProfile ? JSON.parse(storedProfile) : null;
}

export function setProfileLastFetched(timestamp: number): void {
  localStorage.setItem(PROFILE_TIMESTAMP_KEY, timestamp.toString());
}

export function getProfileLastFetched(): number | null {
  const timestamp = localStorage.getItem(PROFILE_TIMESTAMP_KEY);
  return timestamp ? parseInt(timestamp, 10) : null;
}

export function clearStoredProfile(): void {
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem(PROFILE_TIMESTAMP_KEY);
}
