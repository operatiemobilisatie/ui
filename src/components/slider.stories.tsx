import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import * as Slider from './slider';

const meta = {
  title: 'Form/Slider',
  component: Slider.Root,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          "A flexible Slider component that supports multiple sizes. Radix's Root split into Root + Control, Range became Indicator, and the value label under the thumb is now Slider.Value, which follows the handle instead of being frozen at the initial value.",
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    min: {
      control: 'number',
      description: 'The minimum value of the Slider',
    },
    max: {
      control: 'number',
      description: 'The maximum value of the Slider',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the Slider is disabled',
    },
  },
  args: {
    disabled: false,
    className: 'w-72'
  },
} satisfies Meta<typeof Slider.Root>;

export default meta;
type Story = StoryObj<typeof Slider.Root>;

export const Default: Story = {
    render: (args) => (
        <Slider.Root defaultValue={[50]} className={args.className} min={args.min} max={args.max} disabled={args.disabled}>
            <Slider.Control>
                <Slider.Track>
                    <Slider.Indicator />
                </Slider.Track>
                <Slider.Thumb>
                    <Slider.Value />
                </Slider.Thumb>
            </Slider.Control>
        </Slider.Root>
    ),
    parameters: {
        docs: {
            description: {
                story: 'The default input with standard sizing.',
            },
        },
    },
};
