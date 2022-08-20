"use strict";
exports.__esModule = true;
exports.Carousel = void 0;
var tslib_1 = require("tslib");
var react_1 = tslib_1.__importStar(require("react"));
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
        alignItems: 'center'
    });
};
var SlidesContainerCss = function (_a) {
    var gridGap = _a.gridGap, translateOffset = _a.translateOffset, isScrolling = _a.isScrolling, isDragging = _a.isDragging;
    return ({
        display: 'flex',
        flexDirection: 'row',
        gap: "".concat(gridGap, "px"),
        zIndex: 1,
        transform: "translate(".concat(translateOffset, "px)"),
        transition: "transform ".concat(isScrolling || isDragging ? '0ms' : '500ms')
    });
};
var ArrowIconCss = {
    width: '35%',
    height: '35%',
    border: '6px solid #1b1b1b',
    borderRadius: '5px',
    transition: 'border-color 500ms'
};
var ArrowCss = function (_a) {
    var isHover = _a.isHover, isHidden = _a.isHidden, size = _a.size;
    return ({
        position: 'absolute',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '0px',
        margin: '0px',
        border: 'none',
        outline: 'none',
        width: "".concat(size, "px"),
        height: "".concat(size, "px"),
        borderRadius: '50%',
        backgroundColor: "".concat(isHover ? '#efefefa9' : 'transparent'),
        opacity: "".concat(isHidden ? '0' : isHover ? '1' : '0.5'),
        transition: 'opacity 500ms, background-color 500ms',
        zIndex: '2',
        pointerEvents: "".concat(isHidden ? 'none' : 'auto')
    });
};
var LeftArrowCSs = function (props) { return (tslib_1.__assign(tslib_1.__assign({}, ArrowCss(props)), { left: '10px' })); };
var LeftArrowIconCss = tslib_1.__assign(tslib_1.__assign({}, ArrowIconCss), { borderRight: 'none', borderTop: 'none', transform: 'translateX(2.5px) rotate(45deg)' });
var RightArrowCss = function (props) { return (tslib_1.__assign(tslib_1.__assign({}, ArrowCss(props)), { right: '10px' })); };
var RightArrowIconCss = tslib_1.__assign(tslib_1.__assign({}, ArrowIconCss), { borderLeft: 'none', borderBottom: 'none', transform: 'translateX(-2.5px) rotate(45deg)' });
var getClientXOffset = function (e) { var _a, _b; return ((_b = (_a = e === null || e === void 0 ? void 0 : e.touches) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.clientX) || (e === null || e === void 0 ? void 0 : e.clientX) || 0; };
var Carousel = function (_a) {
    var _b = _a.startIndex, startIndex = _b === void 0 ? 0 : _b, _c = _a.minDisplayCount, minDisplayCount = _c === void 0 ? 0 : _c, _d = _a.displayCount, displayCount = _d === void 0 ? 0 : _d, _e = _a.gridGap, gridGap = _e === void 0 ? 10 : _e, slideWidth = _a.slideWidth, _f = _a.showArrows, showArrows = _f === void 0 ? true : _f, children = _a.children;
    var slides = (0, react_1.useMemo)(function () { return react_1["default"].Children.toArray(children) || []; }, [children]);
    var slideCount = (0, react_1.useMemo)(function () { return slides.length; }, [slides]);
    var slidesRefs = (0, react_1.useMemo)(function () { return Array(slideCount).fill(react_1["default"].createRef()); }, [slideCount]);
    var containerRef = (0, react_1.useRef)(null);
    var _g = (0, react_1.useState)(Math.max(displayCount, 1)), maxDisplayCount = _g[0], setMaxDisplayCount = _g[1];
    var getTranslateOffset = (0, react_1.useCallback)(function (newIndex, scrollDelta) {
        if (scrollDelta === void 0) { scrollDelta = 0; }
        return newIndex * -1 * (slideWidth + gridGap) - scrollDelta;
    }, [slideWidth, gridGap]);
    var _h = (0, react_1.useState)(startIndex), index = _h[0], setIndex = _h[1];
    var _j = (0, react_1.useState)(false), isDragging = _j[0], setIsDragging = _j[1];
    var _k = (0, react_1.useState)(false), isScrolling = _k[0], setIsScrolling = _k[1];
    var _l = (0, react_1.useState)(getTranslateOffset(index, 0)), translateOffset = _l[0], setTranslateOffset = _l[1];
    var touchStartRef = (0, react_1.useRef)(0);
    var touchEndRef = (0, react_1.useRef)(0);
    var scrollDebounceId = (0, react_1.useRef)();
    var lastScrollInfo = (0, react_1.useRef)({
        timestamp: 0
    });
    var onResize = (0, react_1.useCallback)(function () {
        var _a;
        var containerWidth = ((_a = containerRef.current) === null || _a === void 0 ? void 0 : _a.clientWidth) || slideCount * slideWidth;
        var boundMaxDisplayCount = Math.max(Math.min(Math.floor(containerWidth / slideWidth), displayCount), 1);
        var newBoundIndex = index < 0 ? 0 : index > slideCount - boundMaxDisplayCount ? slideCount - boundMaxDisplayCount : index;
        var newBoundScrollDelta = getTranslateOffset(newBoundIndex, 0);
        setTranslateOffset(newBoundScrollDelta);
        setMaxDisplayCount(boundMaxDisplayCount);
    }, [slideCount, slideWidth, index, displayCount, getTranslateOffset, setTranslateOffset, setMaxDisplayCount]);
    var getNewScrollState = (0, react_1.useCallback)(function (newIndex) {
        var newBoundIndex = newIndex < 0 ? 0 : newIndex > slideCount - maxDisplayCount ? slideCount - maxDisplayCount : newIndex;
        var newBoundScrollDelta = getTranslateOffset(newBoundIndex, 0);
        return {
            index: newBoundIndex,
            translateOffset: newBoundScrollDelta
        };
    }, [slideCount, maxDisplayCount, getTranslateOffset]);
    (0, react_1.useLayoutEffect)(function () {
        onResize();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [minDisplayCount, displayCount, gridGap, slideWidth]);
    (0, react_1.useEffect)(function () {
        window.addEventListener('resize', onResize);
        return function () {
            window.removeEventListener('resize', onResize);
        };
    }, [onResize]);
    var maxScrollX = 0;
    var minScrollX = (0, react_1.useMemo)(function () { return -1 * (slideCount - maxDisplayCount) * (slideWidth + gridGap); }, [slideCount, maxDisplayCount, slideWidth, gridGap]);
    var showLeftArrow = index !== 0;
    var showRightArrow = index + maxDisplayCount < slideCount;
    var onArrowClick = (0, react_1.useCallback)(function (indexOffset) { return function (e) {
        e.preventDefault();
        e.stopPropagation();
        var newIndex = index + indexOffset;
        var newBoundIndex = newIndex < 0 ? 0 : newIndex > slideCount - maxDisplayCount ? slideCount - maxDisplayCount - 1 : newIndex;
        setIndex(newBoundIndex);
        setTranslateOffset(getTranslateOffset(newBoundIndex, 0));
    }; }, [index, slideCount, maxDisplayCount, getTranslateOffset, setIndex, setTranslateOffset]);
    var onTouchStart = (0, react_1.useCallback)(function (e) {
        if (isScrolling) {
            return;
        }
        setIsDragging(true);
        var xOffset = getClientXOffset(e);
        touchStartRef.current = xOffset;
        touchEndRef.current = xOffset;
    }, [isScrolling, setIsDragging]);
    var onTouchMove = (0, react_1.useCallback)(function (e) {
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
    var onTouchEnd = (0, react_1.useCallback)(function () {
        if (isScrolling) {
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
    var onScroll = (0, react_1.useCallback)(function (e) {
        if (isDragging) {
            return;
        }
        var scrollDirection = Math.sign(e.deltaX);
        var isScrollMomentum = e.timeStamp - lastScrollInfo.current.timestamp > 30;
        lastScrollInfo.current.timestamp = e.timeStamp;
        if (isScrollMomentum ||
            (translateOffset >= maxScrollX && scrollDirection === -1) ||
            (translateOffset <= minScrollX && scrollDirection === 1)) {
            return;
        }
        if (!isScrolling) {
            setIsScrolling(true);
        }
        var newScrollDelta = translateOffset - e.deltaX;
        var debounceFunc = function () {
            requestAnimationFrame(function () {
                setIsScrolling(false);
                var newIndex = Math.round(Math.abs(newScrollDelta) / (slideWidth + gridGap));
                var newScrollState = getNewScrollState(newIndex);
                setIndex(newScrollState.index);
                setTranslateOffset(newScrollState.translateOffset);
            });
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
            requestAnimationFrame(function () {
                setTranslateOffset(newScrollDelta);
            });
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
    return (react_1["default"].createElement("div", { style: ContainerCss({
            minDisplayCount: minDisplayCount,
            displayCount: displayCount,
            slideWidth: slideWidth,
            gridGap: gridGap
        }), ref: containerRef },
        showArrows && (react_1["default"].createElement("button", { style: LeftArrowCSs({
                isHover: false,
                size: 48,
                isHidden: isScrolling || isDragging || !showLeftArrow
            }), onClick: showLeftArrow ? onArrowClick(-1) : undefined },
            react_1["default"].createElement("span", { style: LeftArrowIconCss }))),
        react_1["default"].createElement("div", { style: SlidesContainerCss({
                gridGap: gridGap,
                translateOffset: translateOffset,
                isScrolling: isScrolling,
                isDragging: isDragging
            }), onTouchStart: onTouchStart, onTouchMove: onTouchMove, onTouchEnd: onTouchEnd, onTouchCancel: onTouchEnd, onMouseDown: onTouchStart, onMouseMove: onTouchMove, onMouseUp: onTouchEnd, onMouseLeave: onTouchEnd, onWheel: onScroll }, slides.map(function (slide, i) { return (react_1["default"].createElement("div", { ref: slidesRefs[i], key: i }, slide)); })),
        showArrows && (react_1["default"].createElement("button", { style: RightArrowCss({
                isHover: false,
                isHidden: isScrolling || isDragging || !showRightArrow,
                size: 48
            }), onClick: showRightArrow ? onArrowClick(1) : undefined },
            react_1["default"].createElement("span", { style: RightArrowIconCss })))));
};
exports.Carousel = Carousel;
//# sourceMappingURL=Carousel.js.map