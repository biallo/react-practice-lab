export const lesson = {
  "id": "react-014",
  "version": "0.14",
  "date": "2015-10-07",
  "era": "跨平台拆分",
  "title": "React 与 React DOM 分家",
  "summary": "0.14 是旧版本时代最重要的分水岭：React 核心从 DOM 渲染器中拆出来，函数组件也进入正式 API 视野。",
  "whyItMatters": "React 0.14 把“描述 UI”和“渲染到浏览器”拆成两层：react 负责组件、元素和组合模型，react-dom 负责把这棵元素树挂载、更新或卸载到浏览器 DOM。这个边界让同一套组件模型可以被不同渲染目标复用：Web 使用 react-dom，服务端使用 react-dom/server，移动端可以使用 React Native，测试也可以使用专门的 renderer。后续的 createRoot、hydrateRoot、Server Components 本质上都延续了这个分层思路。",
  "deepDive": [
    {
      "title": "基础模型",
      "items": [
        {
          "title": "包边界",
          "body": "react 负责创建元素、定义组件、处理 children 等平台无关能力；react-dom 负责浏览器容器、DOM 节点、事件系统和卸载；react-dom/server 负责把同一棵元素树输出为 HTML。"
        },
        {
          "title": "元素和节点",
          "body": "React element 是普通对象，描述将要出现的 UI；DOM node 是浏览器中的真实节点。理解这一区别后，render、hydrate、server render 的边界都会更清楚。"
        }
      ]
    },
    {
      "title": "组件表达",
      "items": [
        {
          "title": "函数组件的早期定位",
          "body": "0.14 的函数组件主要用于纯展示场景：接收 props，返回元素，没有 state、生命周期和实例。它不是 Hooks 时代函数组件的完整能力形态。"
        },
        {
          "title": "组件就是 props 到 UI 的映射",
          "body": "无状态函数组件把简单组件保持为简单函数，避免为了展示数据而引入 class 实例、this 和生命周期。"
        }
      ]
    },
    {
      "title": "实践边界",
      "items": [
        {
          "title": "命令式访问的代价",
          "body": "findDOMNode 能拿到底层 DOM，但会穿透组件封装。现代 React 更鼓励通过 ref 显式暴露需要访问的节点，避免父组件依赖子组件内部结构。"
        },
        {
          "title": "渲染器入口判断",
          "body": "当 API 需要浏览器容器、DOM 节点或 HTML 字符串时，它通常属于渲染器；当 API 只描述组件和元素时，它通常属于 React 核心。"
        }
      ]
    }
  ],
  "features": [
    {
      "name": "react / react-dom 拆包",
      "api": "react, react-dom, react-dom/server",
      "note": "react 保存组件模型：createElement、Component、Children 等；react-dom 保存 Web 平台渲染能力：render、unmountComponentAtNode、findDOMNode；react-dom/server 保存服务端字符串渲染能力。"
    },
    {
      "name": "ReactDOM.render",
      "api": "ReactDOM.render(element, container)",
      "note": "把 React element 树挂载到浏览器 DOM 容器里。它是 React 18 之前的 Web 入口；React 18 后被 createRoot(...).render(...) 取代，但理解它有助于理解“渲染器入口”这个概念。"
    },
    {
      "name": "无状态函数组件",
      "api": "function Component(props) { return element; }",
      "note": "适合纯展示逻辑：输入是 props，输出是 React element。0.14 时代它没有 state 和生命周期；现代函数组件通过 Hooks 才能拥有状态与副作用。"
    },
    {
      "name": "ReactDOM.findDOMNode",
      "api": "ReactDOM.findDOMNode(componentOrElement)",
      "note": "用于从组件实例找到底层 DOM 节点。它属于遗留逃生口，会打破组件封装；现代代码更推荐把 ref 显式传到需要访问的 DOM 节点上。"
    },
    {
      "name": "react-dom/server",
      "api": "ReactDOMServer.renderToString",
      "note": "把 React element 树渲染为 HTML 字符串。这个包名也体现了同一套组件树可以被不同目标消费：浏览器 DOM、服务端 HTML、测试 renderer 等。"
    }
  ],
  "code": "import React from 'react';\nimport ReactDOM from 'react-dom';\nimport ReactDOMServer from 'react-dom/server';\n\nfunction ProductCard({ product }) {\n  // React 0.14 之后，组件只要接收 props 并返回元素，就可以写成函数组件。\n  return (\n    <article className=\"product-card\">\n      <h2>{product.name}</h2>\n      <p>{product.price}</p>\n    </article>\n  );\n}\n\nconst element = <ProductCard product={{ name: 'React Guide', price: '$19' }} />;\n\n// react-dom 负责浏览器渲染：把 React element 挂载到真实 DOM 容器。\nReactDOM.render(element, document.getElementById('root'));\n\nclass LegacyFocusBox extends React.Component {\n  componentDidMount() {\n    // findDOMNode 是 React 0.14 暴露在 react-dom 中的旧式逃生口。\n    // 现代代码应优先使用 ref，这里只用于理解历史 API。\n    const node = ReactDOM.findDOMNode(this);\n    node.querySelector('input').focus();\n  }\n\n  render() {\n    return <label>Search <input /></label>;\n  }\n}\n\n// react-dom/server 负责服务端渲染：把同一个 element 输出为 HTML 字符串。\nconst html = ReactDOMServer.renderToString(element);",
  "checklist": [
    "react、react-dom、react-dom/server 三者的职责边界清晰。",
    "ReactDOM.render 属于浏览器 DOM 渲染器，而不是 React 核心包。",
    "React element 是 UI 描述对象，真实 DOM 节点是浏览器中的渲染结果。",
    "纯展示 class 组件可以改写为无状态函数组件，前提是它只依赖 props 返回 UI。",
    "findDOMNode 属于遗留逃生口，现代代码优先通过显式 ref 暴露 DOM 节点。"
  ],
  "sources": [
    "React v0.14 release blog"
  ]
};
