/**
 * TOUCHSTONE — INDUSTRIAL BY-PRODUCT VERIFICATION & TRADE
 * Master JavaScript Application
 * GSAP Animations, Canvas Particle Network, 7-Factor Sandbox,
 * Audio Synthesizer & Interactive Verification Grid
 */

// Live Verification Telemetry Configuration (Placeholder variable wired to real backend/WebSocket)
window.TOUCHSTONE_TELEMETRY = {
  verificationsLogged: 247,
  label: 'VERIFICATIONS LOGGED',
  lastVerifiedBatch: 'BATCH-GIDC-9921',
  activeNodes: 84
};

function initNavBeaconCounter() {
  const countEl = document.getElementById('navVerificationCount');
  const labelEl = document.getElementById('navVerificationLabel');
  if (countEl && window.TOUCHSTONE_TELEMETRY.verificationsLogged !== undefined) {
    countEl.textContent = window.TOUCHSTONE_TELEMETRY.verificationsLogged;
  }
  if (labelEl && window.TOUCHSTONE_TELEMETRY.label) {
    labelEl.textContent = window.TOUCHSTONE_TELEMETRY.label;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide Icons
  if (window.lucide) {
    window.lucide.createIcons();
  }

  // Hydrate Nav Beacon Counter from Telemetry Variable
  initNavBeaconCounter();

  /* ==========================================================================
     1. Web Audio API — Subtle Haptic Soundscape
     ========================================================================== */
  class SoundFX {
    constructor() {
      this.ctx = null;
      this.enabled = false;
      this.toggleBtn = document.getElementById('soundToggle');
      this.initListener();
    }

    init() {
      if (!this.ctx) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        this.ctx = new AudioContext();
      }
    }

    initListener() {
      if (!this.toggleBtn) return;
      this.toggleBtn.addEventListener('click', () => {
        this.init();
        this.enabled = !this.enabled;
        this.toggleBtn.classList.toggle('sound-active', this.enabled);
        if (this.enabled) {
          this.playTone(880, 0.08, 'sine');
        }
      });
    }

    playTone(freq = 440, duration = 0.05, type = 'sine') {
      if (!this.enabled || !this.ctx) return;
      try {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
        gain.gain.setValueAtTime(0.04, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + duration);
      } catch (e) {
        // AudioContext policy catch
      }
    }
  }

  const sfx = new SoundFX();

  /* ==========================================================================
     2. Creative Industrial Reticle Cursor & Magnetic Interactions
     ========================================================================== */
  const cursorReticle = document.getElementById('cursorReticle');
  const cursorCore = document.getElementById('cursorCore');
  const cursorRing = document.getElementById('cursorRing');
  const cursorLabel = document.getElementById('cursorLabel');

  if (cursorReticle && cursorCore && cursorRing) {
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX = mouseX;
    let ringY = mouseY;
    let isVisible = false;

    // Direct, ultra-responsive mouse tracker
    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      if (!isVisible) {
        isVisible = true;
        cursorReticle.classList.add('active');
      }

      // Hardware-accelerated instantaneous core alignment
      cursorCore.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
    });

    document.addEventListener('mouseleave', () => {
      isVisible = false;
      cursorReticle.classList.remove('active');
    });

    document.addEventListener('mouseenter', () => {
      isVisible = true;
      cursorReticle.classList.add('active');
    });

    // Mousedown shockwave / lock
    window.addEventListener('mousedown', () => {
      cursorReticle.classList.add('cursor-active');
      sfx.playTone(950, 0.03, 'sine');
    });

    window.addEventListener('mouseup', () => {
      cursorReticle.classList.remove('cursor-active');
    });

    // Fluid interpolation for the outer reticle and label
    const updateReticle = () => {
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;

      cursorRing.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`;
      if (cursorLabel) {
        cursorLabel.style.transform = `translate3d(${ringX}px, ${ringY + 26}px, 0) translate(-50%, 0)`;
      }

      requestAnimationFrame(updateReticle);
    };
    requestAnimationFrame(updateReticle);

    // Interactive targeting tags
    const interactiveElements = document.querySelectorAll(
      'a, button, .stream-card, .stream-btn, .chip-btn, .cluster-btn, .metric-card, input[type=range], select'
    );

    interactiveElements.forEach((el) => {
      el.addEventListener('mouseenter', () => {
        cursorReticle.classList.add('cursor-hover');
        const customTag = el.getAttribute('data-cursor');
        if (cursorLabel) {
          if (customTag) {
            cursorLabel.textContent = customTag;
          } else if (el.tagName.toLowerCase() === 'a' || el.tagName.toLowerCase() === 'button') {
            cursorLabel.textContent = 'SELECT';
          } else if (el.classList.contains('stream-card')) {
            cursorLabel.textContent = 'INSPECT';
          } else if (el.tagName.toLowerCase() === 'input') {
            cursorLabel.textContent = 'ADJUST';
          } else {
            cursorLabel.textContent = 'SCAN';
          }
        }
        sfx.playTone(720, 0.03, 'triangle');
      });

      el.addEventListener('mouseleave', () => {
        cursorReticle.classList.remove('cursor-hover');
      });
    });

    // Magnetic pull for buttons
    const magnetics = document.querySelectorAll('.btn-magnetic, .stream-btn, .chip-btn, .cluster-btn');
    magnetics.forEach((btn) => {
      btn.addEventListener('mouseleave', () => {
        btn.style.transform = '';
      });
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const btnCenterX = rect.left + rect.width / 2;
        const btnCenterY = rect.top + rect.height / 2;
        const deltaX = (e.clientX - btnCenterX) * 0.18;
        const deltaY = (e.clientY - btnCenterY) * 0.18;
        btn.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
      });
    });
  }

  /* ==========================================================================
     3. Header Scroll Effect & Navigation
     ========================================================================== */
  const header = document.getElementById('mainHeader');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }, { passive: true });

  /* ==========================================================================
     4. GSAP Entrance & ScrollTrigger Animations
     ========================================================================== */
  if (window.gsap) {
    gsap.registerPlugin(ScrollTrigger);

    // Hero entrance staggered reveal
    gsap.from('.animate-in', {
      duration: 1.1,
      y: 40,
      opacity: 0,
      stagger: 0.15,
      ease: 'power3.out',
      delay: 0.2
    });

    // Metric counter trigger
    const counters = document.querySelectorAll('.counter');
    counters.forEach((counter) => {
      const target = parseFloat(counter.getAttribute('data-target'));
      const isDecimal = target % 1 !== 0;

      ScrollTrigger.create({
        trigger: counter,
        start: 'top 88%',
        once: true,
        onEnter: () => {
          gsap.to(counter, {
            innerHTML: target,
            duration: 2,
            ease: 'power2.out',
            snap: { innerHTML: isDecimal ? 0.1 : 1 },
            onUpdate: function () {
              if (isDecimal) {
                counter.innerHTML = parseFloat(this.targets()[0].innerHTML).toFixed(1);
              } else {
                counter.innerHTML = Math.floor(this.targets()[0].innerHTML).toLocaleString('en-IN');
              }
            }
          });
        }
      });
    });

    // Section cards parallax & reveals
    const glassCards = document.querySelectorAll('.comparison-card, .comp-step-card, .stream-card');
    glassCards.forEach((card, index) => {
      gsap.from(card, {
        scrollTrigger: {
          trigger: card,
          start: 'top 88%',
          toggleActions: 'play none none none'
        },
        duration: 0.75,
        y: 35,
        opacity: 0,
        delay: (index % 3) * 0.1,
        ease: 'power2.out'
      });
    });
  }

  /* ==========================================================================
     5. Interactive Hero Network Canvas (Plant Mesh Simulation)
     ========================================================================== */
  const canvas = document.getElementById('networkCanvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width, height;
    let nodes = [];
    const nodeCount = 42;
    const maxDistance = 180;

    const resize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resize);
    resize();

    // Factory Node Class
    class Node {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.55;
        this.vy = (Math.random() - 0.5) * 0.55;
        this.radius = Math.random() * 2.5 + 1.5;
        this.isMajorCluster = Math.random() > 0.8;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.isMajorCluster ? '#D6DF24' : 'rgba(214, 223, 36, 0.4)';
        ctx.shadowColor = this.isMajorCluster ? '#D6DF24' : 'transparent';
        ctx.shadowBlur = this.isMajorCluster ? 10 : 0;
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    }

    for (let i = 0; i < nodeCount; i++) {
      nodes.push(new Node());
    }

    // Packet transmission along symbiotic pipelines
    let packets = [];
    const spawnPacket = () => {
      if (nodes.length < 2) return;
      const i1 = Math.floor(Math.random() * nodes.length);
      const i2 = Math.floor(Math.random() * nodes.length);
      if (i1 !== i2) {
        const d = Math.hypot(nodes[i1].x - nodes[i2].x, nodes[i1].y - nodes[i2].y);
        if (d < maxDistance) {
          packets.push({
            start: nodes[i1],
            end: nodes[i2],
            progress: 0,
            speed: 0.015 + Math.random() * 0.02
          });
        }
      }
    };
    setInterval(spawnPacket, 600);

    const animateNetwork = () => {
      ctx.clearRect(0, 0, width, height);

      // Connect nodes
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.hypot(dx, dy);

          if (dist < maxDistance) {
            const alpha = (1 - dist / maxDistance) * 0.16;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.strokeStyle = `rgba(214, 223, 36, ${alpha})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }

      // Update and draw packets
      for (let p = packets.length - 1; p >= 0; p--) {
        const pkt = packets[p];
        pkt.progress += pkt.speed;
        if (pkt.progress >= 1) {
          packets.splice(p, 1);
          continue;
        }
        const currX = pkt.start.x + (pkt.end.x - pkt.start.x) * pkt.progress;
        const currY = pkt.start.y + (pkt.end.y - pkt.start.y) * pkt.progress;

        ctx.beginPath();
        ctx.arc(currX, currY, 2.8, 0, Math.PI * 2);
        ctx.fillStyle = '#D6DF24';
        ctx.shadowColor = '#D6DF24';
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      nodes.forEach((node) => {
        node.update();
        node.draw();
      });

      requestAnimationFrame(animateNetwork);
    };
    animateNetwork();
  }

  /* ==========================================================================
     6. Verification Engine & Risk Sandbox Logic
     ========================================================================== */
  const streamPresets = {
    'spent-h2so4': {
      title: 'Spent H₂SO₄ (Flagged)',
      defaultVol: 74,
      defaultPurity: 64,
      defaultDist: 3,
      defaultContam: 5
    },
    'phosphogypsum': {
      title: 'Phosphogypsum (Flagged)',
      defaultVol: 45,
      defaultPurity: 80,
      defaultDist: 5,
      defaultContam: 5
    },
    'flyash-f': {
      title: 'Fly Ash Class-F (Clean)',
      defaultVol: 92,
      defaultPurity: 91,
      defaultDist: 1,
      defaultContam: 5
    },
    'spent-toluene': {
      title: 'Spent Toluene (Doc Gap)',
      defaultVol: 91,
      defaultPurity: 91,
      defaultDist: 8,
      defaultContam: 5
    }
  };

  let activeStreamKey = 'spent-h2so4';

  const compositeScore = document.getElementById('compositeScore');
  const meterFill = document.getElementById('meterFill');
  const recalculateBtn = document.getElementById('recalculateBtn');

  // Slider update callbacks
  const updateEngineCalculation = () => {
    const purityEl = document.getElementById('term-purity');
    if (!purityEl) return;
    
    const purity      = parseFloat(purityEl.value) || 0;
    const moisture    = parseFloat(document.getElementById('term-moisture')?.value) || 0;
    const ph          = parseFloat(document.getElementById('term-ph')?.value) || 7;
    const heavyMetals = parseFloat(document.getElementById('term-heavymetals')?.value) || 0;
    const ss          = parseFloat(document.getElementById('term-ss')?.value) || 0;
    const variability = document.getElementById('term-variability')?.value || 'low';
    const consent     = document.getElementById('term-consent')?.value || 'declared_byproduct_for_sale';

    // ─── GOVERNMENT THRESHOLDS ────────────────────────────────────────────────
    // Factor 1: Purity vs BIS threshold (≥85% for feedstock use) | weight 30%
    const PURITY_THRESHOLD = 85;
    let compScore;
    if (purity >= PURITY_THRESHOLD) {
      compScore = Math.min(100, Math.round(70 + ((purity - PURITY_THRESHOLD) / (100 - PURITY_THRESHOLD)) * 30));
    } else {
      compScore = Math.max(0, Math.round((purity / PURITY_THRESHOLD) * 70));
    }

    // Factor 2: Moisture compliance (≤15% per BIS 2584) | weight 20%
    const MOISTURE_MAX = 15;
    let consScore;
    if (moisture <= MOISTURE_MAX) {
      consScore = Math.round(100 - (moisture / MOISTURE_MAX) * 20); // small deduction as it approaches limit
    } else {
      const overrun = moisture - MOISTURE_MAX;
      consScore = Math.max(0, Math.round(80 - (overrun / MOISTURE_MAX) * 80));
    }

    // Factor 3: pH range compliance (GPCB norm: 6.5–8.5) | weight 20%
    const PH_MIN = 6.5, PH_MAX = 8.5, PH_IDEAL_MIN = 7.0, PH_IDEAL_MAX = 8.0;
    let contScore;
    if (ph >= PH_MIN && ph <= PH_MAX) {
      // Within acceptable range — full score, slight bonus for being in ideal band
      contScore = (ph >= PH_IDEAL_MIN && ph <= PH_IDEAL_MAX) ? 100 : 85;
    } else {
      // How far outside the range?
      const dev = ph < PH_MIN ? (PH_MIN - ph) : (ph - PH_MAX);
      contScore = Math.max(0, Math.round(100 - dev * 20));
    }

    // Factor 4: Heavy metals (Hazardous Waste Rules 2016, Schedule II ≤5 ppm) | weight 15%
    const HM_MAX = 5; // ppm
    let regScore;
    if (heavyMetals <= HM_MAX) {
      regScore = Math.round(100 - (heavyMetals / HM_MAX) * 20);
    } else {
      const overrun = heavyMetals - HM_MAX;
      regScore = Math.max(0, Math.round(80 - (overrun / HM_MAX) * 80));
    }

    // Factor 5: Suspended Solids (IS standard ≤100 mg/L) | weight 10%
    const SS_MAX = 100;
    let logScore;
    if (ss <= SS_MAX) {
      logScore = Math.round(100 - (ss / SS_MAX) * 25);
    } else {
      const overrun = ss - SS_MAX;
      logScore = Math.max(0, Math.round(75 - (overrun / SS_MAX) * 75));
    }

    // Factor 6: Batch Consistency (low/medium/high variability) | weight 5%
    const econScore = variability === 'low' ? 100 : (variability === 'medium' ? 65 : 30);

    // ─── WEIGHTED COMPOSITE ───────────────────────────────────────────────────
    // All chemical — no regulatory weight in the score itself
    let total = (compScore * 0.30) + (consScore * 0.20) + (contScore * 0.20) + (regScore * 0.15) + (logScore * 0.10) + (econScore * 0.05);
    total = Math.round(total * 10) / 10;

    // ─── GRADE ────────────────────────────────────────────────────────────────
    let grade = 'F';
    if (total >= 90) grade = 'A+';
    else if (total >= 80) grade = 'B+';
    else if (total >= 70) grade = 'C';
    else if (total >= 50) grade = 'D';

    // ─── DOM UPDATES ──────────────────────────────────────────────────────────
    // Factor bars
    const updateBar = (txtId, barId, score, danger = false) => {
      const txt = document.getElementById(txtId);
      const bar = document.getElementById(barId);
      if (!txt || !bar) return;
      const isBad = score < 60;
      txt.className = `factor-val font-mono ${isBad ? 'text-danger' : (score >= 85 ? 'text-acid' : '')}`;
      txt.innerText = score + '%';
      bar.style.background = isBad ? 'var(--text-danger)' : (score >= 85 ? 'var(--text-acid)' : 'rgba(255,255,255,0.6)');
      gsap.to(bar, { width: score + '%', duration: 0.5, ease: 'power2.out' });
    };

    updateBar('out-comp-txt', 'out-comp-bar', compScore);  // Purity
    updateBar('out-cons-txt', 'out-cons-bar', consScore);  // Moisture
    updateBar('out-cont-txt', 'out-cont-bar', contScore);  // pH
    updateBar('out-reg-txt',  'out-reg-bar',  regScore);   // Heavy Metals
    updateBar('out-log-txt',  'out-log-bar',  logScore);   // Suspended Solids
    updateBar('out-econ-txt', 'out-econ-bar', econScore);  // Batch Consistency

    // Composite Score
    const compScoreEl = document.getElementById('compositeScore');
    const gradeScoreEl = document.getElementById('gradeScore');
    if (compScoreEl) {
      gsap.to(compScoreEl, {
        innerHTML: total, duration: 1, snap: { innerHTML: 0.1 },
        onUpdate: function() { compScoreEl.innerHTML = Number(this.targets()[0].innerHTML).toFixed(1); }
      });
    }
    if (meterFill) gsap.to(meterFill, { width: total + '%', duration: 1, ease: 'power2.out' });
    if (gradeScoreEl) setTimeout(() => { gradeScoreEl.innerText = grade; }, 600);

    // ─── COMPLIANCE FLAG (consent-driven, separate from chemical score) ────────
    const complianceBox   = document.getElementById('out-compliance-box');
    const complianceIcon  = document.getElementById('out-compliance-icon');
    const complianceTitle = document.getElementById('out-compliance-title');
    const complianceDesc  = document.getElementById('out-compliance-desc');
    
    if (complianceBox && complianceIcon && complianceTitle && complianceDesc) {
      if (consent !== 'declared_byproduct_for_sale') {
        complianceBox.style.background = 'rgba(255, 71, 87, 0.1)';
        complianceBox.style.borderColor = 'rgba(255, 71, 87, 0.3)';
        complianceIcon.setAttribute('data-lucide', 'alert-triangle');
        complianceIcon.style.color = '#ff4757';
        complianceTitle.innerText = 'COMPLIANCE FLAG: FAIL';
        complianceTitle.className = 'font-mono text-danger';
        complianceTitle.style.color = '';
        complianceDesc.innerText = 'Unauthorized waste. Trade is blocked pending Rule 9 authorization from GPCB. Chemical quality is irrelevant until legal status is resolved.';
      } else if (total < 65) {
        complianceBox.style.background = 'rgba(255, 165, 2, 0.1)';
        complianceBox.style.borderColor = 'rgba(255, 165, 2, 0.3)';
        complianceIcon.setAttribute('data-lucide', 'alert-circle');
        complianceIcon.style.color = '#ffa502';
        complianceTitle.innerText = 'COMPLIANCE FLAG: WARNING';
        complianceTitle.className = 'font-mono';
        complianceTitle.style.color = '#ffa502';
        complianceDesc.innerText = `Chemical quality score (${total}%) is below the 65% threshold. One or more parameters exceed government limits — physical assay strongly recommended before trade.`;
      } else {
        complianceBox.style.background = 'rgba(46, 213, 115, 0.1)';
        complianceBox.style.borderColor = 'rgba(46, 213, 115, 0.3)';
        complianceIcon.setAttribute('data-lucide', 'shield-check');
        complianceIcon.style.color = '#2ed573';
        complianceTitle.innerText = 'COMPLIANCE FLAG: PASS';
        complianceTitle.className = 'font-mono text-acid';
        complianceTitle.style.color = '';
        complianceDesc.innerText = `All declared chemical parameters are within government-specified limits. Consent to Operate on file. Material is tradeable.`;
      }
      if (window.lucide) window.lucide.createIcons();
    }

    // ─── IMPROVEMENT ACTIONS (dynamic, based on worst chemical factor) ─────────
    const improvementTitle = document.getElementById('out-improvement-title');
    const improvementList  = document.getElementById('out-improvement-list');
    const industryList     = document.getElementById('out-industry-list');
    
    if (improvementTitle && improvementList && industryList) {
      const factors = [
        { name: 'PURITY',            score: compScore, threshold: `≥${PURITY_THRESHOLD}%`, value: purity + '%',      std: 'BIS' },
        { name: 'MOISTURE',          score: consScore, threshold: `≤${MOISTURE_MAX}%`,      value: moisture + '%',    std: 'BIS 2584' },
        { name: 'pH LEVEL',          score: contScore, threshold: '6.5–8.5',                value: ph,                std: 'GPCB' },
        { name: 'HEAVY METALS',      score: regScore,  threshold: `≤${HM_MAX} ppm`,         value: heavyMetals + 'ppm', std: 'HW Rules 2016' },
        { name: 'SUSPENDED SOLIDS',  score: logScore,  threshold: `≤${SS_MAX} mg/L`,        value: ss + ' mg/L',      std: 'IS Standard' },
      ];
      factors.sort((a, b) => a.score - b.score);
      const weakest = factors[0];
      
      improvementTitle.innerText = `IMPROVEMENT ACTIONS (WEAKEST: ${weakest.name} — ${weakest.std} Threshold ${weakest.threshold})`;
      improvementList.innerHTML = `<li style="margin-bottom: 0.5rem;">Declared value: <strong>${weakest.value}</strong>. Government standard (${weakest.std}): <strong>${weakest.threshold}</strong>.</li><li>Remediation: ${weakest.name === 'PURITY' ? 'Increase concentration through filtration or re-processing.' : weakest.name === 'MOISTURE' ? 'Pre-dry the material to below the specified threshold before dispatch.' : weakest.name === 'pH LEVEL' ? 'Neutralize or buffer the material to bring pH within 6.5–8.5.' : weakest.name === 'HEAVY METALS' ? 'Activate a chelation or precipitation treatment stage to reduce heavy metal load.' : 'Reduce suspended particulate matter through sedimentation or filtration.'}</li>`;

      // Industry fit based on chemical grade
      let industryHtml = '';
      if (consent !== 'declared_byproduct_for_sale') {
        industryHtml = `<li style="color: #ff4757;">None — material is legally blocked until GPCB authorization is obtained.</li>`;
      } else if (total >= 80 && purity >= 90) {
        industryHtml = `<li style="margin-bottom:0.5rem;">Cement manufacturing (gypsum retarder substitute)</li><li>Pharmaceutical-grade gypsum board production</li>`;
      } else if (total >= 65) {
        industryHtml = `<li style="margin-bottom:0.5rem;">Low-grade construction filler (brick, mortar)</li><li>Road base stabilization</li>`;
      } else {
        industryHtml = `<li style="color: #ffa502;">Conditional — material requires pretreatment before any industrial use.</li>`;
      }
      industryList.innerHTML = industryHtml;
    }
  };
    
    // Update UI Colors


  const terminalInputs = ['term-purity', 'term-moisture', 'term-ph', 'term-heavymetals', 'term-ss', 'term-variability', 'term-consent'];
  terminalInputs.forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener('input', () => {
        updateEngineCalculation();
        sfx.playTone(450, 0.02, 'sine');
      });
    }
  });

  if (recalculateBtn) {
    recalculateBtn.addEventListener('click', () => {
      sfx.playTone(880, 0.08, 'triangle');
      gsap.to(recalculateBtn, { scale: 0.95, duration: 0.1, yoyo: true, repeat: 1 });
      updateEngineCalculation();
      if (meterFill) gsap.fromTo(meterFill, { opacity: 0.4 }, { opacity: 1, duration: 0.4 });
    });
  }
  // Always initialize sandbox on page load, regardless of recalculateBtn
  updateEngineCalculation();


  /* ==========================================================================
     7. Marketplace Directory Category Filters
     ========================================================================== */
  const filterChips = document.querySelectorAll('.chip-btn');
  const streamCards = document.querySelectorAll('.stream-card');

  filterChips.forEach((chip) => {
    chip.addEventListener('click', () => {
      filterChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      const filter = chip.getAttribute('data-filter');

      sfx.playTone(550, 0.03, 'sine');

      streamCards.forEach((card) => {
        const cat = card.getAttribute('data-category');
        if (filter === 'all' || cat === filter) {
          card.style.display = 'flex';
          gsap.fromTo(card, { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.35 });
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  /* ==========================================================================
     8. Cluster Topology Radar Canvas Simulation
     ========================================================================== */
  const radarCanvas = document.getElementById('clusterRadarCanvas');
  if (radarCanvas) {
    const rCtx = radarCanvas.getContext('2d');
    let rW, rH;

    const resizeRadar = () => {
      const rect = radarCanvas.parentElement.getBoundingClientRect();
      rW = radarCanvas.width = rect.width;
      rH = radarCanvas.height = rect.height;
    };
    resizeRadar();
    window.addEventListener('resize', resizeRadar);

    const clusterData = {
      ankleshwar: {
        title: 'Ankleshwar Heavy Chemical',
        capacity: '42 ACTIVE CASES',
        desc: 'Average field assay team dispatch time for this zone is currently running at 4.2 hours. 118 verified/flagged companies on file.',
        route: 'Nearest Assay Lab / Team Base: Bharuch (Est 45m)',
        centerAngle: 0.2
      },
      dahej: {
        title: 'Dahej PCPIR Complex',
        capacity: '28 ACTIVE CASES',
        desc: 'Average field assay team dispatch time for this zone is currently running at 3.5 hours. 84 verified/flagged companies on file.',
        route: 'Nearest Assay Lab / Team Base: Dahej SEZ (Est 25m)',
        centerAngle: 1.8
      },
      vapi: {
        title: 'Vapi Dyes & Pharma Zone',
        capacity: '35 ACTIVE CASES',
        desc: 'Average field assay team dispatch time for this zone is currently running at 2.8 hours. 156 verified/flagged companies on file.',
        route: 'Nearest Assay Lab / Team Base: Vapi GIDC (Est 15m)',
        centerAngle: 3.4
      },
      vatva: {
        title: 'Vatva & Naroda Industrial',
        capacity: '16 ACTIVE CASES',
        desc: 'Average field assay team dispatch time for this zone is currently running at 5.1 hours. 62 verified/flagged companies on file.',
        route: 'Nearest Assay Lab / Team Base: Ahmedabad (Est 65m)',
        centerAngle: 4.9
      }
    };

    let activeClusterKey = 'ankleshwar';

    // Interactive corridor buttons
    const clusterBtns = document.querySelectorAll('.cluster-btn');
    const clusterDetails = document.getElementById('clusterDetails');

    clusterBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        clusterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        activeClusterKey = btn.getAttribute('data-cluster');

        const info = clusterData[activeClusterKey];
        if (clusterDetails && info) {
          clusterDetails.querySelector('.c-stat-number').textContent = info.capacity;
          clusterDetails.querySelector('.c-stat-desc').textContent = info.desc;
          clusterDetails.querySelector('.c-route-pill').innerHTML = `<i data-lucide="navigation" class="icon-xs"></i> ${info.route}`;
          if (window.lucide) window.lucide.createIcons();
        }

        sfx.playTone(770, 0.05, 'triangle');
      });
    });

    // Radar draw loop
    let angle = 0;
    const drawRadar = () => {
      rCtx.clearRect(0, 0, rW, rH);
      const cx = rW / 2;
      const cy = rH / 2;
      const radius = Math.min(cx, cy) - 30;

      // Draw concentric radar rings
      rCtx.strokeStyle = 'rgba(214, 223, 36, 0.12)';
      rCtx.lineWidth = 1;
      for (let r = 1; r <= 3; r++) {
        rCtx.beginPath();
        rCtx.arc(cx, cy, (radius / 3) * r, 0, Math.PI * 2);
        rCtx.stroke();
      }

      // Draw crosshairs
      rCtx.beginPath();
      rCtx.moveTo(cx - radius, cy);
      rCtx.lineTo(cx + radius, cy);
      rCtx.moveTo(cx, cy - radius);
      rCtx.lineTo(cx, cy + radius);
      rCtx.stroke();

      // Draw cluster specific plant nodes
      const info = clusterData[activeClusterKey];
      const baseAng = info ? info.centerAngle : 0;

      // Generator Node (Red/Orange)
      const gX = cx + Math.cos(baseAng) * (radius * 0.65);
      const gY = cy + Math.sin(baseAng) * (radius * 0.65);

      // Recipient Node (Acid Lime)
      const rX = cx + Math.cos(baseAng + 1.2) * (radius * 0.75);
      const rY = cy + Math.sin(baseAng + 1.2) * (radius * 0.75);

      // Flow line
      rCtx.beginPath();
      rCtx.moveTo(gX, gY);
      rCtx.lineTo(rX, rY);
      rCtx.strokeStyle = 'rgba(214, 223, 36, 0.7)';
      rCtx.lineWidth = 2.5;
      rCtx.setLineDash([4, 4]);
      rCtx.lineDashOffset = -angle * 20;
      rCtx.stroke();
      rCtx.setLineDash([]);

      // Flow pulse packet
      const packetPos = (angle * 0.5) % 1;
      const pkX = gX + (rX - gX) * packetPos;
      const pkY = gY + (rY - gY) * packetPos;
      rCtx.beginPath();
      rCtx.arc(pkX, pkY, 4, 0, Math.PI * 2);
      rCtx.fillStyle = '#D6DF24';
      rCtx.shadowColor = '#D6DF24';
      rCtx.shadowBlur = 10;
      rCtx.fill();
      rCtx.shadowBlur = 0;

      // Generator point
      rCtx.beginPath();
      rCtx.arc(gX, gY, 6, 0, Math.PI * 2);
      rCtx.fillStyle = '#FF4757';
      rCtx.fill();

      // Recipient point
      rCtx.beginPath();
      rCtx.arc(rX, rY, 7, 0, Math.PI * 2);
      rCtx.fillStyle = '#D6DF24';
      rCtx.fill();

      angle += 0.02;
      requestAnimationFrame(drawRadar);
    };
    drawRadar();
  }

  /* ==========================================================================
     9. Interactive Verification Exposure Calculator
     ========================================================================== */
  const roiTonnage = document.getElementById('roiTonnage');


  /* ==========================================================================
     10. Technical Specification Modal
     ========================================================================== */
  const modal = document.getElementById('matchModal');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const openModalBtns = document.querySelectorAll('.open-modal-btn');
  const modalStreamTitle = document.getElementById('modalStreamTitle');
  const modalStreamOrigin = document.getElementById('modalStreamOrigin');
  const downloadSpecBtn = document.getElementById('downloadSpecBtn');
  
  // Modal Dynamic Elements
  const modalDeclaredSpec = document.getElementById('modalDeclaredSpec');
  const modalFiledSpecBox = document.getElementById('modalFiledSpecBox');
  const modalFiledSpec = document.getElementById('modalFiledSpec');
  const modalConfScore = document.getElementById('modalConfScore');
  const modalMeterFill = document.getElementById('modalMeterFill');
  const modalReasoningTrace = document.getElementById('modalReasoningTrace');
  const modalAssayBadge = document.getElementById('modalAssayBadge');

  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.open-modal-btn');
    if (btn) {
      e.preventDefault();
      
      const card = btn.closest('.stream-card');
      const category = card ? card.getAttribute('data-category') : 'flagged';
      const streamName = btn.getAttribute('data-stream-name') || (card ? card.querySelector('.stream-entity-title').textContent : 'Custom Record');
      const origin = btn.getAttribute('data-origin') || 'GIDC ZONE';

      if (modalStreamTitle) modalStreamTitle.textContent = streamName;
      if (modalStreamOrigin) modalStreamOrigin.textContent = `${origin.toUpperCase()} VERIFICATION`;

      // Populate based on category
      if (category === 'clean' || category === 'verified') {
        if (modalDeclaredSpec) modalDeclaredSpec.textContent = '91.0%';
        if (modalFiledSpecBox) {
          modalFiledSpecBox.style.borderColor = 'rgba(214,223,36,0.3)';
          modalFiledSpecBox.style.background = 'rgba(214,223,36,0.05)';
        }
        if (modalFiledSpec) {
          modalFiledSpec.innerHTML = '85.0% - 95.0%';
          modalFiledSpec.className = 'font-mono text-lg text-acid';
          modalFiledSpec.nextElementSibling.innerHTML = '<i data-lucide="check-circle" class="icon-xs inline-icon"></i> Verified Match';
          modalFiledSpec.nextElementSibling.className = 'font-mono text-xs text-acid mt-1';
        }
        if (modalConfScore) {
          modalConfScore.textContent = '98';
          modalConfScore.className = 'composite-score text-acid font-mono';
          modalConfScore.nextElementSibling.className = 'score-den font-mono text-acid';
        }
        if (modalMeterFill) {
          modalMeterFill.style.width = '98%';
          modalMeterFill.style.background = 'var(--text-acid)';
        }
        if (modalReasoningTrace) {
          modalReasoningTrace.textContent = 'Confidence Score: 98% (Clean/Verified). All parameters match: declared specs align with historical norms, and documents are current.';
          modalReasoningTrace.className = 'proj-val text-acid font-mono';
        }
        if (modalAssayBadge) modalAssayBadge.style.display = category === 'verified' ? 'flex' : 'none'; // display assay badge if it was manually verified by scientist
      } else if (category === 'flagged' || category === 'rejected') {
        if (modalDeclaredSpec) modalDeclaredSpec.textContent = '74.5%';
        if (modalFiledSpecBox) {
          modalFiledSpecBox.style.borderColor = 'rgba(255,71,87,0.3)';
          modalFiledSpecBox.style.background = 'rgba(255,71,87,0.05)';
        }
        if (modalFiledSpec) {
          modalFiledSpec.innerHTML = '60.0% - 68.0%';
          modalFiledSpec.className = 'font-mono text-lg text-danger';
          modalFiledSpec.nextElementSibling.innerHTML = '<i data-lucide="alert-triangle" class="icon-xs inline-icon"></i> Mismatched Range';
          modalFiledSpec.nextElementSibling.className = 'font-mono text-xs text-danger mt-1';
        }
        if (modalConfScore) {
          modalConfScore.textContent = '42';
          modalConfScore.className = 'composite-score text-danger font-mono';
          modalConfScore.nextElementSibling.className = 'score-den font-mono text-danger';
        }
        if (modalMeterFill) {
          modalMeterFill.style.width = '42%';
          modalMeterFill.style.background = 'var(--text-danger)';
        }
        if (modalReasoningTrace) {
          modalReasoningTrace.textContent = 'Confidence Score: 42% (Flagged). Primary driver: declared concentration falls outside historical output range — physical assay dispatched & confirmed.';
          modalReasoningTrace.className = 'proj-val text-danger font-mono';
        }
        if (modalAssayBadge) modalAssayBadge.style.display = 'flex';
      } else if (category === 'gap') {
        if (modalDeclaredSpec) modalDeclaredSpec.textContent = '91.8%';
        if (modalFiledSpecBox) {
          modalFiledSpecBox.style.borderColor = 'rgba(255,71,87,0.3)';
          modalFiledSpecBox.style.background = 'rgba(255,71,87,0.05)';
        }
        if (modalFiledSpec) {
          modalFiledSpec.innerHTML = 'EXPIRED';
          modalFiledSpec.className = 'font-mono text-lg text-danger';
          modalFiledSpec.nextElementSibling.innerHTML = '<i data-lucide="alert-triangle" class="icon-xs inline-icon"></i> Consent Lapsed 8mo';
          modalFiledSpec.nextElementSibling.className = 'font-mono text-xs text-danger mt-1';
        }
        if (modalConfScore) {
          modalConfScore.textContent = '12';
          modalConfScore.className = 'composite-score text-danger font-mono';
          modalConfScore.nextElementSibling.className = 'score-den font-mono text-danger';
        }
        if (modalMeterFill) {
          modalMeterFill.style.width = '12%';
          modalMeterFill.style.background = 'var(--text-danger)';
        }
        if (modalReasoningTrace) {
          modalReasoningTrace.textContent = 'Confidence Score: 12% (Doc Gap). Primary driver: regulatory consent expired 8 months ago, exceeding permissible threshold. Trade blocked pending renewal.';
          modalReasoningTrace.className = 'proj-val text-danger font-mono';
        }
        if (modalAssayBadge) modalAssayBadge.style.display = 'none';
      }

      if (window.lucide) window.lucide.createIcons();

      if (modal) modal.classList.add('active');
      sfx.playTone(600, 0.05, 'triangle');
    }
  });

  const closeModal = () => {
    if (modal) modal.classList.remove('active');
  };

  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });
  }

  if (downloadSpecBtn) {
    downloadSpecBtn.addEventListener('click', () => {
      sfx.playTone(880, 0.1, 'sine');
      downloadSpecBtn.innerHTML = `<span>Certificate Exported to Dashboard</span> <i data-lucide="check" class="icon-sm"></i>`;
      if (window.lucide) window.lucide.createIcons();
      setTimeout(() => {
        closeModal();
        // Reset button
        setTimeout(() => {
          downloadSpecBtn.innerHTML = `<span>Download Verification Certificate (PDF)</span> <i data-lucide="download" class="icon-sm"></i>`;
          if (window.lucide) window.lucide.createIcons();
        }, 500);
      }, 1500);
    });
  }

  /* ==========================================================================
     11. Facility Onboarding Form Submission
     ========================================================================== */
  const onboardingForm = document.getElementById('onboardingForm');
  const formSuccessMessage = document.getElementById('formSuccessMessage');
  const plantRoleSelect = document.getElementById('plantRole');
  const sellerNotice = document.getElementById('sellerNotice');

  // Verification Cost Calculation
  const transactVolume = document.getElementById('transactVolume');
  const formCalculatedCost = document.getElementById('formCalculatedCost');
  const formVolumeLabel = document.getElementById('formVolumeLabel');

  if (transactVolume && formCalculatedCost && formVolumeLabel) {
    transactVolume.addEventListener('input', () => {
      const vol = parseFloat(transactVolume.value) || 0;
      const cost = vol * 2500;
      formVolumeLabel.innerText = `${vol.toLocaleString()} MT`;
      formCalculatedCost.innerText = `₹ ${cost.toLocaleString()}`;
    });
  }

  if (plantRoleSelect && sellerNotice) {
    plantRoleSelect.addEventListener('change', (e) => {
      if (e.target.value === 'seller') {
        sellerNotice.style.display = 'block';
        gsap.fromTo(sellerNotice, { opacity: 0, x: -10 }, { opacity: 1, x: 0, duration: 0.3 });
      } else {
        sellerNotice.style.display = 'none';
      }
    });
  }

  if (onboardingForm) {
    onboardingForm.addEventListener('submit', (e) => {
      e.preventDefault();
      sfx.playTone(880, 0.15, 'sawtooth');

      const submitBtn = onboardingForm.querySelector('#submitFormBtn');
      submitBtn.disabled = true;
      submitBtn.innerHTML = `<span>Processing Telemetry...</span> <i data-lucide="loader" class="icon-md animate-spin"></i>`;
      if (window.lucide) window.lucide.createIcons();

      setTimeout(() => {
        onboardingForm.style.display = 'none';
        if (formSuccessMessage) formSuccessMessage.style.display = 'flex';
        gsap.from(formSuccessMessage, { opacity: 0, y: 20, duration: 0.5 });
      }, 1000);
    });
  }

  /* ==========================================================================
     12. Interactive Document Checklist
     ========================================================================== */
  const documentData = {
    "spent-h2so4": {
      buying: [
        { title: "Consent to Operate (CTO) for Receiving", help: "We can help amend your CCA to include this material as a feedstock." },
        { title: "Rule 9 Utilization Approval", help: "We prepare your utilization approval application and liaise directly with GPCB." },
        { title: "Form 10 Transport Manifest (Receiver Copy)", help: "We automate XGN manifest generation and syncing." }
      ],
      selling: [
        { title: "Rule 6 Authorization (Generator)", help: "We can assist in filing for hazardous waste authorization." },
        { title: "Consent to Operate (CTO) covering generation", help: "We compile mass balance sheets for CTO renewal." },
        { title: "Form 9 TREM Card", help: "We prepare the Form 9 TREM card drafting based on NABL physical assay characteristics to ensure transport legality." },
        { title: "Form 10 Transport Manifest (Generator Copy)", help: "We integrate with weighbridge systems for instant manifest generation." }
      ]
    },
    "phosphogypsum": {
      buying: [
        { title: "Consent to Operate (CTO)", help: "We help amend your CTO to explicitly permit this material." },
        { title: "Rule 9 Utilization Approval", help: "We prepare your utilization approval application for Cement/Fertilizer manufacturing and liaise with GPCB." }
      ],
      selling: [
        { title: "Rule 6 Authorization (Generator)", help: "Mandatory for generation. We prepare the complete documentation." },
        { title: "Form 10 Transport Manifest", help: "We automate XGN manifest generation integrated with weighbridge software." }
      ]
    },
    "fly-ash": {
      buying: [
        { title: "Consent to Operate (CTO/CTE)", help: "Required for facility operation. We can expedite renewals." },
        { title: "Commercial Invoice", help: "Standard financial documentation." },
        { title: "GST E-Way Bill", help: "We integrate with your ERP to auto-generate valid E-Way bills based on geofenced distance." }
      ],
      selling: [
        { title: "Consent to Operate (CTO)", help: "Required for facility operation." },
        { title: "GST E-Way Bill", help: "We integrate with your ERP to auto-generate valid E-Way bills based on geofenced distance." },
        { title: "Weighbridge Certificate", help: "We dispatch a verified 3rd-party logistics auditor to oversee public weighbridge calibration." }
      ]
    },
    "toluene": {
      buying: [
        { title: "Consent to Operate (CTO) for Solvent Recovery", help: "We assist in amending your CTO to explicitly permit spent solvent recovery." },
        { title: "PESO License for Flammable Storage", help: "We coordinate with PESO consultants for fast-tracked license renewals." },
        { title: "Rule 9 Utilization Approval", help: "Mandatory for hazardous solvents. We manage the entire GPCB application." }
      ],
      selling: [
        { title: "Rule 6 Authorization", help: "Required hazardous authorization." },
        { title: "Form 9 TREM Card", help: "Critical for flammable transport. We draft and certify TREM cards." },
        { title: "Material Safety Data Sheet (MSDS)", help: "We can help generate NABL-compliant MSDS sheets." }
      ]
    }
  };

  const docRoleToggle = document.getElementById('docRoleToggle');
  const docMaterialToggle = document.getElementById('docMaterialToggle');
  const dynamicChecklistContainer = document.getElementById('dynamicChecklistContainer');

  const renderChecklist = () => {
    if (!dynamicChecklistContainer || !docRoleToggle || !docMaterialToggle) return;
    const role = docRoleToggle.value;
    const material = docMaterialToggle.value;
    const docs = documentData[material]?.[role] || [];

    dynamicChecklistContainer.innerHTML = '';
    
    docs.forEach((doc, idx) => {
      const isLast = idx === docs.length - 1;
      const borderStyle = isLast ? '' : 'border-bottom: 1px solid rgba(255,255,255,0.05);';

      const rowHtml = `
        <div class="doc-row" style="display: flex; justify-content: space-between; align-items: flex-start; padding: 1.25rem 1.5rem; ${borderStyle}">
          
          <div class="doc-info" style="display: flex; align-items: flex-start; gap: 1rem; flex: 1;">
            <input type="checkbox" id="doc-chk-${idx}" class="doc-checkbox" style="width: 1.2rem; height: 1.2rem; margin-top: 0.2rem; accent-color: var(--text-acid); cursor: pointer;" />
            <label for="doc-chk-${idx}" class="doc-title" style="margin-bottom: 0; cursor: pointer; font-size: 1rem; user-select: none;">${doc.title}</label>
          </div>

          <div class="doc-status-col" id="doc-status-col-${idx}" style="text-align: right; min-width: 280px;">
            <!-- Rendered by JS below -->
          </div>
        </div>
      `;
      dynamicChecklistContainer.insertAdjacentHTML('beforeend', rowHtml);

      const checkbox = document.getElementById(`doc-chk-${idx}`);
      const statusCol = document.getElementById(`doc-status-col-${idx}`);

      const updateRowState = (isChecked) => {
        let statusHtml = '';
        let helpHtml = '';

        if (isChecked) {
          statusHtml = `<span class="status-badge" style="display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.25rem 0.75rem; border-radius: 4px; font-size: 0.8rem; font-family: 'Space Mono', monospace; font-weight: 700; background: rgba(46, 213, 115, 0.1); color: #2ed573; transition: all 0.3s;"><i data-lucide="check-circle" class="icon-sm"></i> On File & Verified</span>`;
        } else {
          statusHtml = `<span class="status-badge" style="display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.25rem 0.75rem; border-radius: 4px; font-size: 0.8rem; font-family: 'Space Mono', monospace; font-weight: 700; background: rgba(255, 71, 87, 0.1); color: #ff4757; transition: all 0.3s;"><i data-lucide="x-circle" class="icon-sm"></i> Missing</span>`;
          if (doc.help) {
            helpHtml = `
              <button class="doc-help-btn font-mono text-xs text-muted" data-help="doc-${idx}" style="background: none; border: none; cursor: pointer; text-decoration: underline; display: block; margin-left: auto; margin-top: 0.5rem; transition: color 0.2s;">How to get this document</button>
              <div class="doc-help-panel" id="help-doc-${idx}" style="display: none; background: rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.1); padding: 0.75rem; border-radius: 4px; margin-top: 0.5rem; font-size: 0.85rem; text-align: left; line-height: 1.4; color: var(--text-silver);">
                <div style="margin-bottom: 0.75rem;">${doc.help}</div>
                <button class="req-assist-btn font-mono text-xs" style="background: var(--text-acid); color: #000; border: none; padding: 0.4rem 0.75rem; border-radius: 2px; cursor: pointer; font-weight: bold; width: 100%; display: flex; justify-content: center; align-items: center; gap: 0.25rem;">Request Touchstone Assistance</button>
              </div>
            `;
          }
        }

        statusCol.innerHTML = statusHtml + helpHtml;
        if (window.lucide) window.lucide.createIcons();

        // Re-bind help button
        const helpBtn = statusCol.querySelector('.doc-help-btn');
        if (helpBtn) {
          helpBtn.addEventListener('click', (e) => {
            const panel = document.getElementById(`help-doc-${idx}`);
            if (panel) {
              if (panel.style.display === 'none' || !panel.style.display) {
                panel.style.display = 'block';
                helpBtn.textContent = 'Hide help';
                gsap.fromTo(panel, { opacity: 0, height: 0 }, { opacity: 1, height: 'auto', duration: 0.2 });
              } else {
                panel.style.display = 'none';
                helpBtn.textContent = 'How to get this document';
              }
            }
          });
        }

        // Re-bind request assistance button
        const reqAssistBtn = statusCol.querySelector('.req-assist-btn');
        if (reqAssistBtn) {
          reqAssistBtn.addEventListener('click', (e) => {
            reqAssistBtn.innerHTML = `<i data-lucide="check" class="icon-xs"></i> Assistance Requested`;
            reqAssistBtn.style.background = '#2ed573';
            reqAssistBtn.style.color = '#000';
            reqAssistBtn.style.cursor = 'default';
            reqAssistBtn.disabled = true;
            if (window.lucide) window.lucide.createIcons();
            sfx.playTone(800, 0.1, 'sine');
          });
        }
      };

      // Initial state (unchecked)
      updateRowState(false);

      checkbox.addEventListener('change', (e) => {
        if(e.target.checked) sfx.playTone(600, 0.05, 'triangle');
        else sfx.playTone(300, 0.05, 'square');
        updateRowState(e.target.checked);
      });
    });

    if (window.lucide) window.lucide.createIcons();

    // Animation
    gsap.fromTo(dynamicChecklistContainer.querySelectorAll('.doc-row'), 
      { opacity: 0, y: 10 }, 
      { opacity: 1, y: 0, duration: 0.3, stagger: 0.05 }
    );
  };

  if (docRoleToggle && docMaterialToggle) {
    docRoleToggle.addEventListener('change', () => { sfx.playTone(440, 0.05, 'sine'); renderChecklist(); });
    docMaterialToggle.addEventListener('change', () => { sfx.playTone(440, 0.05, 'sine'); renderChecklist(); });
    renderChecklist(); // Initial render
  }

  /* ==========================================================================
     13. Live Server Timestamp Clock in Footer
     ========================================================================== */
  const liveTimestamp = document.getElementById('liveTimestamp');
  const updateTimestamp = () => {
    if (liveTimestamp) {
      const now = new Date();
      liveTimestamp.textContent = `${now.toISOString().replace('T', ' ').substring(0, 19)} IST`;
    }
  };
  setInterval(updateTimestamp, 1000);
  updateTimestamp();

  /* ==========================================================================
     14. Auth Modal & Dashboard Overlay Logic
     ========================================================================== */
  const navLoginBtn = document.getElementById('navLoginBtn');
  const authModal = document.getElementById('authModal');
  const authCloseBtn = document.getElementById('authCloseBtn');
  
  const tabBtnLogin = document.getElementById('tabBtnLogin');
  const tabBtnSignup = document.getElementById('tabBtnSignup');
  const loginForm = document.getElementById('loginForm');
  const signupForm = document.getElementById('signupForm');
  
  const authLoadingState = document.getElementById('authLoadingState');
  const authResultState = document.getElementById('authResultState');
  const authResultBadge = document.getElementById('authResultBadge');
  const authTabsContainer = document.querySelector('.auth-tabs');
  
  const dashboardOverlay = document.getElementById('dashboardOverlay');
  const dashLogoutBtn = document.getElementById('dashLogoutBtn');
  const dashUserCompany = document.getElementById('dashUserCompany');
  const dashUserCluster = document.getElementById('dashUserCluster');

  // Open / Close Modal
  if (navLoginBtn && authModal) {
    navLoginBtn.addEventListener('click', (e) => {
      e.preventDefault();
      authModal.style.display = 'flex';
      sfx.playTone(440, 0.05, 'sine');
      gsap.fromTo(authModal.querySelector('.modal-window'), 
        { y: 30, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 0.4, ease: "power3.out" }
      );
    });
  }

  if (authCloseBtn) {
    authCloseBtn.addEventListener('click', () => {
      gsap.to(authModal.querySelector('.modal-window'), {
        y: -30, opacity: 0, duration: 0.3, ease: "power3.in",
        onComplete: () => { authModal.style.display = 'none'; }
      });
    });
  }

  // Tabs Toggle
  if (tabBtnLogin && tabBtnSignup) {
    tabBtnLogin.addEventListener('click', () => {
      tabBtnLogin.style.color = 'var(--text-acid)';
      tabBtnLogin.style.fontWeight = 'bold';
      tabBtnSignup.style.color = 'var(--text-muted)';
      tabBtnSignup.style.fontWeight = 'normal';
      loginForm.style.display = 'block';
      signupForm.style.display = 'none';
      sfx.playTone(600, 0.02, 'square');
    });
    
    tabBtnSignup.addEventListener('click', () => {
      tabBtnSignup.style.color = 'var(--text-acid)';
      tabBtnSignup.style.fontWeight = 'bold';
      tabBtnLogin.style.color = 'var(--text-muted)';
      tabBtnLogin.style.fontWeight = 'normal';
      signupForm.style.display = 'block';
      loginForm.style.display = 'none';
      sfx.playTone(600, 0.02, 'square');
    });
  }

  // Open Dashboard Function
  const openDashboard = (companyName, cluster) => {
    authModal.style.display = 'none';
    dashboardOverlay.style.display = 'block';
    if (companyName && dashUserCompany) dashUserCompany.textContent = companyName;
    if (cluster && dashUserCluster) dashUserCluster.textContent = cluster;
    
    // Animate dashboard entrance
    sfx.playTone(800, 0.1, 'sine');
    gsap.fromTo(dashboardOverlay, { opacity: 0 }, { opacity: 1, duration: 0.4 });
    gsap.fromTo(dashboardOverlay.querySelectorAll('.glass-card'), 
      { y: 20, opacity: 0 }, 
      { y: 0, opacity: 1, duration: 0.5, stagger: 0.1, delay: 0.2, ease: "power2.out" }
    );
  };

  // Login Submit
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      openDashboard('Aarti Industries Limited', 'Ankleshwar GIDC');
    });
  }

  // Signup Submit (Registry Check Flow)
  if (signupForm) {
    signupForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const inputCompany = document.getElementById('regCompanyName').value;
      const inputCluster = document.getElementById('regCluster').value;
      
      // Hide forms and tabs
      loginForm.style.display = 'none';
      signupForm.style.display = 'none';
      authTabsContainer.style.display = 'none';
      
      // Show loading
      authLoadingState.style.display = 'block';
      sfx.playTone(300, 0.5, 'square');
      
      setTimeout(() => {
        authLoadingState.style.display = 'none';
        authResultState.style.display = 'block';
        
        // Pseudo-logic for verified vs unverified
        const isVerified = inputCompany.toLowerCase().includes('ltd') || inputCompany.toLowerCase().includes('limited') || inputCompany.length > 6;
        
        if (isVerified) {
          authResultBadge.innerHTML = `<i data-lucide="check-circle-2" class="icon-sm"></i> Verified — Registry Match`;
          authResultBadge.style.color = '#2ed573';
          authResultBadge.style.background = 'rgba(46, 213, 115, 0.1)';
          sfx.playTone(800, 0.1, 'sine');
        } else {
          authResultBadge.innerHTML = `<i data-lucide="alert-triangle" class="icon-sm"></i> Unverified — Self-Reported`;
          authResultBadge.style.color = '#ffa502';
          authResultBadge.style.background = 'rgba(255, 165, 2, 0.1)';
          sfx.playTone(200, 0.2, 'sawtooth');
        }
        
        if (window.lucide) window.lucide.createIcons();

        // After 2.5s, launch dashboard
        setTimeout(() => {
          // Reset modal for future opens
          authResultState.style.display = 'none';
          authTabsContainer.style.display = 'flex';
          signupForm.style.display = 'block';
          
          openDashboard(inputCompany, inputCluster + ' GIDC');
        }, 2500);

      }, 2500);
    });
  }

  // Close Dashboard
  if (dashLogoutBtn) {
    dashLogoutBtn.addEventListener('click', () => {
      gsap.to(dashboardOverlay, { opacity: 0, duration: 0.3, onComplete: () => {
        dashboardOverlay.style.display = 'none';
      }});
    });
  }

  /* ==========================================================================
     15. Scientist Assay Terminal logic
     ========================================================================== */
  const caseSelector = document.getElementById('caseSelector');
  const updateLibraryBtn = document.getElementById('updateLibraryBtn');

  if (caseSelector) {
    caseSelector.addEventListener('change', (e) => {
      sfx.playTone(600, 0.05, 'triangle');
      const outputRadar = document.querySelector('.simulator-output');
      if (outputRadar) {
        gsap.fromTo(outputRadar, { opacity: 0.5 }, { opacity: 1, duration: 0.3 });
      }
    });
  }

  if (updateLibraryBtn) {
    updateLibraryBtn.addEventListener('click', () => {
      sfx.playTone(800, 0.1, 'sine');
      
      const originalText = updateLibraryBtn.innerHTML;
      updateLibraryBtn.innerHTML = `<span>Saving...</span> <i data-lucide="loader-2" class="icon-sm"></i>`;
      if (window.lucide) window.lucide.createIcons();
      updateLibraryBtn.style.background = 'var(--text-acid)';
      updateLibraryBtn.style.color = '#000';
      
      setTimeout(() => {
        updateLibraryBtn.innerHTML = `<span>Report Updated</span> <i data-lucide="check" class="icon-sm"></i>`;
        if (window.lucide) window.lucide.createIcons();
        sfx.playTone(900, 0.2, 'sine');

        // Pull live values from the Field Assay Terminal inputs
        const livePurity = document.getElementById('term-purity') ? document.getElementById('term-purity').value : '—';
        const liveMoisture = document.getElementById('term-moisture') ? document.getElementById('term-moisture').value : '—';
        const liveConsent = document.getElementById('term-consent') ? document.getElementById('term-consent').value : '—';
        const liveScore = document.getElementById('compositeScore') ? document.getElementById('compositeScore').innerText : '—';
        const liveGrade = document.getElementById('gradeScore') ? document.getElementById('gradeScore').innerText : '—';
        const consentLabel = liveConsent === 'declared_byproduct_for_sale' ? 'Rule-9 Approved' : 'Unauthorized — Blocked';
        const consentClass = liveConsent === 'declared_byproduct_for_sale' ? 'text-acid' : 'text-danger';
        const outcomeLabel = parseFloat(liveScore) >= 80 ? 'Verified by Scientist' : (parseFloat(liveScore) >= 65 ? 'Conditional Approval' : 'Flagged — Physical Assay Required');
        const outcomeClass = parseFloat(liveScore) >= 80 ? 'text-acid' : (parseFloat(liveScore) >= 65 ? '' : 'text-danger');

        if (caseSelector && caseSelector.value === 'new-case') {
          const marketplaceGrid = document.getElementById('marketplaceGrid');
          if (marketplaceGrid) {
            const newCard = document.createElement('div');
            newCard.className = 'stream-card glass-card';
            newCard.setAttribute('data-category', parseFloat(liveScore) >= 65 ? 'verified' : 'rejected');
            newCard.innerHTML = `
              <div class="stream-card-top">
                <span class="hazchem-badge font-mono" style="background: var(--text-acid); color: #000;">NEW ASSAY — GRADE ${liveGrade}</span>
                <span class="cluster-pill font-mono">FIELD TERMINAL</span>
              </div>
              <div class="stream-entity-title">${document.getElementById('term-company') ? document.getElementById('term-company').value || 'Unknown Facility' : 'Unknown Facility'}</div>
              <div class="stream-specs font-mono">
                <div class="spec-row">
                  <span>Verification Outcome:</span>
                  <strong class="${outcomeClass}">${outcomeLabel}</strong>
                </div>
                <div class="spec-row">
                  <span>Purity / Moisture:</span>
                  <span>${livePurity}% / ${liveMoisture}%</span>
                </div>
                <div class="spec-row">
                  <span>Marketability Score:</span>
                  <span class="text-acid">${liveScore} / 100</span>
                </div>
                <div class="spec-row">
                  <span>GPCB Authorization:</span>
                  <span class="${consentClass}">${consentLabel}</span>
                </div>
              </div>
              <div class="target-recipients">
                <span class="target-title font-mono text-muted">VERIFICATION SUMMARY:</span>
                <p class="target-desc">Case registered from live field terminal. Purity declared at ${livePurity}% with ${liveMoisture}% moisture. Composite marketability score: ${liveScore}.</p>
              </div>
              <div class="stream-card-footer">
                <button class="btn btn-acid-sm btn-magnetic open-modal-btn w-full" data-stream-name="Field Terminal Case" data-origin="Live Input">
                  <span>View Verification Report</span>
                  <i data-lucide="file-check" class="icon-xs"></i>
                </button>
              </div>
            `;
            marketplaceGrid.insertBefore(newCard, marketplaceGrid.firstChild);
            gsap.fromTo(newCard, { opacity: 0, y: -20 }, { opacity: 1, y: 0, duration: 0.5 });
            if (window.lucide) window.lucide.createIcons();
            setTimeout(() => { newCard.scrollIntoView({ behavior: 'smooth', block: 'center' }); }, 100);
          }
        } else if (caseSelector) {
          // Update an existing case with live terminal values
          const marketplaceGrid = document.getElementById('marketplaceGrid');
          if (marketplaceGrid) {
            const cards = marketplaceGrid.querySelectorAll('.stream-card');
            const caseMap = {
              'spent-h2so4': 0,
              'phosphogypsum': 1,
              'spent-toluene': 2,
              'flyash-f': 3,
              'spent-caustic': 4,
              'ggbs-slag': 5
            };
            const idx = caseMap[caseSelector.value];
            if (idx !== undefined && cards[idx]) {
              const card = cards[idx];
              card.setAttribute('data-category', parseFloat(liveScore) >= 65 ? 'verified' : 'rejected');
              const outcomeRow = card.querySelector('.spec-row:first-child');
              if (outcomeRow) {
                 outcomeRow.innerHTML = `<span>Verification Outcome:</span><strong class="${outcomeClass}">${outcomeLabel}</strong>`;
              }
              // Inject live purity/score into card
              const specRows = card.querySelectorAll('.spec-row');
              if (specRows[1]) specRows[1].innerHTML = `<span>Declared Concentration:</span><span>${livePurity}%</span>`;
              const targetDesc = card.querySelector('.target-desc');
              if (targetDesc) {
                 targetDesc.textContent = `Updated from field assay terminal. Purity: ${livePurity}%, Moisture: ${liveMoisture}%. Composite score: ${liveScore}. ${liveConsent === 'declared_byproduct_for_sale' ? 'GPCB Rule-9 Authorized.' : 'Authorization not on file — trade may be blocked.'}`;
              }
              gsap.fromTo(card, { borderColor: '#d6df24', boxShadow: '0 0 20px rgba(214,223,36,0.3)' }, { borderColor: 'rgba(255,255,255,0.05)', boxShadow: 'none', duration: 2, delay: 0.2 });
              setTimeout(() => { card.scrollIntoView({ behavior: 'smooth', block: 'center' }); }, 100);
            }
          }
        }

        setTimeout(() => {
          updateLibraryBtn.innerHTML = originalText;
          updateLibraryBtn.style.background = 'transparent';
          updateLibraryBtn.style.color = 'var(--text-acid)';
          // reset dropdown if needed
          if (caseSelector && caseSelector.value === 'new-case') {
             caseSelector.selectedIndex = 0;
          }
        }, 3000);
      }, 1000);
    });
  }
});
