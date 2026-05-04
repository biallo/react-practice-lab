export const lesson = {
  "id": "react-18",
  "version": "18",
  "date": "2022-03-29",
  "era": "并发能力",
  "title": "并发渲染、自动批处理与新 Root API",
  "summary": "React 18 引入并发渲染基础、自动批处理、Transition、新的 root API，以及支持 Suspense 的流式 SSR。",
  "whyItMatters": "React 18 把 Fiber 的可调度能力暴露到应用入口和交互模型中。createRoot 启用新渲染器入口，自动批处理减少不必要渲染，Transition 让输入等紧急更新优先响应，流式 SSR 让服务端可以先发送可用外壳再逐步补齐内容。它是现代 React 框架能力的核心底座。",
  "features": [
    {
      "name": "新 Root API",
      "api": "createRoot, hydrateRoot",
      "note": "createRoot(container).render(<App />) 替代 ReactDOM.render，用于客户端挂载；hydrateRoot 用于接管服务端生成的 HTML。新入口是启用 React 18 行为的关键。"
    },
    {
      "name": "自动批处理",
      "api": "automatic batching",
      "note": "React 18 会把更多场景中的多次 state 更新合并成一次渲染，包括 Promise、setTimeout、原生事件回调等。它减少重复渲染，但也要求你理解 state 更新不是立刻同步反映到当前闭包。"
    },
    {
      "name": "Transition",
      "api": "startTransition, useTransition",
      "note": "Transition 标记非紧急更新，例如搜索结果列表、路由内容切换。输入框 value 这类必须立即响应的更新不应放进 Transition。"
    },
    {
      "name": "useDeferredValue",
      "api": "useDeferredValue(value)",
      "note": "当某个派生 UI 更新很重时，可以使用 deferred value 让它滞后于紧急输入更新。它适合“展示可以慢一点，但输入不能卡”的场景。"
    },
    {
      "name": "流式 SSR",
      "api": "renderToPipeableStream, renderToReadableStream",
      "note": "服务端可以配合 Suspense 边界分块输出 HTML，不必等所有数据都准备好才发送完整页面。Node 环境常用 renderToPipeableStream，Web Streams 环境使用 renderToReadableStream。"
    },
    {
      "name": "库作者 Hook",
      "api": "useId, useSyncExternalStore, useInsertionEffect",
      "note": "useId 解决 SSR/客户端一致 ID；useSyncExternalStore 给外部 store 提供并发安全订阅；useInsertionEffect 让 CSS-in-JS 在布局读取前插入样式。"
    }
  ],
  "deepDive": [
    {
      "title": "并发模型",
      "items": [
        {
          "title": "并发不是并行",
          "body": "React 并发渲染仍运行在 JavaScript 主线程。它的核心是工作可以被准备、暂停、丢弃和重试，而不是开多个线程同时改 DOM。"
        },
        {
          "title": "提交阶段",
          "body": "React 可以并发准备渲染结果，但真正提交到 DOM 的阶段仍然需要保持一致性。理解 render 阶段和 commit 阶段，有助于判断副作用放在哪里。"
        }
      ]
    },
    {
      "title": "交互优先级",
      "items": [
        {
          "title": "优先级建模",
          "body": "输入、点击反馈等属于紧急更新；搜索结果、路由内容、图表过滤等可以是非紧急更新。startTransition 是把这种业务优先级告诉 React。"
        },
        {
          "title": "自动批处理",
          "body": "React 18 会在更多异步场景合并多次状态更新，减少重复渲染。它提升效率，但不改变当前闭包里 state 的值。"
        }
      ]
    },
    {
      "title": "服务端和外部状态",
      "items": [
        {
          "title": "SSR 与 Suspense",
          "body": "流式 SSR 的价值来自 Suspense 边界：服务端可以先发已准备好的 shell，慢数据对应的边界稍后补齐。框架能力大多建立在这个模型上。"
        },
        {
          "title": "外部 store 安全",
          "body": "并发渲染下外部 store 需要避免 tearing。useSyncExternalStore 给状态库提供一致订阅协议，是库作者必须理解的 API。"
        }
      ]
    }
  ],
  "code": "import React, {\n  startTransition,\n  useDeferredValue,\n  useId,\n  useInsertionEffect,\n  useState,\n  useSyncExternalStore,\n  useTransition,\n} from 'react';\nimport { createRoot, hydrateRoot } from 'react-dom/client';\nimport { renderToPipeableStream, renderToReadableStream } from 'react-dom/server';\n\nfunction SearchPage({ initialResults }) {\n  const [query, setQuery] = useState('');\n  const [results, setResults] = useState(initialResults);\n  const [isPending, startUiTransition] = useTransition();\n  const deferredQuery = useDeferredValue(query);\n  const inputId = useId();\n\n  const online = useSyncExternalStore(\n    (notify) => {\n      window.addEventListener('online', notify);\n      window.addEventListener('offline', notify);\n      return () => {\n        window.removeEventListener('online', notify);\n        window.removeEventListener('offline', notify);\n      };\n    },\n    () => navigator.onLine\n  );\n\n  useInsertionEffect(() => {\n    // CSS-in-JS 库可在布局读取前插入样式，普通业务副作用仍应使用 useEffect。\n    document.documentElement.dataset.react18Styles = 'ready';\n  }, []);\n\n  function handleChange(event) {\n    const nextQuery = event.target.value;\n    setQuery(nextQuery);\n\n    // startTransition 标记低优先级更新，输入框响应不会被大列表渲染阻塞。\n    startTransition(() => {\n      setResults(filterProducts(nextQuery));\n    });\n\n    // useTransition 提供 isPending，便于展示低优先级更新的等待状态。\n    startUiTransition(() => {\n      logSearchIntent(nextQuery);\n    });\n  }\n\n  return (\n    <section>\n      <label htmlFor={inputId}>Search</label>\n      <input id={inputId} value={query} onChange={handleChange} />\n      {!online && <p>Offline</p>}\n      {isPending && <p>Updating...</p>}\n      <ProductList query={deferredQuery} items={results} />\n    </section>\n  );\n}\n\n// createRoot 启用 React 18 的并发渲染入口和自动批处理。\ncreateRoot(document.getElementById('root')).render(<SearchPage initialResults={[]} />);\n\n// hydrateRoot 用于接管服务端输出的 HTML。\nhydrateRoot(document.getElementById('ssr-root'), <SearchPage initialResults={window.__RESULTS__} />);\n\n// Node.js 服务端可用 renderToPipeableStream 做流式 SSR。\nconst nodeStream = renderToPipeableStream(<SearchPage initialResults={[]} />, {\n  onShellReady() {\n    // response 可以尽早写出 shell，Suspense 内容随后补齐。\n  },\n});\n\n// Web Streams 环境可用 renderToReadableStream。\nconst webStreamPromise = renderToReadableStream(<SearchPage initialResults={[]} />);",
  "checklist": [
    "createRoot 和 hydrateRoot 的使用场景区分清楚。",
    "自动批处理减少重复渲染，但 state 更新仍不是当前闭包内的同步赋值。",
    "Transition 用于非紧急 UI 更新，不能包裹必须即时响应的输入状态。",
    "流式 SSR 与 Suspense 边界一起改善慢数据下的页面交付。"
  ],
  "sources": [
    "React v18.0 release blog"
  ]
};
