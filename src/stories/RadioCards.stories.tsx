import * as React from 'react';

import type { Meta, StoryObj } from '@storybook/react';
import { RadioCards, RadioCardsItem } from '../components/radio-cards';

const meta = {
  title: 'Form/RadioCards',
  component: RadioCards,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'An expandable accordion component that can contain multiple items with headers and content.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    orientation: {
      control: 'select',
      options: ['horizontal', 'vertical'],
      description: 'Whether the display options horizontal or vertical',
      table: {
        defaultValue: { summary: 'horizontal' },
      },
    },
  },
  args: {
    orientation: 'horizontal',
  },
} satisfies Meta<typeof RadioCards>;

export default meta;
type Story = StoryObj<typeof RadioCards>;

export const Default: Story = {
  render: (args) => (
    <RadioCards className="w-[400px] flex flex-col gap-y-2" {...args}>
      <RadioCardsItem value="10">
        €10
      </RadioCardsItem>
      <RadioCardsItem value="20">
        €20
      </RadioCardsItem>
      <RadioCardsItem value="30">
        €30
      </RadioCardsItem>
    </RadioCards>
  ),
  parameters: {
    docs: {
      description: {
        story: 'A basic accordion with multiple items that can be expanded and collapsed.',
      },
    },
  },
};