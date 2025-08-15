import type { Meta, StoryObj } from '@storybook/react';
import { Badge } from '../components/badge';

const meta = {
  title: 'Data Display/Badge',
  component: Badge,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A badge is a small component that displays a label with a visual style.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'secondary', 'destructive', 'success', 'warning', 'info', 'outline-solid'],
      description: 'The visual style of the badge',
      table: {
        defaultValue: { summary: 'default' },
      },
    },
    size: {
      control: 'select',
      options: ['default', 'sm'],
      description: 'The size of the badge',
      table: {
        defaultValue: { summary: 'default' },
      },
    },
    children: {
      control: 'text',
      description: 'The content of the badge',
      table: {
        defaultValue: { summary: '' },
      },
    },
  },
  args: {  },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof Badge>;

export const Primary: Story = {
  args: {
    variant: "default",
    size: "default",
    children: 'Important',
  },
  parameters: {
    docs: {
      description: {
        story: 'A primary badge, used for important information.',
      },
    },
  },
};

export const Secondary: Story = {
  args: {
    variant: "secondary",
    children: 'Outdated',
  },
  parameters: {
    docs: {
      description: {
        story: 'A secondary badge, used for less important information.',
      },
    },
  },
};

export const Destructive: Story  = {
  args: {
    variant: "destructive",
    children: 'Deleted',
  },
  parameters: {
    docs: {
      description: {
          story: 'A destructive badge, used for destructive information.',
      },
    },
  },
};

export const Success: Story  = {
  args: {
    variant: "success",
    children: 'Success',
  },
  parameters: {
    docs: {
      description: {
        story: 'A success badge, used to inform the user that something was successful.',
      },
    },
  },
};  

export const Warning: Story  = {
  args: {
    variant: "warning",
    children: 'Warning',
  },
  parameters: {
    docs: {
      description: {
        story: 'A warning badge, used to inform the user that something is not right.',
      },
    },
  },
};

export const Info: Story  = {
  args: {
    variant: "info",
    children: 'Info',
  },
  parameters: {
    docs: {
      description: {
        story: 'An info badge, used to inform the user of some information.',
      },
    },
  },
};

export const Outline: Story  = {
  args: {
    variant: "outline-solid",
    children: 'Disabled',
  },
  parameters: {
    docs: {
      description: {
        story: 'An outline-solid badge, used for less important information.',
      },
    },
  },
};

export const Small: Story = {
  args: {
    size: 'sm',
    children: 'small info',
  },
  parameters: {
    docs: {
      description: {
        story: 'A small badge, used for smaller labels.',
      },
    },
  },
};
