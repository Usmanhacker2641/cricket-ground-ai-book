'use client';

/**
 * Time Slot Picker Component - Select booking time slots
 */
import React from 'react';
import { motion } from 'framer-motion';
import { FiClock, FiCheck, FiX } from 'react-icons/fi';
import styles from './TimeSlotPicker.module.css';

interface TimeSlotPickerProps {
    availableSlots: string[];
    bookedSlots: string[];
    selectedSlot: string | null;
    onSlotSelect: (slot: string) => void;
    isLoading?: boolean;
}

const ALL_SLOTS = [
    '06:00 - 08:00',
    '08:00 - 10:00',
    '10:00 - 12:00',
    '12:00 - 14:00',
    '14:00 - 16:00',
    '16:00 - 18:00',
    '18:00 - 20:00',
    '20:00 - 22:00',
];

export default function TimeSlotPicker({
    availableSlots,
    bookedSlots,
    selectedSlot,
    onSlotSelect,
    isLoading = false,
}: TimeSlotPickerProps) {
    const getSlotStatus = (slot: string) => {
        if (bookedSlots.includes(slot)) return 'booked';
        if (availableSlots.includes(slot)) return 'available';
        return 'unknown';
    };

    if (isLoading) {
        return (
            <div className={styles.container}>
                <h4 className={styles.title}>
                    <FiClock />
                    <span>Select Time Slot</span>
                </h4>
                <div className={styles.grid}>
                    {ALL_SLOTS.map((slot) => (
                        <div key={slot} className={`${styles.slot} ${styles.loading}`}>
                            <span className={styles.slotTime}>{slot}</span>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <h4 className={styles.title}>
                <FiClock />
                <span>Select Time Slot</span>
            </h4>

            <div className={styles.legend}>
                <div className={styles.legendItem}>
                    <span className={`${styles.legendDot} ${styles.available}`} />
                    <span>Available</span>
                </div>
                <div className={styles.legendItem}>
                    <span className={`${styles.legendDot} ${styles.booked}`} />
                    <span>Booked</span>
                </div>
                <div className={styles.legendItem}>
                    <span className={`${styles.legendDot} ${styles.selected}`} />
                    <span>Selected</span>
                </div>
            </div>

            <div className={styles.grid}>
                {ALL_SLOTS.map((slot, index) => {
                    const status = getSlotStatus(slot);
                    const isSelected = selectedSlot === slot;
                    const isBooked = status === 'booked';

                    return (
                        <motion.button
                            key={slot}
                            onClick={() => !isBooked && onSlotSelect(slot)}
                            disabled={isBooked}
                            className={`
                ${styles.slot}
                ${isSelected ? styles.slotSelected : ''}
                ${isBooked ? styles.slotBooked : ''}
                ${status === 'available' ? styles.slotAvailable : ''}
              `}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            whileHover={!isBooked ? { scale: 1.02 } : {}}
                            whileTap={!isBooked ? { scale: 0.98 } : {}}
                        >
                            <span className={styles.slotTime}>{slot}</span>
                            <span className={styles.slotIcon}>
                                {isSelected && <FiCheck size={18} />}
                                {isBooked && <FiX size={18} />}
                            </span>
                        </motion.button>
                    );
                })}
            </div>
        </div>
    );
}
