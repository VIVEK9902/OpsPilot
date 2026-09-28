export function BackgroundAtmosphere() {
  return (
    <div 
      className="fixed inset-0 pointer-events-none -z-20"
      style={{
        backgroundColor: 'var(--base, #030a16)',
        backgroundImage: `
          radial-gradient(ellipse 38% 34% at 80% 0%, var(--green-glow, rgba(74, 170, 40, 0.55)), transparent 100%),
          radial-gradient(ellipse 60% 55% at 84% 2%, rgba(40, 130, 60, 0.28), transparent 100%),
          radial-gradient(ellipse 45% 30% at 55% 8%, var(--teal-glow, rgba(16, 150, 140, 0.30)), transparent 100%),
          radial-gradient(ellipse 45% 50% at 30% 62%, var(--blue-glow, rgba(10, 95, 165, 0.50)), transparent 100%),
          radial-gradient(ellipse 22% 30% at 8% 68%, var(--sea-glow, rgba(20, 130, 90, 0.32)), transparent 100%),
          radial-gradient(ellipse 40% 35% at 75% 85%, rgba(8, 60, 110, 0.28), transparent 100%),
          linear-gradient(180deg, #04101f 0%, #030a16 100%)
        `,
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed'
      }}
    ></div>
  );
}
