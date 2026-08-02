import * as React from 'react';

import type { Meta, StoryObj } from '@storybook/react-vite';
import * as Alert from './alert';
import { InfoIcon, AlertCircleIcon, CheckCircleIcon } from '../story-icons';

const meta = {
  title: 'Feedback/Alert',
  component: Alert.Root,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'An alert component that provides contextual feedback messages for user actions.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'destructive', 'success', 'info', 'warning'],
      description: 'The visual style of the alert',
      table: {
        defaultValue: { summary: 'default' },
      },
    },
  },
} satisfies Meta<typeof Alert.Root>;

export default meta;
type Story = StoryObj<typeof Alert.Root>;

export const Default: Story = {
  render: (args) => (
    <Alert.Root variant={args.variant} className="w-[400px]">
      <Alert.Title>Information</Alert.Title>
      <Alert.Description>
        This is a default alert message providing neutral information to the user.
      </Alert.Description>
    </Alert.Root>
  ),
  parameters: {
    docs: {
      description: {
        story: 'The default alert style, used for general information messages.',
      },
    },
  },
};

export const DefaultWithIcon: Story = {
  render: (args) => (
    <Alert.Root variant={args.variant} className="w-[400px]">
      <InfoIcon />
      <Alert.Title>Information</Alert.Title>
      <Alert.Description>
        This is a default alert message providing neutral information to the user.
      </Alert.Description>
    </Alert.Root>
  ),
  parameters: {
    docs: {
      description: {
        story: 'An alert with an icon.',
      },
    },
  },
};

export const Destructive: Story = {
  render: () => (
    <Alert.Root variant="destructive" className="w-[400px]">
      <Alert.Title>Error</Alert.Title>
      <Alert.Description>
        Something went wrong! Please try again later.
      </Alert.Description>
    </Alert.Root>
  ),
  parameters: {
    docs: {
      description: {
        story: 'A destructive alert style, used for error messages and warnings.',
      },
    },
  },
};

export const Success: Story = {
  render: () => (
    <Alert.Root variant="success" className="w-[400px]">
      <Alert.Title>Success</Alert.Title>
      <Alert.Description>
        Your changes have been saved successfully!
      </Alert.Description>
    </Alert.Root>
  ),
  parameters: {
    docs: {
      description: {
        story: 'A success alert style, used for successful operation messages.',
      },
    },
  },
};

export const WithoutTitle: Story = {
  render: () => (
    <Alert.Root className="w-[400px]">
      <Alert.Description>
        A simple alert message without a title.
      </Alert.Description>
    </Alert.Root>
  ),
  parameters: {
    docs: {
      description: {
        story: 'An alert without a title, for simpler messages.',
      },
    },
  },
}; 