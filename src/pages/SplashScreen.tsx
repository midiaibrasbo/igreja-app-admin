import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function SplashScreen() {
  const navigate = useNavigate();
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFadeOut(true);
    }, 2500);

    const redirectTimer = setTimeout(() => {
      const token = localStorage.getItem('token');
      if (token) {
        navigate('/dashboard');
      } else {
        navigate('/login');
      }
    }, 3000);

    return () => {
      clearTimeout(timer);
      clearTimeout(redirectTimer);
    };
  }, [navigate]);

  return (
    <div
      className={`min-h-screen bg-gradient-to-br from-red-900 to-red-800 flex items-center justify-center transition-opacity duration-500 ${
        fadeOut ? 'opacity-0' : 'opacity-100'
      }`}
    >
      <style>{`
        @keyframes bounce {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.1);
          }
        }
        
        @keyframes fadeInScale {
          0% {
            opacity: 0;
            transform: scale(0.8);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        .logo-container {
          animation: fadeInScale 0.8s ease-out;
        }
        
        .logo-bounce {
          animation: bounce 2s ease-in-out infinite;
        }
        
        .text-fade {
          animation: fadeInScale 1s ease-out 0.5s both;
        }
      `}</style>

      <div className="text-center">
        <div className="logo-container logo-bounce mb-8">
          <img
            src="/src/assets/ibra-logo.png"
            alt="IBRA Logo"
            className="w-32 h-32 mx-auto"
          />
        </div>
        <h1 className="text-4xl font-bold text-white text-fade mb-2">
          Igreja Batista
        </h1>
        <h2 className="text-2xl font-semibold text-red-100 text-fade">
          da Redenção
        </h2>
        <p className="text-red-200 mt-8 text-fade">Carregando...</p>
      </div>
    </div>
  );
}
