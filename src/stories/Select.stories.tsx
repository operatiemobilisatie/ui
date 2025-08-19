import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs';
import Select from '../components/select';

const meta = {
  title: 'Form/Select',
  component: Select,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A flexible Select component that supports multiple sizes. Built with react-select under the hood, it allows for easy customization and integration into forms.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    displaySize: {
      control: 'select',
      options: ['default', 'sm', 'lg'],
      description: 'The size of the Select',
      table: {
        defaultValue: { summary: 'default' },
      },
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder text',
    },
    isMulti: {
      control: 'boolean',
      description: 'Whether the Select allows multiple selections',
    },
  },
  args: {
    className: 'w-96'
  },
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof Select>;

export const Default: Story = {
    args: {
        displaySize: 'default',
        placeholder: 'Select an option...',
        className: 'min-w-96',
        isMulti: false,
        options: [
            { value: 'option1', label: 'Option 1' },
            { value: 'option2', label: 'Option 2' },
            { value: 'option3', label: 'Option 3' },
        ]
    },
    render: (args) => (
        <Select className={args.className} isMulti={args.isMulti} displaySize={args.displaySize} options={args.options} />
    ),
    parameters: {
        docs: {
            description: {
                story: 'The default input with standard sizing.',
            },
        },
    },
};

export const MultipleSelect: Story = {
    args: {
        isMulti: true,
        placeholder: 'Select multiple options...',
        className: 'min-w-96',
        options: [
            { value: 'option1', label: 'Option 1' },
            { value: 'option2', label: 'Option 2' },
            { value: 'option3', label: 'Option 3' },
        ]
    },
    parameters: {
        docs: {
            description: {
                story: 'A Select component that allows multiple selections.',
            },
        },
    },
};

export const Small: Story = {
    args: {
        displaySize: 'sm',
        placeholder: 'Type your message here...',
        className: 'min-w-96',
        options: [
            { value: 'option1', label: 'Option 1' },
            { value: 'option2', label: 'Option 2' },
            { value: 'option3', label: 'Option 3' },
        ]
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
        className: 'min-w-96',
        options: [
            { value: 'option1', label: 'Option 1' },
            { value: 'option2', label: 'Option 2' },
            { value: 'option3', label: 'Option 3' },
        ]
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
        isDisabled: true,
        placeholder: 'Disabled input',
        value: 'This input is disabled',
        className: 'min-w-96',
        options: [
            { value: 'option1', label: 'Option 1' },
            { value: 'option2', label: 'Option 2' },
            { value: 'option3', label: 'Option 3' },
        ]
    },
    parameters: {
        docs: {
            description: {
                story: 'A disabled input state.',
            },
        },
    },
};