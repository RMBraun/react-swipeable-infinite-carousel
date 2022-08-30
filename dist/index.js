"use strict";Object.defineProperty(exports,"__esModule",{value:!0});var e=require("react");function t(e){return e&&"object"==typeof e&&"default"in e?e:{default:e}}var r=t(e);var o="Carousel-module_container__j52CF",n="Carousel-module_slideContainer__q7xxg",a="Carousel-module_arrowIcon__wMmqr",s="Carousel-module_leftArrowIcon__daMSf",l="Carousel-module_rightArrowIcon__dMi-3",i="Carousel-module_arrow__qfBj1",u="Carousel-module_isArrowHidden__9yP-w",d="Carousel-module_rightArrow__8sZy6",c="Carousel-module_leftArrow__yzgQL";!function(e,t){void 0===t&&(t={});var r=t.insertAt;if(e&&"undefined"!=typeof document){var o=document.head||document.getElementsByTagName("head")[0],n=document.createElement("style");n.type="text/css","top"===r&&o.firstChild?o.insertBefore(n,o.firstChild):o.appendChild(n),n.styleSheet?n.styleSheet.cssText=e:n.appendChild(document.createTextNode(e))}}(".Carousel-module_container__j52CF{align-items:center;display:flex;flex-direction:row;max-width:100%;overflow:hidden;position:relative}.Carousel-module_slideContainer__q7xxg{display:flex;flex-direction:row;z-index:1}.Carousel-module_arrowIcon__wMmqr{background-color:transparent;border:6px solid #1b1b1b;border-radius:5px;height:35%;opacity:.5;transition:border-color .5s;width:35%}.Carousel-module_leftArrowIcon__daMSf{border-right:none;border-top:none;transform:translateX(2.5px) rotate(45deg)}.Carousel-module_rightArrowIcon__dMi-3{border-bottom:none;border-left:none;transform:translateX(-2.5px) rotate(45deg)}.Carousel-module_arrow__qfBj1{align-items:center;background:transparent;border:none;border-radius:50%;cursor:pointer;display:flex;flex-direction:column;height:48px;justify-content:center;margin:0;padding:0;position:absolute;transition:opacity .5s,background-color .5s;width:48px;z-index:2}.Carousel-module_isArrowHidden__9yP-w{opacity:0;pointer-events:none}.Carousel-module_arrow__qfBj1:hover{background-color:#efefefa9;opacity:1}.Carousel-module_arrow__qfBj1:active{background-color:#929292a9;opacity:1}.Carousel-module_rightArrow__8sZy6{right:10px}.Carousel-module_leftArrow__yzgQL{left:10px}");const f=(e,t,r)=>`calc(${e}px * ${t} + (${t-1} * ${r}px))`,m=({slideWidth:e,displayCount:t,minDisplayCount:r,gridGap:o})=>({minWidth:`${r&&r>0?f(e,r,o):"auto"}`,width:`${t&&t>0?f(e,t,o):"100%"}`}),p=({gridGap:e,isScrolling:t,isDragging:r})=>({gap:`${e}px`,transition:"transform "+(t||r?"0ms":"500ms")}),_=({isLeft:e,isHidden:t,style:o,onClick:n})=>r.default.createElement("button",{className:`${i} ${e?c:d} ${t?u:""}`,style:o,onClick:n},r.default.createElement("span",{className:`${a} ${e?s:l}`})),h=e=>e?.touches?.[0]?.clientX||e?.clientX||0;exports.Carousel=({startIndex:t=0,minDisplayCount:a=0,displayCount:s=0,gridGap:l=10,slideWidth:i=0,showArrows:u=!0,renderArrows:d=_,style:c={},slideContainerStyle:f={},slideStyle:C={},children:g})=>{const y=e.useMemo((()=>r.default.Children.toArray(g)||[]),[g]),x=e.useMemo((()=>y.length),[y]),w=e.useMemo((()=>Array(x).fill(r.default.createRef())),[x]),b=e.useRef(null),M=e.useRef(null),[v,k]=e.useState(Math.max(s,1)),A=e.useCallback(((e,t=0)=>-1*e*(i+l)-t),[i,l]),[E,S]=e.useState(t),[$,q]=e.useState(!1),[R,j]=e.useState(!1),L=e.useRef(A(E,0)),T=e.useCallback((e=>{L.current=e,requestAnimationFrame((()=>{M.current&&(M.current.style.transform=`translate(${e}px)`)}))}),[]),D=e.useRef(0),I=e.useRef(0),z=e.useRef(),B=e.useRef({timestamp:0}),N=e.useCallback((()=>{const e=b.current?.clientWidth||x*i,t=Math.max(Math.min(Math.floor(e/i),s),1),r=A(E<0?0:E>x-t?x-t:E,0);T(r),k(t)}),[x,i,E,s,A,T,k]),W=e.useCallback((e=>{const t=e<0?0:e>x-v?x-v:e;return{index:t,translateOffset:A(t,0)}}),[x,v,A]);e.useLayoutEffect((()=>{N()}),[x,a,s,l,i]),e.useEffect((()=>(window.addEventListener("resize",N),()=>{window.removeEventListener("resize",N)})),[N]);const X=e.useMemo((()=>-1*(x-v)*(i+l)),[x,v,i,l]),G=0!==E,H=E+v<x,P=e.useCallback((e=>t=>{t.preventDefault(),t.stopPropagation();const r=E+e,o=r<0?0:r>x-v?x-v-1:r;S(o),T(A(o,0))}),[E,x,v,A,S,T]),O=e.useCallback((e=>{if(R||e.touches?.length>1)return;q(!0);const t=h(e);D.current=t,I.current=t}),[R,q]),F=e.useCallback((e=>{if(e.stopPropagation(),!$||R)return;I.current=h(e);const t=D.current-I.current;if(0!==t){const e=A(E,t);T(e)}}),[R,$,E,T,A]),Q=e.useCallback((e=>{if(R||e.touches?.length>0)return;const t=D.current-I.current;if(0!==t){const e=Math.round(E+t/(i+l)),r=W(e);S(r.index),T(r.translateOffset),D.current=0,I.current=0}q(!1)}),[R,E,i,l,S,T,W]),Y=e.useCallback((e=>{if($)return;const t=0===e.deltaX&&Math.abs(e.deltaY)>0,r=t?-1*e.deltaY:e.deltaX,o=Math.sign(r);if(B.current.timestamp=e.timeStamp,L.current>=0&&-1===o||L.current<=X&&1===o)return;R||t||j(!0);const n=L.current-o*Math.min(i,Math.abs(r)),a=()=>{j(!1);const e=Math.round(Math.abs(n)/(i+l)),t=W(e);S(t.index),T(t.translateOffset)};z.current&&clearTimeout(z.current),n>=0?(T(0),a()):n<=X?(T(X),a()):(T(n),z.current=setTimeout(a,100))}),[l,R,X,L,i,$,j,S,T,W]);return r.default.createElement("div",{className:o,style:{...m({minDisplayCount:a,displayCount:s,slideWidth:i,gridGap:l}),...c},ref:b},u&&r.default.createElement(d,{isLeft:!0,isRight:!1,isHidden:R||$||!G,onClick:G?P(-1):void 0}),r.default.createElement("div",{ref:M,className:n,style:{...p({gridGap:l,isScrolling:R,isDragging:$}),...f},onTouchStart:O,onTouchMove:F,onTouchEnd:Q,onTouchCancel:Q,onMouseDown:O,onMouseMove:F,onMouseUp:Q,onMouseLeave:Q,onWheel:Y},y.map(((e,t)=>r.default.createElement("div",{style:C,ref:w[t],key:t},e)))),u&&r.default.createElement(d,{isLeft:!1,isRight:!0,isHidden:R||$||!H,onClick:H?P(1):void 0}))};
//# sourceMappingURL=index.js.map
