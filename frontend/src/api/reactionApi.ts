import apiClient from '../api/apiClient';

interface ReactionResponse {
    photoId: string;
    userId?: string;
    sessionId?: string;
    imageReactionCount: number;
}

/**
 * Add a reaction (like) to a photo
 */
export const addReaction = async (photoId: string, sessionId?: string): Promise<ReactionResponse> => {
    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
    };

    if (sessionId) {
        headers['X-Session-Id'] = sessionId;
    }

    const response = await apiClient.post<ReactionResponse>(
        '/api/public/reaction/react',
        { photoId },
        { headers }
    );

    return response.data;
};

/**
 * Remove a reaction (unlike) from a photo
 */
export const removeReaction = async (photoId: string, sessionId?: string): Promise<void> => {
    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
    };

    if (sessionId) {
        headers['X-Session-Id'] = sessionId;
    }

    await apiClient.delete(
        '/api/public/reaction/remove',
        {
            data: { photoId },
            headers,
        }
    );
};
