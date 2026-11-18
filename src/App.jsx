import { useEffect, useRef, useState } from 'react'
import {
  profile,
  stats,
  education,
  projects,
  skills,
  achievements,
} from './data.js'

/* ---------- hooks ---------- */

function useInView(options = { threshold: 0.15 }) {
  const ref = useRef(null)
  const [seen, setSeen] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        setSeen(true)
        io.disconnect()
      }
    }, options)
    io.observe(el)
    return () => io.disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return [ref, seen]
}

function Reveal({ children, delay = 0, className = '' }) {
  const [ref, seen] = useInView()
  return (
    <div
      ref={ref}
      className={`reveal ${seen ? 'in' : ''} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  )
}

function useTyping(words, speed = 80, pause = 1400) {
  const [text, setText] = useState('')
  const [i, setI] = useState(0)
  const [deleting, setDeleting] = useState(false)
  useEffect(() => {
    const word = words[i % words.length]
    let t
    if (!deleting && text === word) t = setTimeout(() => setDeleting(true), pause)
    else if (deleting && text === '') {
      setDeleting(false)
      setI((n) => n + 1)
    } else
      t = setTimeout(
        () => setText(deleting ? word.slice(0, text.length - 1) : word.slice(0, text.length + 1)),
        deleting ? speed / 2 : speed
      )
    return () => clearTimeout(t)
  }, [text, deleting, i, words, speed, pause])
  return text
}

function Counter({ value, decimals, suffix }) {
  const [ref, seen] = useInView()
  const [n, setN] = useState(0)
  useEffect(() => {
    if (!seen) return
    const start = performance.now()
    const dur = 1400
    let raf
    const tick = (now) => {
      const p = Math.min((now - start) / dur, 1)
      setN(value * (1 - Math.pow(1 - p, 3)))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [seen, value])
  return (
    <span ref={ref}>
      {n.toFixed(decimals)}
      {suffix}
    </span>
  )
}

/* ---------- background ---------- */

function ParticleBackground() {
  const canvasRef = useRef(null)
  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let w, h, raf
    const mouse = { x: -999, y: -999 }
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const resize = () => {
      w = canvas.width = window.innerWidth
      h = canvas.height = window.innerHeight
    }
    resize()
    const count = Math.min(70, Math.floor((w * h) / 20000))
    const pts = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
    }))
    const color = () =>
      getComputedStyle(document.documentElement).getPropertyValue('--particle').trim()
    const draw = () => {
      ctx.clearRect(0, 0, w, h)
      const c = color()
      ctx.fillStyle = c
      ctx.strokeStyle = c
      for (const p of pts) {
        if (!reduce) {
          p.x += p.vx
          p.y += p.vy
        }
        if (p.x < 0 || p.x > w) p.vx *= -1
        if (p.y < 0 || p.y > h) p.vy *= -1
        ctx.globalAlpha = 0.7
        ctx.beginPath()
        ctx.arc(p.x, p.y, 1.6, 0, Math.PI * 2)
        ctx.fill()
      }
      for (let a = 0; a < pts.length; a++) {
        for (let b = a + 1; b < pts.length; b++) {
          const d = Math.hypot(pts[a].x - pts[b].x, pts[a].y - pts[b].y)
          if (d < 130) {
            ctx.globalAlpha = (1 - d / 130) * 0.25
            ctx.beginPath()
            ctx.moveTo(pts[a].x, pts[a].y)
            ctx.lineTo(pts[b].x, pts[b].y)
            ctx.stroke()
          }
        }
        const dm = Math.hypot(pts[a].x - mouse.x, pts[a].y - mouse.y)
        if (dm < 160) {
          ctx.globalAlpha = (1 - dm / 160) * 0.5
          ctx.beginPath()
          ctx.moveTo(pts[a].x, pts[a].y)
          ctx.lineTo(mouse.x, mouse.y)
          ctx.stroke()
        }
      }
      raf = requestAnimationFrame(draw)
    }
    draw()
    const move = (e) => {
      mouse.x = e.clientX
      mouse.y = e.clientY
    }
    window.addEventListener('resize', resize)
    window.addEventListener('mousemove', move)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', move)
    }
  }, [])
  return <canvas ref={canvasRef} className="particles" aria-hidden="true" />
}

/* ---------- sections ---------- */

const NAV = ['about', 'education', 'projects', 'skills', 'achievements', 'contact']

function Navbar({ theme, toggleTheme }) {
  const [active, setActive] = useState('about')
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20)
      const max = document.documentElement.scrollHeight - window.innerHeight
      setProgress(max > 0 ? (window.scrollY / max) * 100 : 0)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: '-45% 0px -50% 0px' }
    )
    NAV.forEach((id) => {
      const el = document.getElementById(id)
      if (el) io.observe(el)
    })
    return () => {
      window.removeEventListener('scroll', onScroll)
      io.disconnect()
    }
  }, [])

  return (
    <header className={`nav ${scrolled ? 'scrolled' : ''}`}>
      <div className="progress" style={{ width: `${progress}%` }} />
      <div className="container nav-inner">
        <a href="#about" className="logo">
          <span className="logo-mark">CT</span>
          <span className="logo-text">Charan</span>
        </a>
        <nav className={`links ${open ? 'open' : ''}`}>
          {NAV.map((id) => (
            <a
              key={id}
              href={`#${id}`}
              className={active === id ? 'active' : ''}
              onClick={() => setOpen(false)}
            >
              {id}
            </a>
          ))}
        </nav>
        <div className="nav-actions">
          <button className="icon-btn" onClick={toggleTheme} aria-label="Toggle theme">
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
          <button
            className="icon-btn burger"
            onClick={() => setOpen((o) => !o)}
            aria-label="Menu"
            aria-expanded={open}
          >
            {open ? '✕' : '☰'}
          </button>
        </div>
      </div>
    </header>
  )
}

