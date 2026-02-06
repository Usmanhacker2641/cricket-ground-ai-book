'use client';

/**
 * My Bookings Page - User booking history
 */
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { FiCalendar, FiClock, FiMapPin, FiX, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { useAuth } from '@/context/AuthContext';
import { bookingsApi } from '@/lib/api';
import LoadingSkeleton from '@/components/LoadingSkeleton';
import type { Booking } from '@/types';
import styles from './page.module.css';

export default function MyBookingsPage() {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [cancellingId, setCancellingId] = useState<number | null>(null);
    const { isAuthenticated, isLoading: authLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            router.push('/login');
            return;
        }
        if (isAuthenticated) {
            loadBookings();
        }
    }, [isAuthenticated, authLoading]);

    const loadBookings = async () => {
        try {
            const data = await bookingsApi.getMyBookings();
            setBookings(data.bookings);
        } catch (error) {
            console.error('Failed to load bookings:', error);
            toast.error('Failed to load bookings');
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancel = async (bookingId: number) => {
        if (!confirm('Are you sure you want to cancel this booking?')) return;

        setCancellingId(bookingId);
        try {
            await bookingsApi.cancel(bookingId);
            toast.success('Booking cancelled successfully');
            loadBookings();
        } catch (error: any) {
            toast.error(error.message || 'Failed to cancel booking');
        } finally {
            setCancellingId(null);
        }
    };

    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'confirmed': return styles.statusConfirmed;
            case 'cancelled': return styles.statusCancelled;
            case 'completed': return styles.statusCompleted;
            default: return '';
        }
    };

    if (authLoading || (!isAuthenticated && !isLoading)) {
        return (
            <div className={styles.page}>
                <div className={styles.container}>
                    <LoadingSkeleton type="card" count={3} />
                </div>
            </div>
        );
    }

    return (
        <div className={styles.page}>
            <div className={styles.container}>
                <motion.div
                    className={styles.header}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <h1>My Bookings</h1>
                    <p>Manage your cricket ground reservations</p>
                </motion.div>

                {isLoading ? (
                    <div className={styles.bookingsList}>
                        {[1, 2, 3].map((i) => (
                            <LoadingSkeleton key={i} type="card" />
                        ))}
                    </div>
                ) : bookings.length === 0 ? (
                    <motion.div
                        className={styles.emptyState}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <FiCalendar size={64} />
                        <h2>No Bookings Yet</h2>
                        <p>You haven't made any bookings. Start by exploring our cricket grounds!</p>
                        <button onClick={() => router.push('/book')} className="btn btn-primary">
                            Book a Ground
                        </button>
                    </motion.div>
                ) : (
                    <div className={styles.bookingsList}>
                        <AnimatePresence>
                            {bookings.map((booking, index) => (
                                <motion.div
                                    key={booking.id}
                                    className={styles.bookingCard}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, x: -100 }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <div className={styles.cardImage}>
                                        <img
                                            src={booking.ground.image_url || 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=400'}
                                            alt={booking.ground.name}
                                        />
                                    </div>

                                    <div className={styles.cardContent}>
                                        <div className={styles.cardHeader}>
                                            <h3>{booking.ground.name}</h3>
                                            <span className={`${styles.status} ${getStatusStyle(booking.status)}`}>
                                                {booking.status === 'confirmed' && <FiCheckCircle />}
                                                {booking.status === 'cancelled' && <FiAlertCircle />}
                                                {booking.status}
                                            </span>
                                        </div>

                                        <div className={styles.cardDetails}>
                                            <div className={styles.detailItem}>
                                                <FiMapPin />
                                                <span>{booking.ground.location}</span>
                                            </div>
                                            <div className={styles.detailItem}>
                                                <FiCalendar />
                                                <span>{new Date(booking.date).toLocaleDateString('en-IN', {
                                                    weekday: 'short',
                                                    month: 'short',
                                                    day: 'numeric',
                                                    year: 'numeric'
                                                })}</span>
                                            </div>
                                            <div className={styles.detailItem}>
                                                <FiClock />
                                                <span>{booking.time_slot}</span>
                                            </div>
                                        </div>

                                        {booking.notes && (
                                            <p className={styles.notes}>Notes: {booking.notes}</p>
                                        )}

                                        <div className={styles.cardFooter}>
                                            <div className={styles.price}>
                                                <span>Total</span>
                                                <strong>₹{booking.total_price.toLocaleString()}</strong>
                                            </div>

                                            {booking.status === 'confirmed' && (
                                                <button
                                                    className={styles.cancelBtn}
                                                    onClick={() => handleCancel(booking.id)}
                                                    disabled={cancellingId === booking.id}
                                                >
                                                    {cancellingId === booking.id ? 'Cancelling...' : (
                                                        <>
                                                            <FiX />
                                                            Cancel
                                                        </>
                                                    )}
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                )}
            </div>
        </div>
    );
}
