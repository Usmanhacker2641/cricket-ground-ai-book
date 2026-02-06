'use client';

/**
 * Glass Card Component - Reusable glassmorphism card
 */
import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';
import styles from './GlassCard.module.css';

interface GlassCardProps {
    children: ReactNode;
    className?: string;
    hover?: boolean;
    onClick?: () => void;
    delay?: number;
}

export default function GlassCard({
    children,
    className = '',
    hover = true,
    onClick,
    delay = 0
}: GlassCardProps) {
    return (
        <motion.div
            className={`${styles.card} ${hover ? styles.hoverEnabled : ''} ${className}`}
            onClick={onClick}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.5, delay }}
            whileHover={hover ? { y: -5 } : {}}
        >
            {children}
        </motion.div>
    );
}
