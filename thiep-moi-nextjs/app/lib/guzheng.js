// Giai điệu gốc (tự soạn) theo thang ngũ cung Rê, tạo âm thanh bằng mô phỏng dây đàn gảy
// (Karplus-Strong) để gợi âm hưởng đàn tranh trong cung yến cổ phong. Không dùng bản ghi âm nào.

export const BPM = 64;
export const EIGHTH = 60 / BPM / 2; // độ dài một nốt móc đơn (giây)
export const LOOP_EIGHTHS = 32; // một vòng lặp = 4 ô nhịp
export const midiToFreq = (m) => 440 * Math.pow(2, (m - 69) / 12);

// [vị trí (theo nốt móc đơn), nốt MIDI, độ mạnh]
export const MELODY = [
  [0, 69, 1], [2, 71, 0.9], [3, 69, 0.8], [4, 66, 0.9], [6, 69, 0.9],
  [8, 74, 1], [10, 71, 0.9], [11, 69, 0.8], [12, 66, 0.9], [14, 64, 0.9],
  [16, 66, 0.9], [17, 69, 0.8], [18, 71, 0.9], [20, 74, 1], [22, 76, 0.9],
  [24, 74, 0.9], [25, 71, 0.8], [26, 69, 0.9], [28, 71, 1], [30, 62, 1],
];
export const BASS = [[0, 50, 0.9], [8, 47, 0.8], [16, 50, 0.9], [24, 45, 0.8]];
export const ARP_CYCLE = [62, 66, 69, 74];
export const RUN = [62, 64, 66, 69, 71, 74, 76, 78, 81]; // nét lướt đặc trưng của đàn tranh

export const ALL_NOTES = Array.from(
  new Set([...MELODY.map((n) => n[1]), ...BASS.map((n) => n[1]), ...ARP_CYCLE, ...RUN])
);

export function buildPluck(sampleRate, freq, seconds = 3.6) {
  const period = Math.max(2, Math.round(sampleRate / freq));
  const len = Math.floor(sampleRate * seconds);
  const ring = new Float32Array(period);
  let prev = 0;
  for (let i = 0; i < period; i++) {
    const n = Math.random() * 2 - 1;
    prev = prev * 0.35 + n * 0.65; // làm mịn nhẹ cho tiếng gảy ấm hơn
    ring[i] = prev;
  }
  const out = new Float32Array(len);
  const decay = 0.9972;
  let idx = 0;
  let peak = 0;
  for (let i = 0; i < len; i++) {
    const a = ring[idx];
    const b = ring[(idx + 1) % period];
    out[i] = a;
    ring[idx] = (a + b) * 0.5 * decay;
    idx = (idx + 1) % period;
    const v = Math.abs(a);
    if (v > peak) peak = v;
  }
  const norm = peak > 0 ? 0.9 / peak : 1;
  const fade = Math.floor(sampleRate * 0.4);
  for (let i = 0; i < len; i++) {
    let v = out[i] * norm;
    if (i > len - fade) v *= (len - i) / fade;
    out[i] = v;
  }
  // playbackRate bù lại sai số do làm tròn độ dài chu kỳ, để đúng cao độ
  return { data: out, rate: freq / (sampleRate / period) };
}
