export const lesson = {
  id: 'react-166',
  version: '16.6',
  date: '2018-10-23',
  era: '性能与懒加载',
  title: 'memo、lazy 与 Suspense 代码分割',
  summary:
    'React 16.6 带来 React.memo、React.lazy、Suspense 代码分割，以及 class 中读取 Context 的 contextType。',
  whyItMatters:
    'React 16.6 把函数组件性能优化和组件级代码分割带入稳定 API。memo 让函数组件可以按 props 跳过渲染，lazy 让组件文件按需下载，Suspense 为懒加载声明统一 loading UI。这些能力的共同目标是控制渲染成本和首屏包体积。',
  features: [
    {
      name: 'React.memo',
      api: 'React.memo(Component, areEqual?)',
      note:
        'memo 包裹函数组件后，React 会在 props 浅比较相等时复用上一次渲染结果。它不是自动性能按钮，只有当组件渲染成本较高或 props 稳定时才值得使用。'
    },
    {
      name: 'React.lazy',
      api: 'React.lazy(() => import(...))',
      note:
        'lazy 接收动态 import，返回一个懒加载组件。组件第一次被渲染时才下载对应模块。它必须和 Suspense 配合，因为加载期间需要 fallback。'
    },
    {
      name: 'Suspense 代码分割',
      api: '<Suspense fallback={...}>',
      note:
        '在 16.6 中，Suspense 稳定支持的主要场景是 React.lazy 代码分割。它声明“子树还没准备好时显示什么”。数据获取 Suspense 在当时还不是稳定主线。'
    },
    {
      name: 'static contextType',
      api: 'MyClass.contextType = ThemeContext',
      note:
        'class 组件可以通过 contextType 读取单个 Context，避免 Consumer 嵌套。但它一次只能绑定一个 Context。'
    }
  ],
  deepDive: [
    {
      title: '1. memo 优化的是重新渲染，不是首次渲染',
      body:
        'React.memo 只有在父组件更新导致子组件可能重渲染时才发挥作用。首次渲染仍然会执行。它也不能阻止内部 state 或 context 变化导致的渲染。'
    },
    {
      title: '2. lazy 优化的是加载时机',
      body:
        '把很少访问的设置页、图表页、管理后台模块延后下载，可以降低首屏 JavaScript 体积。但如果拆得太碎，网络请求和 loading 状态也会变多。'
    },
    {
      title: '3. Suspense 是声明加载边界',
      body:
        'Suspense 不是加载动画组件，而是边界。边界内某个 lazy 组件还没准备好时，最近的 Suspense fallback 会接管显示。边界放得太大，用户看到的 loading 范围也会变大。'
    }
  ],
  code: `const SettingsPanel = React.lazy(() => import('./SettingsPanel'));

const UserBadge = React.memo(function UserBadge({ user }) {
  return (
    <section>
      <strong>{user.name}</strong>
      <span>{user.role}</span>
    </section>
  );
});

function AccountPage({ user }) {
  return (
    <>
      <UserBadge user={user} />
      <React.Suspense fallback={<p>正在加载设置面板...</p>}>
        <SettingsPanel />
      </React.Suspense>
    </>
  );
}`,
  practice: [
    {
      title: '识别适合 lazy 的组件',
      body:
        '选择一个非首屏、体积较大或低频访问的组件，例如设置面板或图表面板。把它改成 React.lazy(() => import(...))。'
    },
    {
      title: '放置合适的 Suspense 边界',
      body:
        '给 lazy 组件外层加 Suspense。尝试把边界放在页面最外层和局部面板外层，比较用户看到的 loading 范围。'
    },
    {
      title: '判断是否需要 memo',
      body:
        '找一个纯展示函数组件，记录它的 props 是否稳定、渲染是否昂贵。只有在这两个条件至少满足一个时再加 memo，并说明原因。'
    }
  ],
  answer: {
    code: `const SettingsPanel = React.lazy(() => import('./SettingsPanel'));

const UserBadge = React.memo(function UserBadge({ user }) {
  return (
    <section>
      <strong>{user.name}</strong>
      <span>{user.role}</span>
    </section>
  );
});

function AccountPage({ user }) {
  return (
    <>
      <UserBadge user={user} />
      <React.Suspense fallback={<p>正在加载设置面板...</p>}>
        <SettingsPanel />
      </React.Suspense>
    </>
  );
}`,
    notes: [
      'SettingsPanel 是低频或较大的模块，适合用 React.lazy 延后加载。',
      'Suspense 的 fallback 只覆盖它包住的懒加载子树。',
      'React.memo 适合 props 稳定且渲染成本值得优化的展示组件。'
    ]
  },
  checklist: [
    'React.memo 的收益和限制清晰，避免无差别包裹所有组件。',
    'React.lazy 通过动态 import 改变模块加载时机。',
    'Suspense fallback 的显示范围由最近的 Suspense 边界决定。',
    '16.6 中 Suspense 的稳定主场景是代码分割。'
  ],
  sources: ['React v16.6 release blog']
};
