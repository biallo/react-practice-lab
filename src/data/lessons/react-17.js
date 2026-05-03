export const lesson = {
  "id": "react-17",
  "version": "17",
  "date": "2020-10-20",
  "era": "渐进升级",
  "title": "没有新特性的升级桥梁",
  "summary": "React 17 刻意不添加新的面向开发者特性，重点是让应用可以更安全地逐步升级 React。",
  "whyItMatters": "React 17 的价值是降低大应用升级成本。它没有主打新组件 API，而是调整事件委托位置、支持新 JSX Transform、移除事件池，让不同 React 版本在同一页面分块共存更可行。对大型代码库来说，这类“升级基础设施”常常比新语法更重要。",
  "features": [
    {
      "name": "渐进升级",
      "api": "multiple React versions",
      "note": "React 17 支持在一个页面中更安全地嵌入不同 React 版本的子树。团队可以先升级某个页面或某个区域，而不是一次性迁移整个应用。"
    },
    {
      "name": "事件委托调整",
      "api": "rootNode.addEventListener",
      "note": "React 17 把事件监听从 document 移到根容器。这样不同 React 根之间的事件系统更独立，外层旧版本和内层新版本不容易互相干扰。"
    },
    {
      "name": "新 JSX Transform",
      "api": "react/jsx-runtime",
      "note": "新的 JSX 编译方式会自动引入 jsx/jsxs runtime，文件中不再必须因为 JSX 而 import React。注意这依赖构建工具配置，不是浏览器直接理解 JSX。"
    },
    {
      "name": "事件池移除",
      "api": "SyntheticEvent",
      "note": "旧版本 SyntheticEvent 会被复用，异步读取事件属性常需要 event.persist()。React 17 移除事件池后，事件对象使用方式更接近普通 JavaScript 对象。"
    }
  ],
  "deepDive": [
    {
      "title": "1. “没有新特性”也是产品决策",
      "body": "框架升级不仅要提供新能力，还要让已有应用能安全到达新版本。React 17 把重点放在升级路径上，为 React 18 的并发能力入口做准备。"
    },
    {
      "title": "2. 事件委托位置影响多版本共存",
      "body": "如果所有 React 根都把事件挂到 document，多版本混用时事件系统容易互相影响。挂到 root 容器后，每个根更像一个独立岛屿。"
    },
    {
      "title": "3. JSX Transform 改的是编译输出",
      "body": "新 JSX Transform 不代表 React 消失了，也不代表 JSX 变成浏览器原生语法。它只是让编译器改为从 react/jsx-runtime 生成 element。"
    }
  ],
  "code": "// 新 JSX Transform 下，组件文件可以不因为 JSX 而显式 import React。\nfunction Greeting({ name }) {\n  return <h1>Hello {name}</h1>;\n}\n\nfunction SearchBox() {\n  function handleChange(event) {\n    setTimeout(() => {\n      // React 17 后不需要 event.persist() 也能读取事件属性。\n      console.log(event.target.value);\n    }, 100);\n  }\n\n  return <input onChange={handleChange} />;\n}",
  "checklist": [
    "React 17 的主要目标是渐进升级，而不是新增业务 API。",
    "事件委托从 document 移到 root container 的意义清晰。",
    "新 JSX Transform 属于编译层变化，不是浏览器原生支持 JSX。",
    "SyntheticEvent 移除事件池后，异步读取事件属性更自然。"
  ],
  "sources": [
    "React v17.0 release blog"
  ]
};
