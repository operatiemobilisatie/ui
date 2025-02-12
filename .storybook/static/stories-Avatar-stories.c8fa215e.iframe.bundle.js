/*! For license information please see stories-Avatar-stories.c8fa215e.iframe.bundle.js.LICENSE.txt */
"use strict";(self.webpackChunk_operatiemobilisatie_ui=self.webpackChunk_operatiemobilisatie_ui||[]).push([[172],{"./node_modules/@radix-ui/react-compose-refs/dist/index.mjs":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{s:()=>useComposedRefs,t:()=>composeRefs});var react__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/react/index.js");function setRef(ref,value){if("function"==typeof ref)return ref(value);null!=ref&&(ref.current=value)}function composeRefs(...refs){return node=>{let hasCleanup=!1;const cleanups=refs.map((ref=>{const cleanup=setRef(ref,node);return hasCleanup||"function"!=typeof cleanup||(hasCleanup=!0),cleanup}));if(hasCleanup)return()=>{for(let i=0;i<cleanups.length;i++){const cleanup=cleanups[i];"function"==typeof cleanup?cleanup():setRef(refs[i],null)}}}}function useComposedRefs(...refs){return react__WEBPACK_IMPORTED_MODULE_0__.useCallback(composeRefs(...refs),refs)}},"./node_modules/@radix-ui/react-context/dist/index.mjs":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{A:()=>createContextScope,q:()=>createContext2});var react__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/react/index.js"),react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./node_modules/react/jsx-runtime.js");function createContext2(rootComponentName,defaultContext){const Context=react__WEBPACK_IMPORTED_MODULE_0__.createContext(defaultContext),Provider=props=>{const{children,...context}=props,value=react__WEBPACK_IMPORTED_MODULE_0__.useMemo((()=>context),Object.values(context));return(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(Context.Provider,{value,children})};return Provider.displayName=rootComponentName+"Provider",[Provider,function useContext2(consumerName){const context=react__WEBPACK_IMPORTED_MODULE_0__.useContext(Context);if(context)return context;if(void 0!==defaultContext)return defaultContext;throw new Error(`\`${consumerName}\` must be used within \`${rootComponentName}\``)}]}function createContextScope(scopeName,createContextScopeDeps=[]){let defaultContexts=[];const createScope=()=>{const scopeContexts=defaultContexts.map((defaultContext=>react__WEBPACK_IMPORTED_MODULE_0__.createContext(defaultContext)));return function useScope(scope){const contexts=scope?.[scopeName]||scopeContexts;return react__WEBPACK_IMPORTED_MODULE_0__.useMemo((()=>({[`__scope${scopeName}`]:{...scope,[scopeName]:contexts}})),[scope,contexts])}};return createScope.scopeName=scopeName,[function createContext3(rootComponentName,defaultContext){const BaseContext=react__WEBPACK_IMPORTED_MODULE_0__.createContext(defaultContext),index=defaultContexts.length;defaultContexts=[...defaultContexts,defaultContext];const Provider=props=>{const{scope,children,...context}=props,Context=scope?.[scopeName]?.[index]||BaseContext,value=react__WEBPACK_IMPORTED_MODULE_0__.useMemo((()=>context),Object.values(context));return(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(Context.Provider,{value,children})};return Provider.displayName=rootComponentName+"Provider",[Provider,function useContext2(consumerName,scope){const Context=scope?.[scopeName]?.[index]||BaseContext,context=react__WEBPACK_IMPORTED_MODULE_0__.useContext(Context);if(context)return context;if(void 0!==defaultContext)return defaultContext;throw new Error(`\`${consumerName}\` must be used within \`${rootComponentName}\``)}]},composeContextScopes(createScope,...createContextScopeDeps)]}function composeContextScopes(...scopes){const baseScope=scopes[0];if(1===scopes.length)return baseScope;const createScope=()=>{const scopeHooks=scopes.map((createScope2=>({useScope:createScope2(),scopeName:createScope2.scopeName})));return function useComposedScopes(overrideScopes){const nextScopes=scopeHooks.reduce(((nextScopes2,{useScope,scopeName})=>({...nextScopes2,...useScope(overrideScopes)[`__scope${scopeName}`]})),{});return react__WEBPACK_IMPORTED_MODULE_0__.useMemo((()=>({[`__scope${baseScope.scopeName}`]:nextScopes})),[nextScopes])}};return createScope.scopeName=baseScope.scopeName,createScope}},"./node_modules/@radix-ui/react-slot/dist/index.mjs":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{DX:()=>Slot,xV:()=>Slottable});var react__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/react/index.js"),_radix_ui_react_compose_refs__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./node_modules/@radix-ui/react-compose-refs/dist/index.mjs"),react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./node_modules/react/jsx-runtime.js"),Slot=react__WEBPACK_IMPORTED_MODULE_0__.forwardRef(((props,forwardedRef)=>{const{children,...slotProps}=props,childrenArray=react__WEBPACK_IMPORTED_MODULE_0__.Children.toArray(children),slottable=childrenArray.find(isSlottable);if(slottable){const newElement=slottable.props.children,newChildren=childrenArray.map((child=>child===slottable?react__WEBPACK_IMPORTED_MODULE_0__.Children.count(newElement)>1?react__WEBPACK_IMPORTED_MODULE_0__.Children.only(null):react__WEBPACK_IMPORTED_MODULE_0__.isValidElement(newElement)?newElement.props.children:null:child));return(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(SlotClone,{...slotProps,ref:forwardedRef,children:react__WEBPACK_IMPORTED_MODULE_0__.isValidElement(newElement)?react__WEBPACK_IMPORTED_MODULE_0__.cloneElement(newElement,void 0,newChildren):null})}return(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(SlotClone,{...slotProps,ref:forwardedRef,children})}));Slot.displayName="Slot";var SlotClone=react__WEBPACK_IMPORTED_MODULE_0__.forwardRef(((props,forwardedRef)=>{const{children,...slotProps}=props;if(react__WEBPACK_IMPORTED_MODULE_0__.isValidElement(children)){const childrenRef=function getElementRef(element){let getter=Object.getOwnPropertyDescriptor(element.props,"ref")?.get,mayWarn=getter&&"isReactWarning"in getter&&getter.isReactWarning;if(mayWarn)return element.ref;if(getter=Object.getOwnPropertyDescriptor(element,"ref")?.get,mayWarn=getter&&"isReactWarning"in getter&&getter.isReactWarning,mayWarn)return element.props.ref;return element.props.ref||element.ref}(children);return react__WEBPACK_IMPORTED_MODULE_0__.cloneElement(children,{...mergeProps(slotProps,children.props),ref:forwardedRef?(0,_radix_ui_react_compose_refs__WEBPACK_IMPORTED_MODULE_2__.t)(forwardedRef,childrenRef):childrenRef})}return react__WEBPACK_IMPORTED_MODULE_0__.Children.count(children)>1?react__WEBPACK_IMPORTED_MODULE_0__.Children.only(null):null}));SlotClone.displayName="SlotClone";var Slottable=({children})=>(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.Fragment,{children});function isSlottable(child){return react__WEBPACK_IMPORTED_MODULE_0__.isValidElement(child)&&child.type===Slottable}function mergeProps(slotProps,childProps){const overrideProps={...childProps};for(const propName in childProps){const slotPropValue=slotProps[propName],childPropValue=childProps[propName];/^on[A-Z]/.test(propName)?slotPropValue&&childPropValue?overrideProps[propName]=(...args)=>{childPropValue(...args),slotPropValue(...args)}:slotPropValue&&(overrideProps[propName]=slotPropValue):"style"===propName?overrideProps[propName]={...slotPropValue,...childPropValue}:"className"===propName&&(overrideProps[propName]=[slotPropValue,childPropValue].filter(Boolean).join(" "))}return{...slotProps,...overrideProps}}},"./node_modules/@radix-ui/react-use-callback-ref/dist/index.mjs":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{c:()=>useCallbackRef});var react__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/react/index.js");function useCallbackRef(callback){const callbackRef=react__WEBPACK_IMPORTED_MODULE_0__.useRef(callback);return react__WEBPACK_IMPORTED_MODULE_0__.useEffect((()=>{callbackRef.current=callback})),react__WEBPACK_IMPORTED_MODULE_0__.useMemo((()=>(...args)=>callbackRef.current?.(...args)),[])}},"./node_modules/@radix-ui/react-use-layout-effect/dist/index.mjs":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{N:()=>useLayoutEffect2});var react__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/react/index.js"),useLayoutEffect2=Boolean(globalThis?.document)?react__WEBPACK_IMPORTED_MODULE_0__.useLayoutEffect:()=>{}},"./src/stories/Avatar.stories.tsx":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,{CustomSize:()=>CustomSize,Default:()=>Default,Group:()=>Group,WithFallback:()=>WithFallback,__namedExportsOrder:()=>__namedExportsOrder,default:()=>Avatar_stories});var react=__webpack_require__("./node_modules/react/index.js"),dist=__webpack_require__("./node_modules/@radix-ui/react-context/dist/index.mjs"),react_use_callback_ref_dist=__webpack_require__("./node_modules/@radix-ui/react-use-callback-ref/dist/index.mjs"),react_use_layout_effect_dist=__webpack_require__("./node_modules/@radix-ui/react-use-layout-effect/dist/index.mjs"),react_slot_dist=(__webpack_require__("./node_modules/react-dom/index.js"),__webpack_require__("./node_modules/@radix-ui/react-slot/dist/index.mjs")),jsx_runtime=__webpack_require__("./node_modules/react/jsx-runtime.js"),Primitive=["a","button","div","form","h2","h3","img","input","label","li","nav","ol","p","span","svg","ul"].reduce(((primitive,node)=>{const Node=react.forwardRef(((props,forwardedRef)=>{const{asChild,...primitiveProps}=props,Comp=asChild?react_slot_dist.DX:node;return"undefined"!=typeof window&&(window[Symbol.for("radix-ui")]=!0),(0,jsx_runtime.jsx)(Comp,{...primitiveProps,ref:forwardedRef})}));return Node.displayName=`Primitive.${node}`,{...primitive,[node]:Node}}),{});var[createAvatarContext,createAvatarScope]=(0,dist.A)("Avatar"),[AvatarProvider,useAvatarContext]=createAvatarContext("Avatar"),Avatar=react.forwardRef(((props,forwardedRef)=>{const{__scopeAvatar,...avatarProps}=props,[imageLoadingStatus,setImageLoadingStatus]=react.useState("idle");return(0,jsx_runtime.jsx)(AvatarProvider,{scope:__scopeAvatar,imageLoadingStatus,onImageLoadingStatusChange:setImageLoadingStatus,children:(0,jsx_runtime.jsx)(Primitive.span,{...avatarProps,ref:forwardedRef})})}));Avatar.displayName="Avatar";var AvatarImage=react.forwardRef(((props,forwardedRef)=>{const{__scopeAvatar,src,onLoadingStatusChange=()=>{},...imageProps}=props,context=useAvatarContext("AvatarImage",__scopeAvatar),imageLoadingStatus=function useImageLoadingStatus(src,referrerPolicy){const[loadingStatus,setLoadingStatus]=react.useState("idle");return(0,react_use_layout_effect_dist.N)((()=>{if(!src)return void setLoadingStatus("error");let isMounted=!0;const image=new window.Image,updateStatus=status=>()=>{isMounted&&setLoadingStatus(status)};return setLoadingStatus("loading"),image.onload=updateStatus("loaded"),image.onerror=updateStatus("error"),image.src=src,referrerPolicy&&(image.referrerPolicy=referrerPolicy),()=>{isMounted=!1}}),[src,referrerPolicy]),loadingStatus}(src,imageProps.referrerPolicy),handleLoadingStatusChange=(0,react_use_callback_ref_dist.c)((status=>{onLoadingStatusChange(status),context.onImageLoadingStatusChange(status)}));return(0,react_use_layout_effect_dist.N)((()=>{"idle"!==imageLoadingStatus&&handleLoadingStatusChange(imageLoadingStatus)}),[imageLoadingStatus,handleLoadingStatusChange]),"loaded"===imageLoadingStatus?(0,jsx_runtime.jsx)(Primitive.img,{...imageProps,ref:forwardedRef,src}):null}));AvatarImage.displayName="AvatarImage";var AvatarFallback=react.forwardRef(((props,forwardedRef)=>{const{__scopeAvatar,delayMs,...fallbackProps}=props,context=useAvatarContext("AvatarFallback",__scopeAvatar),[canRender,setCanRender]=react.useState(void 0===delayMs);return react.useEffect((()=>{if(void 0!==delayMs){const timerId=window.setTimeout((()=>setCanRender(!0)),delayMs);return()=>window.clearTimeout(timerId)}}),[delayMs]),canRender&&"loaded"!==context.imageLoadingStatus?(0,jsx_runtime.jsx)(Primitive.span,{...fallbackProps,ref:forwardedRef}):null}));AvatarFallback.displayName="AvatarFallback";var dist_Root=Avatar,Image=AvatarImage,Fallback=AvatarFallback,utils=__webpack_require__("./src/lib/utils.ts");const avatar_Avatar=react.forwardRef((({className,...props},ref)=>react.createElement(dist_Root,{ref,className:(0,utils.cn)("relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full",className),...props})));avatar_Avatar.displayName=dist_Root.displayName;const avatar_AvatarImage=react.forwardRef((({className,...props},ref)=>react.createElement(Image,{ref,className:(0,utils.cn)("aspect-square h-full w-full",className),...props})));avatar_AvatarImage.displayName=Image.displayName;const avatar_AvatarFallback=react.forwardRef((({className,...props},ref)=>react.createElement(Fallback,{ref,className:(0,utils.cn)("flex h-full w-full items-center justify-center rounded-full bg-primary-100",className),...props})));avatar_AvatarFallback.displayName=Fallback.displayName,avatar_Avatar.__docgenInfo={description:"",methods:[]},avatar_AvatarImage.__docgenInfo={description:"",methods:[]},avatar_AvatarFallback.__docgenInfo={description:"",methods:[]};const Avatar_stories={title:"Data Display/Avatar",component:avatar_Avatar,parameters:{layout:"centered",docs:{description:{component:"A versatile avatar component that displays user images with fallback support."}}},tags:["autodocs"],argTypes:{className:{control:"text",description:"Additional CSS classes to apply to the avatar",defaultValue:""}},args:{className:""}},Default={render:args=>react.createElement(avatar_Avatar,{className:args.className},react.createElement(avatar_AvatarImage,{src:"https://github.com/douwepausma.png",alt:"@douwepausma"}),react.createElement(avatar_AvatarFallback,null,"CN")),parameters:{docs:{description:{story:"The default avatar with an image and fallback initials."}}}},WithFallback={render:()=>react.createElement(avatar_Avatar,null,react.createElement(avatar_AvatarImage,{src:"/broken-image.jpg",alt:"@johndoe"}),react.createElement(avatar_AvatarFallback,null,"JD")),parameters:{docs:{description:{story:"Avatar with fallback content shown when the image fails to load."}}}},CustomSize={render:()=>react.createElement("div",{className:"flex items-center gap-4"},react.createElement(avatar_Avatar,{className:"h-8 w-8"},react.createElement(avatar_AvatarImage,{src:"https://github.com/shadcn.png",alt:"@shadcn"}),react.createElement(avatar_AvatarFallback,null,"CN")),react.createElement(avatar_Avatar,{className:"h-16 w-16"},react.createElement(avatar_AvatarImage,{src:"https://github.com/shadcn.png",alt:"@shadcn"}),react.createElement(avatar_AvatarFallback,null,"CN")),react.createElement(avatar_Avatar,{className:"h-24 w-24"},react.createElement(avatar_AvatarImage,{src:"https://github.com/shadcn.png",alt:"@shadcn"}),react.createElement(avatar_AvatarFallback,null,"CN"))),parameters:{docs:{description:{story:"Avatars can be customized to different sizes using className."}}}},Group={render:()=>react.createElement("div",{className:"flex -space-x-4"},react.createElement(avatar_Avatar,{className:"border-2 border-white"},react.createElement(avatar_AvatarImage,{src:"https://github.com/bejonwe.png",alt:"@bejonwe"}),react.createElement(avatar_AvatarFallback,null,"CN")),react.createElement(avatar_Avatar,{className:"border-2 border-white"},react.createElement(avatar_AvatarImage,{src:"https://github.com/joe.png",alt:"@joe"}),react.createElement(avatar_AvatarFallback,null,"JD")),react.createElement(avatar_Avatar,{className:"border-2 border-white"},react.createElement(avatar_AvatarImage,{src:"https://github.com/douwepausma.png",alt:"@douwepausma"}),react.createElement(avatar_AvatarFallback,null,"JA"))),parameters:{docs:{description:{story:"Avatars can be grouped together with overlapping effects."}}}},__namedExportsOrder=["Default","WithFallback","CustomSize","Group"];Default.parameters={...Default.parameters,docs:{...Default.parameters?.docs,source:{originalSource:'{\n  render: args => <Avatar className={args.className}>\n      <AvatarImage src="https://github.com/douwepausma.png" alt="@douwepausma" />\n      <AvatarFallback>CN</AvatarFallback>\n    </Avatar>,\n  parameters: {\n    docs: {\n      description: {\n        story: \'The default avatar with an image and fallback initials.\'\n      }\n    }\n  }\n}',...Default.parameters?.docs?.source}}},WithFallback.parameters={...WithFallback.parameters,docs:{...WithFallback.parameters?.docs,source:{originalSource:'{\n  render: () => <Avatar>\n      <AvatarImage src="/broken-image.jpg" alt="@johndoe" />\n      <AvatarFallback>JD</AvatarFallback>\n    </Avatar>,\n  parameters: {\n    docs: {\n      description: {\n        story: \'Avatar with fallback content shown when the image fails to load.\'\n      }\n    }\n  }\n}',...WithFallback.parameters?.docs?.source}}},CustomSize.parameters={...CustomSize.parameters,docs:{...CustomSize.parameters?.docs,source:{originalSource:'{\n  render: () => <div className="flex items-center gap-4">\n      <Avatar className="h-8 w-8">\n        <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />\n        <AvatarFallback>CN</AvatarFallback>\n      </Avatar>\n      <Avatar className="h-16 w-16">\n        <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />\n        <AvatarFallback>CN</AvatarFallback>\n      </Avatar>\n      <Avatar className="h-24 w-24">\n        <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />\n        <AvatarFallback>CN</AvatarFallback>\n      </Avatar>\n    </div>,\n  parameters: {\n    docs: {\n      description: {\n        story: \'Avatars can be customized to different sizes using className.\'\n      }\n    }\n  }\n}',...CustomSize.parameters?.docs?.source}}},Group.parameters={...Group.parameters,docs:{...Group.parameters?.docs,source:{originalSource:'{\n  render: () => <div className="flex -space-x-4">\n      <Avatar className="border-2 border-white">\n        <AvatarImage src="https://github.com/bejonwe.png" alt="@bejonwe" />\n        <AvatarFallback>CN</AvatarFallback>\n      </Avatar>\n      <Avatar className="border-2 border-white">\n        <AvatarImage src="https://github.com/joe.png" alt="@joe" />\n        <AvatarFallback>JD</AvatarFallback>\n      </Avatar>\n      <Avatar className="border-2 border-white">\n        <AvatarImage src="https://github.com/douwepausma.png" alt="@douwepausma" />\n        <AvatarFallback>JA</AvatarFallback>\n      </Avatar>\n    </div>,\n  parameters: {\n    docs: {\n      description: {\n        story: \'Avatars can be grouped together with overlapping effects.\'\n      }\n    }\n  }\n}',...Group.parameters?.docs?.source}}}},"./node_modules/react-dom/cjs/react-dom.production.js":(__unused_webpack_module,exports,__webpack_require__)=>{var React=__webpack_require__("./node_modules/react/index.js");function formatProdErrorMessage(code){var url="https://react.dev/errors/"+code;if(1<arguments.length){url+="?args[]="+encodeURIComponent(arguments[1]);for(var i=2;i<arguments.length;i++)url+="&args[]="+encodeURIComponent(arguments[i])}return"Minified React error #"+code+"; visit "+url+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}function noop(){}var Internals={d:{f:noop,r:function(){throw Error(formatProdErrorMessage(522))},D:noop,C:noop,L:noop,m:noop,X:noop,S:noop,M:noop},p:0,findDOMNode:null},REACT_PORTAL_TYPE=Symbol.for("react.portal");var ReactSharedInternals=React.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;function getCrossOriginStringAs(as,input){return"font"===as?"":"string"==typeof input?"use-credentials"===input?input:"":void 0}exports.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE=Internals,exports.createPortal=function(children,container){var key=2<arguments.length&&void 0!==arguments[2]?arguments[2]:null;if(!container||1!==container.nodeType&&9!==container.nodeType&&11!==container.nodeType)throw Error(formatProdErrorMessage(299));return function createPortal$1(children,containerInfo,implementation){var key=3<arguments.length&&void 0!==arguments[3]?arguments[3]:null;return{$$typeof:REACT_PORTAL_TYPE,key:null==key?null:""+key,children,containerInfo,implementation}}(children,container,null,key)},exports.flushSync=function(fn){var previousTransition=ReactSharedInternals.T,previousUpdatePriority=Internals.p;try{if(ReactSharedInternals.T=null,Internals.p=2,fn)return fn()}finally{ReactSharedInternals.T=previousTransition,Internals.p=previousUpdatePriority,Internals.d.f()}},exports.preconnect=function(href,options){"string"==typeof href&&(options?options="string"==typeof(options=options.crossOrigin)?"use-credentials"===options?options:"":void 0:options=null,Internals.d.C(href,options))},exports.prefetchDNS=function(href){"string"==typeof href&&Internals.d.D(href)},exports.preinit=function(href,options){if("string"==typeof href&&options&&"string"==typeof options.as){var as=options.as,crossOrigin=getCrossOriginStringAs(as,options.crossOrigin),integrity="string"==typeof options.integrity?options.integrity:void 0,fetchPriority="string"==typeof options.fetchPriority?options.fetchPriority:void 0;"style"===as?Internals.d.S(href,"string"==typeof options.precedence?options.precedence:void 0,{crossOrigin,integrity,fetchPriority}):"script"===as&&Internals.d.X(href,{crossOrigin,integrity,fetchPriority,nonce:"string"==typeof options.nonce?options.nonce:void 0})}},exports.preinitModule=function(href,options){if("string"==typeof href)if("object"==typeof options&&null!==options){if(null==options.as||"script"===options.as){var crossOrigin=getCrossOriginStringAs(options.as,options.crossOrigin);Internals.d.M(href,{crossOrigin,integrity:"string"==typeof options.integrity?options.integrity:void 0,nonce:"string"==typeof options.nonce?options.nonce:void 0})}}else null==options&&Internals.d.M(href)},exports.preload=function(href,options){if("string"==typeof href&&"object"==typeof options&&null!==options&&"string"==typeof options.as){var as=options.as,crossOrigin=getCrossOriginStringAs(as,options.crossOrigin);Internals.d.L(href,as,{crossOrigin,integrity:"string"==typeof options.integrity?options.integrity:void 0,nonce:"string"==typeof options.nonce?options.nonce:void 0,type:"string"==typeof options.type?options.type:void 0,fetchPriority:"string"==typeof options.fetchPriority?options.fetchPriority:void 0,referrerPolicy:"string"==typeof options.referrerPolicy?options.referrerPolicy:void 0,imageSrcSet:"string"==typeof options.imageSrcSet?options.imageSrcSet:void 0,imageSizes:"string"==typeof options.imageSizes?options.imageSizes:void 0,media:"string"==typeof options.media?options.media:void 0})}},exports.preloadModule=function(href,options){if("string"==typeof href)if(options){var crossOrigin=getCrossOriginStringAs(options.as,options.crossOrigin);Internals.d.m(href,{as:"string"==typeof options.as&&"script"!==options.as?options.as:void 0,crossOrigin,integrity:"string"==typeof options.integrity?options.integrity:void 0})}else Internals.d.m(href)},exports.requestFormReset=function(form){Internals.d.r(form)},exports.unstable_batchedUpdates=function(fn,a){return fn(a)},exports.useFormState=function(action,initialState,permalink){return ReactSharedInternals.H.useFormState(action,initialState,permalink)},exports.useFormStatus=function(){return ReactSharedInternals.H.useHostTransitionStatus()},exports.version="19.0.0"},"./node_modules/react-dom/index.js":(module,__unused_webpack_exports,__webpack_require__)=>{!function checkDCE(){if("undefined"!=typeof __REACT_DEVTOOLS_GLOBAL_HOOK__&&"function"==typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE)try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(checkDCE)}catch(err){console.error(err)}}(),module.exports=__webpack_require__("./node_modules/react-dom/cjs/react-dom.production.js")},"./node_modules/react/cjs/react-jsx-runtime.production.js":(__unused_webpack_module,exports)=>{var REACT_ELEMENT_TYPE=Symbol.for("react.transitional.element"),REACT_FRAGMENT_TYPE=Symbol.for("react.fragment");function jsxProd(type,config,maybeKey){var key=null;if(void 0!==maybeKey&&(key=""+maybeKey),void 0!==config.key&&(key=""+config.key),"key"in config)for(var propName in maybeKey={},config)"key"!==propName&&(maybeKey[propName]=config[propName]);else maybeKey=config;return config=maybeKey.ref,{$$typeof:REACT_ELEMENT_TYPE,type,key,ref:void 0!==config?config:null,props:maybeKey}}exports.Fragment=REACT_FRAGMENT_TYPE,exports.jsx=jsxProd,exports.jsxs=jsxProd},"./node_modules/react/jsx-runtime.js":(module,__unused_webpack_exports,__webpack_require__)=>{module.exports=__webpack_require__("./node_modules/react/cjs/react-jsx-runtime.production.js")},"./src/lib/utils.ts":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{cn:()=>cn});var clsx__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./node_modules/clsx/dist/clsx.mjs"),tailwind_merge__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/tailwind-merge/dist/bundle-mjs.mjs");function cn(...inputs){return(0,tailwind_merge__WEBPACK_IMPORTED_MODULE_0__.QP)((0,clsx__WEBPACK_IMPORTED_MODULE_1__.$)(inputs))}}}]);