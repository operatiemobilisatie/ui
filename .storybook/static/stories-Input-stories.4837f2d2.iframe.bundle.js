"use strict";(self.webpackChunk_operatiemobilisatie_ui=self.webpackChunk_operatiemobilisatie_ui||[]).push([[669],{"./src/stories/Input.stories.tsx":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,{Default:()=>Default,Disabled:()=>Disabled,Email:()=>Email,Large:()=>Large,Number:()=>Number,Password:()=>Password,Small:()=>Small,__namedExportsOrder:()=>__namedExportsOrder,default:()=>__WEBPACK_DEFAULT_EXPORT__});const __WEBPACK_DEFAULT_EXPORT__={title:"Form/Input",component:__webpack_require__("./src/components/input.tsx").p,parameters:{layout:"centered",docs:{description:{component:"A flexible Input component that supports multiple sizes."}}},tags:["autodocs"],argTypes:{displaySize:{control:"select",options:["default","sm","lg"],description:"The size of the Input",table:{defaultValue:{summary:"default"}}},placeholder:{control:"text",description:"Placeholder text"},disabled:{control:"boolean",description:"Whether the Input is disabled"}},args:{disabled:!1,className:"w-72"}},Default={args:{displaySize:"default",placeholder:"Type your message here..."},parameters:{docs:{description:{story:"The default input with standard sizing."}}}},Small={args:{displaySize:"sm",placeholder:"Type your message here..."},parameters:{docs:{description:{story:"A smaller input for compact layouts."}}}},Large={args:{displaySize:"lg",placeholder:"Type your message here..."},parameters:{docs:{description:{story:"Bigger horizontal padding and rounder corners."}}}},Disabled={args:{disabled:!0,placeholder:"Disabled input",value:"This input is disabled"},parameters:{docs:{description:{story:"A disabled input state."}}}},Email={args:{type:"email",placeholder:"Enter your email"},parameters:{docs:{description:{story:"An input field for email addresses."}}}},Number={args:{type:"number",placeholder:"Enter a number"},parameters:{docs:{description:{story:"An input field for numeric values."}}}},Password={args:{type:"password",placeholder:"Enter your password"},parameters:{docs:{description:{story:"An input field for passwords."}}}},__namedExportsOrder=["Default","Small","Large","Disabled","Email","Number","Password"];Default.parameters={...Default.parameters,docs:{...Default.parameters?.docs,source:{originalSource:"{\n  args: {\n    displaySize: 'default',\n    placeholder: 'Type your message here...'\n  },\n  parameters: {\n    docs: {\n      description: {\n        story: 'The default input with standard sizing.'\n      }\n    }\n  }\n}",...Default.parameters?.docs?.source}}},Small.parameters={...Small.parameters,docs:{...Small.parameters?.docs,source:{originalSource:"{\n  args: {\n    displaySize: 'sm',\n    placeholder: 'Type your message here...'\n  },\n  parameters: {\n    docs: {\n      description: {\n        story: 'A smaller input for compact layouts.'\n      }\n    }\n  }\n}",...Small.parameters?.docs?.source}}},Large.parameters={...Large.parameters,docs:{...Large.parameters?.docs,source:{originalSource:"{\n  args: {\n    displaySize: 'lg',\n    placeholder: 'Type your message here...'\n  },\n  parameters: {\n    docs: {\n      description: {\n        story: 'Bigger horizontal padding and rounder corners.'\n      }\n    }\n  }\n}",...Large.parameters?.docs?.source}}},Disabled.parameters={...Disabled.parameters,docs:{...Disabled.parameters?.docs,source:{originalSource:"{\n  args: {\n    disabled: true,\n    placeholder: 'Disabled input',\n    value: 'This input is disabled'\n  },\n  parameters: {\n    docs: {\n      description: {\n        story: 'A disabled input state.'\n      }\n    }\n  }\n}",...Disabled.parameters?.docs?.source}}},Email.parameters={...Email.parameters,docs:{...Email.parameters?.docs,source:{originalSource:"{\n  args: {\n    type: 'email',\n    placeholder: 'Enter your email'\n  },\n  parameters: {\n    docs: {\n      description: {\n        story: 'An input field for email addresses.'\n      }\n    }\n  }\n}",...Email.parameters?.docs?.source}}},Number.parameters={...Number.parameters,docs:{...Number.parameters?.docs,source:{originalSource:"{\n  args: {\n    type: 'number',\n    placeholder: 'Enter a number'\n  },\n  parameters: {\n    docs: {\n      description: {\n        story: 'An input field for numeric values.'\n      }\n    }\n  }\n}",...Number.parameters?.docs?.source}}},Password.parameters={...Password.parameters,docs:{...Password.parameters?.docs,source:{originalSource:"{\n  args: {\n    type: 'password',\n    placeholder: 'Enter your password'\n  },\n  parameters: {\n    docs: {\n      description: {\n        story: 'An input field for passwords.'\n      }\n    }\n  }\n}",...Password.parameters?.docs?.source}}}},"./node_modules/class-variance-authority/dist/index.mjs":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{F:()=>cva});var clsx__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/clsx/dist/clsx.mjs");const falsyToString=value=>"boolean"==typeof value?`${value}`:0===value?"0":value,cx=clsx__WEBPACK_IMPORTED_MODULE_0__.$,cva=(base,config)=>props=>{var _config_compoundVariants;if(null==(null==config?void 0:config.variants))return cx(base,null==props?void 0:props.class,null==props?void 0:props.className);const{variants,defaultVariants}=config,getVariantClassNames=Object.keys(variants).map((variant=>{const variantProp=null==props?void 0:props[variant],defaultVariantProp=null==defaultVariants?void 0:defaultVariants[variant];if(null===variantProp)return null;const variantKey=falsyToString(variantProp)||falsyToString(defaultVariantProp);return variants[variant][variantKey]})),propsWithoutUndefined=props&&Object.entries(props).reduce(((acc,param)=>{let[key,value]=param;return void 0===value||(acc[key]=value),acc}),{}),getCompoundVariantClassNames=null==config||null===(_config_compoundVariants=config.compoundVariants)||void 0===_config_compoundVariants?void 0:_config_compoundVariants.reduce(((acc,param)=>{let{class:cvClass,className:cvClassName,...compoundVariantOptions}=param;return Object.entries(compoundVariantOptions).every((param=>{let[key,value]=param;return Array.isArray(value)?value.includes({...defaultVariants,...propsWithoutUndefined}[key]):{...defaultVariants,...propsWithoutUndefined}[key]===value}))?[...acc,cvClass,cvClassName]:acc}),[]);return cx(base,getVariantClassNames,getCompoundVariantClassNames,null==props?void 0:props.class,null==props?void 0:props.className)}},"./src/components/input.tsx":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{p:()=>Input});var react__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/react/index.js"),class_variance_authority__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./node_modules/class-variance-authority/dist/index.mjs"),_lib_utils__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./src/lib/utils.ts");const inputVariants=(0,class_variance_authority__WEBPACK_IMPORTED_MODULE_1__.F)("peer flex w-full border border-input bg-background file:mr-4 file:hover:border-primary-400 file:cursor-pointer file:border-border file:border file:border-solid file:bg-transparent file:rounded-2xl file:h-[34px] file:px-4 file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed focus:border-primary disabled:opacity-50 hover:border-gray-300",{variants:{size:{default:"h-10 px-3.5 py-2 rounded-xl",sm:"h-[34px] px-3 rounded-xl",lg:"h-11 px-4 rounded-2xl"}},defaultVariants:{size:"default"}}),Input=react__WEBPACK_IMPORTED_MODULE_0__.forwardRef((({className,displaySize,type,...props},ref)=>react__WEBPACK_IMPORTED_MODULE_0__.createElement("input",{type,className:(0,_lib_utils__WEBPACK_IMPORTED_MODULE_2__.cn)(inputVariants({size:displaySize,className:`${"file"===type?"border-dashed cursor-pointer rounded-2xl h-auto py-4":""} ${className}`})),ref,...props})));Input.displayName="Input",Input.__docgenInfo={description:"",methods:[],displayName:"Input",props:{displaySize:{required:!1,tsType:{name:"union",raw:"'sm' | 'lg' | 'default'",elements:[{name:"literal",value:"'sm'"},{name:"literal",value:"'lg'"},{name:"literal",value:"'default'"}]},description:""}}}},"./src/lib/utils.ts":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{cn:()=>cn});var clsx__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./node_modules/clsx/dist/clsx.mjs"),tailwind_merge__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/tailwind-merge/dist/bundle-mjs.mjs");function cn(...inputs){return(0,tailwind_merge__WEBPACK_IMPORTED_MODULE_0__.QP)((0,clsx__WEBPACK_IMPORTED_MODULE_1__.$)(inputs))}}}]);