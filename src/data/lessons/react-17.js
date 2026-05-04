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
      "title": "升级策略",
      "items": [
        {
          "title": "渐进迁移",
          "body": "大项目通常无法一次升级所有页面。React 17 让局部 React 树升级更现实，可以先迁移低风险区域，再逐步扩大范围。"
        },
        {
          "title": "兼容性思维",
          "body": "React 17 的课程重点是识别升级风险：事件传播、第三方库、测试工具、老 JSX 配置、异步读取事件对象等。"
        }
      ]
    },
    {
      "title": "事件系统",
      "items": [
        {
          "title": "事件委托边界",
          "body": "事件从 document 委托改到 root container 后，不同 React 根的事件处理更隔离。这对微前端、多版本嵌套和渐进升级很关键。"
        },
        {
          "title": "事件池移除",
          "body": "SyntheticEvent 不再复用后，异步读取事件属性更自然，旧代码里为了异步读取而调用 event.persist() 的需求消失。"
        }
      ]
    },
    {
      "title": "编译变化",
      "items": [
        {
          "title": "JSX Transform",
          "body": "新 JSX Transform 是编译输出变化，不是浏览器原生支持 JSX。构建工具会引入 react/jsx-runtime，开发者不必为 JSX 手动 import React。"
        },
        {
          "title": "React 仍然存在",
          "body": "不用手动 import React 不代表 React runtime 不参与渲染。JSX 仍然会被编译成对 React runtime 的调用。"
        }
      ]
    }
  ],
  "code": "import { jsx as _jsx } from 'react/jsx-runtime';\nimport React from 'react';\nimport ReactDOM from 'react-dom';\n\nfunction Button() {\n  return <button onClick={(event) => console.log(event.target.textContent)}>Save</button>;\n}\n\n// 新 JSX Transform 会把 JSX 编译为 jsx-runtime 调用，因此文件里不再必须为了 JSX 引入 React。\nconst compiled = _jsx('button', { children: 'Save' });\n\nconst rootNode = document.getElementById('root');\nReactDOM.render(<Button />, rootNode);\n\n// React 17 把事件委托从 document 调整到 root 容器，便于多版本 React 渐进升级共存。\nrootNode.addEventListener('click', () => {\n  console.log('Native listener on the same root container');\n});\n\nfunction InputLogger() {\n  return (\n    <input\n      onChange={(event) => {\n        // SyntheticEvent 不再做事件池复用，异步读取 event.target 也不会失效。\n        setTimeout(() => console.log(event.target.value), 100);\n        // event.persist() 在 React 17 中保留兼容，但通常已经不需要。\n      }}\n    />\n  );\n}",
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
