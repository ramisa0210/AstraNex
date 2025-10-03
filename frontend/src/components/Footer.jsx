export default function Footer() {
  return (
    <footer className="bg-gradient-to-t from-gray-900 to-black text-center py-4 sm:py-6 mt-8 border-t border-gray-800">
      <div className="container mx-auto px-4">
        <p className="text-xs sm:text-sm text-gray-400 font-light">
          © {new Date().getFullYear()} Astra-Nex • Built for NASA Space Apps Challenge
        </p>
        
        {/* Optional: Add some space-themed decorative elements */}
        <div className="flex justify-center space-x-4 mt-3">
          {[1, 2, 3].map((star) => (
            <div 
              key={star}
              className="w-1 h-1 bg-blue-500 rounded-full opacity-70"
              style={{
                animation: `twinkle ${2 + star * 0.5}s infinite alternate`,
                animationDelay: `${star * 0.3}s`
              }}
            ></div>
          ))}
        </div>
      </div>
      
      {/* Add CSS for twinkling animation */}
      <style jsx>{`
        @keyframes twinkle {
          0% { opacity: 0.3; transform: scale(0.8); }
          100% { opacity: 1; transform: scale(1.2); }
        }
      `}</style>
    </footer>
  );
}
