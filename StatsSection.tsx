'use client';

/**
 * Stats Section Component - Animated statistics display
 */
import React, { useEffect, useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { GiCricketBat } from 'react-icons/gi';
import { FiCalendar, FiUsers, FiMapPin } from 'react-icons/fi';
import styles from './StatsSection.module.css';

interface Stat {
    icon: React.ReactNode;
    value: number;
    label: string;
    suffix?: string;
}

const stats: Stat[] = [
    { icon: <FiMapPin size={28} />, value: 50, label: 'Cricket Grounds', suffix: '+' },
    { icon: <FiCalendar size={28} />, value: 10000, label: 'Bookings Made', suffix: '+' },
    { icon: <FiUsers size={28} />, value: 25000, label: 'Happy Players', suffix: '+' },
    { icon: <GiCricketBat size={28} />, value: 15, label: 'Cities Covered', suffix: '' },
];

function AnimatedNumber({ value, suffix = '' }: { value: number; suffix?: string }) {
    const [count, setCount] = useState(0);
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: '-100px' });

    useEffect(() => {
        if (isInView) {
            const duration = 2000;
            const steps = 60;
            const stepValue = value / steps;
            let current = 0;

            const timer = setInterval(() => {
                current += stepValue;
                if (current >= value) {
                    setCount(value);
                    clearInterval(timer);
                } else {
                    setCount(Math.floor(current));
                }
            }, duration / steps);

            return () => clearInterval(timer);
        }
    }, [isInView, value]);

    return (
        <span ref={ref}>
            {count.toLocaleString()}{suffix}
        </span>
    );
}

export default function StatsSection() {
    const containerRef = useRef(null);
    const isInView = useInView(containerRef, { once: true, margin: '-50px' });

    return (
        <section className={styles.section} ref={containerRef}>
            <div className={styles.container}>
                <motion.div
                    className={styles.header}
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6 }}
                >
                    <h2>Trusted by Thousands of Players</h2>
                    <p>Join our growing community of cricket enthusiasts</p>
                </motion.div>

                <div className={styles.statsGrid}>
                    {stats.map((stat, index) => (
                        <motion.div
                            key={stat.label}
                            className={styles.statCard}
                            initial={{ opacity: 0, y: 40 }}
                            animate={isInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.6, delay: index * 0.1 }}
                        >
                            <div className={styles.iconWrapper}>
                                {stat.icon}
                            </div>
                            <div className={styles.value}>
                                <AnimatedNumber value={stat.value} suffix={stat.suffix} />
                            </div>
                            <div className={styles.label}>{stat.label}</div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
