export const lesson = {
  "id": "react-168",
  "version": "16.8",
  "date": "2019-02-06",
  "era": "Hooks 稳定",
  "title": "Hooks 改变组件写法",
  "summary": "React 16.8 让 Hooks 稳定发布。函数组件可以使用 state、副作用、Context 和自定义可复用逻辑。",
  "whyItMatters": "Hooks 改变的不是“class 换成 function”这么简单，而是状态逻辑的组织方式。class 组件把相关逻辑拆散在生命周期里，把不相关逻辑塞进同一个生命周期；Hooks 允许按“业务关注点”组织 state、effect、订阅和清理逻辑，并通过自定义 Hook 复用这些逻辑。",
  "features": [
    {
      "name": "useState",
      "api": "const [value, setValue] = useState(initial)",
      "note": "useState 保存组件内部状态。setter 会安排一次重新渲染；如果下一个状态依赖上一个状态，使用函数式更新 setValue(prev => next)，避免闭包读到旧值。"
    },
    {
      "name": "useEffect",
      "api": "useEffect(setup, dependencies?)",
      "note": "useEffect 用于把组件和外部系统同步，例如订阅、网络请求、定时器、手动 DOM 集成。依赖数组描述 effect 使用了哪些响应式值，清理函数用于撤销上一次同步。"
    },
    {
      "name": "useContext",
      "api": "useContext(Context)",
      "note": "函数组件可以直接读取 Context，不必写 Consumer 嵌套。Context value 变化会让读取它的组件重新渲染。"
    },
    {
      "name": "useReducer",
      "api": "useReducer(reducer, initialState)",
      "note": "当状态更新逻辑复杂、多个事件会产生不同 action 时，useReducer 比多个 useState 更容易维护。它把“发生了什么”和“状态如何变化”分开。"
    },
    {
      "name": "自定义 Hook",
      "api": "function useSomething()",
      "note": "自定义 Hook 复用的是状态逻辑，不是 UI。它可以组合 useState、useEffect、useContext 等 Hook，并把稳定的接口暴露给组件。"
    }
  ],
  "deepDive": [
    {
      "title": "响应式模型",
      "items": [
        {
          "title": "响应式值",
          "body": "组件内的 props、state 和直接声明的变量都会随渲染变化。effect、memo、callback 读取这些值时，依赖关系必须反映真实读取。"
        },
        {
          "title": "状态更新模型",
          "body": "setter 安排下一次渲染，不会修改当前闭包里的值。依赖旧状态时使用函数式更新，可以避免连续更新和异步回调中的旧值问题。"
        }
      ]
    },
    {
      "title": "副作用边界",
      "items": [
        {
          "title": "Effect 的职责",
          "body": "useEffect 用于同步外部系统，不是所有计算都要放进去。能在渲染期间直接计算的值，不应该绕到 effect 里再 setState。"
        },
        {
          "title": "依赖数组",
          "body": "依赖数组描述 effect 读取了哪些响应式值。漏依赖会制造旧闭包，乱加依赖可能导致重复订阅或循环更新。"
        }
      ]
    },
    {
      "title": "逻辑复用",
      "items": [
        {
          "title": "自定义 Hook 抽象",
          "body": "自定义 Hook 应该命名业务意图，比如 useOnlineStatus 或 useDebouncedValue。它隐藏订阅、清理和状态组合细节，而不是简单搬运代码。"
        },
        {
          "title": "复用状态逻辑",
          "body": "自定义 Hook 复用的是状态和副作用逻辑，不是 DOM 结构。UI 复用仍然应该通过组件完成。"
        }
      ]
    }
  ],
  "code": "import React, { useContext, useEffect, useReducer, useState } from 'react';\n\nconst AuthContext = React.createContext(null);\n\nfunction cartReducer(state, action) {\n  // useReducer 适合把多分支状态变化集中到一个纯函数里。\n  switch (action.type) {\n    case 'add':\n      return [...state, action.item];\n    case 'remove':\n      return state.filter((item) => item.id !== action.id);\n    default:\n      return state;\n  }\n}\n\nfunction useDocumentTitle(title) {\n  // 自定义 Hook 通过组合内置 Hook 复用状态逻辑，而不是复用 UI。\n  useEffect(() => {\n    document.title = title;\n  }, [title]);\n}\n\nfunction CartButton({ product }) {\n  const user = useContext(AuthContext);\n  const [items, dispatch] = useReducer(cartReducer, []);\n  const [isOpen, setIsOpen] = useState(false);\n\n  useDocumentTitle(items.length + ' items');\n\n  return (\n    <button\n      disabled={!user}\n      onClick={() => {\n        // useState 管理局部 UI 状态，useReducer 管理结构化业务变化。\n        setIsOpen(true);\n        dispatch({ type: 'add', item: product });\n      }}\n    >\n      {isOpen ? 'Added' : 'Add to cart'}\n    </button>\n  );\n}",
  "checklist": [
    "useState 的 setter 会安排重新渲染，依赖旧状态时使用函数式更新。",
    "useEffect 用于同步外部系统，并通过清理函数撤销上一次同步。",
    "依赖数组反映 effect 读取的响应式值，不是随意控制执行次数的开关。",
    "自定义 Hook 复用状态逻辑，不负责直接复用 UI 结构。"
  ],
  "sources": [
    "React v16.8 release blog"
  ]
};
