import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Label } from './label';
import { Input } from './input';
import { Checkbox } from './checkbox';

const meta = {
  title: 'Form/Label',
  component: Label,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'An accessible caption for a form control. Link it to its control with htmlFor so that clicking the label focuses or toggles the control.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    htmlFor: {
      control: 'text',
      description: 'The id of the control this label describes.',
    },
    children: {
      control: 'text',
      description: 'The label text.',
    },
  },
  args: {
    children: 'Email address',
  },
} satisfies Meta<typeof Label>;

export default meta;
type Story = StoryObj<typeof Label>;

export const Default: Story = {
  parameters: {
    docs: { description: { story: 'A standalone label.' } },
  },
};

export const WithInput: Story = {
  render: (args) => (
    <div className="grid w-72 gap-y-2">
      <Label {...args} htmlFor="example-label-input" />
      <Input id="example-label-input" type="email" placeholder="name@example.com" />
    </div>
  ),
  parameters: {
    docs: { description: { story: 'The usual pairing: a label stacked above its input.' } },
  },
};

export const WithCheckbox: Story = {
  args: { children: 'I accept the terms and conditions' },
  render: (args) => (
    <div className="flex items-center gap-x-2">
      <Checkbox id="example-label-checkbox" />
      <Label {...args} htmlFor="example-label-checkbox" />
    </div>
  ),
  parameters: {
    docs: { description: { story: 'Beside a checkbox, the label becomes part of the hit target.' } },
  },
};

export const Disabled: Story = {
  render: (args) => (
    <div className="grid w-72 gap-y-2">
      <Label {...args} htmlFor="example-label-disabled" aria-disabled />
      <Input id="example-label-disabled" disabled placeholder="Unavailable" />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'The label dims itself via aria-disabled, and also via peer-disabled when it follows a disabled control marked as a peer.',
      },
    },
  },
};
