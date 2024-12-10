import { auth } from '../lib/firebase';

interface AuthTokens {
    accessToken: string;
    refreshToken: string;
    accessTokenExpiresIn: number;
    refreshTokenExpiresIn: number;
    timestamp: string;
}

const AUTH_STORAGE_KEY = 'credmate_auth_tokens';

export const storeAuthTokens = (tokens: AuthTokens): void => {
    try {
        // Add current server time when storing tokens
        const currentTime = new Date().toISOString();
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({
            ...tokens,
            timestamp: currentTime,
        }));
    } catch (error) {
        console.error('Error storing auth tokens:', error);
    }
};

export const getStoredAuthTokens = (): AuthTokens | null => {
    try {
        const tokens = localStorage.getItem(AUTH_STORAGE_KEY);
        return tokens ? JSON.parse(tokens) : null;
    } catch (error) {
        console.error('Error retrieving auth tokens:', error);
        return null;
    }
};

export const clearAuthTokens = (): void => {
    try {
        // Sign out from Firebase
        auth.signOut().catch(error => {
            console.error('Error signing out:', error);
        });
    } catch (error) {
        console.error('Error clearing auth state:', error);
    }
};

export const isAccessTokenExpired = (): boolean => {
    const tokens = getStoredAuthTokens();
    if (!tokens) return true;

    const tokenTimestamp = new Date(tokens.timestamp).getTime();
    const currentTime = new Date().getTime();
    const expirationTime = tokenTimestamp + (tokens.accessTokenExpiresIn * 1000);

    // Add a 5-second buffer to handle slight time differences
    return (currentTime + 5000) >= expirationTime;
};

export const isRefreshTokenExpired = (): boolean => {
    const tokens = getStoredAuthTokens();
    if (!tokens) return true;

    const tokenTimestamp = new Date(tokens.timestamp).getTime();
    const currentTime = new Date().getTime();
    const expirationTime = tokenTimestamp + (tokens.refreshTokenExpiresIn * 1000);

    // Add a 5-second buffer to handle slight time differences
    return (currentTime + 5000) >= expirationTime;
};

export const refreshAccessToken = async (): Promise<boolean> => {
    try {
        const tokens = getStoredAuthTokens();
        if (!tokens || isRefreshTokenExpired()) {
            clearAuthTokens();
            return false;
        }

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/refresh`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Client-Time': new Date().toISOString(), // Add client timestamp
            },
            body: JSON.stringify({
                refreshToken: tokens.refreshToken,
                clientTime: new Date().toISOString(), // Include client time in request body
            }),
        });

        const data = await response.json();

        if (data.success) {
            storeAuthTokens({
                ...data,
                timestamp: new Date().toISOString(),
            });
            return true;
        }

        clearAuthTokens();
        return false;
    } catch (error) {
        console.error('Error refreshing token:', error);
        clearAuthTokens();
        return false;
    }
};

export const getValidAccessToken = async (): Promise<string | null> => {
    try {
        const user = auth.currentUser;
        if (!user) {
            console.log('No authenticated user found');
            return null;
        }

        // Force refresh to ensure the token is not expired
        const token = await user.getIdToken(true);
        return token;
    } catch (error) {
        console.error('Error getting Firebase ID token:', error);
        return null;
    }
};
