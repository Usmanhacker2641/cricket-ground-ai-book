'use client';

/**
 * Footer Component - Site footer with links and contact info
 */
import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FiMail, FiPhone, FiMapPin, FiInstagram, FiTwitter, FiFacebook, FiYoutube } from 'react-icons/fi';
import { GiCricketBat } from 'react-icons/gi';
import styles from './Footer.module.css';

const footerLinks = {
    company: [
        { label: 'About Us', href: '/company' },
        { label: 'Our Team', href: '/company#team' },
        { label: 'Careers', href: '/company#careers' },
        { label: 'Press', href: '/company#press' },
    ],
    services: [
        { label: 'Book Ground', href: '/book' },
        { label: 'Events', href: '/events' },
        { label: 'Gallery', href: '/gallery' },
        { label: 'Discounts', href: '/discounts' },
    ],
    support: [
        { label: 'Contact Us', href: '/contact' },
        { label: 'FAQs', href: '/contact#faq' },
        { label: 'Terms of Service', href: '/terms' },
        { label: 'Privacy Policy', href: '/privacy' },
    ],
};

const socialLinks = [
    { icon: FiInstagram, href: 'https://instagram.com', label: 'Instagram' },
    { icon: FiTwitter, href: 'https://twitter.com', label: 'Twitter' },
    { icon: FiFacebook, href: 'https://facebook.com', label: 'Facebook' },
    { icon: FiYoutube, href: 'https://youtube.com', label: 'YouTube' },
];

export default function Footer() {
    return (
        <footer className={styles.footer}>
            <div className={styles.container}>
                <div className={styles.grid}>
                    {/* Brand Section */}
                    <div className={styles.brand}>
                        <Link href="/" className={styles.logo}>
                            <GiCricketBat size={32} />
                            <span>CricketBook</span>
                        </Link>
                        <p className={styles.description}>
                            Your premier destination for booking cricket grounds. Play your favorite sport at the best venues with easy online booking.
                        </p>
                        <div className={styles.socials}>
                            {socialLinks.map((social) => (
                                <motion.a
                                    key={social.label}
                                    href={social.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={styles.socialLink}
                                    whileHover={{ scale: 1.1, y: -2 }}
                                    whileTap={{ scale: 0.95 }}
                                    aria-label={social.label}
                                >
                                    <social.icon size={20} />
                                </motion.a>
                            ))}
                        </div>
                    </div>

                    {/* Links Section */}
                    <div className={styles.linksSection}>
                        <h4>Company</h4>
                        <ul>
                            {footerLinks.company.map((link) => (
                                <li key={link.href}>
                                    <Link href={link.href}>{link.label}</Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className={styles.linksSection}>
                        <h4>Services</h4>
                        <ul>
                            {footerLinks.services.map((link) => (
                                <li key={link.href}>
                                    <Link href={link.href}>{link.label}</Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className={styles.linksSection}>
                        <h4>Support</h4>
                        <ul>
                            {footerLinks.support.map((link) => (
                                <li key={link.href}>
                                    <Link href={link.href}>{link.label}</Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Section */}
                    <div className={styles.contactSection}>
                        <h4>Contact Us</h4>
                        <ul className={styles.contactList}>
                            <li>
                                <FiMail />
                                <a href="mailto:info@cricketbook.com">info@cricketbook.com</a>
                            </li>
                            <li>
                                <FiPhone />
                                <a href="tel:+919876543210">+91 98765 43210</a>
                            </li>
                            <li>
                                <FiMapPin />
                                <span>Mumbai, Maharashtra, India</span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className={styles.bottomBar}>
                    <p>© {new Date().getFullYear()} CricketBook. All rights reserved.</p>
                    <p>Made with ❤️ for cricket lovers</p>
                </div>
            </div>
        </footer>
    );
}
