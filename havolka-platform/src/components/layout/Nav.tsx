'use client'
import { useState } from 'react'
import Link from 'next/link'
import styles from './Nav.module.css'

export default function Nav() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <nav className={styles.nav}>
      <Link href="/" className={styles.logo}>HAVOLKA</Link>

      <div className={styles.links}>
        <Link href="/products" className={styles.link}>Products</Link>
        <Link href="/finishes" className={styles.link}>Finishes</Link>
        <Link href="/about" className={styles.link}>The Brand</Link>
        <Link href="/for-trade" className={styles.link}>For Trade</Link>
        <Link href="/resources" className={styles.link}>Resources</Link>
      </div>

      <div className={styles.right}>
        <Link href="/portal" className={styles.login}>Login</Link>
        <Link href="/for-trade#apply" className={styles.apply}>Apply</Link>
      </div>

      <button className={styles.hamburger} onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
        <span /><span /><span />
      </button>

      {menuOpen && (
        <div className={styles.mobileMenu}>
          <Link href="/products" onClick={() => setMenuOpen(false)}>Products</Link>
          <Link href="/finishes" onClick={() => setMenuOpen(false)}>Finishes</Link>
          <Link href="/about" onClick={() => setMenuOpen(false)}>The Brand</Link>
          <Link href="/for-trade" onClick={() => setMenuOpen(false)}>For Trade</Link>
          <Link href="/resources" onClick={() => setMenuOpen(false)}>Resources</Link>
          <Link href="/contact" onClick={() => setMenuOpen(false)}>Contact</Link>
          <Link href="/portal" onClick={() => setMenuOpen(false)}>Member Login</Link>
          <Link href="/for-trade#apply" className={styles.mobileApply} onClick={() => setMenuOpen(false)}>Apply for Membership</Link>
        </div>
      )}
    </nav>
  )
}
