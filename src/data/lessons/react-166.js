export const lesson = {
  "id": "react-166",
  "version": "16.6",
  "date": "2018-10-23",
  "era": "性能与懒加载",
  "title": "memo、lazy 与 Suspense 代码分割",
  "summary": "React 16.6 带来 React.memo、React.lazy、Suspense 代码分割，以及 class 中读取 Context 的 contextType。",
  "whyItMatters": "React 16.6 把函数组件性能优化和组件级代码分割带入稳定 API。memo 让函数组件可以按 props 跳过渲染，lazy 让组件文件按需下载，Suspense 为懒加载声明统一 loading UI。这些能力的共同目标是控制渲染成本和首屏包体积。",
  "features": [
    {
      "name": "React.memo",
      "api": "React.memo(Component, areEqual?)",
      "note": "memo 包裹函数组件后，React 会在 props 浅比较相等时复用上一次渲染结果。它不是自动性能按钮，只有当组件渲染成本较高或 props 稳定时才值得使用。"
    },
    {
      "name": "React.lazy",
      "api": "React.lazy(() => import(...))",
      "note": "lazy 接收动态 import，返回一个懒加载组件。组件第一次被渲染时才下载对应模块。它必须和 Suspense 配合，因为加载期间需要 fallback。"
    },
    {
      "name": "Suspense 代码分割",
      "api": "<Suspense fallback={...}>",
      "note": "在 16.6 中，Suspense 稳定支持的主要场景是 React.lazy 代码分割。它声明“子树还没准备好时显示什么”。数据获取 Suspense 在当时还不是稳定主线。"
    },
    {
      "name": "static contextType",
      "api": "MyClass.contextType = ThemeContext",
      "note": "class 组件可以通过 contextType 读取单个 Context，避免 Consumer 嵌套。但它一次只能绑定一个 Context。"
    }
  ],
  "deepDive": [
    {
      "title": "1. memo 优化的是重新渲染，不是首次渲染",
      "body": "React.memo 只有在父组件更新导致子组件可能重渲染时才发挥作用。首次渲染仍然会执行。它也不能阻止内部 state 或 context 变化导致的渲染。"
    },
    {
      "title": "2. lazy 优化的是加载时机",
      "body": "把很少访问的设置页、图表页、管理后台模块延后下载，可以降低首屏 JavaScript 体积。但如果拆得太碎，网络请求和 loading 状态也会变多。"
    },
    {
      "title": "3. Suspense 是声明加载边界",
      "body": "Suspense 不是加载动画组件，而是边界。边界内某个 lazy 组件还没准备好时，最近的 Suspense fallback 会接管显示。边界放得太大，用户看到的 loading 范围也会变大。"
    }
  ],
  "code": "const SettingsPanel = React.lazy(() => import('./SettingsPanel'));\n\nconst UserBadge = React.memo(function UserBadge({ user }) {\n  return (\n    <section>\n      <strong>{user.name}</strong>\n      <span>{user.role}</span>\n    </section>\n  );\n});\n\nfunction AccountPage({ user }) {\n  return (\n    <>\n      <UserBadge user={user} />\n      <React.Suspense fallback={<p>正在加载设置面板...</p>}>\n        <SettingsPanel />\n      </React.Suspense>\n    </>\n  );\n}",
  "checklist": [
    "React.memo 的收益和限制清晰，避免无差别包裹所有组件。",
    "React.lazy 通过动态 import 改变模块加载时机。",
    "Suspense fallback 的显示范围由最近的 Suspense 边界决定。",
    "16.6 中 Suspense 的稳定主场景是代码分割。"
  ],
  "sources": [
    "React v16.6 release blog"
  ]
};
