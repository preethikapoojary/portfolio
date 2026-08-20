import useScrollProgress from '../../hooks/useScrollProgress';

export default function ScrollProgressBar() {
  const progress = useScrollProgress();
  return (
    <div className="fixed top-0 left-0 z-50 h-[3px] w-full bg-transparent">
      <div
        className="h-full transition-[width] duration-150 ease-out"
        style={{
          width: `${progress}%`,
          background: 'linear-gradient(90deg, var(--color-primary), var(--color-secondary), var(--color-accent))',
        }}
      />
    </div>
  );
}
