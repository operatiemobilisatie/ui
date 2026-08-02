import * as React from 'react';

import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import * as AlertDialog from './alert-dialog';
import { Button } from './button';

const meta = {
  title: 'Feedback/AlertDialog',
  component: AlertDialog.Root,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A modal dialog that interrupts the user with important content and expects a response. Base UI has no Action or Cancel part: cancel is an AlertDialog.Close rendered as a Button, and the confirming action is an ordinary Button.',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof AlertDialog.Root>;

export default meta;
type Story = StoryObj<typeof AlertDialog.Root>;

export const Default: Story = {
  render: () => (
    <AlertDialog.Root>
      <AlertDialog.Trigger render={<Button variant="destructive" />}>Delete Account</AlertDialog.Trigger>
      <AlertDialog.Portal>
        <AlertDialog.Backdrop />
        <AlertDialog.Popup>
          <AlertDialog.Header>
            <AlertDialog.Title>Are you absolutely sure?</AlertDialog.Title>
            <AlertDialog.Description>
              This action cannot be undone. This will permanently delete your account
              and remove your data from our servers.
            </AlertDialog.Description>
          </AlertDialog.Header>
          <AlertDialog.Footer>
            <AlertDialog.Close render={<Button variant="outline-secondary" size="sm" />}>Cancel</AlertDialog.Close>
            <Button variant="destructive" size="sm">Delete Account</Button>
          </AlertDialog.Footer>
        </AlertDialog.Popup>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  ),
  parameters: {
    docs: {
      description: {
        story: 'A basic alert dialog with a destructive action.',
      },
    },
  },
};

export const WithCustomButtons: Story = {
  render: () => (
    <AlertDialog.Root>
      <AlertDialog.Trigger render={<Button />}>Save Changes</AlertDialog.Trigger>
      <AlertDialog.Portal>
        <AlertDialog.Backdrop />
        <AlertDialog.Popup>
          <AlertDialog.Header>
            <AlertDialog.Title>Save Changes?</AlertDialog.Title>
            <AlertDialog.Description>
              You have unsaved changes. Would you like to save them before leaving?
            </AlertDialog.Description>
          </AlertDialog.Header>
          <AlertDialog.Footer>
            <AlertDialog.Close render={<Button variant="outline-secondary" size="sm" />}>Don't Save</AlertDialog.Close>
            <Button variant="green" size="sm">Save Changes</Button>
          </AlertDialog.Footer>
        </AlertDialog.Popup>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  ),
  parameters: {
    docs: {
      description: {
        story: 'An alert dialog with custom styled buttons.',
      },
    },
  },
};

export const WithLongContent: Story = {
  render: () => (
    <AlertDialog.Root>
      <AlertDialog.Trigger render={<Button variant="outline" />}>Terms & Conditions</AlertDialog.Trigger>
      <AlertDialog.Portal>
        <AlertDialog.Backdrop />
        <AlertDialog.Popup>
          <AlertDialog.Header>
            <AlertDialog.Title>Terms of Service</AlertDialog.Title>
            <AlertDialog.Description className="max-h-[300px] overflow-y-auto">
              <div className="space-y-4">
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
                <p>Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
                <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</p>
                <p>Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
              </div>
              <div className="space-y-4">
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
                <p>Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
                <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</p>
                <p>Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
              </div>
              <div className="space-y-4">
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
                <p>Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
                <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</p>
                <p>Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
              </div>
              <div className="space-y-4">
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
                <p>Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
                <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</p>
                <p>Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
              </div>
            </AlertDialog.Description>
          </AlertDialog.Header>
          <AlertDialog.Footer>
            <AlertDialog.Close render={<Button variant="outline-secondary" size="sm" />}>Decline</AlertDialog.Close>
            <Button size="sm">Accept</Button>
          </AlertDialog.Footer>
        </AlertDialog.Popup>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  ),
  parameters: {
    docs: {
      description: {
        story: 'An alert dialog with scrollable content.',
      },
    },
  },
};
/*
 * The stories above only screenshot the closed trigger. This one opens the
 * dialog so the backdrop, popup and both footer buttons are covered.
 */
export const Opened: Story = {
  render: () => (
    <AlertDialog.Root>
      <AlertDialog.Trigger render={<Button variant="destructive" />}>Delete Account</AlertDialog.Trigger>
      <AlertDialog.Portal>
        <AlertDialog.Backdrop />
        <AlertDialog.Popup>
          <AlertDialog.Header>
            <AlertDialog.Title>Are you absolutely sure?</AlertDialog.Title>
            <AlertDialog.Description>
              This action cannot be undone. This will permanently delete your account and remove your
              data from our servers.
            </AlertDialog.Description>
          </AlertDialog.Header>
          <AlertDialog.Footer>
            <AlertDialog.Close render={<Button variant="outline-secondary" size="sm" />}>
              Cancel
            </AlertDialog.Close>
            <Button variant="destructive" size="sm">
              Delete Account
            </Button>
          </AlertDialog.Footer>
        </AlertDialog.Popup>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Delete Account' }));
    await waitFor(() => expect(within(document.body).getByRole('alertdialog')).toBeVisible());
  },
  parameters: {
    docs: {
      description: {
        story: 'Opened by the play function. Covers the Close-as-cancel and the plain action Button, which the closed stories never render.',
      },
    },
  },
};
