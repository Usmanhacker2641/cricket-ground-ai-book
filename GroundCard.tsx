'use client';

/**
 * Ground Card Component - Display cricket ground information
 */
import React from 'react';
import { motion } from 'framer-motion';
import { FiMapPin, FiUsers, FiDollarSign } from 'react-icons/fi';
import Link from 'next/link';
import type { Ground } from '@/types';
import styles from './GroundCard.module.css';

interface GroundCardProps {
    ground: Ground;
    index?: number;
}

export default function GroundCard({ ground, index = 0 }: GroundCardProps) {
    return (
        <motion.div
            className={styles.card}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ y: -8 }}
        >
            {/* Image */}
            <div className={styles.imageWrapper}>
                <img
                    src={ground.image_url || 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=800'}
                    alt={ground.name}
                    className={styles.image}
                />
                <div className={styles.imageOverlay} />
                <div className={styles.priceTag}>
                    <FiDollarSign size={14} />
                    <span>₹{ground.price_per_hour}/hr</span>
                </div>
            </div>

            {/* Content */}
            <div className={styles.content}>
                <h3 className={styles.name}>{ground.name}</h3>

                <div className={styles.location}>
                    <FiMapPin size={14} />
                    <span>{ground.location}</span>
                </div>

                <p className={styles.description}>
                    {ground.description || 'A premium cricket ground with excellent facilities.'}
                </p>

                <div className={styles.footer}>
                    <div className={styles.capacity}>
                        <FiUsers size={14} />
                        <span>Up to {ground.capacity} players</span>
                    </div>

                    <Link href={`/book?ground=${ground.id}`} className={styles.bookBtn}>
                        Book Now
                    </Link>
                </div>
            </div>
        </motion.div>
    );
}
