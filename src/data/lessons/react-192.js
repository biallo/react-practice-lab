export const lesson = {
  "id": "react-192",
  "version": "19.2",
  "date": "2025-10-01",
  "era": "最新文档线",
  "title": "Activity、useEffectEvent 与局部预渲染",
  "summary": "React 19.2 是当前 react.dev 文档线的重要补点，新增 Activity、useEffectEvent、cacheSignal、性能轨道和局部预渲染能力。",
  "whyItMatters": "React 19.2 继续处理大型应用的细节问题：页面隐藏但状态保留、Effect 中混杂响应式和非响应式逻辑、服务端缓存取消、性能调试可视化、静态外壳和动态内容分离。这些能力不一定每天都用，但它们说明 React 正在把复杂应用和框架层面的模式沉淀成明确 API。",
  "features": [
    {
      "name": "Activity",
      "api": "<Activity mode=\"visible | hidden\">",
      "note": "Activity 可以隐藏子树但保留其状态。hidden 模式下，子树的可见 UI 被隐藏，Effect 会按规则暂停/清理，更新优先级也会降低。适合 tab、预渲染路由、可恢复面板等场景。"
    },
    {
      "name": "useEffectEvent",
      "api": "const handler = useEffectEvent(fn)",
      "note": "Effect Event 用来表达 effect 内部的非响应式逻辑。它可以读取最新 props/state，但不会迫使 effect 因这些值变化而重新执行。适合连接订阅时需要最新主题、日志或回调的场景。"
    },
    {
      "name": "cacheSignal",
      "api": "cacheSignal()",
      "note": "Server Components 中的缓存结果不再被使用时，可以通过 AbortSignal 通知异步工作取消或清理。它服务于框架和服务端数据层。"
    },
    {
      "name": "React Performance Tracks",
      "api": "DevTools Performance tracks",
      "note": "React 在性能面板中提供调度和组件相关轨道，帮助定位是 JavaScript 工作、React 渲染、提交还是浏览器布局导致卡顿。"
    },
    {
      "name": "局部预渲染",
      "api": "prerender, resume",
      "note": "服务端可以先预渲染静态 shell，再在请求时恢复动态部分。它面向框架和高级 SSR 架构，目标是把静态速度和动态能力结合起来。"
    }
  ],
  "deepDive": [
    {
      "title": "1. Activity 和条件渲染的区别",
      "body": "条件渲染 false 通常会卸载子树，内部 state 消失；Activity hidden 则保留子树状态，让再次显示时可以恢复。它适合“暂时不可见但不该丢失状态”的 UI。"
    },
    {
      "title": "2. useEffectEvent 解决 effect 依赖撕扯",
      "body": "有些 effect 需要在 roomId 变化时重连，但连接成功后的通知文案要读取最新 theme。把通知逻辑放进 Effect Event，可以避免 theme 变化导致重连。"
    },
    {
      "title": "3. 性能轨道帮助区分问题归因",
      "body": "用户觉得卡，原因可能是 React 渲染多、提交慢、浏览器布局重、网络慢或脚本阻塞。React Performance Tracks 让 React 工作在性能面板中更可见。"
    }
  ],
  "code": "function ProfileRoute({ isActive }) {\n  return (\n    <Activity mode={isActive ? 'visible' : 'hidden'}>\n      <ProfilePage />\n    </Activity>\n  );\n}\n\nfunction ChatRoom({ roomId, theme }) {\n  const onConnected = useEffectEvent(() => {\n    showNotification('Connected', theme);\n  });\n\n  useEffect(() => {\n    const connection = createConnection(roomId);\n    connection.on('connected', onConnected);\n    connection.connect();\n\n    return () => connection.disconnect();\n  }, [roomId]);\n}",
  "checklist": [
    "Activity hidden 保留子树状态，和直接卸载不同。",
    "useEffectEvent 用于 effect 内的非响应式逻辑，避免不必要的 effect 重跑。",
    "cacheSignal 面向服务端缓存生命周期和取消异步工作。",
    "React Performance Tracks 可用于区分 React 工作和浏览器工作。",
    "局部预渲染属于高级 SSR/框架能力，目标是静态外壳和动态恢复结合。"
  ],
  "sources": [
    "React 19.2 release blog",
    "React Versions page"
  ]
};
