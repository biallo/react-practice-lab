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
      "title": "性能判断",
      "items": [
        {
          "title": "渲染成本",
          "body": "性能优化要先判断成本来源：组件自身渲染是否昂贵、props 是否稳定、父组件是否频繁更新。memo 只解决其中一部分问题。"
        },
        {
          "title": "优化克制",
          "body": "memo、lazy、Suspense 都不是默认模板。它们需要基于用户路径、包体体积、渲染频率和交互体验来判断是否值得使用。"
        }
      ]
    },
    {
      "title": "加载模型",
      "items": [
        {
          "title": "包体拆分",
          "body": "lazy 适合低频页面、大组件和重依赖模块。它优化的是加载时机，不会让组件本身渲染更快。"
        },
        {
          "title": "加载边界",
          "body": "Suspense 边界决定 fallback 覆盖范围。边界放得太外，用户看到大面积 loading；边界放得太碎，界面可能频繁闪动。"
        }
      ]
    },
    {
      "title": "使用限制",
      "items": [
        {
          "title": "memo 的限制",
          "body": "memo 只比较 props，不能阻止组件内部 state 或 context 变化导致的渲染，也不能优化首次渲染。"
        },
        {
          "title": "Suspense 的阶段性能力",
          "body": "16.6 中 Suspense 稳定支持的主场景是 React.lazy 代码分割，不应把后来的数据获取 Suspense 经验直接套回这个版本。"
        }
      ]
    }
  ],
  "code": "import React from 'react';\n\nconst LocaleContext = React.createContext('en');\n\nconst Price = React.memo(function Price({ amount }) {\n  // React.memo 会在 props 未变化时跳过函数组件的重复渲染。\n  return <strong>{amount.toFixed(2)} USD</strong>;\n});\n\nconst ProductDetails = React.lazy(() => import('./ProductDetails'));\n\nclass LocaleBadge extends React.Component {\n  static contextType = LocaleContext;\n\n  render() {\n    // static contextType 让 class 组件用 this.context 读取单个 Context。\n    return <span>{this.context.toUpperCase()}</span>;\n  }\n}\n\nfunction ProductPage({ product }) {\n  return (\n    <LocaleContext.Provider value=\"zh-CN\">\n      <Price amount={product.price} />\n      <LocaleBadge />\n      <React.Suspense fallback={<p>Loading details...</p>}>\n        {/* React.lazy 配合 Suspense，把组件代码分割到需要时再加载。 */}\n        <ProductDetails id={product.id} />\n      </React.Suspense>\n    </LocaleContext.Provider>\n  );\n}",
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
