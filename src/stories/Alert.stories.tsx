import * as React from 'react';

import type { Meta, StoryObj } from '@storybook/react';
import { Alert, AlertTitle, AlertDescription } from '../components/alert';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleInfo, faCircleExclamation, faCircleCheck } from '@fortawesome/free-solid-svg-icons';
import type { IconProp } from '@fortawesome/fontawesome-svg-core';

const meta = {
  title: 'Feedback/Alert',
  component: Alert,
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
      options: ['default', 'destructive', 'success'],
      description: 'The visual style of the alert',
      table: {
        defaultValue: { summary: 'default' },
      },
    },
  },
} satisfies Meta<typeof Alert>;

export default meta;
type Story = StoryObj<typeof Alert>;

export const Default: Story = {
  render: (args) => (
    <Alert variant={args.variant} className="w-[400px]">
      <AlertTitle>Information</AlertTitle>
      <AlertDescription>
        This is a default alert message providing neutral information to the user.
      </AlertDescription>
    </Alert>
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
    <Alert variant={args.variant} className="w-[400px]">
      <FontAwesomeIcon icon={faCircleInfo as IconProp} />
      <AlertTitle>Information</AlertTitle>
      <AlertDescription>
        This is a default alert message providing neutral information to the user.
      </AlertDescription>
    </Alert>
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
    <Alert variant="destructive" className="w-[400px]">
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>
        Something went wrong! Please try again later.
      </AlertDescription>
    </Alert>
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
    <Alert variant="success" className="w-[400px]">
      <AlertTitle>Success</AlertTitle>
      <AlertDescription>
        Your changes have been saved successfully!
      </AlertDescription>
    </Alert>
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
    <Alert className="w-[400px]">
      <AlertDescription>
        A simple alert message without a title.
      </AlertDescription>
    </Alert>
  ),
  parameters: {
    docs: {
      description: {
        story: 'An alert without a title, for simpler messages.',
      },
    },
  },
}; 