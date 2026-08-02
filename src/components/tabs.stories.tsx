import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Tabs, TabsList, TabsTrigger, TabsContent } from './tabs';

const meta = {
  title: 'Data Display/Tabs',
  component: Tabs,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A set of layered sections of content, where only one panel is shown at a time. Give each TabsTrigger a value matching its TabsContent.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    defaultValue: {
      control: 'text',
      description: 'The tab selected on first render when the component is uncontrolled.',
    },
    orientation: {
      control: 'radio',
      options: ['horizontal', 'vertical'],
      description: 'The orientation used for keyboard navigation.',
    },
  },
  args: {
    defaultValue: 'projects',
  },
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof Tabs>;

export const Default: Story = {
  render: (args) => (
    <Tabs {...args} className="w-96">
      <TabsList>
        <TabsTrigger value="projects">Projects</TabsTrigger>
        <TabsTrigger value="people">People</TabsTrigger>
        <TabsTrigger value="reports">Reports</TabsTrigger>
      </TabsList>
      <TabsContent value="projects">
        <p className="text-sm">Twelve projects are running across four regions.</p>
      </TabsContent>
      <TabsContent value="people">
        <p className="text-sm">Two hundred and forty workers are currently on assignment.</p>
      </TabsContent>
      <TabsContent value="reports">
        <p className="text-sm">The last quarterly report was published in March.</p>
      </TabsContent>
    </Tabs>
  ),
  parameters: {
    docs: { description: { story: 'Three tabs with the first one selected.' } },
  },
};

export const SecondTabSelected: Story = {
  args: { defaultValue: 'people' },
  render: Default.render,
  parameters: {
    docs: {
      description: {
        story: 'defaultValue picks which panel opens first. The active trigger gets a white pill.',
      },
    },
  },
};

export const WithDisabledTab: Story = {
  render: (args) => (
    <Tabs {...args} className="w-96">
      <TabsList>
        <TabsTrigger value="projects">Projects</TabsTrigger>
        <TabsTrigger value="people">People</TabsTrigger>
        <TabsTrigger value="reports" disabled>
          Reports
        </TabsTrigger>
      </TabsList>
      <TabsContent value="projects">
        <p className="text-sm">Twelve projects are running across four regions.</p>
      </TabsContent>
      <TabsContent value="people">
        <p className="text-sm">Two hundred and forty workers are currently on assignment.</p>
      </TabsContent>
      <TabsContent value="reports">
        <p className="text-sm">The last quarterly report was published in March.</p>
      </TabsContent>
    </Tabs>
  ),
  parameters: {
    docs: { description: { story: 'A disabled trigger is skipped by keyboard navigation.' } },
  },
};
