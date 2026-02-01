import { useEffect, useState } from 'react';
import './FallingPetals.css';

interface Petal {
  id: number;
  left: number;
  animationDuration: number;
  animationDelay: number;
  size: number;
  rotation: number;
  type: 'milkybar' | 'flower';
}

const FLOWER_EMOJIS = ['🌸', '🌺', '🌼', '🌻'];

export function FallingPetals() {
  const [petals, setPetals] = useState<Petal[]>([]);

  useEffect(() => {
    const newPetals: Petal[] = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      animationDuration: 6 + Math.random() * 8,
      animationDelay: Math.random() * 3,
      size: 35 + Math.random() * 25,
      rotation: Math.random() * 360,
      type: Math.random() > 0.25 ? 'milkybar' : 'flower',
    }));
    setPetals(newPetals);
  }, []);

  return (
    <div className="falling-petals-container">
      {petals.map((petal) => (
        <div
          key={petal.id}
          className={`petal ${petal.type === 'milkybar' ? 'milkybar' : 'flower'}`}
          style={{
            left: `${petal.left}%`,
            animationDuration: `${petal.animationDuration}s`,
            animationDelay: `${petal.animationDelay}s`,
            fontSize: `${petal.size}px`,
            '--rotation': `${petal.rotation}deg`,
          } as React.CSSProperties}
        >
          {petal.type === 'milkybar' ? '🍫' : FLOWER_EMOJIS[Math.floor(Math.random() * FLOWER_EMOJIS.length)]}
        </div>
      ))}
    </div>
  );
}
