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

        const firebaseUser = userCredential.user;

        return {
            id: firebaseUser.uid,
            email: firebaseUser.email || '',
            displayName: firebaseUser.displayName || undefined,
            createdAt: Date.now(),
        };
    } catch (error: any) {
        console.error('Sign up error:', error);
        throw new Error(error.message);
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

        const firebaseUser = userCredential.user;

        return {
            id: firebaseUser.uid,
            email: firebaseUser.email || '',
            displayName: firebaseUser.displayName || undefined,
            createdAt: Date.now(),
        };
    } catch (error: any) {
        console.error('Sign in error:', error);
        throw new Error(error.message);
    }
};

export const signOut = async (): Promise<void> => {
    try {
        await auth().signOut();
    } catch (error: any) {
        console.error('Sign out error:', error);
        throw new Error(error.message);
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
        displayName: firebaseUser.displayName || undefined,
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
                displayName: firebaseUser.displayName || undefined,
                createdAt: Date.now(),
            });
        } else {
            callback(null);
        }
    });
};
