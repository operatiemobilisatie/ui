import * as React from 'react';

import type { Meta, StoryObj } from '@storybook/nextjs';
import Spinner from '../components/spinner';

const meta = {
  title: 'Feedback/Spinner',
  component: Spinner,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A versatile spinner component that indicates loading states.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    className: {
      control: 'text',
      description: 'Additional CSS classes to apply to the spinner',
      defaultValue: '',
    },
  },
  args: {
    className: '',
    size: 32,
  },
} satisfies Meta<typeof Spinner>;

export default meta;
type Story = StoryObj<typeof Spinner>;

export const Default: Story = {
  render: (args) => (
    <Spinner className={args.className} size={args.size} />
  ),
  parameters: {
    docs: {
      description: {
        story: 'The default spinner indicating loading state.',
      },
    },
  },
};