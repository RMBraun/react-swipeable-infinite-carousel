import React from 'react';
export declare type RenderArrowsProps = {
    isLeft: boolean;
    isRight: boolean;
    style: React.CSSProperties;
    isHidden: boolean;
    onClick?: React.EventHandler<React.MouseEvent>;
};
export declare const Carousel: React.FC<{
    startIndex?: number;
    minDisplayCount?: number;
    displayCount?: number;
    gridGap?: number;
    slideWidth: number;
    showArrows?: boolean;
    renderArrows?: React.FC<any>;
    style?: React.CSSProperties;
    slideContainerStyle?: React.CSSProperties;
    slideStyle?: React.CSSProperties;
    children?: React.ReactNode;
}>;
