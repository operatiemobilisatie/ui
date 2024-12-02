import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, CardImage, CardLink } from '../components/card';
import { Button } from '../components/button';

const meta = {
  title: 'Data Display/Card',
  component: Card,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A versatile card component that can display content in a contained format with various sections.',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof Card>;

export const Default: Story = {
  render: () => (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Card Title</CardTitle>
        <CardDescription>Card Description that explains the content.</CardDescription>
      </CardHeader>
      <CardContent>
        <p>This is the main content of the card. It can contain any elements.</p>
      </CardContent>
      <CardFooter>
        <Button>Action</Button>
      </CardFooter>
    </Card>
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
    <Card className="w-[350px]">
      <CardImage 
        image={
          <img 
            src="https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=80&w=1000" 
            alt="City view" 
            className="w-full h-full object-cover"
          />
        }
      >
        <CardTitle>Featured Location</CardTitle>
        <CardDescription>Discover amazing places</CardDescription>
      </CardImage>
      <CardContent>
        <p>Explore the beauty of urban landscapes and architecture.</p>
      </CardContent>
      <CardFooter>
        <Button>Learn More</Button>
      </CardFooter>
    </Card>
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
    <CardLink href="/destination" className="w-[350px] block">
      <CardHeader>
        <CardTitle>Click Me</CardTitle>
        <CardDescription>This entire card is clickable</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Click anywhere on this card to navigate.</p>
      </CardContent>
    </CardLink>
  ),
  parameters: {
    docs: {
      description: {
        story: 'A card that functions as a link, making the entire card clickable.',
      },
    },
  },
};

export const FullImageCard: Story = {
  render: () => (
    <Card className="w-[350px] h-[400px]">
      <CardImage 
        fill
        image={
          <img 
            src="https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=80&w=1000" 
            alt="City view" 
            className="w-full h-full object-cover"
          />
        }
      >
        <div className="mt-auto">
          <CardTitle>Full Coverage</CardTitle>
          <CardDescription>Image fills the entire card</CardDescription>
        </div>
      </CardImage>
    </Card>
  ),
  parameters: {
    docs: {
      description: {
        story: 'A card with a full-height image and overlay content.',
      },
    },
  },
}; 