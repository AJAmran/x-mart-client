import React from 'react';
import { getCurrentUser } from '@/src/services/AuthService';
import NavbarClient from './NavbarClient';

// Server component fetching user data
export default async function Navbar() {
  const user = await getCurrentUser();

  return <NavbarClient user={user} />;
}