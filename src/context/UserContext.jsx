import { createContext, useContext, useState, useEffect } from 'react';
import { loadProfile, saveProfile, clearProfile } from '../utils/localStorage';
import { getZodiacAnimal } from '../engine/zodiac';
import { getElement } from '../engine/elements';
import { getLifePhase } from '../engine/lifePhase';
import { calculateAge } from '../utils/dateUtils';

const UserContext = createContext(null);

export function UserProvider({ children }) {
  const [profile, setProfile] = useState(() => loadProfile());
  const [theme, setTheme] = useState(() => localStorage.getItem('9lives-theme') || 'dark');

  const toggleTheme = () => {
    setTheme(t => {
      const next = t === 'dark' ? 'light' : 'dark';
      localStorage.setItem('9lives-theme', next);
      return next;
    });
  };

  useEffect(() => {
    if (profile) {
      saveProfile(profile);
    }
  }, [profile]);

  const completeOnboarding = (birthDate, gender) => {
    const { animal } = getZodiacAnimal(birthDate.year);
    const element = getElement(animal);
    const age = calculateAge(birthDate.year, birthDate.month, birthDate.day);
    const phase = getLifePhase(age, gender);

    const newProfile = {
      birthDate,
      gender,
      zodiacAnimal: animal,
      element,
      onboardedAt: new Date().toISOString(),
    };

    setProfile(newProfile);
    return { ...newProfile, phase };
  };

  const resetProfile = () => {
    clearProfile();
    setProfile(null);
  };

  const getDerivedData = () => {
    if (!profile) return null;
    const age = calculateAge(profile.birthDate.year, profile.birthDate.month, profile.birthDate.day);
    const phase = getLifePhase(age, profile.gender);
    const zodiac = getZodiacAnimal(profile.birthDate.year);
    return { ...profile, age, phase, zodiac };
  };

  return (
    <UserContext.Provider value={{
      profile,
      isOnboarded: !!profile,
      completeOnboarding,
      resetProfile,
      getDerivedData,
      theme,
      toggleTheme,
    }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) throw new Error('useUser must be used within UserProvider');
  return context;
}

export default UserContext;
