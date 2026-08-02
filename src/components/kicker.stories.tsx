import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Kicker } from './kicker';

const meta = {
  title: 'Data Display/Kicker',
  component: Kicker,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A short uppercase eyebrow line that sits above a heading. Renders a span by default; pass `as` to change the element.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    children: {
      control: 'text',
      description: 'The kicker text.',
    },
    as: {
      control: 'text',
      description: 'The element or component to render as. Defaults to span.',
    },
    className: {
      control: 'text',
      description: 'Extra classes, appended after the built-in ones.',
    },
  },
  args: {
    children: 'Our mission',
  },
} satisfies Meta<typeof Kicker>;

export default meta;
type Story = StoryObj<typeof Kicker>;

export const Default: Story = {
  parameters: {
    docs: { description: { story: 'The default kicker, rendered as a span.' } },
  },
};

export const AboveHeading: Story = {
  render: (args) => (
    <div className="max-w-md">
      <Kicker {...args} className="text-primary" />
      <h2 className="font-roboto-slab text-3xl font-medium">Bringing help where it is needed</h2>
    </div>
  ),
  parameters: {
    docs: { description: { story: 'How a kicker is normally used: coloured, directly above a heading.' } },
  },
};

export const AsParagraph: Story = {
  args: { as: 'p', children: 'Field report' },
  parameters: {
    docs: { description: { story: 'Use `as` when the kicker needs to be a block-level element.' } },
  },
};