function Hero() {
  const role = useTyping(profile.roles)
  return (
    <section id="about" className="hero container">
      <div className="hero-text">
        <p className="eyebrow">👋 Hi, I'm</p>
        <h1>
          <span className="gradient">{profile.shortName}</span>
          <br />
          Panakanapalli
        </h1>
        <h2 className="typing">
          <span>{role}</span>
          <i className="caret" />
        </h2>
        <p className="lead">{profile.intro}</p>
        <div className="cta">
          <a href="#projects" className="btn primary">
            View Projects
          </a>
          <a href="#contact" className="btn ghost">
            Contact Me
          </a>
          <a href={profile.resume} className="btn ghost" target="_blank" rel="noreferrer">
            Resume ↗
          </a>
        </div>
        <div className="socials">
          <a href={profile.github} target="_blank" rel="noreferrer">
            GitHub
          </a>
          <a href={profile.linkedin} target="_blank" rel="noreferrer">
            LinkedIn
          </a>
          <a href={`mailto:${profile.email}`}>Email</a>
        </div>
      </div>
      <div className="hero-card" aria-hidden="true">
        <div className="code-window">
          <div className="dots">
            <i /> <i /> <i />
          </div>
          <pre>
            <code>
              <span className="k">const</span> <span className="v">charan</span> = {'{'}
              {'\n'}  <span className="p">college</span>: <span className="s">'IIIT Sri City'</span>,
              {'\n'}  <span className="p">degree</span>: <span className="s">'B.Tech CSE'</span>,
              {'\n'}  <span className="p">cgpa</span>: <span className="n">7.0</span>,
              {'\n'}  <span className="p">stack</span>: [<span className="s">'React'</span>,
              {'\n'}    <span className="s">'Spring Boot'</span>, <span className="s">'Node'</span>,
              {'\n'}    <span className="s">'MySQL'</span>],
              {'\n'}  <span className="p">loves</span>: <span className="s">'building things'</span>
              {'\n'}
              {'}'}
            </code>
          </pre>
        </div>
      </div>
    </section>
  )
}

function SectionTitle({ kicker, title }) {
  return (
    <Reveal>
      <div className="section-title">
        <span>{kicker}</span>
        <h2>{title}</h2>
      </div>
    </Reveal>
  )
}

function Stats() {
  return (
    <section className="container stats">
      {stats.map((s, i) => (
        <Reveal key={s.label} delay={i * 90}>
          <div className="stat">
            <b>
              <Counter value={s.value} decimals={s.decimals} suffix={s.suffix} />
            </b>
            <span>{s.label}</span>
          </div>
        </Reveal>
      ))}
    </section>
  )
}

function Education() {
  return (
    <section id="education" className="container section">
      <SectionTitle kicker="Journey" title="Education" />
      <div className="timeline">
        {education.map((e, i) => (
          <Reveal key={e.school} delay={i * 120}>
            <div className="tl-item">
              <span className="tl-dot" />
              <div className="card">
                <span className="period">{e.period}</span>
                <h3>{e.school}</h3>
                <p>{e.degree}</p>
                <span className="badge">{e.score}</span>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  )
}

function ProjectModal({ project, onClose }) {
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose])
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-label={project.title}
        onClick={(e) => e.stopPropagation()}
      >
        <button className="icon-btn close" onClick={onClose} aria-label="Close">
          ✕
        </button>
        <div className="emoji big">{project.emoji}</div>
        <h3>{project.title}</h3>
        <div className="tags">
          {project.tech.map((t) => (
            <span key={t} className="tag">
              {t}
            </span>
          ))}
        </div>
        <ul>
          {project.points.map((p) => (
            <li key={p}>{p}</li>
          ))}
        </ul>
        <a className="btn primary" href={project.github} target="_blank" rel="noreferrer">
          View on GitHub ↗
        </a>
      </div>
    </div>
  )
}

