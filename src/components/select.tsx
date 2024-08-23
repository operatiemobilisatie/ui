"use client"

import React, { useId, ReactNode } from "react";
import Select from 'react-select';
import type { GroupBase } from 'react-select';
import { cva, type VariantProps } from "class-variance-authority";
import { badgeVariants } from './badge';
import { containerCSS } from "react-select/dist/declarations/src/components/containers";

interface SelectProps<
  Option = { label: string; value: string | number | boolean; },
  IsMulti extends boolean = false,
  Group extends GroupBase<Option> = GroupBase<Option>
> {
    displaySize?: 'sm' | 'default' | 'lg',
    className?: string,
    options: Option[],
    name: string,
    id?: string,
    isDisabled?: boolean,
    value?: Option | Option[],
    onChange?: (value: any) => void,
}

const selectVariants = (size:SelectProps['displaySize'], className:SelectProps['className'],) => {
  switch (size) {
    case 'sm':
      return {
        control: ({isFocused}:{isFocused:boolean}) => `!min-h-[34px] h-8 px-3 rounded-xl flex w-full border border-input bg-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring aria-disabled:cursor-not-allowed focus:border-primary aria-disabled:opacity-50 hover:border-gray-300 ${className} ${isFocused ? 'border-primary hover:border-primary ring-ring ring-2' : ''}`,
        option: () => 'py-2 px-5 hover:bg-gray-100',
        indicatorSeparator: () => 'bg-gray-300 mx-1 my-2',
        indicatorsContainer: () => '-mr-1',
        dropdownIndicator: () => 'text-primary',
        menu: () => 'bg-white rounded-2xl my-2 border border-gray-200 overflow-clip',
        multiValue: () => badgeVariants({ variant: 'default', className: 'text-xs pr-1'}),
        valueContainer: () => "flex flex-wrap gap-1",
        container: () => 'w-full'
      }
    case 'lg':
      return {
        control: ({isFocused}:{isFocused:boolean}) => `h-11 px-4 rounded-2xl flex w-full border border-input bg-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring aria-disabled:cursor-not-allowed focus:border-primary aria-disabled:opacity-50 hover:border-gray-300 ${className} ${isFocused ? 'border-primary hover:border-primary ring-ring ring-2' : ''}`,
        option: () => 'py-2 px-5 hover:bg-gray-100',
        indicatorSeparator: () => 'bg-gray-300 mx-1 my-2',
        indicatorsContainer: () => '-mr-2',
        dropdownIndicator: () => 'text-primary',
        menu: () => 'bg-white rounded-2xl my-2 border border-gray-200 overflow-clip',
        multiValue: () => badgeVariants({ variant: 'default', className: 'text-xs pr-1'}),
        valueContainer: () => "flex flex-wrap gap-1",
        container: () => 'w-full'
      }
    default:
      return {
        control: ({isFocused}:{isFocused:boolean}) => `h-10 px-3.5 rounded-xl flex w-full border border-input bg-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring aria-disabled:cursor-not-allowed focus:border-primary aria-disabled:opacity-50 hover:border-gray-300 ${className} ${isFocused ? 'border-primary hover:border-primary ring-ring ring-2' : ''}`,
        option: () => 'py-2 px-5 hover:bg-gray-100',
        indicatorSeparator: () => 'bg-gray-300 mx-1 my-2',
        indicatorsContainer: () => '-mr-1',
        dropdownIndicator: () => 'text-primary',
        menu: () => 'bg-white rounded-2xl my-2 border border-gray-200 overflow-clip',
        multiValue: () => badgeVariants({ variant: 'default', className: 'text-xs pr-1'}),
        valueContainer: () => "flex flex-wrap gap-1",
        container: () => 'w-full'
      }  
  }
};

const SelectField = ({className, displaySize = 'default', ...props}:SelectProps) => {  
  return (
    <Select      
      classNamePrefix="om-select"
      unstyled
      className="ring-prim"
      instanceId={useId()}
      classNames={selectVariants(displaySize, className)}
      {...props}
    />
  )
};

export { SelectField as Select }