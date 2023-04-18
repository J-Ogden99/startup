import React from 'react';

import { Unauthenticated } from './Unauthenticated';
import { Authenticated } from './authenticated';
import { AuthState } from './authState';
import './login.css'

export function Login({ userName, authState, onAuthChange }) {
  console.log(userName);
  return (
    <main id='home-main' className='container-fluid text-center'>
      <div>
        {authState !== AuthState.Unknown && <h1>Welcome to Study Buddy</h1>}
        {authState === AuthState.Authenticated && (
          <Authenticated userName={userName} onLogout={() => onAuthChange(userName, AuthState.Unauthenticated)} />
        )}
        {authState === AuthState.Unauthenticated && (
          <Unauthenticated
            userName={userName}
            onLogin={(loginUserName) => {
              onAuthChange(loginUserName, AuthState.Authenticated);
            }}
          />
        )}
      </div>
    </main>
  );
}