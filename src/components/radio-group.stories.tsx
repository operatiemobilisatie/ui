
import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import * as RadioGroup from './radio-group';
import { Label } from './label';

/** Root takes no `size`; the stories fan it out to each Item. */
type StoryArgs = React.ComponentProps<typeof RadioGroup.Root> & {
  size?: 'sm' | 'default' | 'lg';
};

const meta = {
  title: 'Form/RadioGroup',
  component: RadioGroup.Root,
  subcomponents: { 'RadioGroup.Item': RadioGroup.Item },
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
      // 'md' was listed here but is not a size the component accepts, so it
      // silently fell through to the cva default.
      options: ['sm', 'default', 'lg'],
      description: 'The size of the radio buttons. Applied to each Item.',
    },
  },
  args: {
    disabled: false,
    size: 'default'
  },
} satisfies Meta<StoryArgs>;

export default meta;
type Story = StoryObj<StoryArgs>;

export const Default: Story = {
  render: (args) => (
      <div className="flex items-center gap-x-2">
        <RadioGroup.Root {...args} id="example-checkbox">
          <ul className="flex flex-col gap-y-2">
            <li className="flex items-center gap-x-1">
              <RadioGroup.Item size={args.size} value="option1" id="option1" />
              <Label htmlFor="option1">Male</Label>
            </li>
            <li className="flex items-center gap-x-1">
              <RadioGroup.Item size={args.size} value="option2" id="option2" />
              <Label htmlFor="option2">Female</Label>
            </li>
            <li className="flex items-center gap-x-1">
              <RadioGroup.Item size={args.size} value="option3" id="option3" />
              <Label htmlFor="option3">Other</Label>
            </li>
          </ul>
        </RadioGroup.Root>
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