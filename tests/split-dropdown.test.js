import { mount } from '@vue/test-utils';
import SplitDropdown from '../src/split-dropdown.vue';

const slot = 'A simple button';
const items = [
  { text: 'Option 1' },
];

test('Expect label must be "A simple button"', async () => {
  const wrapper = mount(SplitDropdown, { slots: { default: slot }});
  const label = wrapper.get('.label')
  expect(label.text()).toBe(slot);
});

test('Expect theme must be danger', async () => {
  const wrapper = mount(SplitDropdown, { slots: { default: slot }, props: { theme: 'danger' }});
  const div = wrapper.get('.danger');
  expect(div).toBeTruthy();
});

test('Expect click show dropdown menu', async () => {
  const wrapper = mount(SplitDropdown, {
    slots: { default: slot },
    props: { theme: 'danger', items },
  });
  const div = wrapper.find('.split-dropdown-box');
  await div.trigger('click');
  await div.trigger('click');
  await div.trigger('click');
  const item = wrapper.find('.split-dropdown-popper ul li');
  expect(item.text()).toBe('Option 1');
});

test('Expect listener window postmessage', async () => {
  const wrapper = mount(SplitDropdown, {
    slots: { default: slot },
  });
  const div = wrapper.find('.split-dropdown-box');
  await div.trigger('click');
  const e = new MessageEvent('message', { data: JSON.stringify({ slideDropdown: 'test' }) });
  const f = new MessageEvent('message', { data: JSON.stringify({ x: 'y' }) });
  window.dispatchEvent(f);
  window.dispatchEvent(e);
  const item = wrapper.find('.split-dropdown-popper');
  expect(item.exists()).toBe(false);
});

test('Expect disabled doesnt work', async () => {
  const wrapper = mount(SplitDropdown, {
    slots: { default: slot },
    props: { disabled: true },
  });
  const div = wrapper.find('.split-dropdown-box');
  await div.trigger('click');
  const item = wrapper.find('.split-dropdown-popper');
  expect(item.exists()).toBe(false);
});

