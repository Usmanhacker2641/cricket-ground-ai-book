'use client';

/**
 * Booking Calendar Component - Date selection for ground booking
 */
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, isToday, isBefore, startOfToday } from 'date-fns';
import styles from './BookingCalendar.module.css';

interface BookingCalendarProps {
    selectedDate: Date | null;
    onDateSelect: (date: Date) => void;
}

export default function BookingCalendar({ selectedDate, onDateSelect }: BookingCalendarProps) {
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const today = startOfToday();

    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

    // Get day of week for first day (0 = Sunday)
    const startDayOfWeek = monthStart.getDay();
    const emptyDays = Array.from({ length: startDayOfWeek }, (_, i) => i);

    const goToPreviousMonth = () => {
        setCurrentMonth(subMonths(currentMonth, 1));
    };

    const goToNextMonth = () => {
        setCurrentMonth(addMonths(currentMonth, 1));
    };

    const isDateDisabled = (date: Date) => {
        return isBefore(date, today);
    };

    return (
        <div className={styles.calendar}>
            {/* Header */}
            <div className={styles.header}>
                <button
                    onClick={goToPreviousMonth}
                    className={styles.navButton}
                    aria-label="Previous month"
                >
                    <FiChevronLeft size={20} />
                </button>

                <motion.h3
                    key={format(currentMonth, 'MMM-yyyy')}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={styles.monthTitle}
                >
                    {format(currentMonth, 'MMMM yyyy')}
                </motion.h3>

                <button
                    onClick={goToNextMonth}
                    className={styles.navButton}
                    aria-label="Next month"
                >
                    <FiChevronRight size={20} />
                </button>
            </div>

            {/* Weekday Names */}
            <div className={styles.weekdays}>
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                    <div key={day} className={styles.weekday}>
                        {day}
                    </div>
                ))}
            </div>

            {/* Days Grid */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={format(currentMonth, 'MMM-yyyy')}
                    className={styles.daysGrid}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                >
                    {/* Empty spaces for alignment */}
                    {emptyDays.map((i) => (
                        <div key={`empty-${i}`} className={styles.emptyDay} />
                    ))}

                    {/* Actual days */}
                    {days.map((day) => {
                        const isSelected = selectedDate && isSameDay(day, selectedDate);
                        const isCurrentDay = isToday(day);
                        const disabled = isDateDisabled(day);

                        return (
                            <motion.button
                                key={day.toISOString()}
                                onClick={() => !disabled && onDateSelect(day)}
                                disabled={disabled}
                                className={`
                  ${styles.day}
                  ${isSelected ? styles.selected : ''}
                  ${isCurrentDay ? styles.today : ''}
                  ${disabled ? styles.disabled : ''}
                `}
                                whileHover={!disabled ? { scale: 1.1 } : {}}
                                whileTap={!disabled ? { scale: 0.95 } : {}}
                            >
                                {format(day, 'd')}
                            </motion.button>
                        );
                    })}
                </motion.div>
            </AnimatePresence>
        </div>
    );
}
