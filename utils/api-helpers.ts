import { APIRequestContext } from '@playwright/test';

export async function getAuthToken(apiContext: APIRequestContext, email: string, password: string): Promise<string> {
        const response = await apiContext.post('https://api.realworld.io/api/users/login', {
            data: {
                user: {
                    email: email,
                    password: password
                }
            }
        });
        
        if (!response.ok()) {
            throw new Error(`Failed to log in: ${response.status()} ${response.statusText()}`);
        }
        const responseBody = await response.json();
        return responseBody.user.token;
}