"use client"

export function BackgroundAnimation() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-950 opacity-50 animate-pulse-slow"></div>
      <div className="absolute inset-0">
        {Array.from({ length: 10 }).map((_, i) => (
          <div
            key={i}
            className="absolute bg-green-300 dark:bg-green-700 rounded-full opacity-0 animate-float"
            style={{
              width: `${Math.random() * 10 + 5}px`,
              height: `${Math.random() * 10 + 5}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${Math.random() * 10 + 10}s`,
            }}
          />
        ))}
      </div>
      <style jsx>{`
        @keyframes float {
          0% {
            transform: translateY(0) translateX(0) scale(0.5);
            opacity: 0;
          }
          25% {
            opacity: 0.3;
          }
          50% {
            transform: translateY(-50px) translateX(20px) scale(1);
            opacity: 0.5;
          }
          75% {
            opacity: 0.3;
          }
          100% {
            transform: translateY(-100px) translateX(40px) scale(0.5);
            opacity: 0;
          }
        }

        @keyframes pulse-slow {
          0% {
            opacity: 0.5;
          }
          50% {
            opacity: 0.6;
          }
          100% {
            opacity: 0.5;
          }
        }
      `}</style>
    </div>
  )
}
