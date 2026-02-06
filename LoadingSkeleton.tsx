'use client';

/**
 * Loading Skeleton Component - Animated placeholder for loading states
 */
import React from 'react';
import styles from './LoadingSkeleton.module.css';

interface LoadingSkeletonProps {
    type?: 'card' | 'text' | 'avatar' | 'button';
    count?: number;
    className?: string;
}

export default function LoadingSkeleton({
    type = 'card',
    count = 1,
    className = ''
}: LoadingSkeletonProps) {
    const items = Array.from({ length: count }, (_, i) => i);

    const renderSkeleton = () => {
        switch (type) {
            case 'text':
                return <div className={`${styles.skeleton} ${styles.text}`} />;
            case 'avatar':
                return <div className={`${styles.skeleton} ${styles.avatar}`} />;
            case 'button':
                return <div className={`${styles.skeleton} ${styles.button}`} />;
            case 'card':
            default:
                return (
                    <div className={styles.card}>
                        <div className={`${styles.skeleton} ${styles.image}`} />
                        <div className={styles.content}>
                            <div className={`${styles.skeleton} ${styles.title}`} />
                            <div className={`${styles.skeleton} ${styles.text}`} />
                            <div className={`${styles.skeleton} ${styles.text} ${styles.short}`} />
                        </div>
                    </div>
                );
        }
    };

    return (
        <div className={`${styles.container} ${className}`}>
            {items.map((i) => (
                <div key={i}>{renderSkeleton()}</div>
            ))}
        </div>
    );
}
