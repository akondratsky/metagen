"use strict";(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([[885],{3905:(e,t,r)=>{r.d(t,{Zo:()=>c,kt:()=>f});var n=r(7294);function a(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function o(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function i(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?o(Object(r),!0).forEach((function(t){a(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):o(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function l(e,t){if(null==e)return{};var r,n,a=function(e,t){if(null==e)return{};var r,n,a={},o=Object.keys(e);for(n=0;n<o.length;n++)r=o[n],t.indexOf(r)>=0||(a[r]=e[r]);return a}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(n=0;n<o.length;n++)r=o[n],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(a[r]=e[r])}return a}var s=n.createContext({}),p=function(e){var t=n.useContext(s),r=t;return e&&(r="function"==typeof e?e(t):i(i({},t),e)),r},c=function(e){var t=p(e.components);return n.createElement(s.Provider,{value:t},e.children)},u="mdxType",y={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},d=n.forwardRef((function(e,t){var r=e.components,a=e.mdxType,o=e.originalType,s=e.parentName,c=l(e,["components","mdxType","originalType","parentName"]),u=p(r),d=a,f=u["".concat(s,".").concat(d)]||u[d]||y[d]||o;return r?n.createElement(f,i(i({ref:t},c),{},{components:r})):n.createElement(f,i({ref:t},c))}));function f(e,t){var r=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var o=r.length,i=new Array(o);i[0]=d;var l={};for(var s in t)hasOwnProperty.call(t,s)&&(l[s]=t[s]);l.originalType=e,l[u]="string"==typeof e?e:a,i[1]=l;for(var p=2;p<o;p++)i[p]=r[p];return n.createElement.apply(null,i)}return n.createElement.apply(null,r)}d.displayName="MDXCreateElement"},8800:(e,t,r)=>{r.r(t),r.d(t,{assets:()=>s,contentTitle:()=>i,default:()=>y,frontMatter:()=>o,metadata:()=>l,toc:()=>p});var n=r(7462),a=(r(7294),r(3905));const o={sidebar_position:2},i="Templating",l={unversionedId:"Templating",id:"Templating",title:"Templating",description:"By default, Metagen checks file type (using istextorbinary). All the binary files are copied. All the text files are rendered with Handlebars. Therefore, you have to be careful regarding you files content. In some cases you may need to handle it manually. Consider next JSX code example:",source:"@site/docs/Templating.mdx",sourceDirName:".",slug:"/Templating",permalink:"/metagen/docs/Templating",draft:!1,tags:[],version:"current",sidebarPosition:2,frontMatter:{sidebar_position:2},sidebar:"tutorialSidebar",previous:{title:"Overview",permalink:"/metagen/docs/intro"},next:{title:"Syntax",permalink:"/metagen/docs/syntax/"}},s={},p=[],c={toc:p},u="wrapper";function y(e){let{components:t,...r}=e;return(0,a.kt)(u,(0,n.Z)({},c,r,{components:t,mdxType:"MDXLayout"}),(0,a.kt)("h1",{id:"templating"},"Templating"),(0,a.kt)("p",null,"By default, Metagen checks file type (using ",(0,a.kt)("a",{parentName:"p",href:"https://github.com/bevry/istextorbinary"},"istextorbinary"),"). All the binary files are copied. All the text files are rendered with Handlebars. Therefore, you have to be careful regarding you files content. In some cases you may need to handle it manually. Consider next JSX code example:"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-jsx"},"<Typography sx={{ ml: 3 }}>Text</Typography>\n")),(0,a.kt)("p",null,"Being interpreted as Handlebars template, this code will throw the error. There are two ways to fix it. If you need just to copy the file, you can bypass templating engine and just copy file with ",(0,a.kt)("a",{parentName:"p",href:"/docs/syntax/copy"},"#copy")," directive. Otherwise, you have to use ",(0,a.kt)("a",{parentName:"p",href:"https://handlebarsjs.com/guide/expressions.html#escaping-handlebars-expressions"},"escaping Handlebars expressions"),"."),(0,a.kt)("p",null,"You may also probably meet cases, when automatic file type recognition will fail, for example, if you output file has binary extension in its name, but you need to render it as a template. In this case you can use ",(0,a.kt)("a",{parentName:"p",href:"/docs/syntax/hbs"},"#hbs")," directive."))}y.isMDXComponent=!0}}]);