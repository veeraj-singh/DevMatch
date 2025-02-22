import { 
  signInWithEmailAndPassword,
  signOut 
} from 'firebase/auth';
import { auth } from "../utils/firebase";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export const guestCredentials = {
  email: 'guest@devmatch.com',    
  password: 'guest1234'  
};

const signInAsGuest = async () => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      guestCredentials.email,
      guestCredentials.password
    );
    return userCredential.user;
  } catch (error) {
    console.error('Error signing in as guest:', error);
    throw error;
  }
};

const GuestButton = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleGuestAccess = async () => {
    setLoading(true);
    setError(null);
    
    try {
      await signInAsGuest();
      navigate('/dashboard'); 
    } catch (err) {
      setError('Failed to access guest account. Please try again.');
      console.error('Guest login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button 
      onClick={handleGuestAccess}
      disabled={loading}
      className="px-8 py-3 bg-emerald-500 hover:bg-emerald-600 rounded-lg font-semibold flex items-center gap-2"
    >
      {loading ? (
        <span> Creating guest account...</span>
      ) : (
        <>
          Get Started as Guest <ArrowRight className="w-5 h-5" />
        </>
      )}
      {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
    </button>
  );
};

export default GuestButton;