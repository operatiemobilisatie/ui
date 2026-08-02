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
