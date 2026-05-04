export const lesson = {
  "id": "react-192",
  "version": "19.2",
  "date": "2025-10-01",
  "era": "最新文档线",
  "title": "Activity、useEffectEvent 与局部预渲染",
  "summary": "React 19.2 是当前 react.dev 文档线的重要补点，新增 Activity、useEffectEvent、cacheSignal、性能轨道和局部预渲染能力。",
  "whyItMatters": "React 19.2 继续处理大型应用的细节问题：页面隐藏但状态保留、Effect 中混杂响应式和非响应式逻辑、服务端缓存取消、性能调试可视化、静态外壳和动态内容分离。这些能力不一定每天都用，但它们说明 React 正在把复杂应用和框架层面的模式沉淀成明确 API。",
  "features": [
    {
      "name": "Activity",
      "api": "<Activity mode=\"visible | hidden\">",
      "note": "Activity 可以隐藏子树但保留其状态。hidden 模式下，子树的可见 UI 被隐藏，Effect 会按规则暂停/清理，更新优先级也会降低。适合 tab、预渲染路由、可恢复面板等场景。"
    },
    {
      "name": "useEffectEvent",
      "api": "const handler = useEffectEvent(fn)",
      "note": "Effect Event 用来表达 effect 内部的非响应式逻辑。它可以读取最新 props/state，但不会迫使 effect 因这些值变化而重新执行。适合连接订阅时需要最新主题、日志或回调的场景。"
    },
    {
      "name": "cacheSignal",
      "api": "cacheSignal()",
      "note": "Server Components 中的缓存结果不再被使用时，可以通过 AbortSignal 通知异步工作取消或清理。它服务于框架和服务端数据层。"
    },
    {
      "name": "React Performance Tracks",
      "api": "DevTools Performance tracks",
      "note": "React 在性能面板中提供调度和组件相关轨道，帮助定位是 JavaScript 工作、React 渲染、提交还是浏览器布局导致卡顿。"
    },
    {
      "name": "局部预渲染",
      "api": "prerender, resume",
      "note": "服务端可以先预渲染静态 shell，再在请求时恢复动态部分。它面向框架和高级 SSR 架构，目标是把静态速度和动态能力结合起来。"
    }
  ],
  "deepDive": [
    {
      "title": "可见性和状态",
      "items": [
        {
          "title": "隐藏和卸载",
          "body": "Activity 的核心是区分“暂时不可见”和“不再存在”。隐藏可以保留状态，卸载会释放子树。路由、tab、预渲染页面需要明确选择。"
        },
        {
          "title": "Effect 暂停",
          "body": "Activity hidden 不只是 CSS 隐藏，它还影响子树 effect 和更新优先级。适合需要保留状态但降低后台成本的 UI。"
        }
      ]
    },
    {
      "title": "Effect 结构",
      "items": [
        {
          "title": "Effect 事件",
          "body": "useEffectEvent 解决的是 effect 内部非响应式逻辑读取最新值的问题。它不是普通事件处理器，也不是绕过依赖数组的万能工具。"
        },
        {
          "title": "重连边界",
          "body": "聊天室例子中 roomId 变化才应该重连，theme 变化只影响通知样式。Effect Event 让这两种变化分开表达。"
        }
      ]
    },
    {
      "title": "框架能力",
      "items": [
        {
          "title": "缓存生命周期",
          "body": "cacheSignal 让服务端缓存结果不再被使用时可以取消异步工作。它更偏框架和数据层，但能帮助理解 Server Components 的资源管理。"
        },
        {
          "title": "预渲染和恢复",
          "body": "prerender/resume 把静态 shell 和动态恢复拆开。它面向高级 SSR 架构，目标是在保持动态能力的同时提高首屏交付效率。"
        },
        {
          "title": "性能归因",
          "body": "React Performance Tracks 让调度、渲染、提交等 React 工作在性能面板中可见。优化前先定位是 React、浏览器布局、脚本还是网络导致慢。"
        }
      ]
    }
  ],
  "code": "import React, { Activity, useEffect, useEffectEvent, useState } from 'react';\nimport { cacheSignal } from 'react';\nimport { prerender, resume } from 'react-dom/static';\n\nfunction ChatRoom({ roomId, muted }) {\n  const [messages, setMessages] = useState([]);\n\n  const onMessage = useEffectEvent((message) => {\n    // useEffectEvent 读取最新 props/state，但不会让外层 effect 因 muted 改变而重连。\n    if (!muted) playSound('message');\n    setMessages((current) => [...current, message]);\n  });\n\n  useEffect(() => {\n    const connection = createConnection(roomId);\n    connection.on('message', onMessage);\n    connection.connect();\n    return () => connection.disconnect();\n  }, [roomId, onMessage]);\n\n  return messages.map((message) => <p key={message.id}>{message.text}</p>);\n}\n\nfunction Inbox({ activeRoom }) {\n  return (\n    <>\n      {/* Activity 可以隐藏但保留子树状态，适合标签页、侧栏和预加载界面。 */}\n      <Activity mode={activeRoom === 'team' ? 'visible' : 'hidden'}>\n        <ChatRoom roomId=\"team\" muted={false} />\n      </Activity>\n      <Activity mode={activeRoom === 'dm' ? 'visible' : 'hidden'}>\n        <ChatRoom roomId=\"dm\" muted />\n      </Activity>\n    </>\n  );\n}\n\nasync function loadProducts() {\n  const signal = cacheSignal();\n  // cacheSignal 把缓存生命周期和异步请求关联起来，缓存失效时可中止请求。\n  const response = await fetch('/api/products', { signal });\n  return response.json();\n}\n\nasync function buildStaticPage() {\n  // prerender 先生成可恢复的静态输出，resume 在请求或客户端阶段继续同一棵树。\n  const prerendered = await prerender(<Inbox activeRoom=\"team\" />);\n  return resume(<Inbox activeRoom=\"team\" />, prerendered);\n}\n\n// React Performance Tracks 会在性能面板中标注 React 工作，帮助定位渲染与数据等待。",
  "checklist": [
    "Activity hidden 保留子树状态，和直接卸载不同。",
    "useEffectEvent 用于 effect 内的非响应式逻辑，避免不必要的 effect 重跑。",
    "cacheSignal 面向服务端缓存生命周期和取消异步工作。",
    "React Performance Tracks 可用于区分 React 工作和浏览器工作。",
    "局部预渲染属于高级 SSR/框架能力，目标是静态外壳和动态恢复结合。"
  ],
  "sources": [
    "React 19.2 release blog",
    "React Versions page"
  ]
};
