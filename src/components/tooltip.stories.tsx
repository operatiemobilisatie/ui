import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './tooltip';
import { Button } from './button';

const meta = {
  title: 'Data Display/Tooltip',
  component: Tooltip,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A floating label shown on hover or focus. Wrap your app (or the story) in a TooltipProvider once, then use Tooltip / TooltipTrigger / TooltipContent per instance.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    open: {
      control: 'boolean',
      description: 'Controls visibility. Leave undefined to let hover and focus drive it.',
    },
    delayDuration: {
      control: 'number',
      description: 'Milliseconds to wait before opening on hover.',
    },
  },
} satisfies Meta<typeof Tooltip>;

export default meta;
type Story = StoryObj<typeof Tooltip>;

/*
 * The stories below force `open` rather than driving hover in a play function.
 * A hover-opened tooltip animates in and repositions, which makes the frame the
 * screenshot lands on depend on timing. An open tooltip is already settled.
 */
export const Default: Story = {
  render: (args) => (
    <TooltipProvider>
      <Tooltip {...args} open>
        <TooltipTrigger asChild>
          <Button variant="outline">Hover me</Button>
        </TooltipTrigger>
        <TooltipContent>Sends the form without saving a draft</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  ),
  parameters: {
    docs: { description: { story: 'A tooltip above its trigger, shown open.' } },
  },
};

export const Sides: Story = {
  render: () => (
    <TooltipProvider>
      <div className="grid grid-cols-2 gap-16 p-16">
        {(['top', 'right', 'bottom', 'left'] as const).map((side) => (
          <Tooltip key={side} open>
            <TooltipTrigger asChild>
              <Button variant="outline" size="sm">
                {side}
              </Button>
            </TooltipTrigger>
            <TooltipContent side={side}>Placed on the {side}</TooltipContent>
          </Tooltip>
        ))}
      </div>
    </TooltipProvider>
  ),
  parameters: {
    docs: { description: { story: 'The four placements available through the side prop.' } },
  },
};

export const OpensOnHover: Story = {
  render: () => (
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline">Hover me</Button>
        </TooltipTrigger>
        <TooltipContent>Opened by the play function</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.hover(canvas.getByRole('button', { name: 'Hover me' }));
    // Tooltip content is portalled to <body>, so query the document, not the canvas.
    await waitFor(() => expect(document.body).toHaveTextContent('Opened by the play function'));
  },
  parameters: {
    docs: {
      description: {
        story:
          'Exercises the real hover path with delayDuration 0. This is the story that would catch a broken trigger.',
      },
    },
  },
};
