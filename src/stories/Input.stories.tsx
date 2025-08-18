import type { Meta, StoryObj } from '@storybook/nextjs';
import { Input } from '../components/input';

const meta = {
  title: 'Form/Input',
  component: Input,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A flexible Input component that supports multiple sizes.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    displaySize: {
      control: 'select',
      options: ['default', 'sm', 'lg'],
      description: 'The size of the Input',
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
      description: 'Whether the Input is disabled',
    },
  },
  args: {
    disabled: false,
    className: 'w-72'
  },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof Input>;

export const Default: Story = {
    args: {
        displaySize: 'default',
        placeholder: 'Type your message here...',
    },
    parameters: {
        docs: {
            description: {
                story: 'The default input with standard sizing.',
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
                story: 'A smaller input for compact layouts.',
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
        placeholder: 'Disabled input',
        value: 'This input is disabled',
    },
    parameters: {
        docs: {
            description: {
                story: 'A disabled input state.',
            },
        },
    },
};
export const Email: Story = {
    args: {
        type: 'email',
        placeholder: 'Enter your email',
    },
    parameters: {
        docs: {
            description: {
                story: 'An input field for email addresses.',
            },
        },
    },
};

export const Number: Story = {
    args: {
        type: 'number',
        placeholder: 'Enter a number',
    },
    parameters: {
        docs: {
            description: {
                story: 'An input field for numeric values.',
            },
        },
    },
};

export const Password: Story = {
    args: {
        type: 'password',
        placeholder: 'Enter your password',
    },
    parameters: {
        docs: {
            description: {
                story: 'An input field for passwords.',
            },
        },
    },
};