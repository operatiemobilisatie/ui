import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, waitFor, within } from 'storybook/test';
import { Progress } from './progress';

const meta = {
  title: 'Feedback/Progress',
  component: Progress,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A horizontal progress bar that animates from zero once it scrolls into view, counting the percentage up as the fill grows.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    value: {
      control: { type: 'range', min: 0, max: 100, step: 1 },
      description: 'The percentage complete, 0 to 100.',
    },
  },
  args: {
    value: 60,
  },
} satisfies Meta<typeof Progress>;

export default meta;
type Story = StoryObj<typeof Progress>;

/*
 * The count-up runs on requestAnimationFrame, which `animations: 'disabled'`
 * does not fast-forward -- only CSS animations are. Every story therefore waits
 * for the counter to reach its final value before the screenshot is taken,
 * otherwise the frame captured depends on machine speed.
 */
const waitForCountUp = (expected: string) => async ({ canvasElement }: { canvasElement: HTMLElement }) => {
  const canvas = within(canvasElement);
  await waitFor(() => expect(canvas.getByText(expected)).toBeInTheDocument(), { timeout: 10_000 });
};

export const Default: Story = {
  render: (args) => (
    <div className="w-96">
      <Progress {...args} />
    </div>
  ),
  play: waitForCountUp('60%'),
  parameters: {
    docs: { description: { story: 'A bar at 60%, with the label riding inside the fill.' } },
  },
};

export const Low: Story = {
  args: { value: 15 },
  render: Default.render,
  play: waitForCountUp('15%'),
  parameters: {
    docs: {
      description: {
        story: 'Below 50% the label sits outside the fill and switches to dark text.',
      },
    },
  },
};

export const Complete: Story = {
  args: { value: 100 },
  render: Default.render,
  play: waitForCountUp('100%'),
  parameters: {
    docs: { description: { story: 'A finished bar.' } },
  },
};
