export const lesson = {
  "id": "react-162",
  "version": "16.2",
  "date": "2017-11-28",
  "era": "JSX 语法体验",
  "title": "Fragment 成为一等公民",
  "summary": "React 16.2 引入 React.Fragment 和 JSX 空标签语法，让组件可以返回多个兄弟元素而不制造额外 DOM。",
  "whyItMatters": "Fragment 解决的是组件结构和 DOM 语义之间的摩擦。组件经常需要返回多个相邻节点，但多包一层 div 会破坏 table、dl、ul 等语义结构，也会影响 CSS 布局。Fragment 允许你在 React 组件层面分组，而不在 DOM 层面制造额外节点。",
  "features": [
    {
      "name": "React.Fragment",
      "api": "<React.Fragment>",
      "note": "Fragment 是 React 提供的虚拟分组元素。它可以包住多个子节点，但不会出现在最终 DOM 中。需要 key 时使用完整写法。"
    },
    {
      "name": "短语法",
      "api": "<></>",
      "note": "短语法适合大多数不需要属性的场景，写起来更接近普通 JSX 包裹。但它不能接收 key 或其他属性。"
    },
    {
      "name": "带 key 的 Fragment",
      "api": "<Fragment key={id}>",
      "note": "当 map 中每一项需要返回多个兄弟节点时，使用完整 Fragment 并提供 key。key 仍然是 React 识别列表项身份的依据。"
    },
    {
      "name": "数组返回与 Fragment 的关系",
      "api": "return [elements]",
      "note": "React 16.0 已支持返回数组，但数组写 JSX 时需要逗号、字符串引号和 key，体验不自然。Fragment 是对这种能力的更好表达。"
    }
  ],
  "deepDive": [
    {
      "title": "1. Fragment 是组件边界，不是 DOM 边界",
      "body": "Fragment 让组件可以返回一个逻辑整体，但浏览器看不到这个整体。调试时如果找不到 Fragment 对应节点，这是正确结果。它存在于 React element 树中，不存在于最终 DOM 树中。"
    },
    {
      "title": "2. 语义 HTML 场景最能体现价值",
      "body": "在 dl 中一组 dt/dd、在 table 中一组 tr、在 ul 中多个 li，都不适合随便插 div。Fragment 让组件拆分不必牺牲 HTML 语义。"
    },
    {
      "title": "3. key 不是给 DOM 的，是给 React 的",
      "body": "带 key 的 Fragment 不会生成 DOM 属性。key 只帮助 React 在更新列表时识别哪一组子节点属于同一个数据项。"
    }
  ],
  "code": "function Glossary({ items }) {\n  return (\n    <dl>\n      {items.map((item) => (\n        <React.Fragment key={item.id}>\n          <dt>{item.term}</dt>\n          <dd>{item.description}</dd>\n        </React.Fragment>\n      ))}\n    </dl>\n  );\n}\n\nfunction Toolbar() {\n  return (\n    <>\n      <button>Save</button>\n      <button>Cancel</button>\n    </>\n  );\n}",
  "checklist": [
    "Fragment 不会生成真实 DOM 节点。",
    "短语法适合无属性分组，完整写法适合需要 key 的分组。",
    "列表中的 Fragment key 用于 React 识别数据项，不是 DOM 属性。",
    "Fragment 可以改善 table、dl、ul 等语义结构中的组件拆分。"
  ],
  "sources": [
    "React v16.2 release blog"
  ]
};
