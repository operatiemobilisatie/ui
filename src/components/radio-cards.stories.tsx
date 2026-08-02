import * as React from 'react';

import type { Meta, StoryObj } from '@storybook/react-vite';
import * as RadioCards from './radio-cards';

const meta = {
  title: 'Form/RadioCards',
  component: RadioCards.Root,
  subcomponents: { 'RadioCards.Item': RadioCards.Item as React.ComponentType<unknown> },
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A radio group rendered as selectable cards. Each Item takes a value; the Root lays them out with flex.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    // Base UI's RadioGroup has no `orientation` prop -- lay the cards out with
    // flex direction on the Root instead.
    className: {
      control: 'text',
      description: 'Classes on the Root. Use flex-row or flex-col to set direction.',
    },
  },
} satisfies Meta<typeof RadioCards.Root>;

export default meta;
type Story = StoryObj<typeof RadioCards.Root>;

export const Default: Story = {
  render: (args) => (
    <RadioCards.Root className="w-[400px] flex flex-col gap-y-2" {...args}>
      <RadioCards.Item value="10">
        €10
      </RadioCards.Item>
      <RadioCards.Item value="20">
        €20
      </RadioCards.Item>
      <RadioCards.Item value="30">
        €30
      </RadioCards.Item>
    </RadioCards.Root>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Three donation amounts laid out vertically via flex-col on the Root.',
      },
    },
  },
};