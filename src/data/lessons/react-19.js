export const lesson = {
  "id": "react-19",
  "version": "19",
  "date": "2024-12-05",
  "era": "Actions 与表单",
  "title": "Actions、乐观更新与新的资源能力",
  "summary": "React 19 稳定发布 Actions，并围绕表单提交、乐观更新、资源加载、ref 传递和 Server Components 补齐一批能力。",
  "whyItMatters": "React 19 把异步数据提交从“手动维护 pending、error、禁用按钮、乐观状态、表单重置”提升为框架级工作流。Actions、useActionState、useFormStatus、useOptimistic 让表单和异步变更更集中、更少样板代码；use、资源预加载、ref as prop 则让数据读取和 DOM 资源管理更贴近组件模型。",
  "features": [
    {
      "name": "Actions",
      "api": "async action functions",
      "note": "Action 是会执行异步变更的函数，可与 form action、Transition 等结合。React 能围绕 Action 管理 pending、错误和提交顺序，减少手写状态机。"
    },
    {
      "name": "useActionState",
      "api": "const [state, action, pending] = useActionState(fn, initialState)",
      "note": "useActionState 把 action 的返回值保存成状态，并暴露 pending。它适合表单提交后返回错误、成功消息或更新后的业务状态。"
    },
    {
      "name": "useFormStatus",
      "api": "useFormStatus()",
      "note": "子组件可以读取最近父级 form 的提交状态，例如 pending、data、method、action。它让 SubmitButton 不需要从父组件手动接收 isPending。"
    },
    {
      "name": "useOptimistic",
      "api": "useOptimistic(state, updateFn)",
      "note": "在服务器确认前先显示乐观 UI。适合评论、点赞、消息发送等失败概率低且需要即时反馈的交互。失败时需要回滚或展示错误。"
    },
    {
      "name": "use",
      "api": "use(resource)",
      "note": "use 可以在渲染中读取 Promise 或 Context。读取 Promise 时会挂起到 Suspense 边界；它使某些资源读取逻辑更接近组件结构。"
    },
    {
      "name": "DOM 与资源改进",
      "api": "ref as prop, preinit, preload, metadata",
      "note": "React 19 支持把 ref 作为普通 prop 传给函数组件，并增强文档 metadata、样式/脚本预加载与预初始化能力，让资源声明更组件化。"
    }
  ],
  "deepDive": [
    {
      "title": "提交工作流",
      "items": [
        {
          "title": "提交生命周期",
          "body": "表单提交不是一个按钮点击那么简单，它包含 pending、成功、失败、校验、重置和重复提交控制。Actions 把这些状态集中到提交函数周围。"
        },
        {
          "title": "表单内聚",
          "body": "useFormStatus 让提交按钮、错误提示、局部 loading 等组件从最近的 form 读取状态，减少父组件层层传 pending。"
        }
      ]
    },
    {
      "title": "用户反馈",
      "items": [
        {
          "title": "乐观 UI",
          "body": "乐观更新是一种用户体验策略，不只是 API 调用。它必须考虑失败回滚、重复提交、临时 ID、服务器最终结果和用户提示。"
        },
        {
          "title": "Action 状态",
          "body": "useActionState 适合把 action 返回值变成 UI 状态，例如错误消息、成功提示或服务器返回的新数据。"
        }
      ]
    },
    {
      "title": "资源和 DOM",
      "items": [
        {
          "title": "资源读取",
          "body": "use(resource) 让 Promise 和 Context 的读取更接近组件结构。读取 Promise 会挂起到 Suspense，这要求你设计好加载边界。"
        },
        {
          "title": "DOM 资源声明",
          "body": "metadata、preload、preinit、ref as prop 都体现 React 19 对 DOM 资源和组件模型的进一步整合，让资源需求可以随组件声明。"
        }
      ]
    }
  ],
  "code": "import React, { use, useActionState, useOptimistic, useRef } from 'react';\nimport { preinit, preload } from 'react-dom';\nimport { useFormStatus } from 'react-dom';\n\nasync function saveProfile(previousState, formData) {\n  const name = formData.get('name');\n  await updateProfile({ name });\n  return { message: 'Saved', name };\n}\n\nfunction SubmitButton() {\n  const { pending } = useFormStatus();\n  // useFormStatus 读取最近父级 form 的提交状态，不需要手动向下传 pending。\n  return <button disabled={pending}>{pending ? 'Saving...' : 'Save'}</button>;\n}\n\nfunction ProfileForm({ profilePromise }) {\n  // use 可以在组件里读取 Promise 或 Context；Promise 未完成时由 Suspense 接住。\n  const profile = use(profilePromise);\n  const [state, formAction] = useActionState(saveProfile, { message: '', name: profile.name });\n  const [optimisticName, setOptimisticName] = useOptimistic(state.name);\n  const inputRef = useRef(null);\n\n  return (\n    <form\n      action={(formData) => {\n        // useOptimistic 先展示乐观结果，Action 完成后再用真实状态校准。\n        setOptimisticName(formData.get('name'));\n        formAction(formData);\n      }}\n    >\n      {/* React 19 允许函数组件直接把 ref 当 prop 接收并向下传递。 */}\n      <TextField ref={inputRef} name=\"name\" defaultValue={optimisticName} />\n      <SubmitButton />\n      <p>{state.message}</p>\n    </form>\n  );\n}\n\nfunction TextField({ ref, ...props }) {\n  return <input ref={ref} {...props} />;\n}\n\n// 资源预加载 API 让 React 提前发现脚本、样式和字体等关键资源。\npreinit('/checkout.js', { as: 'script' });\npreload('/fonts/inter.woff2', { as: 'font', type: 'font/woff2', crossOrigin: '' });\n\n// React 19 还支持在组件树中声明 document metadata，框架可据此管理 title/meta/link。",
  "checklist": [
    "Actions 用于组织异步变更和提交生命周期。",
    "useActionState 适合从 action 返回值派生 UI 状态。",
    "useFormStatus 读取最近父级 form 的提交状态，减少 props 透传。",
    "useOptimistic 需要配套失败回滚或错误提示。",
    "ref as prop 和资源 API 体现 React 19 对 DOM/资源声明的整合。"
  ],
  "sources": [
    "React v19 release blog"
  ]
};
