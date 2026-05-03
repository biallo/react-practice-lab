export const lesson = {
  id: 'react-15',
  version: '15',
  date: '2016-04-07',
  era: '稳定主版本',
  title: 'DOM 输出与版本号进入稳定期',
  summary:
    'React 15 从 0.x 跳到主版本号，并显著改进 DOM 创建、SVG 支持和输出结构。',
  whyItMatters:
    'React 15 的核心价值在于让 React 与真实浏览器 DOM 的交互更轻、更符合平台能力。它把初始挂载从拼接 HTML 字符串转向 document.createElement，减少 data-reactid 这类内部标记，并补齐 SVG 属性支持。学习这一课能帮助你理解 React 并不是只关心组件语法，它也需要不断调整与宿主环境的连接方式。',
  features: [
    {
      name: 'DOM 创建方式更新',
      api: 'document.createElement',
      note:
        'React 15 挂载节点时更多依赖浏览器原生的 createElement，而不是生成大段 HTML 后塞进 innerHTML。这让 DOM 节点和事件映射更直接，也减少了旧实现里与 SVG、多 React 副本等场景相关的边界问题。'
    },
    {
      name: '移除 data-reactid 输出',
      api: 'data-reactid',
      note:
        '早期 React 会给许多 DOM 节点附加 data-reactid，用于内部追踪和事件映射。React 15 减少这类输出后，最终 DOM 更接近开发者写下的结构，调试和 CSS 选择器也更少受到内部实现噪声影响。'
    },
    {
      name: '完整 SVG 属性支持',
      api: 'SVG attributes',
      note:
        'React 15 扩展了 SVG 标签和属性支持。对组件库、图表、图标系统来说，这意味着更多 SVG 可以直接以 JSX 形式表达，而不是绕过 React 手动操作 DOM 或字符串。'
    },
    {
      name: '主版本语义',
      api: 'semver major',
      note:
        '从 0.14 到 15 表示 React 开始用主版本号表达稳定发布节奏。版本号不是知识点本身，但它提醒你：主版本通常意味着迁移边界、弃用清理和内部架构调整。'
    }
  ],
  deepDive: [
    {
      title: '1. 为什么 innerHTML 到 createElement 是重要变化',
      body:
        'innerHTML 更像一次性把字符串交给浏览器解析；createElement 则逐个创建真实节点。React 选择后者后，可以更精确地建立 React 内部实例与 DOM 节点的关系，减少依赖字符串输出格式的脆弱性。'
    },
    {
      title: '2. DOM 越干净，组件越容易组合',
      body:
        '多余的内部属性不会直接破坏 UI，但会增加调试噪声，也可能影响选择器、快照测试和与非 React 代码协作。React 15 减少内部标记，是让渲染结果更接近平台语义的一步。'
    },
    {
      title: '3. SVG 支持体现的是“平台覆盖面”',
      body:
        'React 的 JSX 并不只描述 div、span、button，也可以描述 SVG。图标和图表常需要大量 SVG 属性，如果 React 支持不完整，开发者就会被迫逃离组件模型。React 15 让这些 UI 更自然地留在组件体系中。'
    }
  ],
  code: `function ReactLogoMark({ title = 'React 15 SVG support' }) {
  return (
    <svg viewBox="0 0 120 80" role="img" aria-labelledby="react15-title">
      <title id="react15-title">{title}</title>
      <ellipse cx="60" cy="40" rx="48" ry="16" fill="none" stroke="currentColor" />
      <ellipse cx="60" cy="40" rx="48" ry="16" fill="none" stroke="currentColor" transform="rotate(60 60 40)" />
      <ellipse cx="60" cy="40" rx="48" ry="16" fill="none" stroke="currentColor" transform="rotate(120 60 40)" />
      <circle cx="60" cy="40" r="6" fill="currentColor" />
    </svg>
  );
}`,
  practice: [
    {
      title: '检查一个 SVG 组件',
      body:
        '选择一个 SVG 图标，把它改写成 JSX。标出 viewBox、role、aria-labelledby、stroke、fill、transform 这些属性，并确认哪些属性命名和普通 HTML 属性不同。'
    },
    {
      title: '解释 DOM 输出变化',
      body:
        '用两句话说明 createElement 挂载和 innerHTML 字符串挂载的区别：一个是创建真实节点，一个是让浏览器解析字符串。重点说明这会如何影响调试和内部节点映射。'
    },
    {
      title: '判断平台边界',
      body:
        '说明 SVG 支持属于 React 核心概念、JSX 编译问题，还是 react-dom 对浏览器平台的支持问题。写出你的判断依据。'
    }
  ],
  checklist: [
    'React 15 的 DOM 输出变化可以和浏览器真实节点创建联系起来。',
    'data-reactid 属于早期内部实现标记，不是业务可依赖的 API。',
    'SVG 属性支持影响图标、图表和设计系统组件的表达能力。',
    '主版本升级通常需要关注弃用、迁移和宿主环境行为变化。'
  ],
  sources: ['React v15.0 release blog']
};
