'use client';

import { useEffect, useState } from 'react';

export default function Petals({ count = 16 }) {
  const [petals, setPetals] = useState([]);

  useEffect(() => {
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    setPetals(
      Array.from({ length: count }, () => {
        const size = 8 + Math.random() * 10;
        return {
          left: Math.random() * 100,
          duration: 9 + Math.random() * 10,
          delay: -Math.random() * 18,
          size,
        };
      })
    );
  }, [count]);

  return (
    <div id="petals" aria-hidden="true">
      {petals.map((p, i) => (
        <span
          key={i}
          className="petal"
          style={{
            left: `${p.left}vw`,
            width: p.size,
            height: p.size,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}
    </div>
  );
}
