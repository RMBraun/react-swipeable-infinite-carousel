"use strict";Object.defineProperty(exports,"__esModule",{value:!0});var e=require("react");function r(e){return e&&"object"==typeof e&&"default"in e?e:{default:e}}var t=r(e);function n(){return n=Object.assign?Object.assign.bind():function(e){for(var r=1;r<arguments.length;r++){var t=arguments[r];for(var n in t)Object.prototype.hasOwnProperty.call(t,n)&&(e[n]=t[n])}return e},n.apply(this,arguments)}var o="Carousel-module_container__j52CF",s="Carousel-module_slidesAndArrowsContainer__MvSNQ",a="Carousel-module_slideContainer__q7xxg",l="Carousel-module_arrowIcon__wMmqr",i="Carousel-module_leftArrowIcon__daMSf",u="Carousel-module_rightArrowIcon__dMi-3",c="Carousel-module_arrow__qfBj1",d="Carousel-module_isArrowHidden__9yP-w",m="Carousel-module_rightArrow__8sZy6",f="Carousel-module_leftArrow__yzgQL",h="Carousel-module_indexContainer__pQPXU",p="Carousel-module_index__r8PSD";!function(e,r){void 0===r&&(r={});var t=r.insertAt;if(e&&"undefined"!=typeof document){var n=document.head||document.getElementsByTagName("head")[0],o=document.createElement("style");o.type="text/css","top"===t&&n.firstChild?n.insertBefore(o,n.firstChild):n.appendChild(o),o.styleSheet?o.styleSheet.cssText=e:o.appendChild(document.createTextNode(e))}}(".Carousel-module_container__j52CF{align-items:center;display:flex;flex-direction:column;justify-content:center;max-width:100%;overflow:hidden;position:relative}.Carousel-module_slidesAndArrowsContainer__MvSNQ{display:flex;flex-direction:column;height:100%;justify-content:center;position:relative;width:100%}.Carousel-module_slideContainer__q7xxg{display:flex;flex-direction:row;z-index:1}.Carousel-module_arrowIcon__wMmqr{background-color:transparent;border:6px solid #1b1b1b;height:24px;opacity:.5;transition:border-color .5s;width:24px}.Carousel-module_leftArrowIcon__daMSf{border-right:none;border-top:none;transform:translateX(2.5px) rotate(45deg)}.Carousel-module_rightArrowIcon__dMi-3{border-bottom:none;border-left:none;transform:translateX(-2.5px) rotate(45deg)}.Carousel-module_arrow__qfBj1{align-items:center;background-color:#929292a9;border:none;cursor:pointer;display:flex;flex-direction:column;height:100%;justify-content:center;margin:0;mix-blend-mode:luminosity;opacity:.7;padding:0;position:absolute;transition:opacity .5s,background-color .5s;width:48px;z-index:2}.Carousel-module_isArrowHidden__9yP-w{opacity:0;pointer-events:none}.Carousel-module_arrow__qfBj1:hover{opacity:1}.Carousel-module_arrow__qfBj1:focus-visible{opacity:1}.Carousel-module_arrow__qfBj1:active{background-color:#6b6b6ba9}.Carousel-module_rightArrow__8sZy6{right:0}.Carousel-module_leftArrow__yzgQL{left:0}.Carousel-module_indexContainer__pQPXU{align-items:center;display:flex;flex-direction:row;flex-wrap:wrap;margin:10px;width:100%}.Carousel-module_index__r8PSD{background-color:transparent;border:solid rgba(50,50,50,.5);border-radius:2px;cursor:pointer;height:8px;margin:0;padding:0;transition:background-color .5s}");const _=e=>e?.touches?.[0]?.clientX||e?.clientX||0,g=(e,r)=>e?.length&&r&&r>0?e.reduce(((t,{start:n},o)=>{const s=e[Math.min(o+r-1,e.length-1)].end-n;return s>t?s:t}),0):0,C=({displayCount:e,minDisplayCount:r,slideAnchors:t})=>{const n=g(t,r),o=g(t,e);return{minWidth:n?`${n}px`:"auto",width:o?`${o}px`:"100%"}},x=({isLeft:r,isRight:o,isHidden:s,scrollBy:a,arrowProps:h,arrowIconProps:p})=>{const _=e.useMemo((()=>`${c} ${r?f:m} ${s?d:""} ${h?.className||""}`),[h?.className,r,s]),g=e.useCallback(((e,r)=>t=>{t.preventDefault(),t.stopPropagation(),"function"==typeof e&&e(t),a(r)}),[h?.onClick,a,r]),C=e.useMemo((()=>`${l} ${r?i:u} ${p?.className||""}`),[p?.className,r]);return t.default.createElement("button",n({},h,{className:_,onClick:g(h?.onClick,r?-1:1)}),t.default.createElement("span",n({},p,{className:C})))},y=({startIndex:r,endIndex:o,indexesPerRow:s,slideAnchors:a,scrollBy:l,indexContainerProps:i,indexProps:u})=>{const c=e.useRef(),d=e.useMemo((()=>`calc((100% - ${5*(s-1)}px) / ${s})`),[s]),m=e.useMemo((()=>`${h} ${i?.className||""}`),[i?.className]),f=e.useMemo((()=>`${p} ${u?.className||""}`),[u?.className]),_=e.useCallback(((e,r)=>t=>{"function"==typeof e&&e(t),l(r)}),[u?.onClick,l,r]);return t.default.createElement("div",n({},i,{ref:c,className:m,style:{gap:"5px",...i?.style}}),a?.map(((e,s)=>t.default.createElement("button",n({key:s},u,{className:f,style:{backgroundColor:s>=r&&s<=o?"black":"transparent",width:d,borderWidth:"2px",...u?.style},onClick:_(u?.onClick,s-r)})))))};exports.Carousel=({startIndex:r=0,isScrollable:n=!0,isDraggable:l=!0,hasDragMomentum:i=!0,dragMomentumSpeed:u=25,dragMomentumDecay:c=.98,minDisplayCount:d=0,displayCount:m=0,gridGap:f=10,showArrows:h=!0,renderArrows:p=x,arrowLeftProps:g={},arrowRightProps:w={},scrollSpeed:b=75,showIndexes:M=!0,indexesPerRow:v=0,renderIndexes:k=y,indexContainerProps:A={},indexProps:P={},style:R={},slideContainerStyle:S={},slideStyle:E={},children:N})=>{const $=e.useRef(),j=e.useRef(0),I=e.useRef(),q=t.default.Children.toArray(N)||[],B=q.length,D=e.useMemo((()=>Array(B).fill(null).map(((e,r)=>D?.[r]||t.default.createRef()))),[B]),[L,T]=e.useState([]),X=e.useRef(null),z=e.useRef(null),F=e.useCallback(((e,r=L)=>{const t=r?.[e]?.start;return null!=t?-1*t:0}),[L]),[W,O]=e.useState({left:r,right:r}),Q=e.useRef(W),H=e.useCallback((e=>{Q.current=e,O(e)}),[O]),[U,Y]=e.useState(B),[Z,G]=e.useState(!1),[J,K]=e.useState(!1),V=e.useRef(!1),ee=e.useRef((()=>F(W.left))),re=e.useRef(0),te=e.useRef(0),ne=e.useRef(),oe=e.useMemo((()=>{const e=L?.[U]?.start;return null!=e?-1*e:0}),[L,B,U]),se=0!==W.left,ae=null==ee.current||null==X.current||null==L?.[B-1]||-1*ee.current+X.current.clientWidth<L?.[B-1].end,le=e.useCallback(((e,r=U)=>Math.max(0,Math.min(r,e))),[U]),ie=e.useCallback(((e,r=L)=>{const t=-1*e,n=r.reduce(((e,{start:r,end:n,width:o},s)=>(e.left=t>=r?t>=r+o/2?s+1:s:e.left,e.right=null!=X.current?t+X.current.clientWidth>=n?s:e.right:B-1,e)),{left:0,right:0});return{left:le(n.left),right:Math.max(Math.min(B-1,n.right),n.left)}}),[B,L,le]),ue=e.useCallback((e=>{ee.current=e,requestAnimationFrame((()=>{z.current&&(z.current.style.transform=`translate(${e}px)`)}))}),[]),ce=()=>{const e=((e=[])=>e.reduce(((e,r,t)=>{if(r?.current){const n=r.current.clientWidth,o=0===t?0:e[t-1].end,s=o+n;e.push({start:o,end:s,width:n})}return e}),[]))(D);if(e?.length){const r=z.current.clientWidth,t=e[e.length-1].end,n=le(e.findIndex((({start:e})=>e+r>=t)),e.length-1),o=le(Q.current.left,n),s=F(o,e),a=ie(s,e);H(a),T(e),Y(n),ue(s)}};e.useLayoutEffect((()=>{I.current&&I.current.disconnect(),I.current=new ResizeObserver(ce),D.forEach((({current:e})=>I.current.observe(e))),ce()}),[B,d,m,f]),e.useEffect((()=>(window.addEventListener("resize",ce),()=>{I.current&&I.current.disconnect(),window.removeEventListener("resize",ce)})),[]);const de=e.useCallback((e=>{const r=le(W.left+e),t=F(r),n=ie(t);H(n),ue(t)}),[W,B,F,H,ue,le]),me=e.useCallback((e=>{if($.current&&cancelAnimationFrame($.current),!l||J||e.touches?.length>1)return;V.current=!1,G(!0);const r=_(e);re.current=r,te.current=r}),[l,J,G]),fe=e.useCallback((e=>{if(e.stopPropagation(),V.current||!l||!Z||J)return;te.current=_(e);const r=re.current-te.current;if(re.current=te.current,j.current=r,0!==r){const e=ee.current-r,t=ie(e);H(t),ue(e)}}),[l,L,J,Z,W,ue]),he=e.useCallback((e=>{if($.current&&cancelAnimationFrame($.current),!(!l||J||e.touches?.length>0))if(i){V.current=!0;const e=r=>{$.current=requestAnimationFrame((()=>{const t=ee.current-r;if(Math.abs(r)<=1||t>=0||t<=oe)V.current=!1,G(!1);else{const n=ie(t);H(n),ue(t),e(r*c)}}))};e(j.current<0?Math.max(j.current,-u):Math.min(j.current,u)),j.current=0}else G(!1)}),[i,u,c,oe,0,l,J,G]);e.useEffect((()=>{if(!Z||!l){$.current&&cancelAnimationFrame($.current);const e=-1*ee.current,r=L.reduce(((r,{start:t,width:n},o)=>e>=t?e>=t+n/2?o+1:o:r),0),t=le(r),n=F(t),o=ie(n);H(o),ue(n),re.current=0,te.current=0}}),[Z,l]);const pe=e.useCallback((e=>{if(!n||Z)return;const r=0===e.deltaX&&Math.abs(e.deltaY)>0?-1*e.deltaY:e.deltaX,t=Math.sign(r);if(ee.current>=0&&-1===t||ee.current<=oe&&1===t)return;J||K(!0);const o=ee.current-t*Math.min(b,Math.abs(r)),s=ie(o);W.left===s.left&&W.right===s.right||H(s);const a=()=>{if(J){K(!1);const e=F(s.left),r=ie(e);H(r),ue(e)}};ne.current&&clearTimeout(ne.current),o>=0?(ue(0),a()):o<=oe?(ue(oe),a()):(ue(o),ne.current=setTimeout(a,100))}),[n,W,L,b,J,oe,ee,Z,K,H,ue]),_e=e.useMemo((()=>(({isScrolling:e,isDragging:r})=>({transition:"transform "+(e||r?"0ms":"500ms")}))({isScrolling:J,isDragging:Z})),[J,Z]);return t.default.createElement("div",{className:o,style:{...C({minDisplayCount:d,displayCount:m,slideAnchors:L}),...R},ref:X},t.default.createElement("div",{className:s,onMouseLeave:he},h&&t.default.createElement(p,{isLeft:!0,isRight:!1,isHidden:J||Z||!se,scrollBy:de,arrowProps:g}),t.default.createElement("div",{ref:z,className:a,style:{..._e,...S},onTouchStart:me,onTouchMove:fe,onTouchEnd:he,onTouchCancel:he,onMouseDown:me,onMouseMove:fe,onMouseUp:he,onWheel:pe},q.map(((e,r)=>t.default.createElement("div",{style:{paddingRight:`${r===q.length?0:f}px`,...E},ref:D[r],key:r},e)))),h&&t.default.createElement(p,{isLeft:!1,isRight:!0,isHidden:J||Z||!ae,scrollBy:de,arrowProps:w})),M&&t.default.createElement(k,{startIndex:W.left,endIndex:W.right,indexesPerRow:v||B,slideAnchors:L,scrollBy:de,indexContainerProps:A,indexProps:P}))};
//# sourceMappingURL=index.js.map