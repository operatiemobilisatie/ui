"use client"

import React, {useId, Ref } from "react";
import Select from 'react-select';
import type { GroupBase } from 'react-select';
import { badgeVariants } from './badge';
import type {} from 'react-select/base';
import { Props } from "react-select";

declare module 'react-select/base' {
  export interface Props<
    Option,
    IsMulti extends boolean,
    Group extends GroupBase<Option>
  > {
    displaySize?: 'sm' | 'default' | 'lg'
  }
}

const selectVariants = (size:Props['displaySize'], className:Props['className'],) => {
  switch (size) {
    case 'sm':
      return {
        control: ({isFocused}:{isFocused:boolean}) => `min-h-[34px]! py-1 px-3 rounded-xl flex w-full border border-input bg-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring aria-disabled:cursor-not-allowed focus:border-primary aria-disabled:opacity-50 hover:border-gray-300 ${className} ${isFocused ? 'border-primary hover:border-primary ring-ring ring-2' : ''}`,
        option: () => 'py-2 px-5 hover:bg-gray-100',
        indicatorSeparator: () => 'bg-gray-300 mx-1 my-0.5',
        indicatorsContainer: () => '-mr-1',
        dropdownIndicator: () => 'text-primary',
        menu: () => 'bg-white rounded-2xl my-2 border border-gray-200 overflow-clip',
        multiValue: () => badgeVariants({ variant: 'default', className: 'text-xs pr-1'}),
        valueContainer: () => "flex flex-wrap gap-1",
        container: () => 'w-full'
      }
    case 'lg':
      return {
        control: ({isFocused}:{isFocused:boolean}) => `min-h-11! py-2 px-4 rounded-2xl flex w-full border border-input bg-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring aria-disabled:cursor-not-allowed focus:border-primary aria-disabled:opacity-50 hover:border-gray-300 ${className} ${isFocused ? 'border-primary hover:border-primary ring-ring ring-2' : ''}`,
        option: () => 'py-2 px-5 hover:bg-gray-100',
        indicatorSeparator: () => 'bg-gray-300 mx-1 my-0.5',
        indicatorsContainer: () => '-mr-2',
        dropdownIndicator: () => 'text-primary',
        menu: () => 'bg-white rounded-2xl my-2 border border-gray-200 overflow-clip',
        multiValue: () => badgeVariants({ variant: 'default', className: 'text-xs pr-1'}),
        valueContainer: () => "flex flex-wrap gap-1",
        container: () => 'w-full'
      }
    default:
      return {
        control: ({isFocused}:{isFocused:boolean}) => `min-h-10! py-1.5 px-3.5 rounded-xl flex w-full border border-input bg-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring aria-disabled:cursor-not-allowed focus:border-primary aria-disabled:opacity-50 hover:border-gray-300 ${className} ${isFocused ? 'border-primary hover:border-primary ring-ring ring-2' : ''}`,
        option: () => 'py-2 px-5 hover:bg-gray-100',
        indicatorSeparator: () => 'bg-gray-300 mx-1 my-0.5',
        indicatorsContainer: () => '-mr-1',
        dropdownIndicator: () => 'text-primary',
        menu: () => 'bg-white rounded-2xl my-2 border border-gray-200 overflow-clip',
        multiValue: () => badgeVariants({ variant: 'default', className: 'text-xs pr-1'}),
        valueContainer: () => "flex flex-wrap gap-1",
        container: () => 'w-full'
      }  
  }
};

const CustomSelect = React.forwardRef(<
  Option,
  IsMulti extends boolean = false,
  Group extends GroupBase<Option> = GroupBase<Option>
>({ displaySize, className, ...props }: Props<Option, IsMulti, Group> & { displaySize?: 'sm' | 'default' | 'lg'; className?: string }, ref:Ref<any>) => {
  return (
    <Select
      {...props}
      classNamePrefix="om-select"
      ref={ref}
      unstyled
      instanceId={useId()}
      classNames={selectVariants(displaySize, className)}
    />
  );
}) as <Option, IsMulti extends boolean = false, Group extends GroupBase<Option> = GroupBase<Option>>(props: Props<Option, IsMulti, Group> & { displaySize?: 'sm' | 'default' | 'lg'; className?: string }) => React.ReactElement;

export default CustomSelect;