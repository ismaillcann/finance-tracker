import auth from '@react-native-firebase/auth';
import { User } from '../../types';

export const signUp = async (
    email: string,
    password: string,
): Promise<User | null> => {
    try {
        const userCredential = await auth().createUserWithEmailAndPassword(
            email,
            password,
        );

        return {
            id: userCredential.user.uid,
            email: userCredential.user.email || '',
            createdAt: Date.now(),
        };
    } catch (error: any) {
        console.error('[Firebase Auth] Sign up error:', error);
        throw new Error(error.message || 'Failed to create account');
    }
};

export const signIn = async (
    email: string,
    password: string,
): Promise<User | null> => {
    try {
        const userCredential = await auth().signInWithEmailAndPassword(
            email,
            password,
        );

        return {
            id: userCredential.user.uid,
            email: userCredential.user.email || '',
            createdAt: Date.now(),
        };
    } catch (error: any) {
        console.error('[Firebase Auth] Sign in error:', error);
        throw new Error(error.message || 'Failed to sign in');
    }
};

export const signOut = async (): Promise<void> => {
    try {
        await auth().signOut();
    } catch (error: any) {
        console.error('[Firebase Auth] Sign out error:', error);
        throw new Error(error.message || 'Failed to sign out');
    }
};

export const getCurrentUser = (): User | null => {
    const firebaseUser = auth().currentUser;

    if (!firebaseUser) {
        return null;
    }

    return {
        id: firebaseUser.uid,
        email: firebaseUser.email || '',
        createdAt: Date.now(),
    };
};

export const onAuthStateChanged = (
    callback: (user: User | null) => void,
): (() => void) => {
    return auth().onAuthStateChanged(firebaseUser => {
        if (firebaseUser) {
            callback({
                id: firebaseUser.uid,
                email: firebaseUser.email || '',
                createdAt: Date.now(),
            });
        } else {
            callback(null);
        }
    });
};
