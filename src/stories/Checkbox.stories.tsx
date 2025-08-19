import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs';
import { Checkbox } from '../components/checkbox';
import { Label } from '../components/label';

const meta = {
  title: 'Form/Checkbox',
  component: Checkbox,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A flexible checkbox component that supports multiple states.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    disabled: {
      control: 'boolean',
      description: 'Whether the checkbox is disabled',
    },
  },
  args: {
    disabled: false
  },
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof Checkbox>;

export const Default: Story = {
  render: (args) => (
      <div className="flex items-center gap-x-2">
        <Checkbox {...args} id="example-checkbox" />
        <Label htmlFor="example-checkbox">I accept the terms and conditions</Label>
      </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'The default unchecked checkbox.',
      },
    },
  },
};

export const Checked: Story = {
  args: {
    checked: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'A checked checkbox.',
      },
    },
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    checked: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'A disabled checkbox.',
      },
    },
  },
};

export const DisabledChecked: Story = {
  args: {
    disabled: true,
    checked: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'A disabled and checked checkbox.',
      },
    },
  },
};