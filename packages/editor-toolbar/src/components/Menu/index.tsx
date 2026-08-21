import RcMenu, {Divider, MenuItem, SubMenu} from '@rc-component/menu';
import type {MenuProps} from '@rc-component/menu';
import {type FC, useCallback, useMemo, useState} from 'react';
import type {CSSProperties, ReactElement, ReactNode} from 'react';
import cx from 'classnames';

/** 新版 @rc-component/menu 主入口不再导出这些类型,本地等价声明 */
type MenuMode = 'horizontal' | 'vertical' | 'inline';
type TriggerSubMenuAction = 'hover' | 'click';
interface MenuInfo {
  key: string;
  keyPath: string[];
}

export interface TextoryMenuItem {
  /** 唯一标识;叶子点击时用于回调匹配 */
  key: string;
  label?: ReactNode;
  icon?: ReactNode;
  /** 快捷键提示,展示在行尾(浅色右对齐) */
  shortcut?: string;
  disabled?: boolean;
  /** 危险操作项(红色文案) */
  danger?: boolean;
  /** type: 'divider' 时渲染分割线,其余字段忽略 */
  type?: 'divider';
  /** 子菜单(递归多级) */
  children?: TextoryMenuItem[];
  /**
   * SubMenu 弹层渲染完全自定义的内容(如表格选格网格)。
   * 与 children 互斥:有 popupContent 时忽略 children。
   * 内部经 SubMenu 的 popupRender 实现——默认的 <ul class="rc-menu-sub">
   * 菜单结构被整体替换,内容以独立浮层形式出现在菜单外部。
   */
  popupContent?: ReactNode;
  /** 叶子项点击回调;执行后自动收起整个菜单 */
  onClick?: () => void;
}

export interface TextoryMenuProps {
  options: TextoryMenuItem[];
  /** 默认 vertical(弹层面板);horizontal/inline 用于导航条场景 */
  mode?: MenuMode;
  /** 子菜单展开触发方式,默认 hover */
  triggerSubMenuAction?: TriggerSubMenuAction;
  /** 是否可选中高亮;动作菜单保持 false(默认) */
  selectable?: boolean;
  /** 受控展开的子菜单 key 列表 */
  openKeys?: string[];
  defaultOpenKeys?: string[];
  onOpenChange?: (keys: string[]) => void;
  /** 叶子项点击(执行 onClick)后触发,外层据此收起菜单容器 */
  onCloseAll?: () => void;
  getPopupContainer?: MenuProps['getPopupContainer'];
  className?: string;
  style?: CSSProperties;
}

/** rc-motion 类名规则:`${motionName}-enter/appear/leave(-active)` */
const defaultMotions = {
  horizontal: {motionName: 'textory-menu-slide-up', motionAppear: true, motionEnter: true, motionLeave: true},
  inline: {motionName: 'textory-menu-collapse', motionAppear: true},
  vertical: {motionName: 'textory-menu-zoom', motionAppear: true, motionEnter: true, motionLeave: true},
};

/** SubMenu 展开箭头(CSS 绘制,随 open 旋转) */
const renderExpandIcon = ({isOpen}: {isOpen?: boolean}) => (
  <i className={cx('textory-menu__arrow', {'is-open': isOpen})} />
);

function renderLabel(item: TextoryMenuItem): ReactNode {
  return (
    <span className="textory-menu__content">
      {item.icon && <span className="textory-menu__icon">{item.icon}</span>}
      <span className="textory-menu__label">{item.label}</span>
      {item.shortcut && <span className="textory-menu__shortcut">{item.shortcut}</span>}
    </span>
  );
}

function findItem(options: TextoryMenuItem[], key: string): TextoryMenuItem | undefined {
  for (const option of options) {
    if (option.key === key) return option;
    if (option.children) {
      const found = findItem(option.children, key);
      if (found) return found;
    }
  }
  return undefined;
}

function renderOptions(options: TextoryMenuItem[]): ReactNode {
  return options.map(item => {
    if (item.type === 'divider') {
      return <Divider key={item.key} />;
    }
    if (item.popupContent !== undefined) {
      // popupRender 完全替换默认的 ul.rc-menu-sub 菜单结构,
      // popupContent 以独立浮层出现在菜单外部(定位仍由 trigger 负责)
      return (
        <SubMenu
          key={item.key}
          title={renderLabel(item)}
          disabled={item.disabled}
          popupOffset={[2,0]}
          popupClassName="textory-menu__popup--custom"
          popupRender={(): ReactNode => item.popupContent}
        />
      );
    }
    if (item.children) {
      return (
        <SubMenu
          key={item.key}
          title={renderLabel(item)}
          disabled={item.disabled}
          popupClassName={cx('textory-menu__popup', item.danger && 'textory-menu__popup--danger')}
        >
          {renderOptions(item.children)}
        </SubMenu>
      );
    }
    return (
      <MenuItem
        key={item.key}
        disabled={item.disabled}
        className={cx(item.danger && 'textory-menu__item--danger')}
      >
        {renderLabel(item)}
      </MenuItem>
    );
  });
}

/**
 * 数据驱动的通用多级菜单(rc-menu 封装)。
 *
 * - options 递归渲染 MenuItem / SubMenu / Divider,支持任意层级
 * - 叶子点击:执行该项 onClick → 收起全部子菜单 → 通知外层(onCloseAll)收起容器
 * - openKeys 支持受控/非受控;popupContent 可在子菜单弹层塞自定义内容
 * - expandIcon / 动画 / 样式见 editor-style 的 menu.scss(motionName 前缀 textory-menu-*)
 */
const TextoryMenu: FC<TextoryMenuProps> = ({
  options,
  mode = 'vertical',
  triggerSubMenuAction = 'hover',
  selectable = false,
  openKeys,
  defaultOpenKeys,
  onOpenChange,
  onCloseAll,
  getPopupContainer,
  className,
  style,
}) => {
  const [internalOpenKeys, setInternalOpenKeys] = useState<string[]>(defaultOpenKeys ?? []);
  const mergedOpenKeys = openKeys ?? internalOpenKeys;

  const handleOpenChange = useCallback(
    (keys: string[]) => {
      setInternalOpenKeys(keys);
      onOpenChange?.(keys);
    },
    [onOpenChange],
  );

  const handleClick = useCallback(
    (info: MenuInfo) => {
      const item = findItem(options, info.key);
      if (!item || item.disabled) return;
      item.onClick?.();
      // 叶子项(无子级)执行后收起全部;子菜单标题点击不收起
      if (!item.children && item.popupContent === undefined) {
        setInternalOpenKeys([]);
        onCloseAll?.();
      }
    },
    [options, onCloseAll],
  );

  const content = useMemo(() => renderOptions(options), [options]);

  if (!options.length) return null;

  return (
    <RcMenu
      className={cx('textory-menu', className)}
      style={style}
      mode={mode}
      triggerSubMenuAction={triggerSubMenuAction}
      selectable={selectable}
      openKeys={mergedOpenKeys}
      onOpenChange={handleOpenChange}
      onClick={handleClick}
      expandIcon={renderExpandIcon}
      defaultMotions={defaultMotions as MenuProps['defaultMotions']}
      getPopupContainer={getPopupContainer}
      forceSubMenuRender={false}
      subMenuOpenDelay={0.1}
      subMenuCloseDelay={0.3}
    >
      {content}
    </RcMenu>
  );
};

export default TextoryMenu;
