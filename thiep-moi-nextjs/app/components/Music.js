'use client';

import { useEffect, useRef, useState } from 'react';
import {
  ALL_NOTES, ARP_CYCLE, BASS, EIGHTH, LOOP_EIGHTHS, MELODY, RUN, buildPluck, midiToFreq,
} from '../lib/guzheng';

// Nếu bạn có file nhạc riêng (có bản quyền hợp lệ), đặt vào thư mục public rồi điền đường dẫn,
// ví dụ '/music.mp3'. Để trống thì dùng giai điệu đàn tranh tự tạo trong trình duyệt.
const MUSIC_FILE = '';

function createEngine() {
  const Ctx = window.AudioContext || window.webkitAudioContext;
  if (!Ctx) return null;
  const ctx = new Ctx();
  const sr = ctx.sampleRate;

  // Chuỗi xử lý: master -> nén -> loa
  const comp = ctx.createDynamicsCompressor();
  comp.connect(ctx.destination);
  const master = ctx.createGain();
  master.gain.value = 0;
  master.connect(comp);

  // Vang nhẹ như trong đại điện
  const verb = ctx.createConvolver();
  const irLen = Math.floor(sr * 2.4);
  const ir = ctx.createBuffer(2, irLen, sr);
  for (let c = 0; c < 2; c++) {
    const d = ir.getChannelData(c);
    for (let i = 0; i < irLen; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / irLen, 3);
  }
  verb.buffer = ir;
  const wet = ctx.createGain();
  wet.gain.value = 0.32;
  verb.connect(wet);
  wet.connect(master);
  const dry = ctx.createGain();
  dry.gain.value = 0.85;
  dry.connect(master);

  // Nền ngân nhẹ (hai âm Rê - La)
  const pad = ctx.createGain();
  pad.gain.value = 0.035;
  const padLp = ctx.createBiquadFilter();
  padLp.type = 'lowpass';
  padLp.frequency.value = 500;
  pad.connect(padLp);
  padLp.connect(master);
  [73.42, 146.83, 220.0].forEach((f) => {
    const o = ctx.createOscillator();
    o.type = 'sine';
    o.frequency.value = f;
    o.connect(pad);
    o.start();
  });

  // Tạo trước các nốt đàn
  const bank = new Map();
  ALL_NOTES.forEach((m) => {
    const { data, rate } = buildPluck(sr, midiToFreq(m));
    const buf = ctx.createBuffer(1, data.length, sr);
    buf.getChannelData(0).set(data);
    bank.set(m, { buf, rate });
  });

  function note(midi, when, vel) {
    const n = bank.get(midi);
    if (!n) return;
    const s = ctx.createBufferSource();
    s.buffer = n.buf;
    s.playbackRate.value = n.rate;
    const g = ctx.createGain();
    g.gain.value = vel * 0.55;
    s.connect(g);
    g.connect(dry);
    g.connect(verb);
    s.start(when);
  }

  function scheduleLoop(start, loopIndex) {
    MELODY.forEach(([pos, m, v]) => note(m, start + pos * EIGHTH, v));
    BASS.forEach(([pos, m, v]) => note(m, start + pos * EIGHTH, v * 0.8));
    for (let k = 0; k < 8; k++) {
      note(ARP_CYCLE[k % ARP_CYCLE.length], start + (1 + k * 4) * EIGHTH, 0.32);
    }
    if (loopIndex % 2 === 0) {
      RUN.forEach((m, i) => note(m, start + i * 0.065, 0.28));
    }
  }

  let nextStart = 0;
  let loopIndex = 0;
  let timer = null;
  let wantPlaying = false;

  function tick() {
    while (nextStart - ctx.currentTime < 4) {
      scheduleLoop(nextStart, loopIndex++);
      nextStart += LOOP_EIGHTHS * EIGHTH;
    }
  }

  return {
    async play() {
      wantPlaying = true;
      await ctx.resume();
      master.gain.cancelScheduledValues(ctx.currentTime);
      master.gain.setTargetAtTime(0.85, ctx.currentTime, 0.5);
      if (!timer) {
        nextStart = ctx.currentTime + 0.2;
        tick();
        timer = setInterval(tick, 400);
      }
    },
    pause() {
      wantPlaying = false;
      master.gain.cancelScheduledValues(ctx.currentTime);
      master.gain.setTargetAtTime(0, ctx.currentTime, 0.15);
      setTimeout(() => {
        if (!wantPlaying) ctx.suspend();
      }, 700);
    },
    destroy() {
      if (timer) clearInterval(timer);
      ctx.close();
    },
  };
}

export default function Music() {
  const [playing, setPlaying] = useState(false);
  const [hint, setHint] = useState(true);
  const engine = useRef(null);
  const audioEl = useRef(null);

  useEffect(() => {
    const t = setTimeout(() => setHint(false), 9000);
    return () => {
      clearTimeout(t);
      if (engine.current) engine.current.destroy();
      if (audioEl.current) audioEl.current.pause();
    };
  }, []);

  async function toggle() {
    setHint(false);
    try {
      if (MUSIC_FILE) {
        if (!audioEl.current) {
          audioEl.current = new Audio(MUSIC_FILE);
          audioEl.current.loop = true;
          audioEl.current.volume = 0.7;
        }
        if (playing) audioEl.current.pause();
        else await audioEl.current.play();
        setPlaying(!playing);
        return;
      }
      if (!engine.current) engine.current = createEngine();
      if (!engine.current) return;
      if (playing) engine.current.pause();
      else await engine.current.play();
      setPlaying(!playing);
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <div className="music-wrap">
      {hint && !playing && <div className="music-hint">Chạm để nghe cung nhạc</div>}
      <button
        type="button"
        className={`music-btn${playing ? ' on' : ''}`}
        onClick={toggle}
        aria-pressed={playing}
        aria-label={playing ? 'Tắt nhạc' : 'Bật nhạc'}
        title={playing ? 'Tắt nhạc' : 'Bật nhạc'}
      >
        <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
          <path
            fill="currentColor"
            d="M9 3v11.3A3.5 3.5 0 1 0 11 17.5V8h7V3H9z"
          />
          {!playing && <path d="M4 4l16 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />}
        </svg>
      </button>
    </div>
  );
}