function Projects() {
  const types = ['All', ...new Set(projects.map((p) => p.type))]
  const [filter, setFilter] = useState('All')
  const [selected, setSelected] = useState(null)
  const list = projects.filter((p) => filter === 'All' || p.type === filter)

  const tilt = (e) => {
    const el = e.currentTarget
    const r = el.getBoundingClientRect()
    const x = (e.clientX - r.left) / r.width - 0.5
    const y = (e.clientY - r.top) / r.height - 0.5
    el.style.transform = `perspective(800px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) translateY(-4px)`
  }
  const untilt = (e) => (e.currentTarget.style.transform = '')

  return (
    <section id="projects" className="container section">
      <SectionTitle kicker="Work" title="Projects" />
      <div className="filters">
        {types.map((t) => (
          <button key={t} className={filter === t ? 'chip active' : 'chip'} onClick={() => setFilter(t)}>
            {t}
          </button>
        ))}
      </div>
      <div className="grid projects">
        {list.map((p, i) => (
          <Reveal key={p.title} delay={i * 100}>
            <article
              className="card project"
              onMouseMove={tilt}
              onMouseLeave={untilt}
              onClick={() => setSelected(p)}
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && setSelected(p)}
            >
              <div className="emoji">{p.emoji}</div>
              <h3>{p.title}</h3>
              <p>{p.summary}</p>
              <div className="tags">
                {p.tech.map((t) => (
                  <span key={t} className="tag">
                    {t}
                  </span>
                ))}
              </div>
              <span className="more">Read details →</span>
            </article>
          </Reveal>
        ))}
      </div>
      {selected && <ProjectModal project={selected} onClose={() => setSelected(null)} />}
    </section>
  )
}

function Skills() {
  const groups = Object.keys(skills)
  const [active, setActive] = useState(groups[0])
  return (
    <section id="skills" className="container section">
      <SectionTitle kicker="Toolbox" title="Skills" />
      <Reveal>
        <div className="skills-wrap card">
          <div className="skill-tabs" role="tablist">
            {groups.map((g) => (
              <button
                key={g}
                role="tab"
                aria-selected={active === g}
                className={active === g ? 'tab active' : 'tab'}
                onClick={() => setActive(g)}
              >
                {g}
              </button>
            ))}
          </div>
          <div className="skill-list" key={active}>
            {skills[active].map((s, i) => (
              <span key={s} className="skill" style={{ animationDelay: `${i * 60}ms` }}>
                {s}
              </span>
            ))}
          </div>
        </div>
      </Reveal>
    </section>
  )
}

function Achievements() {
  return (
    <section id="achievements" className="container section">
      <SectionTitle kicker="Highlights" title="Achievements" />
      <div className="grid ach">
        {achievements.map((a, i) => (
          <Reveal key={a.text} delay={i * 80}>
            <div className="card ach-card">
              <span className="emoji">{a.icon}</span>
              <p>{a.text}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  )
}

function Contact() {
  const [form, setForm] = useState({ name: '', message: '' })
  const [copied, setCopied] = useState(false)
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(profile.email)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch {
      /* clipboard unavailable */
    }
  }
  // No backend needed: the form opens the visitor's mail app with the message pre-filled.
  const submit = (e) => {
    e.preventDefault()
    const subject = encodeURIComponent(`Portfolio message from ${form.name}`)
    const body = encodeURIComponent(form.message)
    window.location.href = `mailto:${profile.email}?subject=${subject}&body=${body}`
  }
  return (
    <section id="contact" className="container section">
      <SectionTitle kicker="Say hello" title="Contact" />
      <Reveal>
        <div className="contact card">
          <div>
            <h3>Let's build something together.</h3>
            <p>Open to internships, collaborations and interesting full-stack projects.</p>
            <div className="contact-links">
              <button className="btn ghost" onClick={copy}>
                {copied ? '✅ Copied!' : `📋 ${profile.email}`}
              </button>
              <a className="btn ghost" href={`tel:${profile.phone.replace(/\s/g, '')}`}>
                📞 {profile.phone}
              </a>
              <a className="btn ghost" href={profile.github} target="_blank" rel="noreferrer">
                GitHub ↗
              </a>
              <a className="btn ghost" href={profile.linkedin} target="_blank" rel="noreferrer">
                LinkedIn ↗
              </a>
            </div>
          </div>
          <form onSubmit={submit}>
            <input
              required
              placeholder="Your name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <textarea
              required
              rows="4"
              placeholder="Your message"
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
            />
            <button className="btn primary" type="submit">
              Send via Email ✉
            </button>
          </form>
        </div>
      </Reveal>
    </section>
  )
}

/* ---------- app ---------- */

export default function App() {
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem('theme') || 'dark'
    } catch {
      return 'dark'
    }
  })
  useEffect(() => {
    document.documentElement.dataset.theme = theme
    try {
      localStorage.setItem('theme', theme)
    } catch {
      /* storage unavailable */
    }
  }, [theme])

  return (
    <>
      <ParticleBackground />
      <Navbar theme={theme} toggleTheme={() => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))} />
      <main>
        <Hero />
        <Stats />
        <Education />
        <Projects />
        <Skills />
        <Achievements />
        <Contact />
      </main>
      <footer className="footer">
        <p>© {new Date().getFullYear()} {profile.name}. Built with React.</p>
      </footer>
    </>
  )
}
