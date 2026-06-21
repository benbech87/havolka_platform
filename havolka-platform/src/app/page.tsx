import type { Metadata } from 'next'
import Link from 'next/link'
import Nav from '@/components/layout/Nav'
import Footer from '@/components/layout/Footer'
import styles from './page.module.css'

export const metadata: Metadata = {
  title: 'HAVOLKA — Premium Architectural Door Hardware',
  description: 'Trade-only architectural door hardware. Lever handles, hinges, flush pulls, and cabinet hardware across four premium finishes. Membership by application.',
}

const categories = [
  { name: 'Door Levers', sub: '6 styles · 4 finishes', cat: 'DOOR_LEVER' },
  { name: 'Door Knobs', sub: '3 styles · 4 finishes', cat: 'DOOR_KNOB' },
  { name: 'Flush Pulls', sub: '4 styles · 4 finishes', cat: 'FLUSH_PULL' },
  { name: 'Hinges', sub: '2 styles · 4 finishes', cat: 'HINGE' },
  { name: 'Door Stops', sub: '4 styles · 4 finishes', cat: 'DOOR_STOP' },
  { name: 'Flush Bolts', sub: '3 styles · 4 finishes', cat: 'FLUSH_BOLT' },
  { name: 'Cabinet Handles', sub: '2 styles · 4 finishes', cat: 'CABINET_HANDLE' },
  { name: 'Coming Soon', sub: 'Entrance Sets · 2026', cat: null },
]

const finishes = [
  { name: 'Smooth Black', color: '#1A1A18', context: 'Contemporary · Industrial · Transitional' },
  { name: 'Smooth Nickel', color: '#B4B4AC', context: 'Stone · Concrete · Light timber' },
  { name: 'Smooth Bronze', color: '#6B4A35', context: 'Warm timber · Aged brass · Terracotta' },
  { name: 'Smooth Graphite', color: '#464642', context: 'Coastal · Scandi · Contemporary' },
]

