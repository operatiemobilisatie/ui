import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import type { SliderRootProps } from '@base-ui/react/slider';
import * as Slider from './slider';

/*
 * The label under the thumb is `Slider.Value`, a part of its own -- so it is
 * optional by omission, and its text is whatever you return from it. `showValue`
 * and `valueSuffix` are story-only args that drive those two facts from the
 * Storybook controls; they are not props on the component.
 */
type SliderArgs = SliderRootProps<readonly number[]> & {
  showValue: boolean;
  valueSuffix: string;
};

const meta = {
  title: 'Form/Slider',
  component: Slider.Root,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          "A flexible Slider component that supports multiple sizes. Radix's Root split into Root + Control, Range became Indicator, and the value label under the thumb is now Slider.Value, which follows the handle instead of being frozen at the initial value.",
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    min: {
      control: 'number',
      description: 'The minimum value of the Slider',
    },
    max: {
      control: 'number',
      description: 'The maximum value of the Slider',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the Slider is disabled',
    },
    showValue: {
      control: 'boolean',
      description:
        'Story-only. Whether to render `Slider.Value` under the thumb. Leave the part out of your markup and there is no label.',
    },
    valueSuffix: {
      control: 'text',
      description:
        'Story-only. Appended to the formatted value, to show that the label text is whatever the render function returns.',
    },
  },
  args: {
    disabled: false,
    className: 'w-72',
    showValue: true,
    valueSuffix: '',
  },
} satisfies Meta<SliderArgs>;

export default meta;
type Story = StoryObj<SliderArgs>;

export const Default: Story = {
  render: (args) => (
    <Slider.Root defaultValue={[50]} className={args.className} min={args.min} max={args.max} disabled={args.disabled}>
      <Slider.Control>
        <Slider.Track>
          <Slider.Indicator />
        </Slider.Track>
        <Slider.Thumb>
          {args.showValue && (
            <Slider.Value>{(formatted) => `${formatted}${args.valueSuffix}`}</Slider.Value>
          )}
        </Slider.Thumb>
      </Slider.Control>
    </Slider.Root>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'The default input with standard sizing. Toggle `showValue` off in the controls to drop the label, or type into `valueSuffix` to change its text.',
      },
    },
  },
};

export const WithoutValue: Story = {
  args: { showValue: false },
  render: Default.render,
  parameters: {
    docs: {
      description: {
        story:
          'No label. `Slider.Value` is a separate part, so leaving it out of the markup is the whole of it -- there is no prop to set and nothing renders in its place.',
      },
    },
  },
};

export const WithUnit: Story = {
  args: { valueSuffix: '%' },
  render: Default.render,
  parameters: {
    docs: {
      description: {
        story:
          "`Slider.Value` takes a render function, `(formattedValues, values) => ReactNode`, so the label text is computed rather than fixed. For plain number formatting -- currency, decimals, grouping -- prefer `format` on `Slider.Root`, which takes `Intl.NumberFormatOptions` and also feeds the thumb's accessible value.",
      },
    },
  },
};

export const WithComputedLabel: Story = {
  render: (args) => (
    <Slider.Root defaultValue={[50]} className={args.className} min={args.min} max={args.max} disabled={args.disabled}>
      <Slider.Control>
        <Slider.Track>
          <Slider.Indicator />
        </Slider.Track>
        <Slider.Thumb>
          {/* w-min is right for a bare number and wrong for a word, so the
              override widens it and stops it wrapping under the thumb. */}
          <Slider.Value className="w-max whitespace-nowrap">
            {(formatted, values) =>
              `${formatted} - ${values[0] < 34 ? 'Low' : values[0] < 67 ? 'Medium' : 'High'}`
            }
          </Slider.Value>
        </Slider.Thumb>
      </Slider.Control>
    </Slider.Root>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'The second argument is the raw value array, so the label can say something the number does not. Drag the handle and the band changes with it.',
      },
    },
  },
};
