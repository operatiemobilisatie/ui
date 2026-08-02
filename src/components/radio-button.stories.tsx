import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { RadioButton } from './radio-button';

const meta = {
  title: 'Form/RadioButton',
  component: RadioButton,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A single radio choice rendered as a clickable label wrapping a native input. Group several together by giving them the same `name`.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'outline'],
      description: 'default is borderless; outline draws a box that highlights when selected.',
    },
    size: {
      control: 'select',
      options: ['sm', 'default', 'lg'],
      description: 'The control height and padding.',
    },
    hideIndicator: {
      control: 'boolean',
      description: 'Hides the round indicator, leaving only the label text.',
    },
    children: {
      control: 'text',
      description: 'The visible label.',
    },
  },
  args: {
    variant: 'default',
    size: 'default',
    hideIndicator: false,
    children: 'Monthly',
  },
} satisfies Meta<typeof RadioButton>;

export default meta;
type Story = StoryObj<typeof RadioButton>;

export const Default: Story = {
  render: (args) => <RadioButton {...args} id="radiobutton-default" name="radiobutton-default-group" />,
  parameters: {
    docs: { description: { story: 'A single unselected radio button.' } },
  },
};

export const Outline: Story = {
  args: { variant: 'outline' },
  render: (args) => <RadioButton {...args} id="radiobutton-outline" name="radiobutton-outline-group" />,
  parameters: {
    docs: { description: { story: 'The outline variant boxes each option.' } },
  },
};

export const Group: Story = {
  render: (args) => (
    <div className="flex gap-x-3">
      <RadioButton {...args} id="radiobutton-group-monthly" name="radiobutton-group" defaultChecked>
        Monthly
      </RadioButton>
      <RadioButton {...args} id="radiobutton-group-quarterly" name="radiobutton-group">
        Quarterly
      </RadioButton>
      <RadioButton {...args} id="radiobutton-group-yearly" name="radiobutton-group">
        Yearly
      </RadioButton>
    </div>
  ),
  args: { variant: 'outline' },
  parameters: {
    docs: {
      description: {
        story: 'A shared `name` makes the browser treat these as one group. The first option is preselected.',
      },
    },
  },
};

export const WithoutIndicator: Story = {
  args: { variant: 'outline', hideIndicator: true },
  render: (args) => (
    <div className="flex gap-x-3">
      <RadioButton {...args} id="radiobutton-noind-monthly" name="radiobutton-noind" defaultChecked>
        Monthly
      </RadioButton>
      <RadioButton {...args} id="radiobutton-noind-yearly" name="radiobutton-noind">
        Yearly
      </RadioButton>
    </div>
  ),
  parameters: {
    docs: { description: { story: 'With hideIndicator the whole pill carries the selected state.' } },
  },
};

export const Sizes: Story = {
  render: (args) => (
    <div className="flex items-center gap-x-3">
      <RadioButton {...args} size="sm" id="radiobutton-size-sm" name="radiobutton-sizes">
        Small
      </RadioButton>
      <RadioButton {...args} size="default" id="radiobutton-size-default" name="radiobutton-sizes">
        Default
      </RadioButton>
      <RadioButton {...args} size="lg" id="radiobutton-size-lg" name="radiobutton-sizes">
        Large
      </RadioButton>
    </div>
  ),
  args: { variant: 'outline' },
  parameters: {
    docs: { description: { story: 'The three available sizes, side by side.' } },
  },
};
