import e,{useState as t,useRef as r,useMemo as n,useCallback as o,useLayoutEffect as l,useEffect as i}from"react";function s(e,t){void 0===t&&(t={});var r=t.insertAt;if(e&&"undefined"!=typeof document){var n=document.head||document.getElementsByTagName("head")[0],o=document.createElement("style");o.type="text/css","top"===r&&n.firstChild?n.insertBefore(o,n.firstChild):n.appendChild(o),o.styleSheet?o.styleSheet.cssText=e:o.appendChild(document.createTextNode(e))}}var a="Carousel-module_container__j52CF",c="Carousel-module_slidesAndArrowsContainer__MvSNQ",u="Carousel-module_slidesOuterContainer__fw4D8",d="Carousel-module_slidesContainer__huY0t";s(".Carousel-module_container__j52CF{align-items:center;display:flex;flex-direction:column;justify-content:center;max-width:100%;position:relative}.Carousel-module_slidesAndArrowsContainer__MvSNQ{display:flex;flex-direction:column;height:100%;justify-content:center;position:relative;width:100%}.Carousel-module_slidesOuterContainer__fw4D8{max-width:100%;overflow:hidden;width:100%}.Carousel-module_slidesContainer__huY0t{display:flex;flex-direction:row;transition:transform .5s;z-index:1}");const h=e=>e?.touches?.[0]?.clientX||e?.clientX||0,m=(e,t)=>e?.length&&t&&t>0?e.reduce(((r,{start:n},o)=>{const l=e[Math.min(o+t-1,e.length-1)].end-n;return l>r?l:r}),0):0,f=({isInfinite:s=!1,startIndex:f=0,isScrollable:g=!0,isDraggable:p=!0,hasDragMomentum:x=!0,dragMomentumSpeed:_=25,dragMomentumDecay:w=.98,minDisplayCount:y=0,displayCount:A=0,gridGap:C=10,arrows:b,arrowLeftProps:v={},arrowRightProps:I={},scrollSpeed:M=75,scrollCount:D=1,shouldScrollByDisplayCount:N=!0,indexesPerRow:E=0,indexes:k,indexContainerProps:P={},indexProps:$={},style:T={},slideContainerStyle:S={},slideStyle:F={},children:H})=>{const[L,R]=t(!1),W=r(),j=r(),B=r(!1),O=r(0),q=r(),G=e.Children.toArray(H)||[],[X,Q]=t(s?G.length:0),Y=n((()=>s&&X?[...G.slice(G.length-X,G.length),...G,...G.slice(0,X)]:G),[H,G.length,s,X]),z=Y.length,K=n((()=>Array(z).fill(null).map(((t,r)=>(void 0!==K?K[r]:null)||e.createRef()))),[z]),[U,Z]=t([]),J=n((()=>s?U.slice(X,U.length-X):U),[U,U.length,s]),V=n((()=>J[0]?.index||X),[J,J.length]),ee=n((()=>J[J.length-1]?.index||X+G.length-1),[J,J.length]),te=r(null),re=r(null),ne=r(null),oe=o(((e,t=U)=>{const r=t?.[e]?.start;return null!=r?-1*r:0}),[U]),[le,ie]=t({left:f+X,right:f+X}),se=n((()=>null!=le?.left&&null!=le?.right?Array(le.right-le.left+1).fill(le.left).map(((e,t)=>(le.left+t-X)%G.length)):[]),[le?.left,le?.right,X]),ae=n((()=>s?1:N?se.length:Math.min(se.length,D)),[s,N,se,se.length,D]),[ce,ue]=t(z-1),[de,he]=t(!1),[me,fe]=t(!0),ge=r(!1),pe=r((()=>oe(le.left))),xe=r(0),_e=r(0),we=r(),ye=n((()=>{const e=U?.[ce]?.start;return null!=e?-1*e:0}),[U,z,ce]),Ae=s||0!==le.left,Ce=s||le.left<ce,be=o(((e,t=ce)=>Math.max(0,Math.min(t,e))),[ce]),ve=o(((e,t=U)=>{const r=-1*e,n=t.reduce(((e,{start:t,end:n,width:o},l)=>(e.left=r>=t?r>=t+o/2?l+1:l:e.left,e.right=null!=te.current?r+te.current.clientWidth>=n?l:e.right:z-1,e)),{left:0,right:0});return{left:be(n.left),right:Math.max(Math.min(z-1,n.right),n.left)}}),[z,U,be]),Ie=o((({offset:e,index:t,newSlideAnchors:r=U,newClonesLength:n=X})=>{requestAnimationFrame((()=>{if(!re.current)return;let o=e;if(s&&n&&r.length){const t=r[r.length-n-1].end+C,l=r[n].start;e+t<0?o=e+t-l:e+l>0&&(o=e+l-t)}const l=null==t?ve(o):t;j.current&&cancelAnimationFrame(j.current),(me||de)&&(re.current.style.transitionDuration="0ms"),re.current.style.transform=`translate(${o}px)`,j.current=requestAnimationFrame((()=>{re.current.style.transitionDuration="500ms"})),pe.current=o,ie(l)}))}),[C,me,de,U,U?.length,X,ve,ie,ve]),Me=()=>{const e=((e=[],t,r)=>e.reduce(((n,o,l)=>{if(o?.current){const i=o.current.clientWidth-(r||l!==e.length-1?t:0),s=0===l?0:n[l-1].end+t,a=s+i;n.push({start:s,end:a,width:i,index:l})}return n}),[]))(K,C,s);if(e?.length){const t=re.current.clientWidth,r=(e=>{if(!s)return 0;const t=re.current.clientWidth,r=s?e.slice(X,e.length-X):e,n=r.reduce(((e,{width:r},n)=>(e.width=e.width+r,null==e.index&&e.width>t&&(e.index=n+1),e)),{width:0,index:null}).index,o=r.reduceRight(((e,{width:n},o)=>(e.width=e.width+n,null==e.index&&e.width>t&&(e.index=r.length-o),e)),{width:0,index:null}).index;return Math.max(n,o,1)})(e),n=e[e.length-1].end,o=be(e.findIndex((({start:e})=>e+t>=n)),e.length-1),l=be(le.left-X+r,o),i=oe(l,e),a=ve(i,e);Q(r),ie(a),Z(e),ue(o),Ie({offset:i,index:a})}};l((()=>{q.current&&q.current.disconnect(),q.current=new ResizeObserver((()=>Me())),q.current.observe(te.current),K.forEach((({current:e})=>q.current.observe(e))),Me()}),[z,X,y,A,C,s]),i((()=>{fe(!1),s&&Me()}),[]);const De=o(((e,t,r="500ms")=>{if(!B.current){B.current=!0;const n=Math.min(ae,e);let o=s?le.left+n:be(le.left+n);if(s){const t=o>U.length-X-1?o-G.length-ae:o<X-1?G.length+ae+o:null;if(null!=t){re.current.style.transitionDuration="0ms";const r=-U[t].start;re.current.style.transform=`translate(${r}px)`,pe.current=r,o=be(t+e)}}requestAnimationFrame((()=>{if(re.current.style.transitionDuration=r,o!==le.left){const e=oe(o),r=ve(e);re.current.addEventListener("transitionend",(()=>{K[r.left]?.current?.firstChild?.focus(),B.current=!1}),{once:!0}),requestAnimationFrame((()=>{re.current.style.transform=`translate(${e}px)`})),pe.current=e,ie(r),t?.(r)}else B.current=!1}))}}),[U,s,le,z,X,ve,oe,Ie,be,ie]),Ne=o((e=>{if(W.current&&cancelAnimationFrame(W.current),B.current||!p||me||e.touches?.length>1)return;ge.current=!1,he(!0);const t=h(e);xe.current=t,_e.current=t}),[p,me,he]),Ee=o((e=>{if(e.stopPropagation(),B.current||ge.current||!p||!de||me)return;_e.current=h(e);const t=xe.current-_e.current;xe.current=_e.current,O.current=t,0!==t&&Ie({offset:pe.current-t})}),[p,me,de,Ie]),ke=o((e=>{if(W.current&&cancelAnimationFrame(W.current),!(B.current||!p||me||e.touches?.length>0))if(x){ge.current=!0;const e=t=>{O.current=t,W.current=requestAnimationFrame((()=>{const r=pe.current-t;Math.abs(t)<=1||r>=0||r<=ye?(ge.current=!1,he(!1),O.current=0):(Ie({offset:r}),e(t*w))}))};e(O.current<0?Math.max(O.current,-_):Math.min(O.current,_))}else he(!1)}),[x,_,w,ye,0,p,me,he,Ie]),Pe=o((e=>{if(B.current||!g||de)return;const t=e.deltaX,r=Math.sign(t);if(pe.current>=0&&-1===r||pe.current<=ye&&1===r)return void fe(!1);me||fe(!0);const n=pe.current-r*Math.min(M,Math.abs(t)),o=()=>{fe(!1)};we.current&&clearTimeout(we.current),!s&&n>=0?Ie({offset:0}):!s&&n<=ye?Ie({offset:ye}):(Ie({offset:n}),we.current=setTimeout(o,100))}),[s,g,M,me,ye,pe,de,fe,Ie]);i((()=>{Array.from(re.current.children).forEach(((e,t)=>{(t<V||t>ee)&&e.querySelectorAll("*").forEach((e=>{e.tabIndex=-1}))}))}),[V,ee,re.current]);const $e=o((e=>t=>{if(!t.currentTarget.contains(t.relatedTarget)&&e>=V&&e<=ee){ne.current.scrollLeft=0;!(B.current||p&&de||g&&me)&&(e<le.left||e>le.right)&&De((e<le.left?-1:1)*(s?1:se.length),(()=>{ne.current.scrollLeft=0,re.current.addEventListener("transitionend",(()=>{K[e]?.current?.firstChild?.focus()}),{once:!0})}))}}),[le,le.left,le.right,s,de,p,g,me,De]),Te=o((e=>{(B.current||p&&de||g&&me)&&(e.preventDefault(),e.stopPropagation())}),[p,de,g,me]),Se=o((()=>{R(!0)}),[R]),Fe=o((()=>{R(!1)}),[R]);i((()=>{if(!(B.current||p&&de||g&&me)){W.current&&cancelAnimationFrame(W.current),we.current&&clearTimeout(we.current);const e=oe(le.left);Ie({offset:e}),pe.current!==e&&K[le.left]?.current?.firstChild?.focus(),xe.current=0,_e.current=0}}),[de,p,me,g]);const He=n((()=>(({displayCount:e,minDisplayCount:t,slideAnchors:r})=>{const n=m(r,t),o=m(r,e);return{minWidth:n>0?`${n}px`:"auto",width:o>0?`${o}px`:"100%"}})({minDisplayCount:y,displayCount:A,slideAnchors:U})),[U,U?.length,y,A]);return e.createElement("div",{className:a,style:{...He,...T},ref:te,onMouseEnter:Se,onMouseLeave:Fe},e.createElement("div",{className:c,onMouseLeave:ke},b?e.createElement(b,{startIndex:le.left-X,endIndex:le.right-X,activeIndexes:se,isLeft:!0,isRight:!1,isHidden:!L||me||de||!Ae,scrollBy:De,arrowProps:v,scrollCount:ae}):null,e.createElement("div",{ref:ne,className:u},e.createElement("ul",{ref:re,className:d,style:{display:"flex",flexDirection:"row",listStyleType:"none",margin:"0px",padding:"0px",...S},onTouchStart:Ne,onTouchMove:Ee,onTouchEnd:ke,onTouchCancel:ke,onMouseDown:Ne,onMouseMove:Ee,onMouseUp:ke,onWheel:Pe},Y.map(((t,r)=>e.createElement("li",{style:{paddingRight:`${s||r!==Y.length-1?C:0}px`,...F},ref:K[r],key:r,onFocus:$e(r),onKeyDown:Te},t))))),b?e.createElement(b,{startIndex:le.left-X,endIndex:le.right-X,activeIndexes:se,isLeft:!1,isRight:!0,isHidden:!L||me||de||!Ce,scrollBy:De,arrowProps:I,scrollCount:ae}):null),k?e.createElement(k,{startIndex:le.left-X,endIndex:le.right-X,activeIndexes:se,indexesPerRow:E||G.length,slideAnchors:J,scrollBy:De,indexContainerProps:P,indexProps:$}):null)};function g(){return g=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var r=arguments[t];for(var n in r)Object.prototype.hasOwnProperty.call(r,n)&&(e[n]=r[n])}return e},g.apply(this,arguments)}var p="Arrows-module_arrowIcon__kCgUr",x="Arrows-module_leftArrowIcon__G6aeu",_="Arrows-module_rightArrowIcon__Tkyu9",w="Arrows-module_arrow__AxDhI",y="Arrows-module_isArrowHidden__ulHQN",A="Arrows-module_rightArrow__995WH",C="Arrows-module_leftArrow__xHZIo";s(".Arrows-module_arrowIcon__kCgUr{background-color:transparent;border:6px solid #1b1b1b;height:24px;opacity:.5;transition:border-color .5s;width:24px}.Arrows-module_leftArrowIcon__G6aeu{border-right:none;border-top:none;transform:translateX(2.5px) rotate(45deg)}.Arrows-module_rightArrowIcon__Tkyu9{border-bottom:none;border-left:none;transform:translateX(-2.5px) rotate(45deg)}.Arrows-module_arrow__AxDhI{align-items:center;background-color:#929292a9;border:none;cursor:pointer;display:flex;flex-direction:column;height:100%;justify-content:center;margin:0;mix-blend-mode:luminosity;opacity:.7;padding:0;position:absolute;transition:opacity .5s,background-color .5s;width:48px;z-index:2}.Arrows-module_isArrowHidden__ulHQN{opacity:0;pointer-events:none}.Arrows-module_arrow__AxDhI:hover{opacity:1}.Arrows-module_arrow__AxDhI:focus-visible{opacity:1}.Arrows-module_arrow__AxDhI:active{background-color:#6b6b6ba9}.Arrows-module_rightArrow__995WH{right:0}.Arrows-module_leftArrow__xHZIo{left:0}");const b=({isLeft:t,isHidden:r,scrollBy:l,scrollCount:i,arrowProps:s,arrowIconProps:a})=>{const c=n((()=>`${w} ${t?C:A} ${r?y:""} ${s?.className||""}`),[s?.className,t,r]),u=o(((e,t)=>r=>{r.preventDefault(),r.stopPropagation(),"function"==typeof e&&e(r),l(t)}),[s?.onClick,l,t]),d=n((()=>`${p} ${t?x:_} ${a?.className||""}`),[a?.className,t]);return e.createElement("button",g({},s,{tabIndex:-1,className:c,onClick:u(s?.onClick,t?-i:i)}),e.createElement("span",g({},a,{className:d})))};var v="Indexes-module_indexContainer__vSTKG",I="Indexes-module_index__lF1Yb";s(".Indexes-module_indexContainer__vSTKG{align-items:center;display:flex;flex-direction:row;flex-wrap:wrap;margin:10px;width:100%}.Indexes-module_index__lF1Yb{background-color:transparent;border:solid rgba(50,50,50,.5);border-radius:2px;cursor:pointer;height:8px;margin:0;padding:0;transition:background-color .5s}");const M=({activeIndexes:t,startIndex:l,indexesPerRow:i,slideAnchors:s,scrollBy:a,indexContainerProps:c,indexProps:u})=>{const d=r(),h=n((()=>`calc((100% - ${5*(i-1)}px) / ${i})`),[i]),m=n((()=>`${v} ${c?.className||""}`),[c?.className]),f=n((()=>`${I} ${u?.className||""}`),[u?.className]),p=o(((e,t)=>r=>{"function"==typeof e&&e(r),a(t)}),[a]);return e.createElement("div",g({},c,{ref:d,className:m,style:{gap:"5px",...c?.style}}),s?.map(((r,n)=>e.createElement("button",g({tabIndex:-1,key:n},u,{className:f,style:{backgroundColor:t.includes(n)?"black":"transparent",width:h,borderWidth:"2px",...u?.style},onClick:p(u?.onClick,n-l)})))))};export{b as Arrows,f as Carousel,M as Indexes};
//# sourceMappingURL=index.es.js.map
