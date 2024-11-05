import { Button } from '../components/button';

export default {
  title: 'Elements/Button',
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
      options: ['default', 'secondary', 'outline', 'outline-secondary', 'destructive', 'ghost', 'link'],
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
    asChild: {
      control: 'boolean',
      description: 'If true, the button will render its children directly without a button wrapper',
      table: {
        defaultValue: { summary: 'false' },
      },
    },
  },
  args: {  },
};

export const Primary = {
  args: {
    variant: "default",
    size: "default",
    children: 'Click me',
  },
};

export const Secondary = {
  args: {
    variant: "secondary",
    children: 'Click me',
  },
};

export const Outline = {
  args: {
    variant: "outline",
    children: 'Click me',
  },
};

export const Destructive = {
  args: {
    variant: "destructive",
    children: 'Click me',
  },
};

export const Ghost = {
  args: {
    variant: "ghost",
    children: 'Click me',
  },
};

export const Link = {
  args: {
    variant: "link",
    children: 'Click me',
  },
};

export const Large = {
  args: {
    size: 'lg',
    children: 'Click me',
  },
};

export const Small = {
  args: {
    size: 'sm',
    children: 'Click me',
  },
};

export const Icon = {
  args: {
    size: 'icon',
    children: 'Click me',
  },
};