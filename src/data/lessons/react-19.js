export const lesson = {
  id: 'react-19',
  version: '19',
  date: '2024-12-05',
  era: 'Actions 与表单',
  title: 'Actions、乐观更新与新的资源能力',
  summary:
    'React 19 稳定发布 Actions，并围绕表单提交、乐观更新、资源加载、ref 传递和 Server Components 补齐一批能力。',
  whyItMatters:
    'React 19 把异步数据提交从“手动维护 pending、error、禁用按钮、乐观状态、表单重置”提升为框架级工作流。Actions、useActionState、useFormStatus、useOptimistic 让表单和异步变更更集中、更少样板代码；use、资源预加载、ref as prop 则让数据读取和 DOM 资源管理更贴近组件模型。',
  features: [
    {
      name: 'Actions',
      api: 'async action functions',
      note:
        'Action 是会执行异步变更的函数，可与 form action、Transition 等结合。React 能围绕 Action 管理 pending、错误和提交顺序，减少手写状态机。'
    },
    {
      name: 'useActionState',
      api: 'const [state, action, pending] = useActionState(fn, initialState)',
      note:
        'useActionState 把 action 的返回值保存成状态，并暴露 pending。它适合表单提交后返回错误、成功消息或更新后的业务状态。'
    },
    {
      name: 'useFormStatus',
      api: 'useFormStatus()',
      note:
        '子组件可以读取最近父级 form 的提交状态，例如 pending、data、method、action。它让 SubmitButton 不需要从父组件手动接收 isPending。'
    },
    {
      name: 'useOptimistic',
      api: 'useOptimistic(state, updateFn)',
      note:
        '在服务器确认前先显示乐观 UI。适合评论、点赞、消息发送等失败概率低且需要即时反馈的交互。失败时需要回滚或展示错误。'
    },
    {
      name: 'use',
      api: 'use(resource)',
      note:
        'use 可以在渲染中读取 Promise 或 Context。读取 Promise 时会挂起到 Suspense 边界；它使某些资源读取逻辑更接近组件结构。'
    },
    {
      name: 'DOM 与资源改进',
      api: 'ref as prop, preinit, preload, metadata',
      note:
        'React 19 支持把 ref 作为普通 prop 传给函数组件，并增强文档 metadata、样式/脚本预加载与预初始化能力，让资源声明更组件化。'
    }
  ],
  deepDive: [
    {
      title: '1. Actions 把提交生命周期集中起来',
      body:
        '传统写法需要手动 setPending(true)、try/catch、setError、重置表单。Action 工作流让提交函数本身成为状态来源，UI 读取 pending 和返回值即可。'
    },
    {
      title: '2. useFormStatus 解决的是组件层级传递问题',
      body:
        'SubmitButton 往往在表单内部深层组件中。useFormStatus 让它直接知道最近 form 是否正在提交，不必从表单父组件一路传 props。'
    },
    {
      title: '3. 乐观更新必须设计失败路径',
      body:
        'useOptimistic 让 UI 先显示成功，但网络失败、权限失败、校验失败仍会发生。真正可靠的乐观 UI 要考虑回滚、错误提示和重复提交。'
    }
  ],
  code: `function SubmitButton() {
  const { pending } = useFormStatus();
  return <button disabled={pending}>{pending ? 'Saving...' : 'Save'}</button>;
}

function ChangeName({ updateName }) {
  const [message, submitAction, isPending] = useActionState(
    async (previousMessage, formData) => {
      const name = formData.get('name');
      await updateName(name);
      return 'Name updated';
    },
    ''
  );

  return (
    <form action={submitAction}>
      <input name="name" />
      <SubmitButton />
      {isPending && <p>Updating profile...</p>}
      {message && <p>{message}</p>}
    </form>
  );
}`,
  practice: [
    {
      title: '改写手动提交状态',
      body:
        '找一个表单，把 useState 管理的 pending/error/success 改为 useActionState 返回的 state 和 pending。'
    },
    {
      title: '拆出提交按钮',
      body:
        '把 SubmitButton 拆成表单内部子组件，通过 useFormStatus 获取 pending，而不是从父组件传 isPending。'
    },
    {
      title: '设计乐观更新',
      body:
        '为评论发布或点赞写一个 useOptimistic 示例。写出成功路径和失败回滚策略，不只写“先加一条数据”。'
    }
  ],
  answer: {
    code: `function SubmitButton() {
  const { pending } = useFormStatus();
  return <button disabled={pending}>{pending ? 'Saving...' : 'Save'}</button>;
}

function ChangeName({ updateName }) {
  const [message, submitAction, isPending] = useActionState(
    async (previousMessage, formData) => {
      const name = formData.get('name');
      await updateName(name);
      return 'Name updated';
    },
    ''
  );

  return (
    <form action={submitAction}>
      <input name="name" />
      <SubmitButton />
      {isPending && <p>Updating profile...</p>}
      {message && <p>{message}</p>}
    </form>
  );
}`,
    notes: [
      'useActionState 把 action 返回值保存为 UI 状态，同时给出 pending。',
      'SubmitButton 通过 useFormStatus 读取最近父级 form 的提交状态。',
      '乐观更新类练习还需要失败回滚或错误提示，不能只写成功路径。'
    ]
  },
  checklist: [
    'Actions 用于组织异步变更和提交生命周期。',
    'useActionState 适合从 action 返回值派生 UI 状态。',
    'useFormStatus 读取最近父级 form 的提交状态，减少 props 透传。',
    'useOptimistic 需要配套失败回滚或错误提示。',
    'ref as prop 和资源 API 体现 React 19 对 DOM/资源声明的整合。'
  ],
  sources: ['React v19 release blog']
};
