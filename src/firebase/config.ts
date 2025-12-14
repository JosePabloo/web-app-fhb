// FILE: src/firebase/config.ts
// PURPOSE: Initializes Firebase app and exports Auth instance configured from validated environment settings.
// NOTES: Consumed by AuthProvider and auth services; relies on shared/config/env to supply required Firebase keys.

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import config from '../shared/config/env';

const firebaseConfig = {
  apiKey: config.firebase.apiKey,
  authDomain: config.firebase.authDomain,
  projectId: config.firebase.projectId,
  storageBucket: config.firebase.storageBucket,
  messagingSenderId: config.firebase.messagingSenderId,
  appId: config.firebase.appId,
  databaseURL: config.firebase.databaseURL,
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);