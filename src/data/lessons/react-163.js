export const lesson = {
  "id": "react-163",
  "version": "16.3",
  "date": "2018-03-29",
  "era": "现代 Context 与 Ref",
  "title": "Context、createRef、forwardRef",
  "summary": "React 16.3 发布新的 Context API、createRef、forwardRef，并开始为旧生命周期迁移铺路。",
  "whyItMatters": "React 16.3 把跨层数据传递、命令式 DOM 访问、封装组件暴露底层节点这三件常见需求制度化。Context 解决“多层透传 props”的问题，createRef 让 ref 引用更稳定明确，forwardRef 让组件库可以既封装样式又保留焦点、测量等命令式能力。",
  "features": [
    {
      "name": "新 Context API",
      "api": "React.createContext",
      "note": "createContext 返回 Provider 和 Consumer。Provider 在上层提供 value，下层组件可以读取这个 value，避免把 theme、locale、auth 等全局上下文逐层传递。"
    },
    {
      "name": "对象 ref",
      "api": "React.createRef",
      "note": "createRef 创建形如 { current } 的对象。React 会在挂载后把 DOM 节点或组件实例写入 current，在卸载时清空。它比字符串 ref 更明确，也更容易被工具和类型系统理解。"
    },
    {
      "name": "转发 ref",
      "api": "React.forwardRef",
      "note": "forwardRef 让父组件传入的 ref 可以到达子组件内部的 DOM 节点。组件库中的 Button、Input、Dialog 常需要这个能力，否则封装会阻断 focus、selection、measure 等操作。"
    },
    {
      "name": "生命周期迁移",
      "api": "getDerivedStateFromProps, getSnapshotBeforeUpdate",
      "note": "React 16.3 为旧生命周期迁移提供新 API，并逐步把 componentWillMount、componentWillReceiveProps、componentWillUpdate 标记为不安全模式。"
    }
  ],
  "deepDive": [
    {
      "title": "跨层数据",
      "items": [
        {
          "title": "Context 的适用面",
          "body": "Context 适合 theme、locale、auth、feature flag 这类很多组件都要读取的环境数据。它减少 props drilling，但不等于所有状态都应该进 Context。"
        },
        {
          "title": "更新范围",
          "body": "Context value 变化会影响读取它的组件。频繁变化的数据需要谨慎拆分 Provider，避免让大量不相关组件一起重新渲染。"
        }
      ]
    },
    {
      "title": "命令式能力",
      "items": [
        {
          "title": "ref 生命周期",
          "body": "对象 ref 的 current 在挂载后指向 DOM 或实例，卸载时会被清空。访问 ref 时要考虑节点是否已经存在。"
        },
        {
          "title": "组件库封装",
          "body": "forwardRef 让 Button、Input 这类封装组件既能隐藏内部结构，又能把必要的焦点和测量能力暴露给调用方。"
        }
      ]
    },
    {
      "title": "迁移安全",
      "items": [
        {
          "title": "生命周期安全",
          "body": "旧生命周期在异步和可中断渲染下容易产生不安全副作用。16.3 的新生命周期和 UNSAFE_ 前缀是在为未来渲染模型迁移。"
        },
        {
          "title": "不要滥用派生状态",
          "body": "getDerivedStateFromProps 适合少数从 props 同步状态的场景。多数情况下，直接从 props 渲染或提升状态会更简单。"
        }
      ]
    }
  ],
  "code": "import React from 'react';\n\nconst ThemeContext = React.createContext('light');\n\nclass Toolbar extends React.Component {\n  static contextType = ThemeContext;\n\n  render() {\n    // 新 Context API 让跨层级数据读取更明确，不再依赖旧 contextTypes。\n    return <button className={this.context}>Save</button>;\n  }\n}\n\nclass SearchBox extends React.Component {\n  inputRef = React.createRef();\n\n  componentDidMount() {\n    // createRef 为 class 组件提供稳定的 DOM 或组件实例引用。\n    this.inputRef.current.focus();\n  }\n\n  render() {\n    return <input ref={this.inputRef} placeholder=\"Search\" />;\n  }\n}\n\nconst FancyInput = React.forwardRef(function FancyInput(props, ref) {\n  // forwardRef 把父组件传入的 ref 转发到内部 DOM 节点。\n  return <input ref={ref} className=\"fancy-input\" {...props} />;\n});\n\nclass ScrollingList extends React.Component {\n  listRef = React.createRef();\n\n  static getDerivedStateFromProps(nextProps, prevState) {\n    // 用 getDerivedStateFromProps 替代部分 componentWillReceiveProps 场景。\n    return nextProps.filter !== prevState.filter ? { filter: nextProps.filter } : null;\n  }\n\n  getSnapshotBeforeUpdate(prevProps) {\n    // getSnapshotBeforeUpdate 在 DOM 更新前读取快照，返回值会传给 componentDidUpdate。\n    if (prevProps.items.length < this.props.items.length) {\n      const list = this.listRef.current;\n      return list.scrollHeight - list.scrollTop;\n    }\n    return null;\n  }\n\n  componentDidUpdate(prevProps, prevState, snapshot) {\n    if (snapshot !== null) {\n      this.listRef.current.scrollTop = this.listRef.current.scrollHeight - snapshot;\n    }\n  }\n\n  render() {\n    return <ul ref={this.listRef}>{this.props.items.map((item) => <li key={item.id}>{item.name}</li>)}</ul>;\n  }\n}",
  "checklist": [
    "Context 的 Provider / Consumer 数据流清晰。",
    "createRef.current 在挂载、更新和卸载时的含义明确。",
    "forwardRef 用于让封装组件显式暴露底层 DOM 或实例。",
    "旧生命周期迁移与后续异步渲染安全性有关。"
  ],
  "sources": [
    "React v16.3 release blog"
  ]
};
