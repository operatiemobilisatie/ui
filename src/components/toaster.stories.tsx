import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { Toaster } from './toaster';
import * as Toast from './toast';
import { Button } from './button';

const meta = {
  title: 'Feedback/Toaster',
  component: Toaster,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Renders the toast queue. Wrap your app in `<Toast.Provider>`, mount this once inside it, then call `Toast.useToastManager().add()` from any component below the provider. The provider is no longer baked into Toaster: Base UI keeps the queue in React context, so anything that pushes a toast has to sit *under* the provider, and a Toaster that owned it would put every caller outside.',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Toaster>;

export default meta;
type Story = StoryObj<typeof Toaster>;

/*
 * `add` comes from a hook rather than a module-level import, so the button that
 * pushes a toast has to be a component under the provider. This is the whole
 * shape of the change from the old `toast({...})` helper.
 */
function ShowToastButton({
  children,
  variant,
  toast,
}: {
  children: React.ReactNode;
  variant?: React.ComponentProps<typeof Button>['variant'];
  toast: Parameters<ReturnType<typeof Toast.useToastManager>['add']>[0];
}) {
  const { add } = Toast.useToastManager();
  return (
    <Button variant={variant} onClick={() => add(toast)}>
      {children}
    </Button>
  );
}

export const Default: Story = {
  render: () => (
    <Toast.Provider>
      <div className="p-8">
        <ShowToastButton
          toast={{
            title: 'Registration saved',
            description: 'Twelve new volunteers were added to the roster.',
          }}
        >
          Show toast
        </ShowToastButton>
        <Toaster />
      </div>
    </Toast.Provider>
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
    <Toast.Provider>
      <div className="p-8">
        <ShowToastButton
          variant="destructive"
          toast={{
            type: 'destructive',
            title: 'Could not save registration',
            description: 'The server rejected the request. Try again in a moment.',
          }}
        >
          Show error toast
        </ShowToastButton>
        <Toaster />
      </div>
    </Toast.Provider>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Show error toast' }));
    await waitFor(() => expect(document.body).toHaveTextContent('Could not save registration'));
  },
  parameters: {
    docs: {
      description: {
        story:
          "The Toast variant now travels as the record's `type`, which is Base UI's documented hook for conditional styling; Toaster maps it onto the same cva the parts have always used.",
      },
    },
  },
};
