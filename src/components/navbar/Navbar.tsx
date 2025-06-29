import React from 'react';
import NavbarClient from './NavbarClient';
import { getCurrentUser } from '@/src/services/AuthService';

const Navbar = async () => {
 const user = await getCurrentUser();
  return (
    <>
      <NavbarClient user={user}/>
    </>
  );
};

export default Navbar;