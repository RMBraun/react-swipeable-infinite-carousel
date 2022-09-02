import e,{useRef as r,useMemo as t,useState as n,useCallback as o,useLayoutEffect as s,useEffect as i}from"react";var l="Carousel-module_container__j52CF",a="Carousel-module_slideContainer__q7xxg",c="Carousel-module_arrowIcon__wMmqr",u="Carousel-module_leftArrowIcon__daMSf",d="Carousel-module_rightArrowIcon__dMi-3",m="Carousel-module_arrow__qfBj1",h="Carousel-module_isArrowHidden__9yP-w",_="Carousel-module_rightArrow__8sZy6",p="Carousel-module_leftArrow__yzgQL";!function(e,r){void 0===r&&(r={});var t=r.insertAt;if(e&&"undefined"!=typeof document){var n=document.head||document.getElementsByTagName("head")[0],o=document.createElement("style");o.type="text/css","top"===t&&n.firstChild?n.insertBefore(o,n.firstChild):n.appendChild(o),o.styleSheet?o.styleSheet.cssText=e:o.appendChild(document.createTextNode(e))}}(".Carousel-module_container__j52CF{align-items:center;display:flex;flex-direction:row;max-width:100%;overflow:hidden;position:relative}.Carousel-module_slideContainer__q7xxg{display:flex;flex-direction:row;z-index:1}.Carousel-module_arrowIcon__wMmqr{background-color:transparent;border:6px solid #1b1b1b;border-radius:5px;height:35%;opacity:.5;transition:border-color .5s;width:35%}.Carousel-module_leftArrowIcon__daMSf{border-right:none;border-top:none;transform:translateX(2.5px) rotate(45deg)}.Carousel-module_rightArrowIcon__dMi-3{border-bottom:none;border-left:none;transform:translateX(-2.5px) rotate(45deg)}.Carousel-module_arrow__qfBj1{align-items:center;background:transparent;border:none;border-radius:50%;cursor:pointer;display:flex;flex-direction:column;height:48px;justify-content:center;margin:0;padding:0;position:absolute;transition:opacity .5s,background-color .5s;width:48px;z-index:2}.Carousel-module_isArrowHidden__9yP-w{opacity:0;pointer-events:none}.Carousel-module_arrow__qfBj1:hover{background-color:#efefefa9;opacity:1}.Carousel-module_arrow__qfBj1:active{background-color:#929292a9;opacity:1}.Carousel-module_rightArrow__8sZy6{right:10px}.Carousel-module_leftArrow__yzgQL{left:10px}");const f=e=>e?.touches?.[0]?.clientX||e?.clientX||0,g=(e,r)=>e?.length&&r&&r>0?e.reduce(((t,{start:n},o)=>{const s=e[Math.min(o+r-1,e.length-1)].end-n;return s>t?s:t}),0):0,y=({displayCount:e,minDisplayCount:r,slideAnchors:t})=>{const n=g(t,r),o=g(t,e);return{minWidth:n?`${n}px`:"auto",width:o?`${o}px`:"100%"}},w=({isLeft:r,isHidden:t,scrollBy:n})=>{const s=o((e=>r=>{r.preventDefault(),r.stopPropagation(),n(e)}));return e.createElement("button",{className:`${m} ${r?p:_} ${t?h:""}`,onClick:s(r?-1:1)},e.createElement("span",{className:`${c} ${r?u:d}`}))},C=({startIndex:c=0,minDisplayCount:u=0,displayCount:d=0,gridGap:m=10,showArrows:h=!0,renderArrows:_=w,scrollSpeed:p=75,style:g={},slideContainerStyle:C={},slideStyle:x={},children:b})=>{const v=r(),M=e.Children.toArray(b)||[],A=M.length,E=t((()=>Array(A).fill(null).map(((r,t)=>E?.[t]||e.createRef()))),[A]),[S,q]=n([]),B=r(null),T=r(null),$=o(((e,r=S)=>{const t=r?.[e]?.start;return null!=t?-1*t:0}),[S]),I=r(c),[L,j]=n(c),k=o((e=>{j(e),I.current=e}),[j]),[z,D]=n(A),[N,X]=n(!1),[H,W]=n(!1),P=r($(L)),R=r(0),F=r(0),G=r(),O=t((()=>{const e=S?.[z]?.start;return null!=e?-1*e:0}),[S,A,z]),Q=0!==L,Y=null==P.current||null==B.current||null==S?.[A-1]||-1*P.current+B.current.clientWidth<S?.[A-1].end,Z=o(((e,r=z)=>Math.max(0,Math.min(r,e))),[z]),U=o((e=>{P.current=e,requestAnimationFrame((()=>{T.current&&(T.current.style.transform=`translate(${e}px)`)}))}),[]),J=()=>{const e=((e=[],r=0)=>e.reduce(((e,t,n)=>{if(t?.current){const o=t.current.clientWidth,s=0===n?0:e[n-1].end+r,i=s+o;e.push({start:s,end:i,width:o})}return e}),[]))(E,m),r=B.current.clientWidth,t=e[e.length-1].end,n=Z(e.findIndex((({start:e})=>e+r>=t)),e.length-1),o=Z(I.current,n),s=$(o,e);k(o),q(e),D(n),U(s)},K=o((e=>{const r=Z(e);return{index:r,translateOffset:$(r)}}),[A,$,Z]);s((()=>{v.current&&v.current.disconnect(),v.current=new ResizeObserver(J),E.forEach((({current:e})=>v.current.observe(e))),J()}),[A,u,d,m]),i((()=>(window.addEventListener("resize",J),()=>{v.current&&v.current.disconnect(),window.removeEventListener("resize",J)})),[]);const V=o((e=>{const r=Z(L+e);k(r),U($(r))}),[L,A,$,k,U,Z]),ee=o((e=>{if(H||e.touches?.length>1)return;X(!0);const r=f(e);R.current=r,F.current=r}),[H,X]),re=o((e=>{if(e.stopPropagation(),!N||H)return;F.current=f(e);const r=R.current-F.current;R.current=F.current,0!==r&&U(P.current-r)}),[H,N,L,U]),te=o((e=>{if(H||e.touches?.length>0)return;const r=-1*P.current,t=S.reduce(((e,{start:t,width:n},o)=>r>=t?r>=t+n/2?o+1:o:e),0),n=Z(t);k(n),U($(n)),R.current=0,F.current=0,X(!1)}),[H,S,U,$,k,Z,X]),ne=o((e=>{if(N)return;const r=0===e.deltaX&&Math.abs(e.deltaY)>0,t=r?-1*e.deltaY:e.deltaX,n=Math.sign(t);if(P.current>=0&&-1===n||P.current<=O&&1===n)return;H||r||W(!0);const o=P.current-n*Math.min(p,Math.abs(t)),s=()=>{W(!1);const e=-1*o,r=S.reduce(((r,{start:t,width:n},o)=>e>=t?e>=t+n/2?o+1:o:r),0),t=Z(r);k(t),U($(t))};G.current&&clearTimeout(G.current),o>=0?(U(0),s()):o<=O?(U(O),s()):(U(o),G.current=setTimeout(s,100))}),[S,p,m,H,O,P,N,W,k,U,K]),oe=t((()=>(({gridGap:e,isScrolling:r,isDragging:t})=>({gap:`${e}px`,transition:"transform "+(r||t?"0ms":"500ms")}))({gridGap:m,isScrolling:H,isDragging:N})),[m,H,N]);return e.createElement("div",{className:l,style:{...y({minDisplayCount:u,displayCount:d,slideAnchors:S}),...g},ref:B},h&&e.createElement(_,{isLeft:!0,isRight:!1,isHidden:H||N||!Q,scrollBy:V}),e.createElement("div",{ref:T,className:a,style:{...oe,...C},onTouchStart:ee,onTouchMove:re,onTouchEnd:te,onTouchCancel:te,onMouseDown:ee,onMouseMove:re,onMouseUp:te,onMouseLeave:te,onWheel:ne},M.map(((r,t)=>e.createElement("div",{style:x,ref:E[t],key:t},r)))),h&&e.createElement(_,{isLeft:!1,isRight:!0,isHidden:H||N||!Y,scrollBy:V}))};export{C as Carousel};
//# sourceMappingURL=index.es.js.map
