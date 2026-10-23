import { defaultPreferences, defaultUser } from '../../data/mock';
import { validateUser } from '../../domain/validation';
import type { DemoSlice, UserSlice } from '../types';

export const createUserSlice: DemoSlice<UserSlice> = set => ({
  user: { ...defaultUser, skills: [...defaultUser.skills] },
  preferences: { ...defaultPreferences },
  saveUser: user => {
    if (Object.keys(validateUser(user)).length) return false;
    set({ user: { ...user, name: user.name.trim(), email: user.email.trim(), skills: [...user.skills] } });
    return true;
  },
  setPreferences: value => set(state => ({ preferences: { ...state.preferences, ...value } })),
});
