export const STORAGE_KEYS = {
  activeLessonId: 'react-practice-lab:active-lesson-id',
  progress: 'react-practice-lab:progress'
};

export const loadActiveLessonId = (lessons, defaultLessonId) => {
  try {
    const savedLessonId = localStorage.getItem(STORAGE_KEYS.activeLessonId);
    return lessons.some((lesson) => lesson.id === savedLessonId) ? savedLessonId : defaultLessonId;
  } catch {
    return defaultLessonId;
  }
};

export const loadProgress = (lessons) => {
  try {
    const savedProgress = JSON.parse(localStorage.getItem(STORAGE_KEYS.progress) ?? '{}');
    if (!savedProgress || typeof savedProgress !== 'object' || Array.isArray(savedProgress)) {
      return {};
    }

    return Object.fromEntries(
      lessons
        .filter((lesson) => savedProgress[lesson.id] === true)
        .map((lesson) => [lesson.id, true])
    );
  } catch {
    return {};
  }
};

export const saveActiveLessonId = (lessonId) => {
  try {
    localStorage.setItem(STORAGE_KEYS.activeLessonId, lessonId);
  } catch {
    // Ignore unavailable storage, such as private browsing restrictions.
  }
};

export const saveProgress = (progress) => {
  try {
    localStorage.setItem(STORAGE_KEYS.progress, JSON.stringify(progress));
  } catch {
    // Ignore unavailable storage, such as private browsing restrictions.
  }
};
