import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from './dropdown-menu';
import { Button } from './button';

const meta = {
  title: 'Data Display/DropdownMenu',
  component: DropdownMenu,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A menu of actions opened by a button. The content is portalled to the end of the document, so it is never clipped by an overflow-hidden ancestor.',
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
} satisfies Meta<typeof DropdownMenu>;

export default meta;
type Story = StoryObj<typeof DropdownMenu>;

export const Default: Story = {
  render: (args) => (
    <DropdownMenu {...args} defaultOpen>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">Open menu</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>My account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>Profile</DropdownMenuItem>
          <DropdownMenuItem>Settings</DropdownMenuItem>
          <DropdownMenuItem disabled>Billing</DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Sign out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
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
    <DropdownMenu {...args} defaultOpen>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">Open menu</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuItem>
          New file
          <DropdownMenuShortcut>⌘N</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuItem>
          Duplicate
          <DropdownMenuShortcut>⌘D</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          Delete
          <DropdownMenuShortcut>⌫</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
  parameters: {
    docs: { description: { story: 'DropdownMenuShortcut pushes a key hint to the trailing edge.' } },
  },
};

export const WithCheckboxItems: Story = {
  render: (args) => (
    <DropdownMenu {...args} defaultOpen>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">Columns</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Visible columns</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuCheckboxItem checked>Name</DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem checked>Region</DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem checked={false}>Created at</DropdownMenuCheckboxItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
  parameters: {
    docs: { description: { story: 'Checkbox items show a tick in the leading gutter when checked.' } },
  },
};

export const WithRadioItems: Story = {
  render: (args) => (
    <DropdownMenu {...args} defaultOpen>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">Sort by</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Sort by</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup value="name">
          <DropdownMenuRadioItem value="name">Name</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="date">Date added</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="size">Size</DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
  parameters: {
    docs: { description: { story: 'Radio items are mutually exclusive within a DropdownMenuRadioGroup.' } },
  },
};

export const OpensOnClick: Story = {
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">Open menu</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuItem>Profile</DropdownMenuItem>
        <DropdownMenuItem>Settings</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
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
