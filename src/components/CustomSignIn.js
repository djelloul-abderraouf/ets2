// src/pages/CustomSignIn.js
import React from 'react';
import { SignIn } from '@clerk/clerk-react';

export default function CustomSignIn() {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      backgroundColor: '#0f0f12', // noir
    }}>
      <SignIn
        routing="path"
        path="/sign-in"
        appearance={{
          variables: {
            colorPrimary: '#39bbd6',
            fontFamily: 'Arial, sans-serif',
            borderRadius: '8px',
          },
          elements: {
            card: {
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              backgroundColor: '#18181b', // fond sombre
              color: 'white'
            },
            formButtonPrimary: {
              backgroundColor: '#39bbd6',
              color: 'white',
              fontWeight: 'bold',
            },
            logoBox: {
              display: 'none'
            }
          }
        }}
      />
    </div>
  );
}
