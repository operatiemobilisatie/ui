import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import * as Card from './card';
import { Button } from './button';

const meta = {
  title: 'Data Display/Card',
  component: Card.Root,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A versatile card component that can display content in a contained format with various sections.',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Card.Root>;

export default meta;
type Story = StoryObj<typeof Card.Root>;

export const Default: Story = {
  render: () => (
    <Card.Root className="w-[350px]">
      <Card.Header>
        <Card.Title>Card Title</Card.Title>
        <Card.Description>Card Description that explains the content.</Card.Description>
      </Card.Header>
      <Card.Content>
        <p>This is the main content of the card. It can contain any elements.</p>
      </Card.Content>
      <Card.Footer>
        <Button>Action</Button>
      </Card.Footer>
    </Card.Root>
  ),
  parameters: {
    docs: {
      description: {
        story: 'A basic card with header, content, and footer sections.',
      },
    },
  },
};

export const WithImage: Story = {
  render: () => (
    <Card.Root className="w-[350px]">
      <Card.Image
        image={
          <img 
            src="https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=80&w=1000" 
            alt="City view" 
            className="w-full h-full object-cover absolute"
          />
        }
      >
      </Card.Image>
      <Card.Header>
        <Card.Title>Featured Location</Card.Title>
        <Card.Description>Discover amazing places</Card.Description>
      </Card.Header>
      <Card.Content>
        <p>Explore the beauty of urban landscapes and architecture.</p>
      </Card.Content>
      <Card.Footer>
        <Button>Learn More</Button>
      </Card.Footer>
    </Card.Root>
  ),
  parameters: {
    docs: {
      description: {
        story: 'A card with a featured image and overlay text.',
      },
    },
  },
};

export const AsLink: Story = {
  render: () => (
    <Card.Root className="w-[350px] block" render={<a href="/destination" />}>
      <Card.Header>
        <Card.Title>Click Me</Card.Title>
        <Card.Description>This entire card is clickable</Card.Description>
      </Card.Header>
      <Card.Content>
        <p>Click anywhere on this card to navigate.</p>
      </Card.Content>
    </Card.Root>
  ),
  parameters: {
    docs: {
      description: {
        story: 'A card rendered as an anchor via the render prop, making the whole card clickable. This replaces the v2 asChild API.',
      },
    },
  },
};

export const FullImageCard: Story = {
  render: () => (
      <Card.Image
        className="w-[350px] h-[200px]"
        fill
        image={
          <img 
            src="https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=80&w=1000" 
            alt="City view" 
            className="w-full h-full object-cover absolute"
          />
        }
      >
        <Card.Header>
          <Card.Title>Full Coverage</Card.Title>
        </Card.Header>
        <Card.Content>
          <Card.Description>Image fills the entire card</Card.Description>
        </Card.Content>
      </Card.Image>
  ),
  parameters: {
    docs: {
      description: {
        story: 'A card with a full-height image and overlay content. (Experimental)',
      },
    },
  },
};
