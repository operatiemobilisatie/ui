import * as React from 'react';

import type { Meta, StoryObj } from '@storybook/nextjs';
import { Avatar, AvatarImage, AvatarFallback } from '../components/avatar';

const meta = {
  title: 'Data Display/Avatar',
  component: Avatar,
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
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof Avatar>;

export const Default: Story = {
  render: (args) => (
    <Avatar className={args.className}>
      <AvatarImage src="https://github.com/douwepausma.png" alt="@douwepausma" />
      <AvatarFallback>CN</AvatarFallback>
    </Avatar>
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
    <Avatar>
      <AvatarImage src="/broken-image.jpg" alt="@johndoe" />
      <AvatarFallback>JD</AvatarFallback>
    </Avatar>
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
      <Avatar className="h-8 w-8">
        <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
      <Avatar className="h-16 w-16">
        <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
      <Avatar className="h-24 w-24">
        <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
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
      <Avatar className="border-2 border-white">
        <AvatarImage src="https://github.com/bejonwe.png" alt="@bejonwe" />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
      <Avatar className="border-2 border-white">
        <AvatarImage src="https://github.com/joe.png" alt="@joe" />
        <AvatarFallback>JD</AvatarFallback>
      </Avatar>
      <Avatar className="border-2 border-white">
        <AvatarImage src="https://github.com/douwepausma.png" alt="@douwepausma" />
        <AvatarFallback>JA</AvatarFallback>
      </Avatar>
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