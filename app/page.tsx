import HeroCanvas from "./HeroCanvas";

const mono = "var(--font-mono), monospace";
const sans = "var(--font-sans), sans-serif";

const skills = [
  "Python",
  "JavaScript",
  "Node.js",
  "FastAPI",
  "AWS",
  "Claude Code",
  "Codex",
  "React",
  "Supabase",
  "Vercel",
  "GitHub",
];

const projects = [
  {
    n: "01",
    title: "Semantic Doc Search",
    desc: "RAG pipeline over private documents with a FastAPI backend, vector store and a clean React console.",
    tags: ["Python", "FastAPI", "Claude", "Supabase"],
  },
  {
    n: "02",
    title: "Realtime Event Pipeline",
    desc: "Event ingestion and processing on AWS with a Node service feeding live dashboards.",
    tags: ["Node.js", "AWS", "JavaScript"],
  },
  {
    n: "03",
    title: "Agent Workbench",
    desc: "A UI to orchestrate and inspect autonomous coding agents from prompt to pull request.",
    tags: ["React", "Vercel", "Codex"],
  },
  {
    n: "04",
    title: "API Gateway Starter",
    desc: "Typed backend boilerplate with auth, rate limiting and observability baked in.",
    tags: ["FastAPI", "Python", "GitHub"],
  },
];

