
import React from 'react';

interface AuthViewProps {
  onLogin: (email: string) => void;
}

export const AuthView: React.FC<AuthViewProps> = ({ onLogin }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-red-100">
      <div className="bg-white p-10 rounded-3xl shadow-2xl text-center max-w-sm w-full mx-4 transform transition hover:scale-105">
        <div className="flex justify-center mb-6">
          <div className="w-12 h-12 bg-blue-500 rounded-full mr-2 animate-bounce"></div>
          <div className="w-12 h-12 bg-red-500 rounded-full ml-2 animate-bounce delay-100"></div>
        </div>
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Match the Dots</h1>
        <p className="text-gray-500 mb-8">Connect them by drawing your way!</p>
        
        <button 
          onClick={() => onLogin('player@gmail.com')}
          className="w-full py-4 px-6 bg-white border-2 border-gray-200 text-gray-700 font-bold rounded-xl flex items-center justify-center gap-3 hover:bg-gray-50 transition-all shadow-sm active:scale-95"
        >
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-6" alt="Google" />
          Sign in with Google
        </button>

        <p className="mt-8 text-xs text-gray-400">
          By playing, you agree to our Terms of Service.
        </p>
      </div>
    </div>
  );
};
