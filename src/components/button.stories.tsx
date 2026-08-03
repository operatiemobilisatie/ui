import * as React from "react"
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from './button';
import { PlusIcon } from '../story-icons';

const meta = {
  title: 'Form/Button',
  component: Button,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A versatile button component that supports multiple variants and sizes. Use it to trigger actions, submit forms, or navigate between pages.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'secondary', 'outline', 'outline-secondary', 'green', 'blue', 'orange', 'aqua', 'destructive', 'ghost', 'link'],
      description: 'The visual style of the button',
      table: {
        defaultValue: { summary: 'default' },
      },
    },
    size: {
      control: 'select',
      options: ['default', 'sm', 'lg', 'icon', 'sm-icon', 'lg-icon'],
      description: 'The size of the button',
      table: {
        defaultValue: { summary: 'default' },
      },
    },
    children: {
      control: 'text',
      description: 'The content of the button',
      table: {
        defaultValue: { summary: '' },
      },
    },
    render: {
      control: false,
      description:
        'A React element to render instead of the default <button>, e.g. render={<a href="/give" />}. Replaces the v2 asChild prop.',
    },
  },
  args: {  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: {
    variant: "default",
    size: "default",
    children: 'Click me',
  },
  parameters: {
    docs: {
      description: {
        story: 'The primary button, used for the most important actions.',
      },
    },
  },
};

export const PrimaryWithIcon: Story = {
  args: {
    variant: 'default',
    size: 'default',
    children: (
      <>
        <PlusIcon className="mr-2" />
        Add Item
      </>
    ),
  },
  parameters: {
    docs: {
      description: {
        story: 'Button with an icon and text, providing visual context alongside the label.',
      },
    },
  },
};

export const Secondary: Story = {
  args: {
    variant: "secondary",
    children: 'Click me',
  },
  parameters: {
    docs: {
      description: {
        story: 'A secondary button, used for less important actions.',
      },
    },
  },
};

export const Outline: Story  = {
  args: {
    variant: "outline",
    children: 'Click me',
  },
  parameters: {
    docs: {
      description: {
        story: 'An outline button, used for less important actions.',
      },
    },
  },
};

export const Destructive: Story  = {
  args: {
    variant: "destructive",
    children: 'Click me',
  },
  parameters: {
    docs: {
      description: {
        story: 'A destructive button, used for destructive actions.',
      },
    },
  },
};

export const Ghost: Story  = {
  args: {
    variant: "ghost",
    children: 'Click me',
  },
  parameters: {
    docs: {
      description: {
        story: 'A ghost button, used for less important actions.',
      },
    },
  },
};

export const Link: Story = {
  args: {
    variant: "link",
    children: 'Click me',
  },
  parameters: {
    docs: {
      description: {
        story: 'A link button, used for navigation.',
      },
    },
  },
};

export const Large: Story = {
  args: {
    size: 'lg',
    children: 'Click me',
  },
  parameters: {
    docs: {
      description: {
        story: 'A large button, used for larger actions.',
      },
    },
  },
};

export const Small: Story = {
  args: {
    size: 'sm',
    children: 'Click me',
  },
  parameters: {
    docs: {
      description: {
        story: 'A small button, used for smaller actions.',
      },
    },
  },
};

export const Icon: Story = {
  args: {
    size: 'icon',
    children: <PlusIcon />,
    'aria-label': 'Add',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Icon-only button, always remains an exact same size circle. The icon is aria-hidden, so the accessible name has to come from an `aria-label` on the button itself.',
      },
    },
  },
};

export const IconSmall: Story = {
  args: {
    size: 'sm-icon',
    children: <PlusIcon />,
    'aria-label': 'Add',
  },
  parameters: {
    docs: {
      description: {
        story: 'An icon-only button with a small size.',
      },
    },
  },
};

export const IconLarge: Story = {
  args: {
    size: 'lg-icon',
    children: <PlusIcon />,
    'aria-label': 'Add',
  },
  parameters: {
    docs: {
      description: {
        story: 'An icon-only button with a large size.',
      },
    },
  },
};
