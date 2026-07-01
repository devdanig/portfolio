"use client";

import { useEffect, useRef } from "react";

export type HeroViz =
  | "atom"
  | "sphere"
  | "reactor"
  | "neural"
  | "constellation"
  | "orbital";

export interface HeroCanvasProps {
  /** Which visualization to render. Defaults to "sphere". */
  heroViz?: HeroViz;
  /** React to mouse movement. Defaults to true. */
  mouseReactive?: boolean;
  /** Node density multiplier (0.4 – 1.8). Defaults to 1.8. */
  nodeDensity?: number;
  /** Skill labels shown on the sphere nodes. */
  skills?: string[];
}

const DEFAULT_SKILLS = [
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

/**
 * Standalone canvas visualization engine ported from the Claude Design
 * `Portfolio.dc.html` component. Drives an Iron Man / Kaspersky-style rotating
 * skill sphere (plus atom / reactor / orbital / neural field alternatives).
 */
class VizEngine {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  cfg: Required<HeroCanvasProps>;
  mouse = { x: 0, y: 0, active: false };
  raf = 0;
  t = 0;
  W = 0;
  H = 0;
  mode: HeroViz = "sphere";

  // per-mode state
  nodes: any[] = [];
  pts: any[] = [];
  orbits: any[] = [];
  rnodes: any[] = [];
  packets: any[] = [];
  beams: any[] = [];
  flashes: any[] = [];
  center = { x: 0, y: 0 };
  maxDist = 158;
  R = 0;
  ZR = 100;
  monoFont = "monospace";

  private onResize = () => this.resize(false);

  constructor(canvas: HTMLCanvasElement, cfg: Required<HeroCanvasProps>) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d")!;
    this.cfg = cfg;
    const mono = getComputedStyle(document.body)
      .getPropertyValue("--font-mono")
      .trim();
    if (mono) this.monoFont = `${mono}, monospace`;
    window.addEventListener("resize", this.onResize);
    this.resize(true);
    this.loop();
  }

  destroy() {
    cancelAnimationFrame(this.raf);
    window.removeEventListener("resize", this.onResize);
  }

  accent() {
    return { r: 79, g: 214, b: 224 };
  }

  skills() {
    return this.cfg.skills && this.cfg.skills.length
      ? this.cfg.skills
      : DEFAULT_SKILLS;
  }

  resize(rebuild: boolean) {
    const c = this.canvas;
    if (!c || !this.ctx) return;
    const w = c.clientWidth,
      h = c.clientHeight;
    if (w === 0 || h === 0) {
      requestAnimationFrame(() => this.resize(rebuild));
      return;
    }
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    c.width = w * dpr;
    c.height = h * dpr;
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    this.W = w;
    this.H = h;
    if (rebuild || !this.nodes.length) this.build();
  }

  build() {
    if (this.W == null) return;
    const mode = this.cfg.heroViz || "neural";
    const density = this.cfg.nodeDensity || 1;
    this.mode = mode;
    if (mode === "orbital") this.buildOrbital(this.W, this.H, density);
    else if (mode === "sphere") this.buildSphere(this.W, this.H, density);
    else if (mode === "atom") this.buildAtom(this.W, this.H, density);
    else if (mode === "reactor") this.buildReactor(this.W, this.H, density);
    else this.buildField(this.W, this.H, density, mode);
  }

  buildField(W: number, H: number, density: number, mode: HeroViz) {
    const base = mode === "constellation" ? 0.00014 : 0.00008;
    let n = Math.round(W * H * base * density);
    n = Math.max(22, Math.min(150, n));
    this.maxDist = mode === "constellation" ? 112 : 158;
    this.nodes = [];
    for (let i = 0; i < n; i++) {
      this.nodes.push({
        x: Math.random() * W,
        y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.28,
        vy: (Math.random() - 0.5) * 0.28,
        r:
          mode === "constellation"
            ? Math.random() * 1.1 + 0.6
            : Math.random() * 1.5 + 1,
      });
    }
  }

  buildOrbital(W: number, H: number, density: number) {
    const cx = W / 2,
      cy = H / 2;
    this.center = { x: cx, y: cy };
    const maxR = Math.min(W, H) * 0.42;
    const rings = 4;
    this.nodes = [];
    for (let ri = 0; ri < rings; ri++) {
      const r = maxR * (0.32 + (0.68 * ri) / (rings - 1));
      const count = Math.max(4, Math.round((6 + ri * 4) * density));
      const speed = (0.0007 + ri * 0.00025) * (ri % 2 ? 1 : -1);
      for (let i = 0; i < count; i++) {
        this.nodes.push({
          r,
          a: (i / count) * Math.PI * 2,
          speed,
          size: Math.random() * 1.3 + 1,
          px: cx,
          py: cy,
        });
      }
    }
    this.packets = [];
    for (let i = 0; i < 5; i++) {
      this.packets.push({
        r: maxR * (0.32 + Math.random() * 0.68),
        a: Math.random() * Math.PI * 2,
        speed: 0.004 + Math.random() * 0.004,
      });
    }
  }

  loop() {
    this.raf = requestAnimationFrame(() => this.loop());
    const ctx = this.ctx;
    if (!ctx || this.W == null) return;
    this.t = (this.t || 0) + 1;
    ctx.clearRect(0, 0, this.W, this.H);
    if (this.mode === "orbital") this.drawOrbital(ctx);
    else if (this.mode === "sphere") this.drawSphere(ctx);
    else if (this.mode === "atom") this.drawAtom(ctx);
    else if (this.mode === "reactor") this.drawReactor(ctx);
    else this.drawField(ctx);
  }

  drawField(ctx: CanvasRenderingContext2D) {
    const { r, g, b } = this.accent();
    const W = this.W,
      H = this.H,
      nodes = this.nodes,
      md = this.maxDist;
    const mouse = this.mouse,
      react = this.cfg.mouseReactive !== false;
    const MR = 165;
    for (const p of nodes) {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > W) p.vx *= -1;
      if (p.y < 0 || p.y > H) p.vy *= -1;
      p.x = Math.max(0, Math.min(W, p.x));
      p.y = Math.max(0, Math.min(H, p.y));
      if (react && mouse.active) {
        const dx = mouse.x - p.x,
          dy = mouse.y - p.y,
          d = Math.hypot(dx, dy);
        if (d < MR && d > 0.01) {
          p.x += (dx * 0.0009 * (MR - d)) / MR;
          p.y += (dy * 0.0009 * (MR - d)) / MR;
        }
      }
    }
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const a = nodes[i],
          bb = nodes[j];
        const dx = a.x - bb.x,
          dy = a.y - bb.y,
          d = Math.hypot(dx, dy);
        if (d < md) {
          const al = (1 - d / md) * 0.5;
          ctx.strokeStyle = `rgba(${r},${g},${b},${al * 0.55})`;
          ctx.lineWidth = 0.6;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(bb.x, bb.y);
          ctx.stroke();
        }
      }
    }
    if (react && mouse.active) {
      for (const p of nodes) {
        const d = Math.hypot(mouse.x - p.x, mouse.y - p.y);
        if (d < MR) {
          const al = 1 - d / MR;
          ctx.strokeStyle = `rgba(${r},${g},${b},${al * 0.85})`;
          ctx.lineWidth = 0.8;
          ctx.beginPath();
          ctx.moveTo(mouse.x, mouse.y);
          ctx.lineTo(p.x, p.y);
          ctx.stroke();
        }
      }
    }
    for (const p of nodes) {
      const near =
        react && mouse.active && Math.hypot(mouse.x - p.x, mouse.y - p.y) < MR;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = near
        ? `rgba(${r},${g},${b},0.95)`
        : "rgba(214,220,226,0.5)";
      ctx.fill();
    }
    if (react && mouse.active) {
      ctx.beginPath();
      ctx.arc(mouse.x, mouse.y, 3.2, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${r},${g},${b},1)`;
      ctx.fill();
    }
  }

  drawOrbital(ctx: CanvasRenderingContext2D) {
    const { r, g, b } = this.accent();
    const c = this.center,
      nodes = this.nodes;
    const mouse = this.mouse,
      react = this.cfg.mouseReactive !== false;
    for (const p of nodes) {
      let sp = p.speed;
      if (react && mouse.active) {
        const md = Math.hypot(mouse.x - c.x, mouse.y - c.y);
        sp *= 1 + Math.max(0, 1 - md / 220) * 1.6;
      }
      p.a += sp;
      p.px = c.x + Math.cos(p.a) * p.r;
      p.py = c.y + Math.sin(p.a) * p.r;
    }
    const ringRs = [...new Set(nodes.map((n) => Math.round(n.r)))];
    for (const rr of ringRs) {
      ctx.beginPath();
      ctx.arc(c.x, c.y, rr, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(${r},${g},${b},0.06)`;
      ctx.lineWidth = 0.6;
      ctx.stroke();
    }
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const a = nodes[i],
          bb = nodes[j];
        const d = Math.hypot(a.px - bb.px, a.py - bb.py);
        if (d < 94) {
          const al = (1 - d / 94) * 0.38;
          ctx.strokeStyle = `rgba(${r},${g},${b},${al})`;
          ctx.lineWidth = 0.6;
          ctx.beginPath();
          ctx.moveTo(a.px, a.py);
          ctx.lineTo(bb.px, bb.py);
          ctx.stroke();
        }
      }
    }
    for (const pk of this.packets) {
      pk.a += pk.speed;
      const x = c.x + Math.cos(pk.a) * pk.r,
        y = c.y + Math.sin(pk.a) * pk.r;
      ctx.beginPath();
      ctx.arc(c.x, c.y, pk.r, pk.a - 0.55, pk.a);
      ctx.strokeStyle = `rgba(${r},${g},${b},0.5)`;
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(x, y, 2.1, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${r},${g},${b},1)`;
      ctx.fill();
    }
    if (react && mouse.active) {
      for (const p of nodes) {
        const d = Math.hypot(mouse.x - p.px, mouse.y - p.py);
        if (d < 150) {
          const al = 1 - d / 150;
          ctx.strokeStyle = `rgba(${r},${g},${b},${al * 0.7})`;
          ctx.lineWidth = 0.8;
          ctx.beginPath();
          ctx.moveTo(mouse.x, mouse.y);
          ctx.lineTo(p.px, p.py);
          ctx.stroke();
        }
      }
    }
    for (const p of nodes) {
      ctx.beginPath();
      ctx.arc(p.px, p.py, p.size, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(214,220,226,0.58)";
      ctx.fill();
    }
    ctx.beginPath();
    ctx.arc(c.x, c.y, 3.2, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${r},${g},${b},1)`;
    ctx.fill();
    if (react && mouse.active) {
      ctx.beginPath();
      ctx.arc(mouse.x, mouse.y, 3, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${r},${g},${b},0.9)`;
      ctx.fill();
    }
  }

  buildSphere(W: number, H: number, density: number) {
    const n = Math.max(70, Math.min(280, Math.round(150 * density)));
    const labels = this.skills();
    const bag = labels.slice();
    for (let k = bag.length - 1; k > 0; k--) {
      const m = Math.floor(Math.random() * (k + 1));
      [bag[k], bag[m]] = [bag[m], bag[k]];
    }
    this.pts = [];
    const off = 2 / n,
      ga = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < n; i++) {
      const y = i * off - 1 + off / 2;
      const rr = Math.sqrt(Math.max(0, 1 - y * y));
      const phi = i * ga;
      this.pts.push({
        x: Math.cos(phi) * rr,
        y,
        z: Math.sin(phi) * rr,
        label: bag[i % bag.length],
      });
    }
    const E = 70;
    const visW = Math.max(80, W - 2 * E),
      visH = Math.max(80, H - 2 * E);
    this.R = Math.min(visW, visH) * 0.4;
    this.ZR = Math.max(60, Math.min(115, Math.min(W, H) / 2 - this.R - 10));
    this.beams = [];
    this.flashes = [];
  }

  drawSphere(ctx: CanvasRenderingContext2D) {
    const { r, g, b } = this.accent();
    const cx = this.W / 2,
      cy = this.H / 2,
      R = this.R;
    const mouse = this.mouse,
      react = this.cfg.mouseReactive !== false;
    const ry = this.t * 0.003,
      rx = 0.42 + Math.sin(this.t * 0.0011) * 0.18;
    const active =
      react &&
      mouse.active &&
      Math.hypot(mouse.x - this.W / 2, mouse.y - this.H / 2) <= this.R;
    const cosY = Math.cos(ry),
      sinY = Math.sin(ry),
      cosX = Math.cos(rx),
      sinX = Math.sin(rx);
    const pts = this.pts,
      proj: any[] = [];
    for (const p of pts) {
      const x1 = p.x * cosY - p.z * sinY,
        z1 = p.x * sinY + p.z * cosY;
      const y1 = p.y * cosX - z1 * sinX,
        z2 = p.y * sinX + z1 * cosX;
      proj.push({
        sx: cx + x1 * R,
        sy: cy + y1 * R,
        depth: (z2 + 1) / 2,
        label: p.label,
      });
    }
    const n = proj.length;
    if (!this.beams) this.beams = [];
    if (!this.flashes) this.flashes = [];

    ctx.beginPath();
    ctx.arc(cx, cy, R, 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(${r},${g},${b},0.10)`;
    ctx.lineWidth = 1;
    ctx.stroke();

    const maxBeams = Math.min(16, Math.round(n / 7));
    while (this.beams.length < maxBeams && Math.random() < 0.22) {
      const i = (Math.random() * n) | 0;
      let j = (Math.random() * n) | 0,
        tries = 0;
      while (j === i && tries++ < 4) j = (Math.random() * n) | 0;
      this.beams.push({ i, j, t: 0, speed: 0.012 + Math.random() * 0.02 });
    }
    for (let k = this.beams.length - 1; k >= 0; k--) {
      const bm = this.beams[k];
      bm.t += bm.speed;
      const a = proj[bm.i],
        q = proj[bm.j];
      if (!a || !q) {
        this.beams.splice(k, 1);
        continue;
      }
      const t = Math.min(1, bm.t);
      const tt = Math.max(0, t - 0.36);
      const depth = (a.depth + q.depth) / 2,
        al = 0.4 + depth * 0.5;
      const mx = (a.sx + q.sx) / 2,
        my = (a.sy + q.sy) / 2;
      let dx = mx - cx,
        dy = my - cy;
      const dl = Math.hypot(dx, dy) || 1;
      const chord = Math.hypot(q.sx - a.sx, q.sy - a.sy);
      const bulge = chord * 0.3;
      const ctrlX = mx + (dx / dl) * bulge,
        ctrlY = my + (dy / dl) * bulge;
      const bez = (s: number) => {
        const u = 1 - s;
        return [
          u * u * a.sx + 2 * u * s * ctrlX + s * s * q.sx,
          u * u * a.sy + 2 * u * s * ctrlY + s * s * q.sy,
        ];
      };
      const head = bez(t),
        start = bez(tt);
      const grd = ctx.createLinearGradient(
        start[0],
        start[1],
        head[0],
        head[1],
      );
      grd.addColorStop(0, `rgba(${r},${g},${b},0)`);
      grd.addColorStop(1, `rgba(${r},${g},${b},${al})`);
      ctx.save();
      ctx.shadowColor = `rgba(${r},${g},${b},${al})`;
      ctx.shadowBlur = 7;
      ctx.strokeStyle = grd;
      ctx.lineWidth = 2.6;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.beginPath();
      const steps = 12;
      for (let s = 0; s <= steps; s++) {
        const p = bez(tt + ((t - tt) * s) / steps);
        if (s === 0) ctx.moveTo(p[0], p[1]);
        else ctx.lineTo(p[0], p[1]);
      }
      ctx.stroke();
      ctx.restore();
      ctx.beginPath();
      ctx.arc(head[0], head[1], 2.4, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${r},${g},${b},${Math.min(1, al + 0.25)})`;
      ctx.fill();
      if (bm.t >= 1) {
        this.flashes.push({ x: q.sx, y: q.sy, r: 1 });
        this.beams.splice(k, 1);
      }
    }
    for (let k = this.flashes.length - 1; k >= 0; k--) {
      const f = this.flashes[k];
      f.r += 0.6;
      const al = Math.max(0, 1 - f.r / 14);
      if (al <= 0) {
        this.flashes.splice(k, 1);
        continue;
      }
      ctx.beginPath();
      ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(${r},${g},${b},${al * 0.7})`;
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    let hi = -1,
      hd = 26;
    if (active) {
      for (let i = 0; i < n; i++) {
        const d = Math.hypot(mouse.x - proj[i].sx, mouse.y - proj[i].sy);
        if (d < hd) {
          hd = d;
          hi = i;
        }
      }
    }
    if (hi >= 0) {
      const a = proj[hi];
      const near: { i: number; d: number }[] = [];
      for (let i = 0; i < n; i++) {
        if (i === hi) continue;
        near.push({
          i,
          d: Math.hypot(a.sx - proj[i].sx, a.sy - proj[i].sy),
        });
      }
      near.sort((u, v) => u.d - v.d);
      for (let s = 0; s < Math.min(5, near.length); s++) {
        const q = proj[near[s].i];
        ctx.strokeStyle = `rgba(${r},${g},${b},${0.5 * (1 - s / 6)})`;
        ctx.lineWidth = 0.8;
        ctx.beginPath();
        ctx.moveTo(a.sx, a.sy);
        ctx.lineTo(q.sx, q.sy);
        ctx.stroke();
      }
    }

    const ZR = this.ZR || 100;
    if (active) {
      const gg = ctx.createRadialGradient(
        mouse.x,
        mouse.y,
        0,
        mouse.x,
        mouse.y,
        ZR,
      );
      gg.addColorStop(0, `rgba(${r},${g},${b},0.18)`);
      gg.addColorStop(0.6, `rgba(${r},${g},${b},0.06)`);
      gg.addColorStop(1, `rgba(${r},${g},${b},0)`);
      ctx.fillStyle = gg;
      ctx.beginPath();
      ctx.arc(mouse.x, mouse.y, ZR, 0, Math.PI * 2);
      ctx.fill();
    }
    for (let i = 0; i < n; i++) {
      const p = proj[i];
      let size = 0.8 + p.depth * 1.9,
        px = p.sx,
        py = p.sy;
      let dx = 0,
        dy = 0,
        d = Infinity;
      if (active) {
        dx = p.sx - mouse.x;
        dy = p.sy - mouse.y;
        d = Math.hypot(dx, dy);
      }
      const inZone = d < ZR;
      if (inZone) {
        const k = 1 - d / ZR;
        const factor = 1 + 0.13 * k;
        px = mouse.x + dx * factor;
        py = mouse.y + dy * factor;
        size += 1.3 * k;
      }
      ctx.beginPath();
      ctx.arc(px, py, size, 0, Math.PI * 2);
      if (inZone) {
        const k = 1 - d / ZR;
        ctx.fillStyle = `rgba(${r},${g},${b},${0.6 + 0.4 * k})`;
      } else {
        ctx.fillStyle = `rgba(${Math.round(150 + p.depth * 90)},${Math.round(
          200 + p.depth * 30,
        )},${Math.round(210 + p.depth * 20)},${0.25 + p.depth * 0.6})`;
      }
      ctx.fill();
    }

    if (hi >= 0 && proj[hi].label) {
      const p = proj[hi],
        text = proj[hi].label;
      ctx.font = `500 13px ${this.monoFont}`;
      const tw = ctx.measureText(text).width;
      const padX = 10,
        bw = tw + padX * 2,
        bh = 24;
      let bx = p.sx + 14,
        by = p.sy - bh - 10;
      if (bx + bw > this.W - 6) bx = p.sx - bw - 14;
      if (by < 6) by = p.sy + 12;
      ctx.strokeStyle = `rgba(${r},${g},${b},0.6)`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(p.sx, p.sy);
      ctx.lineTo(bx + 4, by + bh / 2);
      ctx.stroke();
      ctx.fillStyle = "rgba(8,9,12,0.9)";
      ctx.strokeStyle = `rgba(${r},${g},${b},0.55)`;
      ctx.lineWidth = 1;
      const rd = 6;
      ctx.beginPath();
      ctx.moveTo(bx + rd, by);
      ctx.lineTo(bx + bw - rd, by);
      ctx.arcTo(bx + bw, by, bx + bw, by + rd, rd);
      ctx.lineTo(bx + bw, by + bh - rd);
      ctx.arcTo(bx + bw, by + bh, bx + bw - rd, by + bh, rd);
      ctx.lineTo(bx + rd, by + bh);
      ctx.arcTo(bx, by + bh, bx, by + bh - rd, rd);
      ctx.lineTo(bx, by + rd);
      ctx.arcTo(bx, by, bx + rd, by, rd);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = `rgba(${r},${g},${b},1)`;
      ctx.textBaseline = "middle";
      ctx.textAlign = "left";
      ctx.fillText(text, bx + padX, by + bh / 2 + 0.5);
      ctx.textBaseline = "alphabetic";
    }
  }

  buildAtom(W: number, H: number, density: number) {
    this.R = Math.min(W, H) * 0.42;
    const count = Math.max(3, Math.round(2 + density));
    this.orbits = [];
    for (let i = 0; i < count; i++) {
      this.orbits.push({
        tilt: (i * Math.PI) / count,
        e: Math.random() * Math.PI * 2,
        speed: 0.018 + i * 0.006,
      });
    }
  }

  drawAtom(ctx: CanvasRenderingContext2D) {
    const { r, g, b } = this.accent();
    const cx = this.W / 2,
      cy = this.H / 2,
      R = this.R;
    const mouse = this.mouse,
      react = this.cfg.mouseReactive !== false;
    const prec = this.t * 0.0016,
      a = R,
      bb = R * 0.3;
    this.orbits.forEach((o) => {
      const tilt = o.tilt + prec,
        cosT = Math.cos(tilt),
        sinT = Math.sin(tilt);
      ctx.beginPath();
      for (let k = 0; k <= 72; k++) {
        const t = (k / 72) * Math.PI * 2;
        const ex = Math.cos(t) * a,
          ey = Math.sin(t) * bb;
        const x = cx + ex * cosT - ey * sinT,
          y = cy + ex * sinT + ey * cosT;
        if (k === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = `rgba(${r},${g},${b},0.30)`;
      ctx.lineWidth = 1.1;
      ctx.stroke();
      o.e += o.speed;
      const ex = Math.cos(o.e) * a,
        ey = Math.sin(o.e) * bb;
      const px = cx + ex * cosT - ey * sinT,
        py = cy + ex * sinT + ey * cosT;
      let size = 3.2;
      if (react && mouse.active) {
        const d = Math.hypot(mouse.x - px, mouse.y - py);
        if (d < 85) size += (1 - d / 85) * 4.5;
      }
      const gr = ctx.createRadialGradient(px, py, 0, px, py, size * 4);
      gr.addColorStop(0, `rgba(${r},${g},${b},0.5)`);
      gr.addColorStop(1, `rgba(${r},${g},${b},0)`);
      ctx.fillStyle = gr;
      ctx.beginPath();
      ctx.arc(px, py, size * 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = `rgba(${r},${g},${b},1)`;
      ctx.beginPath();
      ctx.arc(px, py, size, 0, Math.PI * 2);
      ctx.fill();
    });
    const ng = ctx.createRadialGradient(cx, cy, 0, cx, cy, 28);
    ng.addColorStop(0, "rgba(224,250,252,0.95)");
    ng.addColorStop(0.4, `rgba(${r},${g},${b},0.6)`);
    ng.addColorStop(1, `rgba(${r},${g},${b},0)`);
    ctx.fillStyle = ng;
    ctx.beginPath();
    ctx.arc(cx, cy, 28, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "rgba(232,253,254,1)";
    ctx.beginPath();
    ctx.arc(cx, cy, 4, 0, Math.PI * 2);
    ctx.fill();
  }

  buildReactor(W: number, H: number, density: number) {
    const R = Math.min(W, H) * 0.42;
    this.R = R;
    this.rnodes = [];
    const rings = Math.max(3, Math.round(3 + density * 2));
    for (let ri = 0; ri < rings; ri++) {
      const rad = R * (0.28 + (0.72 * ri) / (rings - 1));
      const cnt = Math.round((8 + ri * 5) * density);
      for (let i = 0; i < cnt; i++) {
        this.rnodes.push({
          rad,
          a: (i / cnt) * Math.PI * 2,
          base: Math.random() * 1 + 1.3,
          ring: ri,
        });
      }
    }
  }

  drawReactor(ctx: CanvasRenderingContext2D) {
    const { r, g, b } = this.accent();
    const cx = this.W / 2,
      cy = this.H / 2,
      R = this.R;
    const mouse = this.mouse,
      react = this.cfg.mouseReactive !== false;
    const rot = this.t * 0.0015;
    const radii = [...new Set(this.rnodes.map((n) => Math.round(n.rad)))];
    radii.forEach((rad) => {
      ctx.beginPath();
      ctx.arc(cx, cy, rad, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(${r},${g},${b},0.10)`;
      ctx.lineWidth = 0.8;
      ctx.stroke();
    });
    for (let i = 0; i < 24; i++) {
      const ang = rot * 0.5 + (i / 24) * Math.PI * 2;
      ctx.beginPath();
      ctx.moveTo(cx + Math.cos(ang) * R * 0.2, cy + Math.sin(ang) * R * 0.2);
      ctx.lineTo(cx + Math.cos(ang) * R, cy + Math.sin(ang) * R);
      ctx.strokeStyle = `rgba(${r},${g},${b},0.05)`;
      ctx.lineWidth = 0.6;
      ctx.stroke();
    }
    const pos = this.rnodes.map((n) => {
      const ang = n.a + rot * (n.ring % 2 ? 1 : -1) * (0.4 + n.ring * 0.12);
      return {
        x: cx + Math.cos(ang) * n.rad,
        y: cy + Math.sin(ang) * n.rad,
        n,
      };
    });
    for (let i = 0; i < pos.length; i++) {
      for (let j = i + 1; j < pos.length; j++) {
        const d = Math.hypot(pos[i].x - pos[j].x, pos[i].y - pos[j].y);
        if (d < 72) {
          const al = (1 - d / 72) * 0.28;
          ctx.strokeStyle = `rgba(${r},${g},${b},${al})`;
          ctx.lineWidth = 0.6;
          ctx.beginPath();
          ctx.moveTo(pos[i].x, pos[i].y);
          ctx.lineTo(pos[j].x, pos[j].y);
          ctx.stroke();
        }
      }
    }
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(this.t * 0.01);
    const lg = ctx.createLinearGradient(0, 0, R, 0);
    lg.addColorStop(0, `rgba(${r},${g},${b},0)`);
    lg.addColorStop(1, `rgba(${r},${g},${b},0.4)`);
    ctx.strokeStyle = lg;
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(R, 0);
    ctx.stroke();
    ctx.restore();
    for (const p of pos) {
      let size = p.n.base,
        near = false;
      if (react && mouse.active) {
        const d = Math.hypot(mouse.x - p.x, mouse.y - p.y);
        if (d < 72) {
          size += (1 - d / 72) * 3.2;
          near = true;
        }
      }
      ctx.beginPath();
      ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
      ctx.fillStyle = near
        ? `rgba(${r},${g},${b},1)`
        : `rgba(${r},${g},${b},0.6)`;
      ctx.fill();
    }
    const ng = ctx.createRadialGradient(cx, cy, 0, cx, cy, R * 0.2);
    ng.addColorStop(0, `rgba(${r},${g},${b},0.45)`);
    ng.addColorStop(1, `rgba(${r},${g},${b},0)`);
    ctx.fillStyle = ng;
    ctx.beginPath();
    ctx.arc(cx, cy, R * 0.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "rgba(232,253,254,0.95)";
    ctx.beginPath();
    ctx.arc(cx, cy, 3, 0, Math.PI * 2);
    ctx.fill();
  }
}

export default function HeroCanvas(props: HeroCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<VizEngine | null>(null);

  const cfg: Required<HeroCanvasProps> = {
    heroViz: props.heroViz ?? "sphere",
    mouseReactive: props.mouseReactive ?? true,
    nodeDensity: props.nodeDensity ?? 1.8,
    skills: props.skills ?? DEFAULT_SKILLS,
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const engine = new VizEngine(canvas, cfg);
    engineRef.current = engine;
    return () => engine.destroy();
    // Rebuild the engine whenever a visualization-affecting prop changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cfg.heroViz, cfg.mouseReactive, cfg.nodeDensity, cfg.skills.join("|")]);

  const handleMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const engine = engineRef.current;
    const canvas = canvasRef.current;
    if (!engine || !canvas) return;
    const rect = canvas.getBoundingClientRect();
    engine.mouse.x = e.clientX - rect.left;
    engine.mouse.y = e.clientY - rect.top;
    engine.mouse.active = true;
  };

  const handleLeave = () => {
    if (engineRef.current) engineRef.current.mouse.active = false;
  };

  return (
    <canvas
      ref={canvasRef}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{
        position: "absolute",
        top: "-70px",
        left: "-70px",
        width: "calc(100% + 140px)",
        height: "calc(100% + 140px)",
        display: "block",
      }}
    />
  );
}
