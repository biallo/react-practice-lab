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
      "title": "1. Context 适合稳定的跨层依赖",
      "body": "Context 不是状态管理库的完整替代品。它适合 theme、locale、当前用户、权限等很多组件都需要读取的数据。频繁变化且影响大量节点的 value 需要谨慎设计，否则会造成大范围重新渲染。"
    },
    {
      "title": "2. ref 是显式暴露命令式能力",
      "body": "React 的主路径是声明式数据流，但输入框 focus、滚动定位、测量尺寸无法完全用 props 表达。ref 的价值是把这些命令式需求限制在明确的位置，而不是到处 querySelector。"
    },
    {
      "title": "3. forwardRef 是组件库质量分水岭",
      "body": "一个封装后的 Input 如果不能被父组件 focus，就很难替代原生 input。forwardRef 让组件保持封装，同时把必要的底层节点暴露给调用方。"
    }
  ],
  "code": "const ThemeContext = React.createContext('light');\n\nconst TextInput = React.forwardRef(function TextInput(props, ref) {\n  return <input ref={ref} className=\"text-input\" {...props} />;\n});\n\nclass ProfileForm extends React.Component {\n  inputRef = React.createRef();\n\n  componentDidMount() {\n    this.inputRef.current.focus();\n  }\n\n  render() {\n    return (\n      <ThemeContext.Consumer>\n        {(theme) => (\n          <section data-theme={theme}>\n            <TextInput ref={this.inputRef} placeholder=\"Name\" />\n          </section>\n        )}\n      </ThemeContext.Consumer>\n    );\n  }\n}",
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
