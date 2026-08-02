import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import * as DropdownMenu from './dropdown-menu';
import { Button } from './button';

const meta = {
  title: 'Data Display/DropdownMenu',
  component: DropdownMenu.Root,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A menu of actions opened by a button. The content is portalled to the end of the document, so it is never clipped by an overflow-hidden ancestor. Radix\'s single Content is now Portal > Positioner > Popup: placement props live on the Positioner, styling on the Popup.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    open: {
      control: 'boolean',
      description: 'Controls visibility. Leave undefined to let the trigger drive it.',
    },
    modal: {
      control: 'boolean',
      description: 'When true, interaction outside the menu is blocked while it is open.',
    },
  },
} satisfies Meta<typeof DropdownMenu.Root>;

export default meta;
type Story = StoryObj<typeof DropdownMenu.Root>;

export const Default: Story = {
  render: (args) => (
    <DropdownMenu.Root {...args} defaultOpen>
      <DropdownMenu.Trigger render={<Button variant="outline" />}>Open menu</DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Positioner>
          <DropdownMenu.Popup className="w-56">
            {/* GroupLabel has to sit inside a Group: it labels that group via
                aria-labelledby, and Base UI throws if it cannot find one. */}
            <DropdownMenu.Group>
              <DropdownMenu.GroupLabel>My account</DropdownMenu.GroupLabel>
            </DropdownMenu.Group>
            <DropdownMenu.Separator />
            <DropdownMenu.Group>
              <DropdownMenu.Item>Profile</DropdownMenu.Item>
              <DropdownMenu.Item>Settings</DropdownMenu.Item>
              <DropdownMenu.Item disabled>Billing</DropdownMenu.Item>
            </DropdownMenu.Group>
            <DropdownMenu.Separator />
            <DropdownMenu.Item>Sign out</DropdownMenu.Item>
          </DropdownMenu.Popup>
        </DropdownMenu.Positioner>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  ),
  parameters: {
    docs: {
      description: {
        story: 'A labelled menu with a disabled item, shown open via defaultOpen.',
      },
    },
  },
};

export const WithShortcuts: Story = {
  render: (args) => (
    <DropdownMenu.Root {...args} defaultOpen>
      <DropdownMenu.Trigger render={<Button variant="outline" />}>Open menu</DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Positioner>
          <DropdownMenu.Popup className="w-56">
            <DropdownMenu.Item>
              New file
              <DropdownMenu.Shortcut>⌘N</DropdownMenu.Shortcut>
            </DropdownMenu.Item>
            <DropdownMenu.Item>
              Duplicate
              <DropdownMenu.Shortcut>⌘D</DropdownMenu.Shortcut>
            </DropdownMenu.Item>
            <DropdownMenu.Separator />
            <DropdownMenu.Item>
              Delete
              <DropdownMenu.Shortcut>⌫</DropdownMenu.Shortcut>
            </DropdownMenu.Item>
          </DropdownMenu.Popup>
        </DropdownMenu.Positioner>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  ),
  parameters: {
    docs: { description: { story: 'DropdownMenu.Shortcut pushes a key hint to the trailing edge.' } },
  },
};

export const WithCheckboxItems: Story = {
  render: (args) => (
    <DropdownMenu.Root {...args} defaultOpen>
      <DropdownMenu.Trigger render={<Button variant="outline" />}>Columns</DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Positioner>
          <DropdownMenu.Popup className="w-56">
            <DropdownMenu.Group>
              <DropdownMenu.GroupLabel>Visible columns</DropdownMenu.GroupLabel>
            </DropdownMenu.Group>
            <DropdownMenu.Separator />
            <DropdownMenu.CheckboxItem checked>Name</DropdownMenu.CheckboxItem>
            <DropdownMenu.CheckboxItem checked>Region</DropdownMenu.CheckboxItem>
            <DropdownMenu.CheckboxItem checked={false}>Created at</DropdownMenu.CheckboxItem>
          </DropdownMenu.Popup>
        </DropdownMenu.Positioner>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  ),
  parameters: {
    docs: { description: { story: 'Checkbox items show a tick in the leading gutter when checked.' } },
  },
};

