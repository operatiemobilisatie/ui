import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import * as Toast from './toast';

const meta = {
  title: 'Feedback/Toast',
  component: Toast.Root,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'A transient message anchored to the corner of the screen. These are the low-level parts; for the usual case reach for Toaster and `Toast.useToastManager()` instead, which manage the queue for you. Note that a toast has no `open` prop any more -- it exists because something called `add()`, and `Toast.Root` takes the resulting record as its `toast` prop.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'success', 'info', 'destructive'],
      description: 'The colour treatment.',
    },
  },
  args: {
    variant: 'default',
  },
} satisfies Meta<typeof Toast.Root>;

export default meta;
type Story = StoryObj<typeof Toast.Root>;

/*
 * Base UI has no literal open toast to render, so the stories seed the queue on
 * mount instead. Adding with a fixed `id` makes it idempotent -- Base UI updates
 * a toast in place when the id already exists -- which keeps a double-invoked
 * effect (StrictMode, or a Storybook remount) from stacking two copies.
 *
 * `timeout: 0` is load-bearing for the screenshots, exactly as
 * `duration={Infinity}` was: the default 5s auto-dismiss would otherwise race
 * the capture.
 */
function Seed({
  title,
  description,
  type,
}: {
  title: React.ReactNode;
  description?: React.ReactNode;
  type?: string;
}) {
  const { add } = Toast.useToastManager();
  React.useEffect(() => {
    add({ id: 'story', title, description, type, timeout: 0 });
  }, [add, title, description, type]);
  return null;
}

function List({ withAction }: { withAction?: boolean }) {
  const { toasts } = Toast.useToastManager();
  return (
    <React.Fragment>
      {toasts.map((toast) => (
        <Toast.Root key={toast.id} toast={toast} variant={toast.type as Toast.Variant | undefined}>
          <Toast.Content>
            <Toast.Title />
            <Toast.Description />
          </Toast.Content>
          {withAction && <Toast.Action>Undo</Toast.Action>}
          <Toast.Close />
        </Toast.Root>
      ))}
    </React.Fragment>
  );
}

const render = (args: React.ComponentProps<typeof Toast.Root>) => (
  <Toast.Provider>
    <Seed
      title="Registration saved"
      description="Twelve new volunteers were added to the roster."
      type={args.variant ?? undefined}
    />
    <Toast.Portal>
      <Toast.Viewport>
        <List />
      </Toast.Viewport>
    </Toast.Portal>
  </Toast.Provider>
);

export const Default: Story = { render };

export const Success: Story = {
  args: { variant: 'success' },
  render,
  parameters: {
    docs: { description: { story: 'For a completed action.' } },
  },
};

export const Info: Story = {
  args: { variant: 'info' },
  render,
  parameters: {
    docs: { description: { story: 'For neutral, non-urgent information.' } },
  },
};

export const Destructive: Story = {
  args: { variant: 'destructive' },
  render,
  parameters: {
    docs: { description: { story: 'For failures and destructive outcomes.' } },
  },
};

export const WithAction: Story = {
  render: (args) => (
    <Toast.Provider>
      <Seed
        title="Volunteer removed"
        description="Anna Visser was removed from the roster."
        type={args.variant ?? undefined}
      />
      <Toast.Portal>
        <Toast.Viewport>
          <List withAction />
        </Toast.Viewport>
      </Toast.Portal>
    </Toast.Provider>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Toast.Action adds a single button. Radix required an `altText` here for the screen-reader announcement; Base UI drops it and announces the title and description through the viewport live region instead. Composed by hand the button takes children directly, as below; driven from the queue it comes from `actionProps` in the add() options.',
      },
    },
  },
};

export const TitleOnly: Story = {
  render: (args) => (
    <Toast.Provider>
      <Seed title="Changes saved" type={args.variant ?? undefined} />
      <Toast.Portal>
        <Toast.Viewport>
          <List />
        </Toast.Viewport>
      </Toast.Portal>
    </Toast.Provider>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'The description is optional. `Toast.Description` renders `null` rather than an empty element when the record has none, so the grid does not gain a row.',
      },
    },
  },
};