export default function HomePage() {
  return (
    <>
      <Nav />

      {/* HERO */}
      <section className={styles.hero}>
        <div className={styles.heroLeft}>
          <p className={styles.heroEyebrow}>Trade membership — by application</p>
          <h1 className={styles.heroH1}>
            Every handle.<br />
            Every hinge.<br />
            <em>Every finish.</em>
          </h1>
          <p className={styles.heroSub}>
            Specified by architects.<br />
            Built for the trade.
          </p>
          <div className={styles.heroCtas}>
            <Link href="/for-trade#apply" className={styles.btnWhite}>Apply for Membership</Link>
            <Link href="/finishes#samples" className={styles.btnGhost}>Request Finish Samples</Link>
          </div>
        </div>
        <div className={styles.heroRight}>
          {/* Photography placeholder — replaced via admin panel */}
          <div className={styles.heroImgPlaceholder}>
            <span>Photography</span>
          </div>
        </div>
      </section>

      {/* FINISH BAR */}
      <div className={styles.finishBar}>
        <span className={styles.finishBarLabel}>Finishes</span>
        <div className={styles.finishDiscs}>
          {finishes.map(f => (
            <Link href={`/finishes/${f.name.toLowerCase().replace(' ', '-')}`} key={f.name} className={styles.finishDisc}>
              <div className={styles.disc} style={{ background: f.color }} />
              <span className={styles.discName}>{f.name}</span>
            </Link>
          ))}
        </div>
        <Link href="/finishes#samples" className={styles.finishBarCta}>
          Request free finish samples
        </Link>
      </div>

      {/* SPLIT — The range */}
      <section className={styles.split}>
        <div className={styles.splitImg}>
          <div className={styles.imgPlaceholder} />
        </div>
        <div className={styles.splitContent}>
          <p className={styles.eyebrow}>The range</p>
          <h2 className={styles.splitH}>
            Hardware for<br />
            every opening.<br />
            <em>Designed to last.</em>
          </h2>
          <p className={styles.splitBody}>
            From lever sets to cabinet handles — a complete range across four consistent finishes. Specified once. Relied on for life.
          </p>
          <Link href="/products" className={styles.splitLink}>Browse all products</Link>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className={styles.categories}>
        <p className={styles.eyebrow}>Product families</p>
        <div className={styles.catGrid}>
          {categories.map(cat => (
            <Link
              href={cat.cat ? `/products?cat=${cat.cat}` : '/products'}
              key={cat.name}
              className={`${styles.catCard} ${!cat.cat ? styles.catComingSoon : ''}`}
            >
              <div className={styles.catImg} />
              <div className={styles.catName}>{cat.name}</div>
              <div className={styles.catSub}>{cat.sub}</div>
            </Link>
          ))}
        </div>
      </section>

      {/* SPLIT — Trade membership */}
      <section className={`${styles.split} ${styles.splitReverse}`}>
        <div className={styles.splitImg} style={{ background: '#0F0F0D' }}>
          <div className={styles.imgPlaceholder} />
        </div>
        <div className={styles.splitContent}>
          <p className={styles.eyebrow}>Trade membership</p>
          <h2 className={styles.splitH}>
            Built for<br />
            the trade.<br />
            <em>Available by<br />application.</em>
          </h2>
          <p className={styles.splitBody}>
            HAVOLKA is trade-only by design. Architects, designers, and builders apply for membership. Approved members access full pricing, quotes, BIM files, and a direct account manager.
          </p>
          <Link href="/for-trade" className={styles.splitLink}>Apply for membership</Link>
        </div>
      </section>

      {/* MEMBERSHIP STEPS */}
      <section className={styles.membership}>
        <p className={styles.eyebrow}>How it works</p>
        <div className={styles.steps}>
          {[
            { n: '01', t: 'Apply', b: 'Tell us about your practice. We look for fit and quality of work — not prestige or minimum spend.' },
            { n: '02', t: 'Get access', b: 'Approved members see full trade pricing, build PDF quotes, place orders, and download BIM and Revit files.' },
            { n: '03', t: 'Specify with confidence', b: 'Your account manager handles door schedules, finish samples, project pricing, and lead times.' },
          ].map(step => (
            <div key={step.n} className={styles.step}>
              <div className={styles.stepNum}>{step.n}</div>
              <div className={styles.stepTitle}>{step.t}</div>
              <div className={styles.stepBody}>{step.b}</div>
            </div>
          ))}
        </div>
      </section>

      {/* SPLIT — Finishes */}
      <section className={styles.split}>
        <div className={styles.splitImg} style={{ background: '#0F0F0D' }}>
          <div className={styles.imgPlaceholder} />
        </div>
        <div className={styles.splitContent}>
          <p className={styles.eyebrow}>Finishes</p>
          <h2 className={styles.splitH}>
            Four finishes.<br />
            <em>Every product.<br />No exceptions.</em>
          </h2>
          <p className={styles.splitBody}>
            Smooth Black, Smooth Nickel, Smooth Bronze, Smooth Graphite. Premium surface finish. Consistent across the entire range — from lever sets to cabinet handles.
          </p>
          <Link href="/finishes" className={styles.splitLink}>View the finish library</Link>
        </div>
      </section>

      {/* DOOR SCHEDULE OFFER */}
      <section className={styles.schedule}>
        <div>
          <p className={styles.scheduleEyebrow}>Complimentary service</p>
          <h2 className={styles.scheduleH}>
            We'll build your<br />
            <em>door schedule.</em>
          </h2>
          <p className={styles.scheduleBody}>
            Send us your floor plan. We map every product across every opening and deliver a formatted schedule — ready to hand to your builder or certifier.
          </p>
        </div>
        <div className={styles.scheduleCtas}>
          <Link href="/for-trade#schedule" className={styles.btnWhite}>Request a Door Schedule</Link>
          <Link href="/for-trade#schedule-info" className={styles.btnGhost}>See what's included</Link>
        </div>
      </section>

      <Footer />
    </>
  )
}
