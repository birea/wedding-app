import { auth, provider, resetPasswordDomain } from "./firebase";

// Sign Up
export const doCreateUserWithEmailAndPassword = (email, password) =>
    auth.createUserWithEmailAndPassword(email, password);

// Sign In
export const doSignInWithEmailAndPassword = (email, password) =>
    auth.signInWithEmailAndPassword(email, password);

// Sign out
export const doSignOut = () =>
    auth.signOut();

// Password Reset
export const doPasswordReset = (email) =>    
    auth.sendPasswordResetEmail(email, {url: resetPasswordDomain});


// Password Change
export const doPasswordUpdate = (password) =>
    auth.currentUser.updatePassword(password);

// Sign In using Google Account
export const doSignInWithGoogleAccount = () => {
    //provider.addScope("https://www.googleapis.com/auth/contacts.readonly");
    auth.useDeviceLanguage();    
    return auth.signInWithPopup(provider);
};