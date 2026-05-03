export const lesson = {
  id: 'react-18',
  version: '18',
  date: '2022-03-29',
  era: '并发能力',
  title: '并发渲染、自动批处理与新 Root API',
  summary:
    'React 18 引入并发渲染基础、自动批处理、Transition、新的 root API，以及支持 Suspense 的流式 SSR。',
  whyItMatters:
    'React 18 把 Fiber 的可调度能力暴露到应用入口和交互模型中。createRoot 启用新渲染器入口，自动批处理减少不必要渲染，Transition 让输入等紧急更新优先响应，流式 SSR 让服务端可以先发送可用外壳再逐步补齐内容。它是现代 React 框架能力的核心底座。',
  features: [
    {
      name: '新 Root API',
      api: 'createRoot, hydrateRoot',
      note:
        'createRoot(container).render(<App />) 替代 ReactDOM.render，用于客户端挂载；hydrateRoot 用于接管服务端生成的 HTML。新入口是启用 React 18 行为的关键。'
    },
    {
      name: '自动批处理',
      api: 'automatic batching',
      note:
        'React 18 会把更多场景中的多次 state 更新合并成一次渲染，包括 Promise、setTimeout、原生事件回调等。它减少重复渲染，但也要求你理解 state 更新不是立刻同步反映到当前闭包。'
    },
    {
      name: 'Transition',
      api: 'startTransition, useTransition',
      note:
        'Transition 标记非紧急更新，例如搜索结果列表、路由内容切换。输入框 value 这类必须立即响应的更新不应放进 Transition。'
    },
    {
      name: 'useDeferredValue',
      api: 'useDeferredValue(value)',
      note:
        '当某个派生 UI 更新很重时，可以使用 deferred value 让它滞后于紧急输入更新。它适合“展示可以慢一点，但输入不能卡”的场景。'
    },
    {
      name: '流式 SSR',
      api: 'renderToPipeableStream, renderToReadableStream',
      note:
        '服务端可以配合 Suspense 边界分块输出 HTML，不必等所有数据都准备好才发送完整页面。Node 环境常用 renderToPipeableStream，Web Streams 环境使用 renderToReadableStream。'
    },
    {
      name: '库作者 Hook',
      api: 'useId, useSyncExternalStore, useInsertionEffect',
      note:
        'useId 解决 SSR/客户端一致 ID；useSyncExternalStore 给外部 store 提供并发安全订阅；useInsertionEffect 让 CSS-in-JS 在布局读取前插入样式。'
    }
  ],
  deepDive: [
    {
      title: '1. 并发渲染不等于多线程',
      body:
        'React 仍在 JavaScript 主线程上运行。并发的意思是 React 可以准备多个 UI 版本、暂停低优先级工作、优先处理紧急更新，并在合适时机提交结果。'
    },
    {
      title: '2. Transition 是交互优先级工具',
      body:
        '搜索框输入和搜索结果过滤常同时发生。输入 value 必须立即更新；结果列表可以晚一点。startTransition 让 React 在两者竞争时优先保证输入响应。'
    },
    {
      title: '3. SSR 从“生成完整 HTML”走向“分块交付”',
      body:
        '传统 SSR 容易被慢数据阻塞。React 18 的流式 SSR 可以先把框架和已准备好的内容发给浏览器，再通过 Suspense 边界填充慢内容。'
    }
  ],
  code: `import { createRoot } from 'react-dom/client';
import { startTransition, useState } from 'react';

createRoot(document.getElementById('root')).render(<App />);

function SearchPage({ allItems }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState(allItems);

  function handleChange(event) {
    const nextQuery = event.target.value;
    setQuery(nextQuery);

    startTransition(() => {
      setResults(filterItems(allItems, nextQuery));
    });
  }

  return (
    <>
      <input value={query} onChange={handleChange} />
      <ResultList items={results} />
    </>
  );
}`,
  practice: [
    {
      title: '迁移入口',
      body:
        '把 ReactDOM.render(<App />, root) 改成 createRoot(root).render(<App />)。如果是 SSR 接管，说明应该使用 hydrateRoot。'
    },
    {
      title: '观察自动批处理',
      body:
        '在 setTimeout 或 Promise.then 中连续调用两次 setState，观察 React 18 下通常只触发一次渲染。写出这和旧行为的差异。'
    },
    {
      title: '拆分紧急与非紧急更新',
      body:
        '实现搜索输入：input value 直接 setQuery，昂贵的列表过滤放进 startTransition。说明为什么不能把 setQuery 放进 Transition。'
    }
  ],
  checklist: [
    'createRoot 和 hydrateRoot 的使用场景区分清楚。',
    '自动批处理减少重复渲染，但 state 更新仍不是当前闭包内的同步赋值。',
    'Transition 用于非紧急 UI 更新，不能包裹必须即时响应的输入状态。',
    '流式 SSR 与 Suspense 边界一起改善慢数据下的页面交付。'
  ],
  sources: ['React v18.0 release blog']
};
