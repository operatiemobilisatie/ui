import type { Meta, StoryObj } from '@storybook/react';
import { Textarea } from '../components/textarea';

const meta = {
  title: 'Form/Textarea',
  component: Textarea,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A flexible textarea component that supports multiple sizes.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    displaySize: {
      control: 'select',
      options: ['default', 'sm', 'lg'],
      description: 'The size of the textarea',
      table: {
        defaultValue: { summary: 'default' },
      },
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder text',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the textarea is disabled',
    },
  },
  args: {
    disabled: false,
  },
} satisfies Meta<typeof Textarea>;

export default meta;
type Story = StoryObj<typeof Textarea>;

export const Default: Story = {
  args: {
    displaySize: 'default',
    placeholder: 'Type your message here...',
  },
  parameters: {
    docs: {
      description: {
        story: 'The default textarea with standard sizing.',
      },
    },
  },
};

export const Small: Story = {
  args: {
    displaySize: 'sm',
    placeholder: 'Type your message here...',
  },
  parameters: {
    docs: {
      description: {
        story: 'A smaller textarea for compact layouts.',
      },
    },
  },
};

export const Large: Story = {
  args: {
    displaySize: 'lg',
    placeholder: 'Type your message here...',
  },
  parameters: {
    docs: {
      description: {
        story: 'Bigger horizontal padding and rounder corners.',
      },
    },
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    placeholder: 'Disabled textarea',
    value: 'This textarea is disabled',
  },
  parameters: {
    docs: {
      description: {
        story: 'A disabled textarea state.',
      },
    },
  },
}; 