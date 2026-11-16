import { initializeApp, getApps } from 'firebase/app';
import { getFirestore, collection, getDocs, query, where } from 'firebase/firestore';

// Firebase web configuration is public. Security is enforced by Firebase Rules.
// The real activity collection remains read-only in this preview.
const firebaseConfig = {
  apiKey: 'AIzaSyAovYRZpqOI4bXhjCZVTkZNu57GhFF3KFw',
  authDomain: 'group-activity-complete-life.firebaseapp.com',
  projectId: 'group-activity-complete-life',
  storageBucket: 'group-activity-complete-life.firebasestorage.app',
  messagingSenderId: '133830123615',
  appId: '1:133830123615:web:cc400279c04391f51d3bea'
};

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
const db = getFirestore(app);

// Public data contract: events/{id} with status = "published".
// No write actions are exposed to anonymous visitors.
export async function loadPublishedEvents() {
  const snap = await getDocs(query(collection(db, 'events'), where('status', '==', 'published')));
  return snap.docs.map(doc => {
    const data = doc.data();
    const rawDate = typeof data.date === 'string' ? data.date : (data.date?.toDate?.()?.toISOString?.().slice(0, 10) || '');
    const date = rawDate.replaceAll('-', '.');
    return {
      id: doc.id,
      title: String(data.title || '未命名活動'),
      date,
      year: date.slice(0, 4),
      tag: String(data.category || '活動紀錄'),
      summary: String(data.introduction || ''),
      story: String(data.story || data.introduction || ''),
      location: String(data.location || ''),
      image: typeof data.coverImage === 'string' ? data.coverImage : '',
      photos: Array.isArray(data.photos) ? data.photos.filter(u => typeof u === 'string' && /^https:\/\//.test(u)).slice(0, 24) : [],
      videoUrl: typeof data.videoUrl === 'string' ? data.videoUrl : '',
      count: Array.isArray(data.photos) ? data.photos.length + ' 張照片' : '活動紀錄',
      isDemo: false
    };
  }).sort((a,b) => b.date.localeCompare(a.date));
}
