"use strict";(self.webpackChunk_operatiemobilisatie_ui=self.webpackChunk_operatiemobilisatie_ui||[]).push([[141],{"./src/stories/Textarea.stories.tsx":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,{Default:()=>Default,Disabled:()=>Disabled,Large:()=>Large,Small:()=>Small,__namedExportsOrder:()=>__namedExportsOrder,default:()=>Textarea_stories});var react=__webpack_require__("./node_modules/react/index.js"),dist=__webpack_require__("./node_modules/class-variance-authority/dist/index.mjs"),utils=__webpack_require__("./src/lib/utils.ts");const inputVariants=(0,dist.F)("peer flex w-full border border-input bg-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed focus:border-primary disabled:opacity-50 hover:border-gray-300",{variants:{size:{default:"min-h-10 px-3.5 py-2 rounded-xl",sm:"min-h-[34px] px-3 rounded-xl",lg:"min-h-11 px-4 rounded-2xl"}},defaultVariants:{size:"default"}}),Textarea=react.forwardRef((({className,displaySize,...props},ref)=>react.createElement("textarea",{className:(0,utils.cn)(inputVariants({size:displaySize,className})),ref,...props})));Textarea.displayName="Textarea",Textarea.__docgenInfo={description:"",methods:[],displayName:"Textarea",props:{displaySize:{required:!1,tsType:{name:"union",raw:"'sm' | 'lg' | 'default'",elements:[{name:"literal",value:"'sm'"},{name:"literal",value:"'lg'"},{name:"literal",value:"'default'"}]},description:""}}};const Textarea_stories={title:"Form/Textarea",component:Textarea,parameters:{layout:"centered",docs:{description:{component:"A flexible textarea component that supports multiple sizes."}}},tags:["autodocs"],argTypes:{displaySize:{control:"select",options:["default","sm","lg"],description:"The size of the textarea",table:{defaultValue:{summary:"default"}}},placeholder:{control:"text",description:"Placeholder text"},disabled:{control:"boolean",description:"Whether the textarea is disabled"}},args:{disabled:!1}},Default={args:{displaySize:"default",placeholder:"Type your message here..."},parameters:{docs:{description:{story:"The default textarea with standard sizing."}}}},Small={args:{displaySize:"sm",placeholder:"Type your message here..."},parameters:{docs:{description:{story:"A smaller textarea for compact layouts."}}}},Large={args:{displaySize:"lg",placeholder:"Type your message here..."},parameters:{docs:{description:{story:"Bigger horizontal padding and rounder corners."}}}},Disabled={args:{disabled:!0,placeholder:"Disabled textarea",value:"This textarea is disabled"},parameters:{docs:{description:{story:"A disabled textarea state."}}}},__namedExportsOrder=["Default","Small","Large","Disabled"];Default.parameters={...Default.parameters,docs:{...Default.parameters?.docs,source:{originalSource:"{\n  args: {\n    displaySize: 'default',\n    placeholder: 'Type your message here...'\n  },\n  parameters: {\n    docs: {\n      description: {\n        story: 'The default textarea with standard sizing.'\n      }\n    }\n  }\n}",...Default.parameters?.docs?.source}}},Small.parameters={...Small.parameters,docs:{...Small.parameters?.docs,source:{originalSource:"{\n  args: {\n    displaySize: 'sm',\n    placeholder: 'Type your message here...'\n  },\n  parameters: {\n    docs: {\n      description: {\n        story: 'A smaller textarea for compact layouts.'\n      }\n    }\n  }\n}",...Small.parameters?.docs?.source}}},Large.parameters={...Large.parameters,docs:{...Large.parameters?.docs,source:{originalSource:"{\n  args: {\n    displaySize: 'lg',\n    placeholder: 'Type your message here...'\n  },\n  parameters: {\n    docs: {\n      description: {\n        story: 'Bigger horizontal padding and rounder corners.'\n      }\n    }\n  }\n}",...Large.parameters?.docs?.source}}},Disabled.parameters={...Disabled.parameters,docs:{...Disabled.parameters?.docs,source:{originalSource:"{\n  args: {\n    disabled: true,\n    placeholder: 'Disabled textarea',\n    value: 'This textarea is disabled'\n  },\n  parameters: {\n    docs: {\n      description: {\n        story: 'A disabled textarea state.'\n      }\n    }\n  }\n}",...Disabled.parameters?.docs?.source}}}},"./node_modules/class-variance-authority/dist/index.mjs":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{F:()=>cva});var clsx__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/clsx/dist/clsx.mjs");const falsyToString=value=>"boolean"==typeof value?`${value}`:0===value?"0":value,cx=clsx__WEBPACK_IMPORTED_MODULE_0__.$,cva=(base,config)=>props=>{var _config_compoundVariants;if(null==(null==config?void 0:config.variants))return cx(base,null==props?void 0:props.class,null==props?void 0:props.className);const{variants,defaultVariants}=config,getVariantClassNames=Object.keys(variants).map((variant=>{const variantProp=null==props?void 0:props[variant],defaultVariantProp=null==defaultVariants?void 0:defaultVariants[variant];if(null===variantProp)return null;const variantKey=falsyToString(variantProp)||falsyToString(defaultVariantProp);return variants[variant][variantKey]})),propsWithoutUndefined=props&&Object.entries(props).reduce(((acc,param)=>{let[key,value]=param;return void 0===value||(acc[key]=value),acc}),{}),getCompoundVariantClassNames=null==config||null===(_config_compoundVariants=config.compoundVariants)||void 0===_config_compoundVariants?void 0:_config_compoundVariants.reduce(((acc,param)=>{let{class:cvClass,className:cvClassName,...compoundVariantOptions}=param;return Object.entries(compoundVariantOptions).every((param=>{let[key,value]=param;return Array.isArray(value)?value.includes({...defaultVariants,...propsWithoutUndefined}[key]):{...defaultVariants,...propsWithoutUndefined}[key]===value}))?[...acc,cvClass,cvClassName]:acc}),[]);return cx(base,getVariantClassNames,getCompoundVariantClassNames,null==props?void 0:props.class,null==props?void 0:props.className)}},"./src/lib/utils.ts":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{cn:()=>cn});var clsx__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./node_modules/clsx/dist/clsx.mjs"),tailwind_merge__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/tailwind-merge/dist/bundle-mjs.mjs");function cn(...inputs){return(0,tailwind_merge__WEBPACK_IMPORTED_MODULE_0__.QP)((0,clsx__WEBPACK_IMPORTED_MODULE_1__.$)(inputs))}}}]);