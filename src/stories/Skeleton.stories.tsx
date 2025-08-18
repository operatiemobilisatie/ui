import * as React from 'react';

import type { Meta, StoryObj } from '@storybook/react';
import { Skeleton } from '@/components/skeleton';

const meta = {
  title: 'Feedback/Skeleton',
  component: Skeleton,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A versatile skeleton component that indicates loading states.',
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
    className: 'w-96 h-16'
  },
} satisfies Meta<typeof Skeleton>;

export default meta;
type Story = StoryObj<typeof Skeleton>;

export const Default: Story = {
  render: (args) => (
    <Skeleton className={args.className} />
  ),
  parameters: {
    docs: {
      description: {
        story: 'The default skeleton indicating loading state.',
      },
    },
  },
};

export const ImitateLayout: Story = {
  render: () => (
    <div className="flex flex-col gap-y-3">
      <Skeleton className="w-32 h-6" />
      <Skeleton className="w-96 h-12" />
      <Skeleton className="w-96 h-32" />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'A skeleton layout imitating the structure of a typical card.',
      },
    },
  },
};