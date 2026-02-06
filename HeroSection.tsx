'use client';

/**
 * Hero Section Component - Animated hero with cricket background
 */
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FiArrowRight, FiPlay } from 'react-icons/fi';
import styles from './HeroSection.module.css';

// Animation frames from the provided folder
const FRAME_COUNT = 87;
const FRAME_INTERVAL = 100; // ms between frames

export default function HeroSection() {
    const [currentFrame, setCurrentFrame] = useState(1);

    // Animate through frames
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentFrame((prev) => (prev >= FRAME_COUNT ? 1 : prev + 1));
        }, FRAME_INTERVAL);
        return () => clearInterval(interval);
    }, []);

    const frameNumber = String(currentFrame).padStart(3, '0');

    return (
        <section className={styles.hero}>
            {/* Animated Background */}
            <div className={styles.backgroundWrapper}>
                <motion.div
                    className={styles.frameContainer}
                    key={currentFrame}
                    initial={{ opacity: 0.8 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.05 }}
                >
                    <img
                        src={`/cricket-frames/ezgif-frame-${frameNumber}.jpg`}
                        alt="Cricket animation"
                        className={styles.backgroundFrame}
                    />
                </motion.div>
                <div className={styles.overlay} />
            </div>

            {/* Hero Content */}
            <div className={styles.content}>
                <motion.div
                    className={styles.badge}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <FiPlay size={14} />
                    <span>#1 Cricket Ground Booking Platform</span>
                </motion.div>

                <motion.h1
                    className={styles.title}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                >
                    Book Your Perfect <br />
                    <span className={styles.highlight}>Cricket Ground</span>
                </motion.h1>

                <motion.p
                    className={styles.subtitle}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                >
                    Discover and book the best cricket grounds near you. Play with friends,
                    host tournaments, and enjoy the sport you love!
                </motion.p>

                <motion.div
                    className={styles.actions}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                >
                    <Link href="/book" className={styles.primaryBtn}>
                        Book Your Ground Now
                        <FiArrowRight />
                    </Link>
                    <Link href="/gallery" className={styles.secondaryBtn}>
                        Explore Grounds
                    </Link>
                </motion.div>

                {/* Quick Stats */}
                <motion.div
                    className={styles.quickInfo}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.5 }}
                >
                    <div className={styles.infoItem}>
                        <span className={styles.infoIcon}>✓</span>
                        <span>Instant Booking</span>
                    </div>
                    <div className={styles.infoItem}>
                        <span className={styles.infoIcon}>✓</span>
                        <span>Best Prices</span>
                    </div>
                    <div className={styles.infoItem}>
                        <span className={styles.infoIcon}>✓</span>
                        <span>Premium Grounds</span>
                    </div>
                </motion.div>
            </div>

            {/* Scroll Indicator */}
            <motion.div
                className={styles.scrollIndicator}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, y: [0, 10, 0] }}
                transition={{
                    opacity: { delay: 1 },
                    y: { repeat: Infinity, duration: 1.5 }
                }}
            >
                <div className={styles.scrollMouse}>
                    <div className={styles.scrollWheel} />
                </div>
                <span>Scroll to explore</span>
            </motion.div>
        </section>
    );
}
