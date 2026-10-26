import React, { useState } from 'react';
import { Lock, Eye, EyeOff, X, AlertCircle } from 'lucide-react';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: () => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const trimmedUser = username.trim();
    
    // Check credentials without exposing them in the UI
    const isValidUser = trimmedUser.toUpperCase() === 'PATRICIA PALACIOS';
    const isValidPass = password === 'pattypal*2026';

    if (isValidUser && isValidPass) {
      setUsername('');
      setPassword('');
      setError(null);
      onLoginSuccess();
    } else {
      setError('Credenciales incorrectas. Verifique los datos ingresados.');
    }
  };

  const handleClose = () => {
    setUsername('');
    setPassword('');
    setError(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in">
      <div 
        className="relative w-full max-w-md bg-[#FAF8F5] rounded-3xl shadow-2xl border border-[#D5C4B0] overflow-hidden p-6 sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 rounded-full text-[#7A7064] hover:text-[#24211D] hover:bg-[#EFEAE2] transition-colors"
          aria-label="Cerrar ventana"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Icon */}
        <div className="w-12 h-12 rounded-2xl bg-[#24211D] text-[#D4AF37] flex items-center justify-center mx-auto mb-4 shadow-md">
          <Lock className="w-6 h-6" />
        </div>

        <div className="text-center mb-6">
          <h3 className="font-serif-luxury text-2xl font-bold text-[#24211D]">
            Acceso Administrativo
          </h3>
          <p className="text-xs text-[#7A7064] mt-1">
            Módulo privado de gestión de catálogo
          </p>
        </div>

        {/* Error notification */}
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-[#FDF2F2] border border-[#F8B4B4] text-[#9B1C1C] text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#5A5043] mb-1.5">
              Usuario
            </label>
            <input
              type="text"
              required
              autoFocus
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                if (error) setError(null);
              }}
              placeholder="Ingresa tu nombre de usuario"
              className="w-full px-4 py-2.5 bg-[#F5EFE8] border border-[#D8CABE] rounded-xl text-sm text-[#24211D] focus:outline-none focus:border-[#24211D] focus:ring-1 focus:ring-[#24211D] transition-colors"
              autoComplete="username"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#5A5043] mb-1.5">
              Contraseña
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) setError(null);
                }}
                placeholder="••••••••••••"
                className="w-full pl-4 pr-11 py-2.5 bg-[#F5EFE8] border border-[#D8CABE] rounded-xl text-sm text-[#24211D] focus:outline-none focus:border-[#24211D] focus:ring-1 focus:ring-[#24211D] transition-colors"
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7A7064] hover:text-[#24211D] p-1"
                aria-label={showPassword ? 'Ocultar contraseña' : 'Ver contraseña'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3 bg-[#24211D] hover:bg-[#3D3731] text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-colors shadow-md cursor-pointer flex items-center justify-center gap-2"
            >
              <Lock className="w-4 h-4 text-[#D4AF37]" />
              <span>Ingresar al Administrador</span>
            </button>
          </div>
        </form>

        <div className="mt-6 pt-4 border-t border-[#E8DCCF] text-center">
          <p className="text-[11px] text-[#8C8275]">
            Look & Glow by Fer • Sistema de Control Interno
          </p>
        </div>
      </div>
    </div>
  );
};
