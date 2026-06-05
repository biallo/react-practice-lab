import { useEffect, useRef } from 'react';
import { versionLessons } from '../data/lessons.js';

const formatIndex = (index) => String(index + 1).padStart(2, '0');

export function Sidebar({ activeLesson, completedCount, onLessonSelect, progress }) {
  const lessonListRef = useRef(null);
  const progressPercent = Math.round((completedCount / versionLessons.length) * 100);

  useEffect(() => {
    const list = lessonListRef.current;
    const activeItem = list?.querySelector(`[data-lesson-id="${activeLesson.id}"]`);

    if (!list || !activeItem) {
      return undefined;
    }

    const frame = requestAnimationFrame(() => {
      const listRect = list.getBoundingClientRect();
      const itemRect = activeItem.getBoundingClientRect();
      const padding = 8;

      if (itemRect.top < listRect.top) {
        list.scrollBy({
          top: -(listRect.top - itemRect.top) - padding,
          behavior: 'smooth'
        });
      } else if (itemRect.bottom > listRect.bottom) {
        list.scrollBy({
          top: itemRect.bottom - listRect.bottom + padding,
          behavior: 'smooth'
        });
      }

      if (itemRect.left < listRect.left) {
        list.scrollBy({
          left: -(listRect.left - itemRect.left) - padding,
          behavior: 'smooth'
        });
      } else if (itemRect.right > listRect.right) {
        list.scrollBy({
          left: itemRect.right - listRect.right + padding,
          behavior: 'smooth'
        });
      }
    });

    return () => cancelAnimationFrame(frame);
  }, [activeLesson.id]);

  return (
    <aside className="sidebar" aria-label="课程列表">
      <div className="brand">
        <div className="brand-mark">R</div>
        <div>
          <p>React Practice Lab</p>
          <span>按版本时间线复盘核心特性</span>
        </div>
      </div>

      <div className="progress-panel">
        <div className="progress-row">
          <span>总体进度</span>
          <strong>{progressPercent}%</strong>
        </div>
        <div className="progress-track" aria-hidden="true">
          <div style={{ width: `${progressPercent}%` }} />
        </div>
        <p>
          {completedCount} / {versionLessons.length} 个版本节点完成
        </p>
      </div>

      <label className="mobile-lesson-picker">
        <span>当前课程</span>
        <select
          onChange={(event) => {
            const lesson = versionLessons.find((item) => item.id === event.target.value);
            if (lesson) {
              onLessonSelect(lesson);
            }
          }}
          value={activeLesson.id}
        >
          {versionLessons.map((lesson, index) => (
            <option key={lesson.id} value={lesson.id}>
              {formatIndex(index)} · React {lesson.version} · {lesson.title}
            </option>
          ))}
        </select>
      </label>

      <nav className="lesson-list" ref={lessonListRef}>
        {versionLessons.map((lesson, index) => {
          const isActive = lesson.id === activeLesson.id;
          const isCompleted = progress[lesson.id];

          return (
            <button
              className={`lesson-item${isActive ? ' active' : ''}${isCompleted ? ' completed' : ''}`}
              data-lesson-id={lesson.id}
              key={lesson.id}
              onClick={() => onLessonSelect(lesson)}
              type="button"
            >
              <span className="lesson-number">{formatIndex(index)}</span>
              <span className="lesson-copy">
                <strong>React {lesson.version}</strong>
                <small>{lesson.date} · {lesson.era}</small>
                <span>{lesson.title}</span>
              </span>
              {
                isCompleted
                  ? <span className="lesson-status">✓</span>
                  : ''
              }
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
