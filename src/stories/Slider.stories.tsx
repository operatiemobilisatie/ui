import type { Meta, StoryObj } from '@storybook/nextjs';
import { Slider } from '../components/slider';

const meta = {
  title: 'Form/Slider',
  component: Slider,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A flexible Slider component that supports multiple sizes.',
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
} satisfies Meta<typeof Slider>;

export default meta;
type Story = StoryObj<typeof Slider>;

export const Default: Story = {
    render: (args) => (
        <Slider defaultValue={[50]} className={args.className} min={args.min} max={args.max} disabled={args.disabled} />
    ),
    parameters: {
        docs: {
            description: {
                story: 'The default input with standard sizing.',
            },
        },
    },
};