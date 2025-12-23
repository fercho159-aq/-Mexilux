'use client';

import { ReactNode, CSSProperties } from 'react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

type AnimationType =
    | 'fade-up'
    | 'fade-down'
    | 'fade-left'
    | 'fade-right'
    | 'fade-in'
    | 'zoom-in'
    | 'zoom-out';

interface ScrollAnimateProps {
    children: ReactNode;
    animation?: AnimationType;
    delay?: number;
    duration?: number;
    threshold?: number;
    className?: string;
    style?: CSSProperties;
}

const animationStyles: Record<AnimationType, { initial: CSSProperties; visible: CSSProperties }> = {
    'fade-up': {
        initial: { opacity: 0, transform: 'translateY(40px)' },
        visible: { opacity: 1, transform: 'translateY(0)' },
    },
    'fade-down': {
        initial: { opacity: 0, transform: 'translateY(-40px)' },
        visible: { opacity: 1, transform: 'translateY(0)' },
    },
    'fade-left': {
        initial: { opacity: 0, transform: 'translateX(40px)' },
        visible: { opacity: 1, transform: 'translateX(0)' },
    },
    'fade-right': {
        initial: { opacity: 0, transform: 'translateX(-40px)' },
        visible: { opacity: 1, transform: 'translateX(0)' },
    },
    'fade-in': {
        initial: { opacity: 0 },
        visible: { opacity: 1 },
    },
    'zoom-in': {
        initial: { opacity: 0, transform: 'scale(0.9)' },
        visible: { opacity: 1, transform: 'scale(1)' },
    },
    'zoom-out': {
        initial: { opacity: 0, transform: 'scale(1.1)' },
        visible: { opacity: 1, transform: 'scale(1)' },
    },
};

export function ScrollAnimate({
    children,
    animation = 'fade-up',
    delay = 0,
    duration = 600,
    threshold = 0.1,
    className = '',
    style = {},
}: ScrollAnimateProps) {
    const [ref, isVisible] = useScrollAnimation<HTMLDivElement>({ threshold });

    const animStyle = animationStyles[animation];
    const currentStyle = isVisible ? animStyle.visible : animStyle.initial;

    return (
        <div
            ref={ref}
            className={className}
            style={{
                ...style,
                ...currentStyle,
                transition: `opacity ${duration}ms ease-out ${delay}ms, transform ${duration}ms ease-out ${delay}ms`,
                willChange: 'opacity, transform',
            }}
        >
            {children}
        </div>
    );
}

export default ScrollAnimate;
