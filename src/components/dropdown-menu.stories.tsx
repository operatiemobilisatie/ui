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
          'A menu of actions opened by a button. Compose Portal, Positioner, and Popup; placement props belong to Positioner and visual props belong to Popup.',
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

/*
 * Every story that wants a visible menu opens it by clicking, never by
 * `defaultOpen`. That is not a stylistic preference -- `defaultOpen` made the
 * whole Storybook unusable, in two compounding ways:
 *
 *   Base UI's Menu.Root defaults to `modal: true` (as Radix's DropdownMenu did),
 *   and a modal menu renders a full-viewport `position: fixed; inset: 0`
 *   backdrop, cut out only around its own trigger. Four always-open stories on
 *   the autodocs page meant four of those stacked over the page, so nothing on
 *   it could be clicked.
 *
 *   And the Positioner restores Radix's `positionMethod: "fixed"`, so the popups
 *   are pinned to the viewport rather than to the page. Scrolling the docs page
 *   left them hanging in front of whatever happened to be underneath.
 *
 * A play function has neither problem: Storybook does not run play functions in
 * docs (`docs.autoplay` is false by default), so the docs page renders closed
 * menus and stays interactive, while the canvas -- which is what the visual
 * regression suite screenshots -- still gets an open one. STORY_RENDERED fires
 * after play() resolves, so the capture is never of the pre-click frame.
 */
const openMenu =
  (trigger: string, expected: string): NonNullable<Story['play']> =>
  async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: trigger }));
    // Menu content is portalled to <body>, so assert against the document.
    await waitFor(() => expect(document.body).toHaveTextContent(expected));
  };

export const Default: Story = {
  render: (args) => (
    <DropdownMenu.Root {...args}>
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
  play: openMenu('Open menu', 'My account'),
  parameters: {
    docs: {
      description: {
        story: 'A labelled menu with a disabled item.',
      },
    },
  },
};

export const WithShortcuts: Story = {
  render: (args) => (
    <DropdownMenu.Root {...args}>
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
  play: openMenu('Open menu', 'Duplicate'),
  parameters: {
    docs: { description: { story: 'DropdownMenu.Shortcut pushes a key hint to the trailing edge.' } },
  },
};

export const WithCheckboxItems: Story = {
  render: (args) => (
    <DropdownMenu.Root {...args}>
      <DropdownMenu.Trigger render={<Button variant="outline" />}>Columns</DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Positioner>
          <DropdownMenu.Popup className="w-56">
            <DropdownMenu.Group>
              <DropdownMenu.GroupLabel>Visible columns</DropdownMenu.GroupLabel>
            </DropdownMenu.Group>
            <DropdownMenu.Separator />
            <DropdownMenu.CheckboxItem defaultChecked>Name</DropdownMenu.CheckboxItem>
            <DropdownMenu.CheckboxItem defaultChecked>Region</DropdownMenu.CheckboxItem>
            <DropdownMenu.CheckboxItem defaultChecked={false}>Created at</DropdownMenu.CheckboxItem>
          </DropdownMenu.Popup>
        </DropdownMenu.Positioner>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  ),
  play: openMenu('Columns', 'Visible columns'),
  parameters: {
    docs: { description: { story: 'Checkbox items show a tick in the leading gutter when checked.' } },
  },
};

export const WithRadioItems: Story = {
  render: (args) => (
    <DropdownMenu.Root {...args}>
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
  play: openMenu('Sort by', 'Date added'),
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
  play: openMenu('Open menu', 'Profile'),
  parameters: {
    docs: {
      description: {
        story: 'The plainest menu there is: two items, nothing else. Every story here now opens by clicking.',
      },
    },
  },
};

/*
 * Submenus need their own regression coverage because the parent menu stories
 * do not exercise submenu positioning or interaction. The screenshot protects
 * rendering while behavior tests cover keyboard and pointer controls.
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
          'A submenu opened from the keyboard so both popups are visible. Submenus use SubmenuRoot, SubmenuTrigger, Positioner, and the regular Popup part.',
      },
    },
  },
};
