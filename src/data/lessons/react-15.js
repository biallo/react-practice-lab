export const lesson = {
  "id": "react-15",
  "version": "15",
  "date": "2016-04-07",
  "era": "稳定主版本",
  "title": "DOM 输出与版本号进入稳定期",
  "summary": "React 15 从 0.x 跳到主版本号，并显著改进 DOM 创建、SVG 支持和输出结构。",
  "whyItMatters": "React 15 的核心价值在于让 React 与真实浏览器 DOM 的交互更轻、更符合平台能力。它把初始挂载从拼接 HTML 字符串转向 document.createElement，减少 data-reactid 这类内部标记，并补齐 SVG 属性支持。学习这一课能帮助你理解 React 并不是只关心组件语法，它也需要不断调整与宿主环境的连接方式。",
  "features": [
    {
      "name": "DOM 创建方式更新",
      "api": "document.createElement",
      "note": "React 15 挂载节点时更多依赖浏览器原生的 createElement，而不是生成大段 HTML 后塞进 innerHTML。这让 DOM 节点和事件映射更直接，也减少了旧实现里与 SVG、多 React 副本等场景相关的边界问题。"
    },
    {
      "name": "移除 data-reactid 输出",
      "api": "data-reactid",
      "note": "早期 React 会给许多 DOM 节点附加 data-reactid，用于内部追踪和事件映射。React 15 减少这类输出后，最终 DOM 更接近开发者写下的结构，调试和 CSS 选择器也更少受到内部实现噪声影响。"
    },
    {
      "name": "完整 SVG 属性支持",
      "api": "SVG attributes",
      "note": "React 15 扩展了 SVG 标签和属性支持。对组件库、图表、图标系统来说，这意味着更多 SVG 可以直接以 JSX 形式表达，而不是绕过 React 手动操作 DOM 或字符串。"
    },
    {
      "name": "主版本语义",
      "api": "semver major",
      "note": "从 0.14 到 15 表示 React 开始用主版本号表达稳定发布节奏。版本号不是知识点本身，但它提醒你：主版本通常意味着迁移边界、弃用清理和内部架构调整。"
    }
  ],
  "deepDive": [
    {
      "title": "宿主环境",
      "items": [
        {
          "title": "ReactDOM 的职责",
          "body": "React 的组件模型最终要落到宿主环境。Web 的宿主环境是浏览器 DOM，ReactDOM 必须处理节点创建、属性设置、事件绑定和浏览器差异。"
        },
        {
          "title": "创建节点的方式",
          "body": "innerHTML 更像一次性把字符串交给浏览器解析；createElement 则逐个创建真实节点。React 15 的变化让内部实例和 DOM 节点关系更精确。"
        }
      ]
    },
    {
      "title": "输出质量",
      "items": [
        {
          "title": "DOM 输出可观察性",
          "body": "减少内部属性后，开发者看到的 DOM 更接近组件表达的结构。调试、快照测试、CSS 选择器都更少依赖 React 内部实现细节。"
        },
        {
          "title": "SVG 组件化",
          "body": "图标、图表和可视化通常依赖 SVG。React 15 的 SVG 支持让这些 UI 能留在 JSX 和组件系统里，而不是退回字符串拼接或手动 DOM 操作。"
        }
      ]
    },
    {
      "title": "版本判断",
      "items": [
        {
          "title": "主版本意识",
          "body": "从 0.x 进入 15 说明 React 开始更明确地使用主版本表达破坏性变更、弃用清理和迁移边界。学习版本线时要关注这些迁移信号。"
        },
        {
          "title": "不要依赖内部标记",
          "body": "data-reactid 这类内部输出不是业务 API。即使曾经能在 DOM 中看到，也不应该被测试、样式或业务逻辑依赖。"
        }
      ]
    }
  ],
  "code": "import React from 'react';\nimport ReactDOM from 'react-dom';\n\nfunction ReactLogoMark({ size = 64 }) {\n  // React 15 改进了 SVG 支持，很多 SVG 属性可以像普通 JSX 属性一样声明。\n  return (\n    <svg width={size} height={size} viewBox=\"0 0 64 64\" role=\"img\">\n      <title>React mark</title>\n      <circle cx=\"32\" cy=\"32\" r=\"6\" fill=\"currentColor\" />\n      <ellipse cx=\"32\" cy=\"32\" rx=\"28\" ry=\"10\" fill=\"none\" stroke=\"currentColor\" />\n      <ellipse cx=\"32\" cy=\"32\" rx=\"28\" ry=\"10\" fill=\"none\" stroke=\"currentColor\" transform=\"rotate(60 32 32)\" />\n      <ellipse cx=\"32\" cy=\"32\" rx=\"28\" ry=\"10\" fill=\"none\" stroke=\"currentColor\" transform=\"rotate(120 32 32)\" />\n    </svg>\n  );\n}\n\nconst root = document.getElementById('root') || document.createElement('div');\n\n// ReactDOM.render 内部会通过 DOM API 创建和更新节点，例如 document.createElement。\nReactDOM.render(<ReactLogoMark />, root);\n\n// React 15 不再依赖 data-reactid 作为客户端渲染的主要标记。\n// 不要把 data-reactid 当成业务选择器，它属于旧版实现细节。\nconst shouldAvoid = '[data-reactid]';\n\n// React 15 之后版本号遵循 semver：15.1.0 是小版本，15.1.1 是补丁版本。",
  "checklist": [
    "React 15 的 DOM 输出变化可以和浏览器真实节点创建联系起来。",
    "data-reactid 属于早期内部实现标记，不是业务可依赖的 API。",
    "SVG 属性支持影响图标、图表和设计系统组件的表达能力。",
    "主版本升级通常需要关注弃用、迁移和宿主环境行为变化。"
  ],
  "sources": [
    "React v15.0 release blog"
  ]
};
