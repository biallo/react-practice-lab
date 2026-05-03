export const lesson = {
  id: 'react-16',
  version: '16.0',
  date: '2017-09-26',
  era: 'Fiber 架构',
  title: 'Fiber、错误边界与 Portal',
  summary:
    'React 16 使用 Fiber 新架构重写核心，带来错误边界、Portal、更多 render 返回类型和改进的 SSR。',
  whyItMatters:
    'React 16 是现代 React 的架构转折点。Fiber 把渲染工作拆成可管理的单元，为后来的优先级调度、并发渲染、Suspense 打基础；错误边界让局部 UI 可以从渲染错误中恢复；Portal 让 React 组件关系和 DOM 物理位置分离。这些能力共同改变了大型应用的稳定性和交互组织方式。',
  features: [
    {
      name: 'Fiber 架构',
      api: 'reconciler',
      note:
        'Fiber 是 React 内部新的协调架构。它把组件树中的工作拆成 fiber 节点，使 React 有机会暂停、恢复、丢弃或重新安排渲染工作。React 16 默认没有开启后来的并发能力，但底层已经换了轨道。'
    },
    {
      name: '错误边界',
      api: 'componentDidCatch, getDerivedStateFromError',
      note:
        '错误边界捕获子树渲染、生命周期和构造过程中的错误，并渲染 fallback UI。它不能捕获事件处理器、异步回调、服务端渲染错误，也不能捕获自身内部抛出的错误。'
    },
    {
      name: 'Portal',
      api: 'ReactDOM.createPortal(children, domNode)',
      note:
        'Portal 让子组件在 React 树中仍属于当前父组件，但 DOM 节点可以渲染到另一个容器。弹窗、Toast、Tooltip 常用它避免被父级 overflow、z-index 或布局上下文限制。'
    },
    {
      name: '多返回类型',
      api: 'array, string, number',
      note:
        '组件不再必须返回单一 DOM 包裹节点，可以返回数组、字符串等类型。它降低了为了满足 JSX 结构而添加无意义 div 的概率，也为后来的 Fragment 体验铺路。'
    },
    {
      name: 'SSR 改进',
      api: 'server renderer',
      note:
        'React 16 重写服务端渲染器并改进 hydration 行为。服务端输出和客户端接管不再完全依赖旧式 checksum，这让 SSR 在性能和容错上都有改善。'
    }
  ],
  deepDive: [
    {
      title: '1. Fiber 解决的是“工作如何被组织”',
      body:
        '组件树变大后，一次同步渲染可能阻塞主线程。Fiber 的意义不是某个公开 API，而是让 React 内部可以把更新拆成工作单元。后来的 startTransition、Suspense、并发渲染都依赖这种可调度的工作模型。'
    },
    {
      title: '2. 错误边界是 UI 层的 try/catch',
      body:
        'JavaScript try/catch 捕获命令式代码块里的异常；错误边界捕获 React 渲染子树里的异常。它的价值是缩小故障范围：评论区坏了不必让整个页面白屏，局部 fallback 可以给用户继续操作的机会。'
    },
    {
      title: '3. Portal 分离 React 父子关系和 DOM 位置',
      body:
        'Portal 内的事件仍会按照 React 树向上冒泡，而不是只按 DOM 位置理解。这一点很关键：Modal 可以渲染到 body 下，但逻辑上仍属于打开它的页面组件。'
    }
  ],
  code: `class ErrorBoundary extends React.Component {
  state = { error: null };

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    reportError(error, info.componentStack);
  }

  render() {
    if (this.state.error) {
      return <p role="alert">这一块暂时无法显示。</p>;
    }

    return this.props.children;
  }
}

function Modal({ children }) {
  return ReactDOM.createPortal(
    <div className="modal">{children}</div>,
    document.getElementById('modal-root')
  );
}`,
  practice: [
    {
      title: '实现错误边界',
      body:
        '写一个 ErrorBoundary，使用 getDerivedStateFromError 渲染 fallback，并在 componentDidCatch 中记录错误信息。再写一个会在 render 中抛错的子组件验证效果。'
    },
    {
      title: '实现 Portal 弹窗',
      body:
        '在 index.html 中准备 root 和 modal-root 两个容器。让 Modal 组件通过 createPortal 渲染到 modal-root，同时保持按钮点击事件由 React 组件树处理。'
    },
    {
      title: '解释 Fiber 的位置',
      body:
        '不要把 Fiber 写成一个业务 API。用自己的话说明它是 React 内部协调架构，并指出它为哪些后续能力铺路。'
    }
  ],
  checklist: [
    'Fiber 被理解为内部协调架构，而不是业务组件 API。',
    '错误边界的捕获范围和不能捕获的场景清晰。',
    'Portal 的 DOM 位置和 React 组件关系可以分开理解。',
    '多返回类型减少了无意义包裹节点，并连接到后续 Fragment 设计。'
  ],
  sources: ['React v16.0 release blog']
};
