'use client';

/**
 * Navbar Component - Responsive navigation with animated tabs
 */
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMenu, FiX, FiUser, FiLogOut } from 'react-icons/fi';
import { GiCricketBat } from 'react-icons/gi';
import ThemeToggle from './ThemeToggle';
import { useAuth } from '@/context/AuthContext';
import styles from './Navbar.module.css';

const navItems = [
    { label: 'Home', href: '/' },
    { label: 'Company', href: '/company' },
    { label: 'Events', href: '/events' },
    { label: 'Gallery', href: '/gallery' },
    { label: 'Discounts', href: '/discounts' },
    { label: 'Contact', href: '/contact' },
];

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const pathname = usePathname();
    const { isAuthenticated, user, logout } = useAuth();

    // Handle scroll effect
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <motion.nav
            className={`${styles.navbar} ${isScrolled ? styles.scrolled : ''}`}
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
        >
            <div className={styles.container}>
                {/* Logo */}
                <Link href="/" className={styles.logo}>
                    <motion.div
                        whileHover={{ rotate: 15 }}
                        transition={{ duration: 0.3 }}
                    >
                        <GiCricketBat size={32} />
                    </motion.div>
                    <span>CricketBook</span>
                </Link>

                {/* Desktop Navigation */}
                <div className={styles.desktopNav}>
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`${styles.navLink} ${pathname === item.href ? styles.active : ''}`}
                        >
                            {item.label}
                            {pathname === item.href && (
                                <motion.div
                                    className={styles.activeIndicator}
                                    layoutId="activeIndicator"
                                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                                />
                            )}
                        </Link>
                    ))}
                </div>

                {/* Right Side Actions */}
                <div className={styles.actions}>
                    <ThemeToggle />

                    {isAuthenticated ? (
                        <div className={styles.userMenu}>
                            <Link href="/my-bookings" className={styles.userBtn}>
                                <FiUser />
                                <span>{user?.name?.split(' ')[0]}</span>
                            </Link>
                            <button onClick={logout} className={styles.logoutBtn} title="Logout">
                                <FiLogOut />
                            </button>
                        </div>
                    ) : (
                        <div className={styles.authButtons}>
                            <Link href="/login" className="btn btn-ghost">
                                Login
                            </Link>
                            <Link href="/signup" className="btn btn-primary">
                                Sign Up
                            </Link>
                        </div>
                    )}

                    {/* Mobile Menu Button */}
                    <button
                        className={styles.mobileMenuBtn}
                        onClick={() => setIsOpen(!isOpen)}
                        aria-label="Toggle menu"
                    >
                        {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Navigation */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        className={styles.mobileNav}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        {navItems.map((item, index) => (
                            <motion.div
                                key={item.href}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.05 }}
                            >
                                <Link
                                    href={item.href}
                                    className={`${styles.mobileNavLink} ${pathname === item.href ? styles.active : ''}`}
                                    onClick={() => setIsOpen(false)}
                                >
                                    {item.label}
                                </Link>
                            </motion.div>
                        ))}

                        {!isAuthenticated && (
                            <div className={styles.mobileAuthButtons}>
                                <Link href="/login" className="btn btn-ghost" onClick={() => setIsOpen(false)}>
                                    Login
                                </Link>
                                <Link href="/signup" className="btn btn-primary" onClick={() => setIsOpen(false)}>
                                    Sign Up
                                </Link>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.nav>
    );
}
