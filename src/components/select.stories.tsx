import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Select } from './select';

/*
 * Annotated rather than `satisfies Meta<...>`. The decorator below takes a
 * Storybook-supplied component whose props are Select's, and inferring that
 * makes `meta`'s type reach for `SelectComponents` -- a react-select type that
 * is not reachable through its `exports` map, so tsc refuses to name it
 * (TS2883). The annotation keeps the reference inside the import we already
 * have.
 */
const meta: Meta<typeof Select> = {
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
  /*
   * react-select renders its menu as an absolutely positioned child of the
   * container rather than portalling it, so the menu is only as visible as the
   * box the story is drawn in. `layout: 'centered'` sizes that box to the
   * control -- about 40px tall -- and the menu spilled straight out of the docs
   * preview and off the bottom of the canvas.
   *
   * This reserves the room instead. min-h-72 is roughly the control plus eight
   * options, so a menu of any realistic length is fully in frame in both the
   * docs page and the canvas. Pass `menuPortalTarget={document.body}` in a real
   * app if you would rather escape the container than make space in it.
   */
  decorators: [
    (Story) => (
      <div className="flex min-h-72 w-96 flex-col items-stretch">
        <Story />
      </div>
    ),
  ],
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
};

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

export const MenuOpen: Story = {
    args: {
        displaySize: 'default',
        placeholder: 'Select an option...',
        className: 'min-w-96',
        menuIsOpen: true,
        options: [
            { value: 'option1', label: 'Option 1' },
            { value: 'option2', label: 'Option 2' },
            { value: 'option3', label: 'Option 3' },
            { value: 'option4', label: 'Option 4' },
            { value: 'option5', label: 'Option 5' },
        ]
    },
    parameters: {
        docs: {
            description: {
                story:
                    'The open menu, held open with the controlled `menuIsOpen` prop so the option styling is on screen without an interaction (and so the screenshot cannot race one). Use `defaultMenuIsOpen` if you want it open on mount but still closable.',
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
        defaultValue: 'This input is disabled',
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