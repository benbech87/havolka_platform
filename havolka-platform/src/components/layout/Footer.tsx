import Link from 'next/link'
import styles from './Footer.module.css'

export default function Footer() {
  return (
    <>
      {/* Trust strip */}
      <div className={styles.trust}>
        <div className={styles.trustItem}>
          <div className={styles.trustLabel}>Availability</div>
          <div className={styles.trustValue}>Trade-only. Not available in retail.</div>
        </div>
        <div className={styles.trustItem}>
          <div className={styles.trustLabel}>Ownership</div>
          <div className={styles.trustValue}>Australian owned and operated.</div>
        </div>
        <div className={styles.trustItem}>
          <div className={styles.trustLabel}>Service</div>
          <div className={styles.trustValue}>Direct account manager. Always.</div>
        </div>
        <div className={styles.trustItem}>
          <div className={styles.trustLabel}>Samples</div>
          <div className={styles.trustValue}>Free finish discs. Posted to your studio.</div>
        </div>
      </div>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.grid}>
          <div>
            <div className={styles.logo}>HAVOLKA</div>
            <div className={styles.tagline}>Premium architectural door hardware.<br />Trade membership by application.</div>
          </div>
          <div>
            <div className={styles.colTitle}>Products</div>
            <div className={styles.links}>
              <Link href="/products?cat=DOOR_LEVER">Door Levers</Link>
              <Link href="/products?cat=DOOR_KNOB">Door Knobs</Link>
              <Link href="/products?cat=FLUSH_PULL">Flush Pulls</Link>
              <Link href="/products?cat=HINGE">Hinges</Link>
              <Link href="/products?cat=DOOR_STOP">Door Stops</Link>
              <Link href="/products?cat=CABINET_HANDLE">Cabinet Handles</Link>
            </div>
          </div>
          <div>
            <div className={styles.colTitle}>Trade</div>
            <div className={styles.links}>
              <Link href="/for-trade">Apply for Membership</Link>
              <Link href="/portal">Member Login</Link>
              <Link href="/for-trade#schedule">Door Schedule Service</Link>
              <Link href="/finishes#samples">Finish Samples</Link>
              <Link href="/resources">Resources</Link>
            </div>
          </div>
          <div>
            <div className={styles.colTitle}>Company</div>
            <div className={styles.links}>
              <Link href="/about">The Brand</Link>
              <Link href="/finishes">Finishes</Link>
              <Link href="/contact">Contact</Link>
              <Link href="/trade-terms">Trade Terms</Link>
              <Link href="/privacy">Privacy Policy</Link>
            </div>
          </div>
        </div>
        <div className={styles.bottom}>
          <div className={styles.legal}>© {new Date().getFullYear()} HAVOLKA. All rights reserved.</div>
          <div className={styles.bdg}>A Bechelet Design Group brand</div>
        </div>
      </footer>
    </>
  )
}
