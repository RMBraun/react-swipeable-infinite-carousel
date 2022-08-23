import { __assign } from "tslib";
import React, { useState, useMemo, useRef, useCallback, useEffect, useLayoutEffect } from 'react';
var ContainerCss = function (_a) {
    var slideWidth = _a.slideWidth, displayCount = _a.displayCount, minDisplayCount = _a.minDisplayCount, gridGap = _a.gridGap;
    return ({
        position: 'relative',
        minWidth: "".concat(minDisplayCount && minDisplayCount > 0 ? "calc(".concat(minDisplayCount, " * ").concat(slideWidth, "px)") : "auto"),
        width: "".concat(displayCount && displayCount > 0
            ? "calc(".concat(slideWidth, "px * ").concat(displayCount, " + (").concat(displayCount - 1, " * ").concat(gridGap, "px))")
            : '100%'),
        maxWidth: '100%',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
    });
};
var SlidesContainerCss = function (_a) {
    var gridGap = _a.gridGap, isScrolling = _a.isScrolling, isDragging = _a.isDragging;
    return ({
        display: 'flex',
        flexDirection: 'row',
        gap: "".concat(gridGap, "px"),
        zIndex: 1,
        transition: "transform ".concat(isScrolling || isDragging ? '0ms' : '500ms'),
    });
};
var ArrowIconCss = {
    width: '35%',
    height: '35%',
    border: '6px solid #1b1b1b',
    borderRadius: '5px',
    transition: 'border-color 500ms',
};
var ArrowCss = function (_a) {
    var size = _a.size;
    return ({
        position: 'absolute',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '0px',
        margin: '0px',
        border: 'none',
        width: "".concat(size, "px"),
        height: "".concat(size, "px"),
        borderRadius: '50%',
        backgroundColor: 'transparent',
        transition: 'opacity 500ms, background-color 500ms',
        zIndex: '2',
        cursor: 'pointer',
    });
};
var LeftArrowCSs = function (props) { return (__assign(__assign({}, ArrowCss(props)), { left: '10px' })); };
var LeftArrowIconCss = __assign(__assign({}, ArrowIconCss), { borderRight: 'none', borderTop: 'none', transform: 'translateX(2.5px) rotate(45deg)' });
var RightArrowCss = function (props) { return (__assign(__assign({}, ArrowCss(props)), { right: '10px' })); };
var RightArrowIconCss = __assign(__assign({}, ArrowIconCss), { borderLeft: 'none', borderBottom: 'none', transform: 'translateX(-2.5px) rotate(45deg)' });
var Arrow = function (props) {
    var isLeft = props.isLeft, isHidden = props.isHidden, style = props.style, onClick = props.onClick;
    var _a = useState(false), isHover = _a[0], setIsHover = _a[1];
    var _b = useState(false), isActive = _b[0], setIsActive = _b[1];
    return (React.createElement("button", { style: __assign(__assign({}, style), { opacity: isHidden ? '0' : isHover ? '1' : '0.5', pointerEvents: "".concat(isHidden ? 'none' : 'auto'), backgroundColor: isActive ? '#929292a9' : isHover ? '#efefefa9' : 'transparent' }), onClick: onClick, onMouseEnter: function () { return setIsHover(true); }, onMouseLeave: function () {
            setIsHover(false);
            setIsActive(false);
        }, onMouseDown: function () { return setIsActive(true); }, onMouseUp: function () { return setIsActive(false); } },
        React.createElement("span", { style: isLeft ? LeftArrowIconCss : RightArrowIconCss })));
};
var getClientXOffset = function (e) { var _a, _b; return ((_b = (_a = e === null || e === void 0 ? void 0 : e.touches) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.clientX) || (e === null || e === void 0 ? void 0 : e.clientX) || 0; };
export var Carousel = function (_a) {
    var _b = _a.startIndex, startIndex = _b === void 0 ? 0 : _b, _c = _a.minDisplayCount, minDisplayCount = _c === void 0 ? 0 : _c, _d = _a.displayCount, displayCount = _d === void 0 ? 0 : _d, _e = _a.gridGap, gridGap = _e === void 0 ? 10 : _e, slideWidth = _a.slideWidth, _f = _a.showArrows, showArrows = _f === void 0 ? true : _f, _g = _a.renderArrows, RenderArrows = _g === void 0 ? Arrow : _g, _h = _a.style, style = _h === void 0 ? {} : _h, _j = _a.slideContainerStyle, slideContainerStyle = _j === void 0 ? {} : _j, _k = _a.slideStyle, slideStyle = _k === void 0 ? {} : _k, children = _a.children;
    var slides = useMemo(function () { return React.Children.toArray(children) || []; }, [children]);
    var slideCount = useMemo(function () { return slides.length; }, [slides]);
    var slidesRefs = useMemo(function () { return Array(slideCount).fill(React.createRef()); }, [slideCount]);
    var containerRef = useRef(null);
    var slideContainerRef = useRef(null);
    var _l = useState(Math.max(displayCount, 1)), maxDisplayCount = _l[0], setMaxDisplayCount = _l[1];
    var getTranslateOffset = useCallback(function (newIndex, scrollDelta) {
        if (scrollDelta === void 0) { scrollDelta = 0; }
        return newIndex * -1 * (slideWidth + gridGap) - scrollDelta;
    }, [slideWidth, gridGap]);
    var _m = useState(startIndex), index = _m[0], setIndex = _m[1];
    var _o = useState(false), isDragging = _o[0], setIsDragging = _o[1];
    var _p = useState(false), isScrolling = _p[0], setIsScrolling = _p[1];
    var translateOffset = useRef(getTranslateOffset(index, 0));
    var setTranslateOffset = useCallback(function (offset) {
        translateOffset.current = offset;
        requestAnimationFrame(function () {
            if (slideContainerRef.current) {
                slideContainerRef.current.style.transform = "translate(".concat(offset, "px)");
            }
        });
    }, []);
    var touchStartRef = useRef(0);
    var touchEndRef = useRef(0);
    var scrollDebounceId = useRef();
    var lastScrollInfo = useRef({
        timestamp: 0,
    });
    var onResize = useCallback(function () {
        var _a;
        var containerWidth = ((_a = containerRef.current) === null || _a === void 0 ? void 0 : _a.clientWidth) || slideCount * slideWidth;
        var boundMaxDisplayCount = Math.max(Math.min(Math.floor(containerWidth / slideWidth), displayCount), 1);
        var newBoundIndex = index < 0 ? 0 : index > slideCount - boundMaxDisplayCount ? slideCount - boundMaxDisplayCount : index;
        var newBoundScrollDelta = getTranslateOffset(newBoundIndex, 0);
        setTranslateOffset(newBoundScrollDelta);
        setMaxDisplayCount(boundMaxDisplayCount);
    }, [slideCount, slideWidth, index, displayCount, getTranslateOffset, setTranslateOffset, setMaxDisplayCount]);
    var getNewScrollState = useCallback(function (newIndex) {
        var newBoundIndex = newIndex < 0 ? 0 : newIndex > slideCount - maxDisplayCount ? slideCount - maxDisplayCount : newIndex;
        var newBoundScrollDelta = getTranslateOffset(newBoundIndex, 0);
        return {
            index: newBoundIndex,
            translateOffset: newBoundScrollDelta,
        };
    }, [slideCount, maxDisplayCount, getTranslateOffset]);
    useLayoutEffect(function () {
        onResize();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [slideCount, minDisplayCount, displayCount, gridGap, slideWidth]);
    useEffect(function () {
        window.addEventListener('resize', onResize);
        return function () {
            window.removeEventListener('resize', onResize);
        };
    }, [onResize]);
    var maxScrollX = 0;
    var minScrollX = useMemo(function () { return -1 * (slideCount - maxDisplayCount) * (slideWidth + gridGap); }, [slideCount, maxDisplayCount, slideWidth, gridGap]);
    var showLeftArrow = index !== 0;
    var showRightArrow = index + maxDisplayCount < slideCount;
    var onArrowClick = useCallback(function (indexOffset) { return function (e) {
        e.preventDefault();
        e.stopPropagation();
        var newIndex = index + indexOffset;
        var newBoundIndex = newIndex < 0 ? 0 : newIndex > slideCount - maxDisplayCount ? slideCount - maxDisplayCount - 1 : newIndex;
        setIndex(newBoundIndex);
        setTranslateOffset(getTranslateOffset(newBoundIndex, 0));
    }; }, [index, slideCount, maxDisplayCount, getTranslateOffset, setIndex, setTranslateOffset]);
    var onTouchStart = useCallback(function (e) {
        var _a;
        if (isScrolling || ((_a = e.touches) === null || _a === void 0 ? void 0 : _a.length) > 1) {
            return;
        }
        setIsDragging(true);
        var xOffset = getClientXOffset(e);
        touchStartRef.current = xOffset;
        touchEndRef.current = xOffset;
    }, [isScrolling, setIsDragging]);
    var onTouchMove = useCallback(function (e) {
        e.stopPropagation();
        if (!isDragging || isScrolling) {
            return;
        }
        touchEndRef.current = getClientXOffset(e);
        var delta = touchStartRef.current - touchEndRef.current;
        if (delta !== 0) {
            var newScrollDelta = getTranslateOffset(index, delta);
            setTranslateOffset(newScrollDelta);
        }
    }, [isScrolling, isDragging, index, setTranslateOffset, getTranslateOffset]);
    var onTouchEnd = useCallback(function (e) {
        var _a;
        if (isScrolling || ((_a = e.touches) === null || _a === void 0 ? void 0 : _a.length) > 0) {
            return;
        }
        var delta = touchStartRef.current - touchEndRef.current;
        if (delta !== 0) {
            var newIndex = Math.round(index + delta / (slideWidth + gridGap));
            var newScrollState = getNewScrollState(newIndex);
            setIndex(newScrollState.index);
            setTranslateOffset(newScrollState.translateOffset);
            touchStartRef.current = 0;
            touchEndRef.current = 0;
        }
        setIsDragging(false);
    }, [isScrolling, index, slideWidth, gridGap, setIndex, setTranslateOffset, getNewScrollState]);
    var onScroll = useCallback(function (e) {
        if (isDragging) {
            return;
        }
        var isWheel = e.deltaX === 0 && Math.abs(e.deltaY) > 0;
        var scrollDelta = isWheel ? -1 * e.deltaY : e.deltaX;
        var scrollDirection = Math.sign(scrollDelta);
        lastScrollInfo.current.timestamp = e.timeStamp;
        if ((translateOffset.current >= maxScrollX && scrollDirection === -1) ||
            (translateOffset.current <= minScrollX && scrollDirection === 1)) {
            return;
        }
        if (!isScrolling && !isWheel) {
            setIsScrolling(true);
        }
        var newScrollDelta = translateOffset.current - scrollDirection * Math.min(slideWidth, Math.abs(scrollDelta));
        var debounceFunc = function () {
            setIsScrolling(false);
            var newIndex = Math.round(Math.abs(newScrollDelta) / (slideWidth + gridGap));
            var newScrollState = getNewScrollState(newIndex);
            setIndex(newScrollState.index);
            setTranslateOffset(newScrollState.translateOffset);
        };
        if (scrollDebounceId.current) {
            clearTimeout(scrollDebounceId.current);
        }
        if (newScrollDelta >= maxScrollX) {
            setTranslateOffset(maxScrollX);
            debounceFunc();
        }
        else if (newScrollDelta <= minScrollX) {
            setTranslateOffset(minScrollX);
            debounceFunc();
        }
        else {
            setTranslateOffset(newScrollDelta);
            scrollDebounceId.current = setTimeout(debounceFunc, 100);
        }
    }, [
        gridGap,
        isScrolling,
        minScrollX,
        translateOffset,
        slideWidth,
        isDragging,
        setIsScrolling,
        setIndex,
        setTranslateOffset,
        getNewScrollState,
    ]);
    return (React.createElement("div", { style: __assign(__assign({}, ContainerCss({
            minDisplayCount: minDisplayCount,
            displayCount: displayCount,
            slideWidth: slideWidth,
            gridGap: gridGap,
        })), style), ref: containerRef },
        showArrows && (React.createElement(RenderArrows, { isLeft: true, isRight: false, style: LeftArrowCSs({
                size: 48,
            }), isHidden: isScrolling || isDragging || !showLeftArrow, onClick: showLeftArrow ? onArrowClick(-1) : undefined })),
        React.createElement("div", { ref: slideContainerRef, style: __assign(__assign({}, SlidesContainerCss({
                gridGap: gridGap,
                isScrolling: isScrolling,
                isDragging: isDragging,
            })), slideContainerStyle), onTouchStart: onTouchStart, onTouchMove: onTouchMove, onTouchEnd: onTouchEnd, onTouchCancel: onTouchEnd, onMouseDown: onTouchStart, onMouseMove: onTouchMove, onMouseUp: onTouchEnd, onMouseLeave: onTouchEnd, onWheel: onScroll }, slides.map(function (slide, i) { return (React.createElement("div", { style: slideStyle, ref: slidesRefs[i], key: i }, slide)); })),
        showArrows && (React.createElement(RenderArrows, { isLeft: false, isRight: true, style: RightArrowCss({
                size: 48,
            }), isHidden: isScrolling || isDragging || !showRightArrow, onClick: showRightArrow ? onArrowClick(1) : undefined }))));
};
//# sourceMappingURL=Carousel.js.map