export default function Home() {
  return (
    <div style={{ position: "relative", overflowX: "hidden" }}>
      <header
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "18px 40px",
          backdropFilter: "blur(14px)",
          WebkitBackdropFilter: "blur(14px)",
          background: "rgba(8,9,12,0.55)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          boxSizing: "border-box",
        }}
      >
        <a
          href="#top"
          style={{
            fontFamily: mono,
            fontSize: 14,
            letterSpacing: "0.18em",
            color: "#e8e9ec",
            textDecoration: "none",
            fontWeight: 500,
          }}
        >
          DGF<span style={{ color: "#4fd6e0" }}>.</span>
        </a>
        <nav
          className="nav-links"
          style={{
            display: "flex",
            gap: 34,
            alignItems: "center",
            fontFamily: mono,
            fontSize: 12.5,
            letterSpacing: "0.06em",
          }}
        >
          <a href="#work" className="nav-link">
            Work
          </a>
          <a href="#about" className="nav-link">
            About
          </a>
          <a href="#contact" className="nav-link">
            Contact
          </a>
        </nav>
        <a
          href="#contact"
          className="btn-avail"
          style={{
            fontFamily: mono,
            fontSize: 12.5,
            letterSpacing: "0.04em",
            color: "#08090c",
            background: "#4fd6e0",
            padding: "9px 16px",
            borderRadius: 999,
            textDecoration: "none",
            fontWeight: 500,
          }}
        >
          Available ↗
        </a>
      </header>

      <section
        id="top"
        style={{
          position: "relative",
          minHeight: "100vh",
          display: "grid",
          gridTemplateColumns: "1.08fr 0.92fr",
          gap: 48,
          alignItems: "center",
          padding: "130px 48px 70px",
          maxWidth: 1440,
          margin: "0 auto",
          boxSizing: "border-box",
        }}
      >
        <div style={{ position: "relative", zIndex: 2 }}>
          <h1
            style={{
              fontFamily: sans,
              fontWeight: 800,
              fontSize: "clamp(46px,6.4vw,98px)",
              lineHeight: 0.94,
              letterSpacing: "-0.03em",
              margin: 0,
              color: "#f2f3f5",
            }}
          >
            Daniel Garcia
            <br />
            Fonseca<span style={{ color: "#4fd6e0" }}>.</span>
          </h1>
          <p
            style={{
              fontFamily: sans,
              fontWeight: 400,
              fontSize: "clamp(16px,1.4vw,20px)",
              lineHeight: 1,
              margin: "14px 0 0",
              color: "#f2f3f5",
            }}
          >
            Software AI Developer
          </p>
        </div>

        <div
          id="hero-canvas"
          style={{
            position: "relative",
            width: "100%",
            height: "100%",
            minHeight: 560,
            background:
              "radial-gradient(circle at 55% 45%, rgba(79,214,224,0.07), rgba(8,9,12,0) 60%)",
          }}
        >
          <HeroCanvas heroViz="sphere" skills={skills} nodeDensity={1.8} />
        </div>

        <a
          href="#work"
          className="scroll-arrow"
          aria-label="Scroll to work"
          style={{
            position: "absolute",
            left: "50%",
            bottom: 34,
            transform: "translateX(-50%)",
            zIndex: 3,
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: 44,
            height: 44,
            color: "#9aa0aa",
            textDecoration: "none",
          }}
        >
          <span
            style={{
              display: "inline-flex",
              animation: "floaty 2.4s ease-in-out infinite",
            }}
          >
            <svg
              width="26"
              height="26"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M12 5v14M6 13l6 6 6-6" />
            </svg>
          </span>
        </a>
      </section>

      <section
        id="work"
        style={{
          padding: "96px 48px",
          maxWidth: 1440,
          margin: "0 auto",
          boxSizing: "border-box",
          borderTop: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 20,
            marginBottom: 56,
          }}
        >
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 14,
                marginBottom: 18,
              }}
            >
              <span
                style={{
                  fontFamily: mono,
                  fontSize: 12,
                  letterSpacing: "0.14em",
                  color: "#4fd6e0",
                }}
              >
                (01)
              </span>
              <span
                style={{
                  fontFamily: mono,
                  fontSize: 12,
                  letterSpacing: "0.2em",
                  color: "#7f8794",
                  textTransform: "uppercase",
                }}
              >
                Selected Work
              </span>
            </div>
            <h2
              style={{
                fontFamily: sans,
                fontWeight: 700,
                fontSize: "clamp(32px,4vw,52px)",
                letterSpacing: "-0.02em",
                margin: 0,
                color: "#f2f3f5",
              }}
            >
              Things I&apos;ve built
            </h2>
          </div>
          <span
            style={{
              fontFamily: mono,
              fontSize: 12.5,
              color: "#6b727d",
              maxWidth: 280,
            }}
          >
            A selection of AI and backend projects — production systems and
            developer tooling.
          </span>
        </div>

        <div
          className="col2"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 26,
          }}
        >
          {projects.map((p) => (
            <a
              key={p.n}
              href="#work"
              className="project-card"
              style={{
                display: "block",
                textDecoration: "none",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 16,
                padding: 18,
                background: "#0a0c10",
              }}
            >
              <div
                style={{
                  aspectRatio: "16 / 9",
                  borderRadius: 11,
                  background:
                    "repeating-linear-gradient(135deg,#0e1117 0 13px,#0b0d12 13px 26px)",
                  border: "1px solid rgba(255,255,255,0.06)",
                  display: "flex",
                  alignItems: "flex-end",
                  justifyContent: "space-between",
                  padding: 16,
                  boxSizing: "border-box",
                  marginBottom: 20,
                }}
              >
                <span
                  style={{
                    fontFamily: mono,
                    fontSize: 11,
                    letterSpacing: "0.1em",
                    color: "#4a5460",
                  }}
                >
                  {p.n} / PROJECT
                </span>
                <span
                  style={{
                    fontFamily: mono,
                    fontSize: 11,
                    letterSpacing: "0.1em",
                    color: "#4a5460",
                  }}
                >
                  project shot
                </span>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 14,
                  marginBottom: 10,
                }}
              >
                <h3
                  style={{
                    fontFamily: sans,
                    fontWeight: 600,
                    fontSize: 22,
                    letterSpacing: "-0.01em",
                    margin: 0,
                    color: "#eef0f2",
                  }}
                >
                  {p.title}
                </h3>
                <span style={{ color: "#4fd6e0", fontSize: 18 }}>↗</span>
              </div>
              <p
                style={{
                  margin: "0 0 18px",
                  fontSize: 15,
                  lineHeight: 1.55,
                  color: "#8b919b",
                  maxWidth: "46ch",
                }}
              >
                {p.desc}
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {p.tags.map((tag) => (
                  <span
                    key={tag}
                    style={{
                      fontFamily: mono,
                      fontSize: 11.5,
                      color: "#7f8794",
                      border: "1px solid rgba(255,255,255,0.09)",
                      padding: "5px 11px",
                      borderRadius: 999,
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </a>
          ))}
        </div>
      </section>

      <section
        id="about"
        style={{
          padding: "96px 48px",
          maxWidth: 1440,
          margin: "0 auto",
          boxSizing: "border-box",
          borderTop: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div
          className="col2"
          style={{
            display: "grid",
            gridTemplateColumns: "0.85fr 1.15fr",
            gap: 60,
            alignItems: "start",
          }}
        >
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 14,
                marginBottom: 18,
              }}
            >
              <span
                style={{
                  fontFamily: mono,
                  fontSize: 12,
                  letterSpacing: "0.14em",
                  color: "#4fd6e0",
                }}
              >
                (02)
              </span>
              <span
                style={{
                  fontFamily: mono,
                  fontSize: 12,
                  letterSpacing: "0.2em",
                  color: "#7f8794",
                  textTransform: "uppercase",
                }}
              >
                About
              </span>
            </div>
            <div
              style={{
                width: "100%",
                aspectRatio: "1 / 1",
                maxWidth: 300,
                borderRadius: 14,
                background:
                  "repeating-linear-gradient(135deg,#0e1117 0 13px,#0b0d12 13px 26px)",
                border: "1px solid rgba(255,255,255,0.07)",
                display: "flex",
                alignItems: "flex-end",
                padding: 16,
                boxSizing: "border-box",
              }}
            >
              <span
                style={{
                  fontFamily: mono,
                  fontSize: 11,
                  letterSpacing: "0.1em",
                  color: "#4a5460",
                }}
              >
                portrait
              </span>
            </div>
          </div>
          <div>
            <h2
              style={{
                fontFamily: sans,
                fontWeight: 600,
                fontSize: "clamp(26px,3vw,38px)",
                lineHeight: 1.3,
                letterSpacing: "-0.015em",
                margin: "0 0 28px",
                color: "#e9ebed",
                maxWidth: "24ch",
              }}
            >
              Junior developer focused on AI systems, clean backends and
              shipping real products.
            </h2>
            <p
              style={{
                fontSize: 17,
                lineHeight: 1.7,
                color: "#9aa0aa",
                margin: "0 0 18px",
                maxWidth: "60ch",
              }}
            >
              I work where models meet infrastructure — designing APIs with
              Python and FastAPI, wiring up data with Node and Supabase, and
              deploying on AWS and Vercel. I lean on modern AI tooling like
              Claude Code and Codex to move fast without cutting corners.
            </p>
            <p
              style={{
                fontSize: 17,
                lineHeight: 1.7,
                color: "#9aa0aa",
                margin: "0 0 34px",
                maxWidth: "60ch",
              }}
            >
              I care about reliability, readable code and developer experience.
              Right now I&apos;m looking for a junior role or freelance work
              where I can grow and ship.
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 30 }}>
              <div>
                <div
                  style={{
                    fontFamily: sans,
                    fontWeight: 700,
                    fontSize: 30,
                    color: "#4fd6e0",
                    letterSpacing: "-0.02em",
                  }}
                >
                  11+
                </div>
                <div
                  style={{
                    fontFamily: mono,
                    fontSize: 12,
                    color: "#7f8794",
                    marginTop: 4,
                  }}
                >
                  technologies
                </div>
              </div>
              <div>
                <div
                  style={{
                    fontFamily: sans,
                    fontWeight: 700,
                    fontSize: 30,
                    color: "#e9ebed",
                    letterSpacing: "-0.02em",
                  }}
                >
                  AI
                </div>
                <div
                  style={{
                    fontFamily: mono,
                    fontSize: 12,
                    color: "#7f8794",
                    marginTop: 4,
                  }}
                >
                  + backend focus
                </div>
              </div>
              <div>
                <div
                  style={{
                    fontFamily: sans,
                    fontWeight: 700,
                    fontSize: 30,
                    color: "#e9ebed",
                    letterSpacing: "-0.02em",
                  }}
                >
                  ∞
                </div>
                <div
                  style={{
                    fontFamily: mono,
                    fontSize: 12,
                    color: "#7f8794",
                    marginTop: 4,
                  }}
                >
                  curiosity
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        id="contact"
        style={{
          padding: "120px 48px 90px",
          maxWidth: 1440,
          margin: "0 auto",
          boxSizing: "border-box",
          borderTop: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            marginBottom: 26,
          }}
        >
          <span
            style={{
              fontFamily: mono,
              fontSize: 12,
              letterSpacing: "0.14em",
              color: "#4fd6e0",
            }}
          >
            (03)
          </span>
          <span
            style={{
              fontFamily: mono,
              fontSize: 12,
              letterSpacing: "0.2em",
              color: "#7f8794",
              textTransform: "uppercase",
            }}
          >
            Contact
          </span>
        </div>
        <h2
          style={{
            fontFamily: sans,
            fontWeight: 800,
            fontSize: "clamp(40px,7vw,104px)",
            lineHeight: 0.96,
            letterSpacing: "-0.03em",
            margin: "0 0 40px",
            color: "#f2f3f5",
            maxWidth: "14ch",
          }}
        >
          Let&apos;s build something<span style={{ color: "#4fd6e0" }}>.</span>
        </h2>
        <a
          href="mailto:danielgfdev@gmail.com"
          className="contact-link"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 12,
            fontFamily: sans,
            fontSize: "clamp(20px,2.4vw,30px)",
            color: "#e8e9ec",
            textDecoration: "none",
            borderBottom: "1px solid rgba(255,255,255,0.18)",
            paddingBottom: 6,
          }}
        >
          danielgfdev@gmail.com <span style={{ fontSize: "0.8em" }}>↗</span>
        </a>

        <div
          style={{
            display: "flex",
            gap: 14,
            flexWrap: "wrap",
            marginTop: 50,
          }}
        >
          {[
            { label: "GitHub ↗", href: "https://github.com/devdanig" },
            {
              label: "LinkedIn ↗",
              href: "https://www.linkedin.com/in/daniel-garcia-fonseca-8313a61a9/",
            },
            { label: "Résumé / CV ↗", href: "#" },
          ].map(({ label, href }) => (
            <a
              key={label}
              href={href}
              target={href !== "#" ? "_blank" : undefined}
              rel={href !== "#" ? "noopener noreferrer" : undefined}
              className="social-link"
              style={{
                fontFamily: mono,
                fontSize: 13,
                color: "#aeb4bd",
                textDecoration: "none",
                border: "1px solid rgba(255,255,255,0.1)",
                padding: "11px 20px",
                borderRadius: 999,
              }}
            >
              {label}
            </a>
          ))}
        </div>
      </section>

      <footer
        style={{
          borderTop: "1px solid rgba(255,255,255,0.06)",
          padding: "26px 48px",
          maxWidth: 1440,
          margin: "0 auto",
          boxSizing: "border-box",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 12,
        }}
      >
        <span style={{ fontFamily: mono, fontSize: 12, color: "#5a626d" }}>
          © 2026 Daniel Garcia Fonseca
        </span>
        <span style={{ fontFamily: mono, fontSize: 12, color: "#5a626d" }}>
          Designed &amp; built with care
        </span>
      </footer>
    </div>
  );
}
