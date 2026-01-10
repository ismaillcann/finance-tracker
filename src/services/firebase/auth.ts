import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut as firebaseSignOut,
    onAuthStateChanged as firebaseOnAuthStateChanged,
    User as FirebaseUser,
} from 'firebase/auth';
import { auth } from './config';
import { User } from '../../types';

const mapFirebaseUser = (firebaseUser: FirebaseUser | null): User | null => {
    if (!firebaseUser) return null;
    return {
        id: firebaseUser.uid,
        email: firebaseUser.email || '',
        createdAt: parseInt(firebaseUser.metadata.creationTime || Date.now().toString()),
    };
};

export const signUp = async (
    email: string,
    password: string,
): Promise<User | null> => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        return mapFirebaseUser(userCredential.user);
    } catch (error: any) {
        console.warn('[Firebase Auth] Sign up error:', error);
        throw new Error(error.message || 'Failed to create account');
    }
};

export const signIn = async (
    email: string,
    password: string,
): Promise<User | null> => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        return mapFirebaseUser(userCredential.user);
    } catch (error: any) {
        console.warn('[Firebase Auth] Sign in error:', error);
        throw new Error(error.message || 'Failed to sign in');
    }
};

export const signOut = async (): Promise<void> => {
    try {
        await firebaseSignOut(auth);
    } catch (error: any) {
        console.error('[Firebase Auth] Sign out error:', error);
        throw new Error(error.message || 'Failed to sign out');
    }
};

export const getCurrentUser = (): User | null => {
    return mapFirebaseUser(auth.currentUser);
};

export const onAuthStateChanged = (
    callback: (user: User | null) => void,
): (() => void) => {
    return firebaseOnAuthStateChanged(auth, (firebaseUser) => {
        callback(mapFirebaseUser(firebaseUser));
    });
};
