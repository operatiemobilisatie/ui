import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Switch } from './switch';
import { Label } from './label';

const meta = {
  title: 'Form/Switch',
  component: Switch,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A toggle between two mutually exclusive states, checked and unchecked.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    checked: {
      control: 'boolean',
      description: 'Whether the switch is on. Provide together with onCheckedChange to control it.',
    },
    defaultChecked: {
      control: 'boolean',
      description: 'The initial state when the switch is uncontrolled.',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the switch is disabled.',
    },
  },
  args: {
    disabled: false,
  },
} satisfies Meta<typeof Switch>;

export default meta;
type Story = StoryObj<typeof Switch>;

export const Default: Story = {
  parameters: {
    docs: { description: { story: 'An unchecked switch.' } },
  },
};

export const Checked: Story = {
  args: { defaultChecked: true },
  parameters: {
    docs: { description: { story: 'A switch in its on state.' } },
  },
};

export const Disabled: Story = {
  args: { disabled: true },
  parameters: {
    docs: { description: { story: 'A disabled switch cannot be toggled.' } },
  },
};

export const DisabledChecked: Story = {
  args: { disabled: true, defaultChecked: true },
  parameters: {
    docs: { description: { story: 'A disabled switch that is on.' } },
  },
};

export const WithLabel: Story = {
  render: (args) => (
    <div className="flex items-center gap-x-2">
      <Switch {...args} id="example-switch" />
      <Label htmlFor="example-switch">Receive newsletter</Label>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Pair the switch with a Label using a shared id so clicking the text toggles it.',
      },
    },
  },
};
