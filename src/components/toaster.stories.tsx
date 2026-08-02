import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { Toaster } from './toaster';
import { Button } from './button';
import { toast } from '../lib/use-toast';

const meta = {
  title: 'Feedback/Toaster',
  component: Toaster,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Renders the toast queue. Mount it once near the root of your app, then call `toast()` from anywhere to push a message. Note the queue holds one toast at a time.',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Toaster>;

export default meta;
type Story = StoryObj<typeof Toaster>;

export const Default: Story = {
  render: () => (
    <div className="p-8">
      <Button
        onClick={() =>
          toast({
            title: 'Registration saved',
            description: 'Twelve new volunteers were added to the roster.',
          })
        }
      >
        Show toast
      </Button>
      <Toaster />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Show toast' }));
    await waitFor(() => expect(document.body).toHaveTextContent('Registration saved'));
  },
  parameters: {
    docs: {
      description: {
        story: 'The play function clicks the button so the queued toast is visible in the frame.',
      },
    },
  },
};

export const Destructive: Story = {
  render: () => (
    <div className="p-8">
      <Button
        variant="destructive"
        onClick={() =>
          toast({
            variant: 'destructive',
            title: 'Could not save registration',
            description: 'The server rejected the request. Try again in a moment.',
          })
        }
      >
        Show error toast
      </Button>
      <Toaster />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Show error toast' }));
    await waitFor(() => expect(document.body).toHaveTextContent('Could not save registration'));
  },
  parameters: {
    docs: { description: { story: 'Any Toast variant can be passed straight through to `toast()`.' } },
  },
};
