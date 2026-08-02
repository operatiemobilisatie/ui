import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  Toast,
  ToastAction,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from './toast';

const meta = {
  title: 'Feedback/Toast',
  component: Toast,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'A transient message anchored to the corner of the screen. These are the low-level parts; for the usual case reach for Toaster and the `toast()` helper instead, which manage the queue for you.',
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
    open: {
      control: 'boolean',
      description: 'Whether the toast is shown.',
    },
  },
  args: {
    variant: 'default',
  },
} satisfies Meta<typeof Toast>;

export default meta;
type Story = StoryObj<typeof Toast>;

/*
 * duration={Infinity} is load-bearing for the screenshots: the default duration
 * dismisses the toast after a few seconds, which would race the capture.
 */
const render = (args: React.ComponentProps<typeof Toast>) => (
  <ToastProvider duration={Infinity}>
    <Toast {...args} open>
      <div className="grid gap-1">
        <ToastTitle>Registration saved</ToastTitle>
        <ToastDescription>Twelve new volunteers were added to the roster.</ToastDescription>
      </div>
      <ToastClose />
    </Toast>
    <ToastViewport />
  </ToastProvider>
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
    <ToastProvider duration={Infinity}>
      <Toast {...args} open>
        <div className="grid gap-1">
          <ToastTitle>Volunteer removed</ToastTitle>
          <ToastDescription>Anna Visser was removed from the roster.</ToastDescription>
        </div>
        <ToastAction altText="Undo removing Anna Visser">Undo</ToastAction>
        <ToastClose />
      </Toast>
      <ToastViewport />
    </ToastProvider>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'ToastAction adds a single button. altText is required: it is what a screen reader announces as the available action.',
      },
    },
  },
};

export const TitleOnly: Story = {
  render: (args) => (
    <ToastProvider duration={Infinity}>
      <Toast {...args} open>
        <ToastTitle>Changes saved</ToastTitle>
        <ToastClose />
      </Toast>
      <ToastViewport />
    </ToastProvider>
  ),
  parameters: {
    docs: { description: { story: 'The description is optional.' } },
  },
};
