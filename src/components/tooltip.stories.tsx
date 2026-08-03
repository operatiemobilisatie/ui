import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import * as Tooltip from './tooltip';
import { Button } from './button';

const meta = {
  title: 'Data Display/Tooltip',
  component: Tooltip.Root,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A floating label shown on hover or focus. Wrap your app (or the story) in a Tooltip.Provider once, then use Tooltip.Root / Trigger / Portal / Positioner / Popup per instance. Placement lives on the Positioner; the Popup is only the styled box.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    open: {
      control: 'boolean',
      description: 'Controls visibility. Leave undefined to let hover and focus drive it.',
    },
    // Radix's delayDuration is gone from the root: the open delay is now `delay`
    // on Tooltip.Provider (shared by a group) or on an individual Tooltip.Trigger.
    disabled: {
      control: 'boolean',
      description: 'Prevents the tooltip from opening at all.',
    },
  },
} satisfies Meta<typeof Tooltip.Root>;

export default meta;
type Story = StoryObj<typeof Tooltip.Root>;

/*
 * The stories below force `open` rather than driving hover in a play function.
 * A hover-opened tooltip animates in and repositions, which makes the frame the
 * screenshot lands on depend on timing. An open tooltip is already settled.
 */
export const Default: Story = {
  render: (args) => (
    <Tooltip.Provider>
      <Tooltip.Root {...args} defaultOpen>
        <Tooltip.Trigger render={<Button variant="outline" />}>Hover me</Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Positioner>
            <Tooltip.Popup>Sends the form without saving a draft</Tooltip.Popup>
          </Tooltip.Positioner>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  ),
  parameters: {
    docs: { description: { story: 'A tooltip above its trigger, shown open.' } },
  },
};

export const Sides: Story = {
  render: () => (
    <Tooltip.Provider>
      <div className="grid grid-cols-2 gap-16 p-16">
        {(['top', 'right', 'bottom', 'left'] as const).map((side) => (
          <Tooltip.Root key={side} defaultOpen>
            <Tooltip.Trigger render={<Button variant="outline" size="sm" />}>{side}</Tooltip.Trigger>
            <Tooltip.Portal>
              <Tooltip.Positioner side={side}>
                <Tooltip.Popup>Placed on the {side}</Tooltip.Popup>
              </Tooltip.Positioner>
            </Tooltip.Portal>
          </Tooltip.Root>
        ))}
      </div>
    </Tooltip.Provider>
  ),
  parameters: {
    docs: { description: { story: 'The four placements available through the side prop.' } },
  },
};

export const OpensOnHover: Story = {
  render: () => (
    <Tooltip.Provider delay={0}>
      <Tooltip.Root>
        <Tooltip.Trigger render={<Button variant="outline" />}>Hover me</Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Positioner>
            <Tooltip.Popup>Opened by the play function</Tooltip.Popup>
          </Tooltip.Positioner>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole('button', { name: 'Hover me' });
    /*
     * Leaving and re-entering is not decoration. Base UI opens the tooltip from a
     * native `mouseenter` listener but decides whether the pointer is mouse-like
     * from React's synthetic `onPointerEnter`. user-event dispatches the whole
     * pointer burst in a single task, so on the very first hover the native
     * listener runs before React has recorded a pointer type and the hover is
     * dropped. The second pass has one. A real user never hits this -- the browser
     * has been firing pointer events at the page long before they reach a trigger.
     */
    await userEvent.hover(trigger);
    await userEvent.unhover(trigger);
    await userEvent.hover(trigger);
    // Tooltip content is portalled to <body>, so query the document, not the canvas.
    await waitFor(() => expect(document.body).toHaveTextContent('Opened by the play function'));
  },
  parameters: {
    docs: {
      description: {
        story:
          'Exercises the real hover path with delay 0. This is the story that would catch a broken trigger.',
      },
    },
  },
};
