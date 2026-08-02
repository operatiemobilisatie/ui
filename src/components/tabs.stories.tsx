import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import * as Tabs from './tabs';

const meta = {
  title: 'Data Display/Tabs',
  component: Tabs.Root,
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
} satisfies Meta<typeof Tabs.Root>;

export default meta;
type Story = StoryObj<typeof Tabs.Root>;

export const Default: Story = {
  render: (args) => (
    <Tabs.Root {...args} className="w-96">
      <Tabs.List>
        <Tabs.Tab value="projects">Projects</Tabs.Tab>
        <Tabs.Tab value="people">People</Tabs.Tab>
        <Tabs.Tab value="reports">Reports</Tabs.Tab>
      </Tabs.List>
      <Tabs.Panel value="projects">
        <p className="text-sm">Twelve projects are running across four regions.</p>
      </Tabs.Panel>
      <Tabs.Panel value="people">
        <p className="text-sm">Two hundred and forty workers are currently on assignment.</p>
      </Tabs.Panel>
      <Tabs.Panel value="reports">
        <p className="text-sm">The last quarterly report was published in March.</p>
      </Tabs.Panel>
    </Tabs.Root>
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
    <Tabs.Root {...args} className="w-96">
      <Tabs.List>
        <Tabs.Tab value="projects">Projects</Tabs.Tab>
        <Tabs.Tab value="people">People</Tabs.Tab>
        <Tabs.Tab value="reports" disabled>
          Reports
        </Tabs.Tab>
      </Tabs.List>
      <Tabs.Panel value="projects">
        <p className="text-sm">Twelve projects are running across four regions.</p>
      </Tabs.Panel>
      <Tabs.Panel value="people">
        <p className="text-sm">Two hundred and forty workers are currently on assignment.</p>
      </Tabs.Panel>
      <Tabs.Panel value="reports">
        <p className="text-sm">The last quarterly report was published in March.</p>
      </Tabs.Panel>
    </Tabs.Root>
  ),
  parameters: {
    docs: { description: { story: 'A disabled trigger is skipped by keyboard navigation.' } },
  },
};
