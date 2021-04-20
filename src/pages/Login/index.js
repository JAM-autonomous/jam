import React from 'react';
import Login from '../../components/Login';
import { aaTrack } from '../../services/tracking';
import { PAGE_NAMES } from '../../services/tracking/define';

aaTrack.trackPage(PAGE_NAMES.LOGIN);

function LoginPage() {
  return (
    <Login />
  )
}

export default LoginPage;