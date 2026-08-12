import * as React from 'react';

import type { Meta, StoryObj } from '@storybook/react-vite';
import * as Avatar from './avatar';

const meta = {
  title: 'Data Display/Avatar',
  component: Avatar.Root,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A versatile avatar component that displays user images with fallback support.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    className: {
      control: 'text',
      description: 'Additional CSS classes to apply to the avatar',
      defaultValue: '',
    },
  },
  args: {
    className: '',
  },
} satisfies Meta<typeof Avatar.Root>;

export default meta;
type Story = StoryObj<typeof Avatar.Root>;

export const Default: Story = {
  render: (args) => (
    <Avatar.Root className={args.className}>
      <Avatar.Image src="https://github.com/douwepausma.png" alt="@douwepausma" />
      <Avatar.Fallback>CN</Avatar.Fallback>
    </Avatar.Root>
  ),
  parameters: {
    docs: {
      description: {
        story: 'The default avatar with an image and fallback initials.',
      },
    },
  },
};

export const WithFallback: Story = {
  render: () => (
    <Avatar.Root>
      <Avatar.Image src="/broken-image.jpg" alt="@johndoe" />
      <Avatar.Fallback>JD</Avatar.Fallback>
    </Avatar.Root>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Avatar with fallback content shown when the image fails to load.',
      },
    },
  },
};

export const CustomSize: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Avatar.Root className="h-8 w-8">
        <Avatar.Image src="https://github.com/shadcn.png" alt="@shadcn" />
        <Avatar.Fallback>CN</Avatar.Fallback>
      </Avatar.Root>
      <Avatar.Root className="h-16 w-16">
        <Avatar.Image src="https://github.com/shadcn.png" alt="@shadcn" />
        <Avatar.Fallback>CN</Avatar.Fallback>
      </Avatar.Root>
      <Avatar.Root className="h-24 w-24">
        <Avatar.Image src="https://github.com/shadcn.png" alt="@shadcn" />
        <Avatar.Fallback>CN</Avatar.Fallback>
      </Avatar.Root>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Avatars can be customized to different sizes using className.',
      },
    },
  },
};

export const Group: Story = {
  render: () => (
    <div className="flex -space-x-4">
      <Avatar.Root className="border-2 border-white">
        <Avatar.Image src="https://github.com/bejonwe.png" alt="@bejonwe" />
        <Avatar.Fallback>CN</Avatar.Fallback>
      </Avatar.Root>
      <Avatar.Root className="border-2 border-white">
        <Avatar.Image src="https://github.com/joe.png" alt="@joe" />
        <Avatar.Fallback>JD</Avatar.Fallback>
      </Avatar.Root>
      <Avatar.Root className="border-2 border-white">
        <Avatar.Image src="https://github.com/douwepausma.png" alt="@douwepausma" />
        <Avatar.Fallback>JA</Avatar.Fallback>
      </Avatar.Root>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Avatars can be grouped together with overlapping effects.',
      },
    },
  },
};