export const WithRadioItems: Story = {
  render: (args) => (
    <DropdownMenu.Root {...args} defaultOpen>
      <DropdownMenu.Trigger render={<Button variant="outline" />}>Sort by</DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Positioner>
          <DropdownMenu.Popup className="w-56">
            <DropdownMenu.Group>
              <DropdownMenu.GroupLabel>Sort by</DropdownMenu.GroupLabel>
            </DropdownMenu.Group>
            <DropdownMenu.Separator />
            <DropdownMenu.RadioGroup value="name">
              <DropdownMenu.RadioItem value="name">Name</DropdownMenu.RadioItem>
              <DropdownMenu.RadioItem value="date">Date added</DropdownMenu.RadioItem>
              <DropdownMenu.RadioItem value="size">Size</DropdownMenu.RadioItem>
            </DropdownMenu.RadioGroup>
          </DropdownMenu.Popup>
        </DropdownMenu.Positioner>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  ),
  parameters: {
    docs: { description: { story: 'Radio items are mutually exclusive within a DropdownMenu.RadioGroup.' } },
  },
};

export const OpensOnClick: Story = {
  render: () => (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger render={<Button variant="outline" />}>Open menu</DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Positioner>
          <DropdownMenu.Popup className="w-56">
            <DropdownMenu.Item>Profile</DropdownMenu.Item>
            <DropdownMenu.Item>Settings</DropdownMenu.Item>
          </DropdownMenu.Popup>
        </DropdownMenu.Positioner>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Open menu' }));
    // Menu content is portalled to <body>, so assert against the document.
    await waitFor(() => expect(document.body).toHaveTextContent('Profile'));
  },
  parameters: {
    docs: {
      description: {
        story:
          'Exercises the real trigger rather than defaultOpen. This is the story that would catch a broken open interaction.',
      },
    },
  },
};

/*
 * The only story that renders a submenu. SubmenuRoot/SubmenuTrigger were
 * migrated in Phase 5.5 and nothing exercised them afterwards, so both the
 * screenshot suite and the behaviour suite were blind to them.
 *
 * Honest limitation of the baseline this story produces: every other PNG in the
 * suite was captured from the *Radix* rendering before a component was touched,
 * so a diff there means "the migration moved a pixel". This one is captured from
 * the Base UI rendering and has no Radix reference at all. It locks in the
 * current rendering from here on; it does not verify parity with v2.
 */
export const WithSubmenu: Story = {
  render: () => (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger render={<Button variant="outline" />}>Open menu</DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Positioner>
          <DropdownMenu.Popup className="w-56">
            <DropdownMenu.Item>Profile</DropdownMenu.Item>
            <DropdownMenu.SubmenuRoot>
              <DropdownMenu.SubmenuTrigger>Invite people</DropdownMenu.SubmenuTrigger>
              {/* A submenu reuses Portal > Positioner > Popup -- Base UI has no
                  separate SubContent part. Its Positioner defaults to
                  side="inline-end" / align="start" when the parent is a menu. */}
              <DropdownMenu.Portal>
                <DropdownMenu.Positioner>
                  <DropdownMenu.Popup className="w-48">
                    <DropdownMenu.Item>Email invite</DropdownMenu.Item>
                    <DropdownMenu.Item>Copy link</DropdownMenu.Item>
                  </DropdownMenu.Popup>
                </DropdownMenu.Positioner>
              </DropdownMenu.Portal>
            </DropdownMenu.SubmenuRoot>
            <DropdownMenu.Separator />
            <DropdownMenu.Item>Sign out</DropdownMenu.Item>
          </DropdownMenu.Popup>
        </DropdownMenu.Positioner>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Open menu' }));
    // Menu content is portalled to <body>, so assert against the document.
    await waitFor(() => expect(document.body).toHaveTextContent('Invite people'));

    /*
     * Keyboard rather than hover, deliberately. SubmenuTrigger defaults to
     * openOnHover with a 100ms rest delay and additionally gates on the parent
     * menu having seen a real mousemove, so a synthetic hover here is a race.
     * Two ArrowDowns walk past Profile onto the submenu trigger; ArrowRight
     * opens it in one deterministic step.
     */
    await userEvent.keyboard('{ArrowDown}{ArrowDown}{ArrowRight}');
    await waitFor(() => expect(document.body).toHaveTextContent('Email invite'));
  },
  parameters: {
    docs: {
      description: {
        story:
          'A submenu, opened from the keyboard so both popups are on screen. Radix\'s Sub/SubTrigger became SubmenuRoot/SubmenuTrigger, and the submenu reuses the same Popup part as its parent.',
      },
    },
  },
};
