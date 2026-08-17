import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import Switch from './index';

afterEach(cleanup);

describe('Switch 组件渲染', () => {
  it('渲染为 button 且默认未选中', () => {
    render(<Switch />);
    const btn = screen.getByRole('switch');
    expect(btn).toBeDefined();
    expect(btn.getAttribute('aria-checked')).toBe('false');
  });

  it('受控模式：checked 属性生效', () => {
    render(<Switch checked checkedChildren="开" unCheckedChildren="关" />);
    const btn = screen.getByRole('switch');
    expect(btn.getAttribute('aria-checked')).toBe('true');
    expect(btn.textContent).toContain('开');
  });

  it('点击触发 onChange 并切换状态', () => {
    const onChange = vi.fn();
    render(<Switch defaultChecked={false} onChange={onChange} />);
    const btn = screen.getByRole('switch');
    fireEvent.click(btn);
    expect(onChange).toHaveBeenCalledOnce();
    expect(onChange.mock.calls[0][0]).toBe(true);
    expect(btn.getAttribute('aria-checked')).toBe('true');
  });

  it('disabled 时不响应点击', () => {
    const onChange = vi.fn();
    render(<Switch disabled onChange={onChange} />);
    fireEvent.click(screen.getByRole('switch'));
    expect(onChange).not.toHaveBeenCalled();
  });
});
