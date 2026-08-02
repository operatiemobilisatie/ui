import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Logo } from './logo';

const meta = {
  title: 'Data Display/Logo',
  component: Logo,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'The OM logo as inline SVG, so it inherits no external requests and scales cleanly. Renders a figure by default; pass `as` to change the element.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    width: {
      control: 'text',
      description: 'Any CSS length. Applied as an inline style.',
    },
    height: {
      control: 'text',
      description: 'Any CSS length. Applied as an inline style.',
    },
    as: {
      control: 'text',
      description: 'The element or component to render as. Defaults to figure.',
    },
    className: {
      control: 'text',
      description: 'Extra classes. The shimmer utility is always applied.',
    },
  },
  args: {
    width: '100px',
    height: '100px',
  },
} satisfies Meta<typeof Logo>;

export default meta;
type Story = StoryObj<typeof Logo>;

export const Default: Story = {
  parameters: {
    docs: { description: { story: 'The logo at its default 100x100 size.' } },
  },
};

export const Small: Story = {
  args: { width: '48px', height: '48px' },
  parameters: {
    docs: { description: { story: 'Scaled down for use in a header or footer.' } },
  },
};

export const Large: Story = {
  args: { width: '200px', height: '200px' },
  parameters: {
    docs: { description: { story: 'Scaled up. Being SVG, it stays sharp at any size.' } },
  },
};

export const OnDarkBackground: Story = {
  render: (args) => (
    <div className="rounded-2xl bg-gray-800 p-8">
      <Logo {...args} />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'The mark carries its own white circle, so it stays legible on a dark surface.',
      },
    },
  },
};
