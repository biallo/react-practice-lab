import { FeatureList } from './FeatureList.jsx';

function DetailList({ items }) {
  return (
    <div className="detail-list">
      {items.map((item) => (
        <article className="detail-item" key={item.title}>
          <h3>{item.title}</h3>
          <p>{item.body}</p>
        </article>
      ))}
    </div>
  );
}

export function LessonContent({
  isDone,
  lesson,
  onDone,
  tab
}) {
  if (tab === 'review') {
    return (
      <section className="content-grid">
        <article className="panel wide">
          <div className="section-title">
            <span>Review</span>
            <h2>复盘</h2>
          </div>
          <ul className="checklist">
            {lesson.checklist.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <button className={isDone ? 'primary done' : 'primary'} onClick={onDone} type="button">
            {isDone ? '已完成' : '标记为已完成'}
          </button>
        </article>
      </section>
    );
  }

  return (
    <section className="content-grid">
      <article className="panel wide">
        <div className="section-title">
          <span>Why</span>
          <h2>这个版本解决了什么</h2>
        </div>
        <p className="lead">{lesson.whyItMatters}</p>
      </article>

      <article className="panel wide">
        <div className="section-title">
          <span>Features</span>
          <h2>方法与特性</h2>
        </div>
        <FeatureList features={lesson.features} />
      </article>

      <article className="panel wide">
        <div className="section-title">
          <span>Deep Dive</span>
          <h2>深入理解</h2>
        </div>
        <DetailList items={lesson.deepDive} />
      </article>

      <article className="panel wide">
        <div className="section-title">
          <span>Code</span>
          <h2>代码示例</h2>
        </div>
        <pre className="code-block">
          <code>{lesson.code}</code>
        </pre>
      </article>
    </section>
  );
}
