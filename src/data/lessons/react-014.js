export const lesson = {
  id: 'react-014',
  version: '0.14',
  date: '2015-10-07',
  era: '跨平台拆分',
  title: 'React 与 React DOM 分家',
  summary:
    '0.14 是旧版本时代最重要的分水岭：React 核心从 DOM 渲染器中拆出来，函数组件也进入正式 API 视野。',
  whyItMatters:
    'React 0.14 把“描述 UI”和“渲染到浏览器”拆成两层：react 负责组件、元素和组合模型，react-dom 负责把这棵元素树挂载、更新或卸载到浏览器 DOM。这个边界让同一套组件模型可以被不同渲染目标复用：Web 使用 react-dom，服务端使用 react-dom/server，移动端可以使用 React Native，测试也可以使用专门的 renderer。后续的 createRoot、hydrateRoot、Server Components 本质上都延续了这个分层思路。',
  deepDive: [
    {
      title: '1. React 元素不是 DOM 节点',
      body:
        'JSX 最终描述的是 React element，它只是一个轻量对象，表达“我要渲染什么”。DOM 节点是浏览器里的真实对象。React 核心可以创建 element、组合组件、比较树结构，但它并不天然知道浏览器 DOM 应该怎么创建、怎么插入、怎么监听事件。把 element 变成 DOM，是 react-dom 的工作。'
    },
    {
      title: '2. 拆包背后的架构边界',
      body:
        '0.14 之前，很多 DOM 能力挂在 React 对象上。拆成 react 和 react-dom 后，React.Component、React.createElement、React.Children 这类组件模型能力留在 react；ReactDOM.render、findDOMNode、unmountComponentAtNode 这类和浏览器容器有关的能力进入 react-dom。这个边界让 React 可以服务多个平台。'
    },
    {
      title: '3. 函数组件的意义不只是少写代码',
      body:
        '无状态函数组件把“组件就是 props 到 UI 的映射”这件事表达得更直接。它没有实例、没有 this、没有生命周期，所以更适合展示型组件。后来 Hooks 出现后，函数组件才获得状态与副作用能力；但最早的函数组件价值，是让简单组件保持简单。'
    },
    {
      title: '4. ref 是命令式逃生口',
      body:
        'React 主张通过 state 和 props 声明 UI，但焦点、选区、测量尺寸、第三方 DOM 库等场景仍需要直接访问底层节点。0.14 调整了 DOM ref 行为，并用 ReactDOM.findDOMNode 替代 getDOMNode。今天你仍应优先使用明确的 ref，而不是依赖 findDOMNode 去穿透组件。'
    }
  ],
  features: [
    {
      name: 'react / react-dom 拆包',
      api: 'react, react-dom, react-dom/server',
      note:
        'react 保存组件模型：createElement、Component、Children 等；react-dom 保存 Web 平台渲染能力：render、unmountComponentAtNode、findDOMNode；react-dom/server 保存服务端字符串渲染能力。'
    },
    {
      name: 'ReactDOM.render',
      api: 'ReactDOM.render(element, container)',
      note:
        '把 React element 树挂载到浏览器 DOM 容器里。它是 React 18 之前的 Web 入口；React 18 后被 createRoot(...).render(...) 取代，但理解它有助于理解“渲染器入口”这个概念。'
    },
    {
      name: '无状态函数组件',
      api: 'function Component(props) { return element; }',
      note:
        '适合纯展示逻辑：输入是 props，输出是 React element。0.14 时代它没有 state 和生命周期；现代函数组件通过 Hooks 才能拥有状态与副作用。'
    },
    {
      name: 'ReactDOM.findDOMNode',
      api: 'ReactDOM.findDOMNode(componentOrElement)',
      note:
        '用于从组件实例找到底层 DOM 节点。它属于遗留逃生口，会打破组件封装；现代代码更推荐把 ref 显式传到需要访问的 DOM 节点上。'
    },
    {
      name: 'react-dom/server',
      api: 'ReactDOMServer.renderToString',
      note:
        '把 React element 树渲染为 HTML 字符串。这个包名也体现了同一套组件树可以被不同目标消费：浏览器 DOM、服务端 HTML、测试 renderer 等。'
    }
  ],
  code: `import React from 'react';
import ReactDOM from 'react-dom';
import ReactDOMServer from 'react-dom/server';

// React 核心：描述组件和元素，不直接操作浏览器 DOM。
function ProductCard({ product }) {
  return (
    <article className="product-card">
      <h2>{product.name}</h2>
      <p>{product.description}</p>
    </article>
  );
}

const element = (
  <ProductCard
    product={{
      name: 'React 0.14',
      description: 'React core describes UI. React DOM renders it.'
    }}
  />
);

// react-dom：把 element 渲染到浏览器 DOM 容器。
ReactDOM.render(element, document.getElementById('root'));

// react-dom/server：把同一棵 element 树渲染成 HTML 字符串。
const html = ReactDOMServer.renderToString(element);
console.log(html);`,
  practice: [
    {
      title: '写一个纯函数组件',
      body:
        '创建 ProfileSummary，只通过 props 接收 user 数据并返回 JSX。不要使用 state、ref、document、window 或任何 DOM API。目标是把“React 核心负责描述 UI”这件事写出来。'
    },
    {
      title: '写出浏览器挂载入口',
      body:
        '说明如果要把 <ProfileSummary /> 挂载到 #root，需要从哪个包导入什么方法。答案应该落在 react-dom，因为这是浏览器 DOM 渲染器的职责。'
    },
    {
      title: '写出服务端 HTML 输出入口',
      body:
        '说明如果要把同一个 <ProfileSummary /> 转成 HTML 字符串，需要从哪个包导入什么方法。答案应该落在 react-dom/server，因为这里的目标不是浏览器节点，而是 HTML 字符串。'
    },
    {
      title: '总结边界',
      body:
        '用一句话总结：ProfileSummary 属于 react 的组件模型；浏览器挂载属于 react-dom；服务端字符串渲染属于 react-dom/server。'
    }
  ],
  checklist: [
    'react、react-dom、react-dom/server 三者的职责边界清晰。',
    'ReactDOM.render 属于浏览器 DOM 渲染器，而不是 React 核心包。',
    'React element 是 UI 描述对象，真实 DOM 节点是浏览器中的渲染结果。',
    '纯展示 class 组件可以改写为无状态函数组件，前提是它只依赖 props 返回 UI。',
    'findDOMNode 属于遗留逃生口，现代代码优先通过显式 ref 暴露 DOM 节点。'
  ],
  sources: ['React v0.14 release blog']
};
