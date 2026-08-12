import * as React from 'react';

import type { Meta, StoryObj } from '@storybook/react-vite';
import * as Accordion from './accordion';

const meta = {
  title: 'Data Display/Accordion',
  component: Accordion.Root,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'An expandable collection of items. Set `multiple` to allow more than one open panel; `value` and `defaultValue` are arrays in both modes.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    multiple: {
      control: 'boolean',
      description: 'Whether multiple items can be open at the same time',
      table: {
        defaultValue: { summary: 'false' },
      },
    },
  },
  args: {
    multiple: false,
  },
} satisfies Meta<typeof Accordion.Root>;

export default meta;
type Story = StoryObj<typeof Accordion.Root>;

export const Default: Story = {
  render: (args) => (
    <Accordion.Root className="w-[400px] flex flex-col gap-y-2" {...args}>
      <Accordion.Item value="item-1">
        <Accordion.Header>
          <Accordion.Trigger>Is it accessible?</Accordion.Trigger>
        </Accordion.Header>
        <Accordion.Panel>
          Yes. It adheres to the WAI-ARIA design pattern.
        </Accordion.Panel>
      </Accordion.Item>
      <Accordion.Item value="item-2">
        <Accordion.Header>
          <Accordion.Trigger>Is it styled?</Accordion.Trigger>
        </Accordion.Header>
        <Accordion.Panel>
          Yes. It comes with default styles that match your theme.
        </Accordion.Panel>
      </Accordion.Item>
      <Accordion.Item value="item-3">
        <Accordion.Header>
          <Accordion.Trigger>Is it animated?</Accordion.Trigger>
        </Accordion.Header>
        <Accordion.Panel>
          Yes. It's animated by default, but you can disable it if you prefer.
        </Accordion.Panel>
      </Accordion.Item>
    </Accordion.Root>
  ),
  parameters: {
    docs: {
      description: {
        story: 'A basic accordion with multiple items that can be expanded and collapsed.',
      },
    },
  },
};

export const Multiple: Story = {
  args: {
    multiple: true,
  },
  render: (args) => (
    <Accordion.Root className="w-[400px] flex flex-col gap-y-2" {...args}>
      <Accordion.Item value="item-1">
        <Accordion.Header>
          <Accordion.Trigger>First Section</Accordion.Trigger>
        </Accordion.Header>
        <Accordion.Panel>
          This is the first section's content.
        </Accordion.Panel>
      </Accordion.Item>
      <Accordion.Item value="item-2">
        <Accordion.Header>
          <Accordion.Trigger>Second Section</Accordion.Trigger>
        </Accordion.Header>
        <Accordion.Panel>
          This is the second section's content.
        </Accordion.Panel>
      </Accordion.Item>
    </Accordion.Root>
  ),
  parameters: {
    docs: {
      description: {
        story: 'An accordion that allows multiple items to be open simultaneously.',
      },
    },
  },
};

export const WithoutChevron: Story = {
  render: (args) => (
    <Accordion.Root className="w-[400px]" {...args}>
      <Accordion.Item value="item-1">
        <Accordion.Header>
          <Accordion.Trigger hideChevron>No Chevron Item</Accordion.Trigger>
        </Accordion.Header>
        <Accordion.Panel>
          This accordion trigger has no chevron icon.
        </Accordion.Panel>
      </Accordion.Item>
    </Accordion.Root>
  ),
  parameters: {
    docs: {
      description: {
        story: 'An accordion item without the chevron icon.',
      },
    },
  },
};
/*
 * All three stories above start collapsed, so the panel -- and the open/close
 * animation the accordion is built around -- was never screenshotted.
 */
export const Expanded: Story = {
  /*
   * `defaultValue` is an array now even though this is a single accordion, and
   * `collapsible` is gone: Base UI's single mode always allows closing the open
   * item, so there is nothing left to opt into.
   */
  args: { multiple: false, defaultValue: ['item-1'] },
  render: Default.render,
  parameters: {
    docs: {
      description: {
        story: 'defaultValue opens the first item on mount, covering the expanded panel.',
      },
    },
  },
};
