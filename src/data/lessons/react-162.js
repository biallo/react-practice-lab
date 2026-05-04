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
      "title": "结构语义",
      "items": [
        {
          "title": "语义 HTML",
          "body": "不是所有地方都能随便加 div。table、dl、ul、select 等结构对直接子节点有语义要求，Fragment 能让组件拆分不破坏这些结构。"
        },
        {
          "title": "布局副作用",
          "body": "无意义包裹节点可能影响 flex/grid、CSS 选择器、间距和无障碍语义。Fragment 的价值经常体现在这些细节里。"
        }
      ]
    },
    {
      "title": "Fragment 模型",
      "items": [
        {
          "title": "虚拟分组",
          "body": "Fragment 是 React 层面的分组，不是 DOM 层面的容器。它让组件返回一个逻辑整体，但最终不会生成真实节点。"
        },
        {
          "title": "短语法和完整写法",
          "body": "<></> 适合无属性分组；需要 key 的列表场景必须使用 <React.Fragment key={...}>。"
        }
      ]
    },
    {
      "title": "列表身份",
      "items": [
        {
          "title": "key 的归属",
          "body": "列表中的 key 属于 React 识别元素身份的机制，不是 DOM 属性。带 key 的 Fragment 用完整写法，短语法不支持 key。"
        },
        {
          "title": "分组项的身份",
          "body": "当一个数据项对应多个兄弟节点时，key 应该放在包住这一组节点的 Fragment 上，而不是随便放在其中某一个子节点上。"
        }
      ]
    }
  ],
  "code": "import React from 'react';\n\nfunction DescriptionList({ rows }) {\n  return (\n    <dl>\n      {rows.map((row) => (\n        // 显式 React.Fragment 可以携带 key，适合 map 中返回多个同级节点。\n        <React.Fragment key={row.term}>\n          <dt>{row.term}</dt>\n          <dd>{row.description}</dd>\n        </React.Fragment>\n      ))}\n    </dl>\n  );\n}\n\nfunction FieldGroup() {\n  // 短语法 <>...</> 适合不需要 key 的普通分组，不会额外生成 DOM 节点。\n  return (\n    <>\n      <label htmlFor=\"email\">Email</label>\n      <input id=\"email\" />\n    </>\n  );\n}\n\nfunction LegacyPair() {\n  // Fragment 普及前，也可以返回数组；缺点是需要手动维护 key，阅读性较弱。\n  return [\n    <label key=\"label\" htmlFor=\"name\">Name</label>,\n    <input key=\"input\" id=\"name\" />,\n  ];\n}",
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
