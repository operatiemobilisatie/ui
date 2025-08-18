import * as React from 'react';

import type { Meta, StoryObj } from '@storybook/nextjs';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogClose
} from '../components/dialog';
import { Button } from '../components/button';
import { Input } from '../components/input';
import { Label } from '../components/label';
import { faCopy } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const meta = {
  title: 'Data Display/Dialog',
  component: Dialog,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A window overlaid on either the primary window or another dialog window, rendering the content underneath inert.',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Dialog>;

export default meta;
type Story = StoryObj<typeof Dialog>;

export const Default: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Share</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share link</DialogTitle>
          <DialogDescription>
            Anyone who has this link will be able to view this.
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center space-x-2">
          <div className="grid flex-1 gap-2">
            <Label htmlFor="link" className="sr-only">
              Link
            </Label>
            <Input
              id="link"
              displaySize="sm"
              defaultValue="https://ui.shadcn.com/docs/installation"
              readOnly
            />
          </div>
          <Button type="submit" size="sm-icon" className="px-3">
            <span className="sr-only">Copy</span>
            <FontAwesomeIcon icon={faCopy} />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  ),
  parameters: {
    docs: {
      description: {
        story: 'A basic dialog with a form like action.',
      },
    },
  },
};

export const WithCustomButtons: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger>
        <Button>Save Changes</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Save Changes?</DialogTitle>
          <DialogDescription>
            You have unsaved changes. Would you like to save them before leaving?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button size="sm" variant="outline-secondary">Don't Save</Button>
          <Button size="sm" variant="default">Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
  parameters: {
    docs: {
      description: {
        story: 'A dialog with custom styled buttons.',
      },
    },
  },
};

export const WithLongContent: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger>
        <Button variant="outline">Terms & Conditions</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Terms of Service</DialogTitle>
          <DialogDescription className="max-h-[300px] overflow-y-auto">
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
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  ),
  parameters: {
    docs: {
      description: {
        story: 'A dialog with scrollable content.',
      },
    },
  },
}; 