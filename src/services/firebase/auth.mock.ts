import { User } from '../../types';

let currentUser: User | null = null;
let authStateListeners: Array<(user: User | null) => void> = [];

const MOCK_USERS = [
    {
        id: 'mock-user-1',
        email: 'demo@financetracker.com',
        password: 'demo123',
        displayName: 'Demo User',
    },
];

export const signUp = async (
    email: string,
    password: string,
): Promise<User | null> => {
    try {
        await new Promise(resolve => setTimeout(resolve, 1000));

        const newUser: User = {
            id: `user-${Date.now()}`,
            email,
            displayName: email.split('@')[0],
            createdAt: Date.now(),
        };

        currentUser = newUser;
        notifyAuthStateListeners(newUser);

        return newUser;
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
        await new Promise(resolve => setTimeout(resolve, 1000));

        const mockUser = MOCK_USERS.find(u => u.email === email);

        if (!mockUser || mockUser.password !== password) {
            throw new Error('Invalid email or password');
        }

        const user: User = {
            id: mockUser.id,
            email: mockUser.email,
            displayName: mockUser.displayName,
            createdAt: Date.now(),
        };

        currentUser = user;
        notifyAuthStateListeners(user);

        return user;
    } catch (error: any) {
        console.error('Sign in error:', error);
        throw new Error(error.message);
    }
};

export const signOut = async (): Promise<void> => {
    try {
        await new Promise(resolve => setTimeout(resolve, 500));
        currentUser = null;
        notifyAuthStateListeners(null);
    } catch (error: any) {
        console.error('Sign out error:', error);
        throw new Error(error.message);
    }
};

export const getCurrentUser = (): User | null => {
    return currentUser;
};

export const onAuthStateChanged = (
    callback: (user: User | null) => void,
): (() => void) => {
    authStateListeners.push(callback);
    callback(currentUser);

    return () => {
        authStateListeners = authStateListeners.filter(
            listener => listener !== callback,
        );
    };
};

const notifyAuthStateListeners = (user: User | null) => {
    authStateListeners.forEach(listener => listener(user));
};
