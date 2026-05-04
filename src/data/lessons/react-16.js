export const lesson = {
  "id": "react-16",
  "version": "16.0",
  "date": "2017-09-26",
  "era": "Fiber 架构",
  "title": "Fiber、错误边界与 Portal",
  "summary": "React 16 使用 Fiber 新架构重写核心，带来错误边界、Portal、更多 render 返回类型和改进的 SSR。",
  "whyItMatters": "React 16 是现代 React 的架构转折点。Fiber 把渲染工作拆成可管理的单元，为后来的优先级调度、并发渲染、Suspense 打基础；错误边界让局部 UI 可以从渲染错误中恢复；Portal 让 React 组件关系和 DOM 物理位置分离。这些能力共同改变了大型应用的稳定性和交互组织方式。",
  "features": [
    {
      "name": "Fiber 架构",
      "api": "reconciler",
      "note": "Fiber 是 React 内部新的协调架构。它把组件树中的工作拆成 fiber 节点，使 React 有机会暂停、恢复、丢弃或重新安排渲染工作。React 16 默认没有开启后来的并发能力，但底层已经换了轨道。"
    },
    {
      "name": "错误边界",
      "api": "componentDidCatch, getDerivedStateFromError",
      "note": "错误边界捕获子树渲染、生命周期和构造过程中的错误，并渲染 fallback UI。它不能捕获事件处理器、异步回调、服务端渲染错误，也不能捕获自身内部抛出的错误。"
    },
    {
      "name": "Portal",
      "api": "ReactDOM.createPortal(children, domNode)",
      "note": "Portal 让子组件在 React 树中仍属于当前父组件，但 DOM 节点可以渲染到另一个容器。弹窗、Toast、Tooltip 常用它避免被父级 overflow、z-index 或布局上下文限制。"
    },
    {
      "name": "多返回类型",
      "api": "array, string, number",
      "note": "组件不再必须返回单一 DOM 包裹节点，可以返回数组、字符串等类型。它降低了为了满足 JSX 结构而添加无意义 div 的概率，也为后来的 Fragment 体验铺路。"
    },
    {
      "name": "SSR 改进",
      "api": "server renderer",
      "note": "React 16 重写服务端渲染器并改进 hydration 行为。服务端输出和客户端接管不再完全依赖旧式 checksum，这让 SSR 在性能和容错上都有改善。"
    }
  ],
  "deepDive": [
    {
      "title": "架构模型",
      "items": [
        {
          "title": "协调器思维",
          "body": "React 的核心工作不是直接改 DOM，而是协调旧树和新树之间的差异。Fiber 改变了这项工作被拆分、保存和调度的方式。"
        },
        {
          "title": "Fiber 的位置",
          "body": "Fiber 是内部协调架构，不是业务 API。它让 React 有机会暂停、恢复、丢弃或重新安排渲染工作，为后续并发能力铺路。"
        }
      ]
    },
    {
      "title": "稳定性",
      "items": [
        {
          "title": "故障隔离",
          "body": "错误边界让错误控制在某个 UI 子树内。它适合保护评论区、图表、第三方组件等容易失败但不应拖垮整个页面的区域。"
        },
        {
          "title": "错误边界的范围",
          "body": "错误边界捕获渲染、生命周期和构造阶段的子树错误，不负责捕获事件处理器、异步回调或自身内部错误。"
        }
      ]
    },
    {
      "title": "结构表达",
      "items": [
        {
          "title": "视觉层和逻辑层分离",
          "body": "Portal 让弹窗视觉上出现在 body 或 overlay root 下，但逻辑上仍属于打开它的 React 父组件。事件和上下文仍按 React 树工作。"
        },
        {
          "title": "返回值模型扩展",
          "body": "组件返回数组、字符串等类型，说明 React 组件不再被单一 DOM 包裹节点限制。这为 Fragment 和更少冗余 DOM 的组件结构铺路。"
        }
      ]
    }
  ],
  "code": "import React from 'react';\nimport ReactDOM from 'react-dom';\nimport { renderToString } from 'react-dom/server';\n\nclass ErrorBoundary extends React.Component {\n  state = { hasError: false };\n\n  static getDerivedStateFromError(error) {\n    // 捕获子树渲染阶段的错误，并切换到降级 UI。\n    return { hasError: true };\n  }\n\n  componentDidCatch(error, info) {\n    // componentDidCatch 适合记录错误与组件栈，避免整个应用白屏。\n    reportError(error, info.componentStack);\n  }\n\n  render() {\n    return this.state.hasError ? <p>Something went wrong.</p> : this.props.children;\n  }\n}\n\nfunction Toolbar() {\n  // React 16 支持返回数组，列表项需要稳定的 key。\n  return [\n    <button key=\"save\">Save</button>,\n    <button key=\"preview\">Preview</button>,\n  ];\n}\n\nfunction StatusText({ ready }) {\n  // React 16 还支持直接返回字符串或 null，让小组件更轻。\n  return ready ? 'Ready' : null;\n}\n\nfunction Modal({ children }) {\n  // Portal 把 React 子树渲染到当前 DOM 层级之外，常用于弹窗和浮层。\n  return ReactDOM.createPortal(children, document.getElementById('modal-root'));\n}\n\nconst app = (\n  <ErrorBoundary>\n    <Toolbar />\n    <StatusText ready />\n    <Modal>Saved</Modal>\n  </ErrorBoundary>\n);\n\n// Fiber 是 React 16 的新协调器；使用方式不变，但调度、错误恢复和增量渲染能力来自这里。\nReactDOM.render(app, document.getElementById('root'));\n\n// React 16 的服务端渲染器可以输出更干净的 HTML，并配合客户端 hydrate。\nconst html = renderToString(app);",
  "checklist": [
    "Fiber 被理解为内部协调架构，而不是业务组件 API。",
    "错误边界的捕获范围和不能捕获的场景清晰。",
    "Portal 的 DOM 位置和 React 组件关系可以分开理解。",
    "多返回类型减少了无意义包裹节点，并连接到后续 Fragment 设计。"
  ],
  "sources": [
    "React v16.0 release blog"
  ]
};
