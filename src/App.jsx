import { useEffect, useMemo, useState } from 'react';
import { LessonContent } from './components/LessonContent.jsx';
import { LessonHeader } from './components/LessonHeader.jsx';
import { LessonTabs } from './components/LessonTabs.jsx';
import { Sidebar } from './components/Sidebar.jsx';
import { versionLessons } from './data/lessons.js';
import {
  loadActiveLessonId,
  loadPracticeDrafts,
  loadProgress,
  saveActiveLessonId,
  savePracticeDrafts,
  saveProgress
} from './utils/storage.js';

const defaultLessonId = versionLessons[0].id;

function App() {
  const [activeLessonId, setActiveLessonId] = useState(() =>
    loadActiveLessonId(versionLessons, defaultLessonId)
  );
  const [activeTab, setActiveTab] = useState('explain');
  const [progress, setProgress] = useState(() => loadProgress(versionLessons));
  const [practiceDrafts, setPracticeDrafts] = useState(() => loadPracticeDrafts(versionLessons));

  const activeIndex = Math.max(
    versionLessons.findIndex((lesson) => lesson.id === activeLessonId),
    0
  );
  const activeLesson = versionLessons[activeIndex];
  const completedCount = useMemo(() => Object.values(progress).filter(Boolean).length, [progress]);

  const selectLesson = (lesson) => {
    setActiveLessonId(lesson.id);
    setActiveTab('explain');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const markDone = () => {
    setProgress((current) => ({
      ...current,
      [activeLesson.id]: true
    }));
  };

  const updatePracticeDraft = (draft) => {
    setPracticeDrafts((current) => ({
      ...current,
      [activeLesson.id]: draft
    }));
  };

  useEffect(() => {
    saveActiveLessonId(activeLessonId);
  }, [activeLessonId]);

  useEffect(() => {
    saveProgress(progress);
  }, [progress]);

  useEffect(() => {
    savePracticeDrafts(practiceDrafts);
  }, [practiceDrafts]);

  return (
    <main className="app-shell">
      <Sidebar
        activeLesson={activeLesson}
        completedCount={completedCount}
        onLessonSelect={selectLesson}
        progress={progress}
      />

      <section className="workspace">
        <LessonHeader lesson={activeLesson} />
        <LessonTabs activeTab={activeTab} onTabChange={setActiveTab} />
        <LessonContent
          isDone={Boolean(progress[activeLesson.id])}
          lesson={activeLesson}
          onDone={markDone}
          onPracticeDraftChange={updatePracticeDraft}
          practiceDraft={practiceDrafts[activeLesson.id] ?? ''}
          tab={activeTab}
        />
      </section>
    </main>
  );
}

export default App;
