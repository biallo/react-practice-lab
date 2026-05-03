export const lesson = {
  id: 'react-168',
  version: '16.8',
  date: '2019-02-06',
  era: 'Hooks 稳定',
  title: 'Hooks 改变组件写法',
  summary:
    'React 16.8 让 Hooks 稳定发布。函数组件可以使用 state、副作用、Context 和自定义可复用逻辑。',
  whyItMatters:
    'Hooks 改变的不是“class 换成 function”这么简单，而是状态逻辑的组织方式。class 组件把相关逻辑拆散在生命周期里，把不相关逻辑塞进同一个生命周期；Hooks 允许按“业务关注点”组织 state、effect、订阅和清理逻辑，并通过自定义 Hook 复用这些逻辑。',
  features: [
    {
      name: 'useState',
      api: 'const [value, setValue] = useState(initial)',
      note:
        'useState 保存组件内部状态。setter 会安排一次重新渲染；如果下一个状态依赖上一个状态，使用函数式更新 setValue(prev => next)，避免闭包读到旧值。'
    },
    {
      name: 'useEffect',
      api: 'useEffect(setup, dependencies?)',
      note:
        'useEffect 用于把组件和外部系统同步，例如订阅、网络请求、定时器、手动 DOM 集成。依赖数组描述 effect 使用了哪些响应式值，清理函数用于撤销上一次同步。'
    },
    {
      name: 'useContext',
      api: 'useContext(Context)',
      note:
        '函数组件可以直接读取 Context，不必写 Consumer 嵌套。Context value 变化会让读取它的组件重新渲染。'
    },
    {
      name: 'useReducer',
      api: 'useReducer(reducer, initialState)',
      note:
        '当状态更新逻辑复杂、多个事件会产生不同 action 时，useReducer 比多个 useState 更容易维护。它把“发生了什么”和“状态如何变化”分开。'
    },
    {
      name: '自定义 Hook',
      api: 'function useSomething()',
      note:
        '自定义 Hook 复用的是状态逻辑，不是 UI。它可以组合 useState、useEffect、useContext 等 Hook，并把稳定的接口暴露给组件。'
    }
  ],
  deepDive: [
    {
      title: '1. 依赖数组不是优化开关',
      body:
        '依赖数组描述 effect 读取了哪些响应式值。漏依赖通常会制造 stale closure；乱加依赖可能导致重复订阅或无限循环。正确做法是先写出 effect 的同步目标，再让依赖反映真实读取。'
    },
    {
      title: '2. effect 不是“组件加载时执行代码”的容器',
      body:
        '许多逻辑不需要 effect：从 props 派生值可以直接计算，事件导致的请求可以放在事件处理器里。effect 适合和外部系统同步，而不是替代所有生命周期思维。'
    },
    {
      title: '3. 自定义 Hook 让逻辑按领域命名',
      body:
        'useOnlineStatus、useDocumentTitle、useDebouncedValue 这种命名能把组件从细节中解放出来。调用方关心领域状态，Hook 内部负责订阅、清理和依赖管理。'
    }
  ],
  code: `function useDocumentTitle(title) {
  React.useEffect(() => {
    const previousTitle = document.title;
    document.title = title;

    return () => {
      document.title = previousTitle;
    };
  }, [title]);
}

function Counter() {
  const [count, setCount] = React.useState(0);
  useDocumentTitle(\`Count: \${count}\`);

  return (
    <button onClick={() => setCount((value) => value + 1)}>
      Count: {count}
    </button>
  );
}`,
  practice: [
    {
      title: '把 class 计数器改成函数组件',
      body:
        '用 useState 管理 count。递增时使用函数式更新 setCount(value => value + 1)，并说明它为什么比 setCount(count + 1) 更不容易受闭包影响。'
    },
    {
      title: '抽取一个自定义 Hook',
      body:
        '把 document.title 同步逻辑抽成 useDocumentTitle(title)。组件只传入 title，不直接处理副作用细节。'
    },
    {
      title: '检查 effect 依赖',
      body:
        '列出 effect 内部读取的响应式值，并让依赖数组与这些值一致。解释漏掉 title 会发生什么。'
    }
  ],
  checklist: [
    'useState 的 setter 会安排重新渲染，依赖旧状态时使用函数式更新。',
    'useEffect 用于同步外部系统，并通过清理函数撤销上一次同步。',
    '依赖数组反映 effect 读取的响应式值，不是随意控制执行次数的开关。',
    '自定义 Hook 复用状态逻辑，不负责直接复用 UI 结构。'
  ],
  sources: ['React v16.8 release blog']
};
