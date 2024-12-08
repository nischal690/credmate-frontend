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
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(tokens));
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
        localStorage.removeItem(AUTH_STORAGE_KEY);
    } catch (error) {
        console.error('Error clearing auth tokens:', error);
    }
};

export const isAccessTokenExpired = (): boolean => {
    const tokens = getStoredAuthTokens();
    if (!tokens) return true;

    const tokenTimestamp = new Date(tokens.timestamp).getTime();
    const currentTime = new Date().getTime();
    const expirationTime = tokenTimestamp + (tokens.accessTokenExpiresIn * 1000);

    return currentTime >= expirationTime;
};

export const isRefreshTokenExpired = (): boolean => {
    const tokens = getStoredAuthTokens();
    if (!tokens) return true;

    const tokenTimestamp = new Date(tokens.timestamp).getTime();
    const currentTime = new Date().getTime();
    const expirationTime = tokenTimestamp + (tokens.refreshTokenExpiresIn * 1000);

    return currentTime >= expirationTime;
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
            },
            body: JSON.stringify({
                refreshToken: tokens.refreshToken
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
    const tokens = getStoredAuthTokens();
    if (!tokens) return null;

    if (isAccessTokenExpired()) {
        const refreshSuccess = await refreshAccessToken();
        if (!refreshSuccess) return null;
        
        const newTokens = getStoredAuthTokens();
        return newTokens?.accessToken || null;
    }

    return tokens.accessToken;
};
