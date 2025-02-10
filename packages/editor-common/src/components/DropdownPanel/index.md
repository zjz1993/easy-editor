---
group:
  title: 抽象组件
title: 弹出层组件
---

## DropdownPanel-弹出层组件

内部依据[rc-trigger 组件](https://www.npmjs.com/package/rc-trigger)进行封装，该组件和 antd 的 DropDown 组件不同的是，弹出层内可以放置任何的 react 组件，不是非得菜单按钮  
默认触发方式是点击 在点击节点的下方展示一个弹出层

### 1.示例

<code src="./demo/index.tsx" ></code>

### 2.属性

继承了 rc-trigger 所有的属性，详情参考[该链接](https://www.npmjs.com/package/rc-trigger#props)  
在 rc-trigger 组件属性的基础上，又扩展了如下几个属性

| 属性      | 说明                                                                                 | 类型    | 是否必填 | 默认值    |
| --------- | ------------------------------------------------------------------------------------ | ------- | -------- | --------- |
| className | 加在触发操作的节点上，不是加到弹出层上，如果想加到弹出层上请使用 popupClassName 属性 | string  | 否       | undefined |
| style     | 加在触发操作的节点上，不是加到弹出层上，如果想加到弹出层上请使用 popupStyle 属性     | string  | 否       | undefined |
| sameWidth | 弹出层是否要和触发操作的节点保持相同宽度                                             | boolean | 否       | undefined |
