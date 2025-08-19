
// @ts-nocheck
import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs';
import { RadioGroup, RadioGroupItem } from '../components/radio-group';
import { Label } from '../components/label';

const meta = {
  title: 'Form/RadioGroup',
  component: RadioGroup,
  subcomponents: {
    RadioGroupItem
  },
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A flexible radio group component that supports multiple states.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    disabled: {
      control: 'boolean',
      description: 'Whether the radio group is disabled',
    },
    size: { 
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'The size of the radio buttons',
    },
  },
  args: {
    disabled: false,
    size: 'md'
  },
} satisfies Meta<typeof RadioGroup>;

export default meta;
type Story = StoryObj<typeof RadioGroup>;

export const Default: Story = {
  render: (args) => (
      <div className="flex items-center gap-x-2">
        <RadioGroup {...args} id="example-checkbox">
          <ul className="flex flex-col gap-y-2">
            <li className="flex items-center gap-x-1">
              <RadioGroupItem size={args.size} value="option1" id="option1" />
              <Label htmlFor="option1">Male</Label>
            </li>
            <li className="flex items-center gap-x-1">
              <RadioGroupItem size={args.size} value="option2" id="option2" />
              <Label htmlFor="option2">Female</Label>
            </li>
            <li className="flex items-center gap-x-1">
              <RadioGroupItem size={args.size} value="option3" id="option3" />
              <Label htmlFor="option3">Other</Label>
            </li>
          </ul>
        </RadioGroup>
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

// export const Checked: Story = {
//   args: {
//     checked: true,
//   },
//   parameters: {
//     docs: {
//       description: {
//         story: 'A checked checkbox.',
//       },
//     },
//   },
// };

// export const Disabled: Story = {
//   args: {
//     disabled: true,
//     checked: false,
//   },
//   parameters: {
//     docs: {
//       description: {
//         story: 'A disabled checkbox.',
//       },
//     },
//   },
// };

// export const DisabledChecked: Story = {
//   args: {
//     disabled: true,
//     checked: true,
//   },
//   parameters: {
//     docs: {
//       description: {
//         story: 'A disabled and checked checkbox.',
//       },
//     },
//   },
// };