import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import * as Toast from './toast';
import { Button } from './button';

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
 * Toasts are pushed by a button, not seeded in an effect on mount.
 *
 * Seeding on mount meant every story on the autodocs page fired its toast the
 * moment the page loaded, and since they all portal to the same fixed corner
 * they arrived as one pile of six unrelated messages with no way to tell which
 * story owned which. Storybook does not run play functions in docs
 * (`docs.autoplay` is false by default), so a button plus a play function shows
 * nothing until you ask for it there, while the canvas -- what the visual
 * regression suite screenshots -- still gets its toast automatically.
 *
 * `timeout: 0` is load-bearing for those screenshots, exactly as
 * `duration={Infinity}` was: the default 5s auto-dismiss would otherwise race
 * the capture.
 */
function ShowToastButton({
  label = 'Show toast',
  title,
  description,
  type,
  count = 1,
}: {
  label?: string;
  title: string;
  description?: React.ReactNode;
  type?: string;
  count?: number;
}) {
  const { add } = Toast.useToastManager();
  return (
    <Button
      variant="outline"
      onClick={() => {
        for (let i = 0; i < count; i += 1) {
          add({
            title: count > 1 ? `${title} ${i + 1}` : title,
            description,
            type,
            timeout: 0,
          });
        }
      }}
    >
      {label}
    </Button>
  );
}

function List({ withAction }: { withAction?: boolean }) {
  const { toasts } = Toast.useToastManager();
  return (
    <React.Fragment>
      {toasts.map((toast) => (
        <Toast.Root key={toast.id} toast={toast} variant={toast.type as Toast.Variant | undefined}>
          {/* Content is the padded row and Title/Description share a wrapper
              inside it -- see the note in toast.tsx for why the nesting matters
              to the stack geometry. */}
          <Toast.Content>
            <div className="grid min-w-0 flex-1 gap-1">
              <Toast.Title />
              <Toast.Description />
            </div>
            {withAction && <Toast.Action>Undo</Toast.Action>}
          </Toast.Content>
          <Toast.Close />
        </Toast.Root>
      ))}
    </React.Fragment>
  );
}

const showToast = (label = 'Show toast', expected: string): NonNullable<Story['play']> =>
  async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: label }));
    // Toasts portal out of the canvas, so assert against the document.
    await waitFor(() => expect(document.body).toHaveTextContent(expected));
  };

const render = (args: React.ComponentProps<typeof Toast.Root>) => (
  <Toast.Provider>
    <div className="p-8">
      <ShowToastButton
        title="Registration saved"
        description="Twelve new volunteers were added to the roster."
        type={args.variant ?? undefined}
      />
    </div>
    <Toast.Portal>
      <Toast.Viewport>
        <List />
      </Toast.Viewport>
    </Toast.Portal>
  </Toast.Provider>
);

export const Default: Story = {
  render,
  play: showToast('Show toast', 'Registration saved'),
};

export const Success: Story = {
  args: { variant: 'success' },
  render,
  play: showToast('Show toast', 'Registration saved'),
  parameters: {
    docs: { description: { story: 'For a completed action.' } },
  },
};

export const Info: Story = {
  args: { variant: 'info' },
  render,
  play: showToast('Show toast', 'Registration saved'),
  parameters: {
    docs: { description: { story: 'For neutral, non-urgent information.' } },
  },
};

export const Destructive: Story = {
  args: { variant: 'destructive' },
  render,
  play: showToast('Show toast', 'Registration saved'),
  parameters: {
    docs: { description: { story: 'For failures and destructive outcomes.' } },
  },
};

export const WithAction: Story = {
  render: (args) => (
    <Toast.Provider>
      <div className="p-8">
        <ShowToastButton
          title="Volunteer removed"
          description="Anna Visser was removed from the roster."
          type={args.variant ?? undefined}
        />
      </div>
      <Toast.Portal>
        <Toast.Viewport>
          <List withAction />
        </Toast.Viewport>
      </Toast.Portal>
    </Toast.Provider>
  ),
  play: showToast('Show toast', 'Volunteer removed'),
  parameters: {
    docs: {
      description: {
        story:
          'Toast.Action adds a button. In hand-composed toasts it takes children directly; queue-managed toasts receive it through `actionProps` in the add() options.',
      },
    },
  },
};

export const TitleOnly: Story = {
  render: (args) => (
    <Toast.Provider>
      <div className="p-8">
        <ShowToastButton title="Changes saved" type={args.variant ?? undefined} />
      </div>
      <Toast.Portal>
        <Toast.Viewport>
          <List />
        </Toast.Viewport>
      </Toast.Portal>
    </Toast.Provider>
  ),
  play: showToast('Show toast', 'Changes saved'),
  parameters: {
    docs: {
      description: {
        story:
          'The description is optional. `Toast.Description` renders `null` rather than an empty element when the record has none, so the grid does not gain a row.',
      },
    },
  },
};

export const Stacked: Story = {
  render: (args) => (
    <Toast.Provider>
      <div className="p-8">
        <ShowToastButton
          label="Show three toasts"
          title="Registration saved"
          description="Twelve new volunteers were added to the roster."
          type={args.variant ?? undefined}
          count={3}
        />
      </div>
      <Toast.Portal>
        <Toast.Viewport>
          <List />
        </Toast.Viewport>
      </Toast.Portal>
    </Toast.Provider>
  ),
  play: showToast('Show three toasts', 'Registration saved 3'),
  parameters: {
    docs: {
      description: {
        story:
          'Several toasts collapse into a stack rather than filling the edge of the screen: each one behind the front sits 12px higher, 10% smaller and with its contents faded out. Hover or focus the stack and it fans out into a spaced list. `limit` on `Toast.Provider` caps how many are on screen at once and defaults to 3.',
      },
    },
  },
};
