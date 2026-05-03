export function LessonHeader({ lesson }) {
  return (
    <header className="lesson-header">
      <div>
        <p className="eyebrow">{lesson.date} · React {lesson.version} · {lesson.era}</p>
        <h1>{lesson.title}</h1>
        <p>{lesson.summary}</p>
      </div>
    </header>
  );
}
