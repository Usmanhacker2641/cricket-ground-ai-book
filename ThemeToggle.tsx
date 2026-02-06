'use client';

/**
 * Theme Toggle Component - Dark/Light mode switch with animation
 */
import React from 'react';
import { motion } from 'framer-motion';
import { FiSun, FiMoon } from 'react-icons/fi';
import { useTheme } from '@/context/ThemeContext';
import styles from './ThemeToggle.module.css';

export default function ThemeToggle() {
    const { theme, toggleTheme } = useTheme();

    return (
        <motion.button
            className={styles.toggle}
            onClick={toggleTheme}
            whileTap={{ scale: 0.9 }}
            whileHover={{ scale: 1.1 }}
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
            <motion.div
                className={styles.iconWrapper}
                initial={false}
                animate={{
                    rotate: theme === 'dark' ? 180 : 0,
                }}
                transition={{ duration: 0.3 }}
            >
                {theme === 'light' ? (
                    <FiMoon size={20} />
                ) : (
                    <FiSun size={20} />
                )}
            </motion.div>
        </motion.button>
    );
}
