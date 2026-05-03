export const lessonTabs = [
  { id: 'explain', label: '讲解' },
  { id: 'practice', label: '练习' },
  { id: 'review', label: '复盘' }
];

export function LessonTabs({ activeTab, onTabChange }) {
  return (
    <div className="lesson-tabs" role="tablist" aria-label="课程内容分类">
      {lessonTabs.map((tab) => (
        <button
          aria-selected={activeTab === tab.id}
          className={activeTab === tab.id ? 'lesson-tab active' : 'lesson-tab'}
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          role="tab"
          type="button"
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
