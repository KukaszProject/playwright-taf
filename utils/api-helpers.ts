import { Page } from '@playwright/test';

class APIHelper {

    constructor() { }

    async returnToken(page: Page) {
        const response = await page.request.post('https://api.realworld.io/api/users/login', {
            data: {
                user: {
                    email: 'test@example.com',
                    password: 'password'
                }
            }
        });

        const token = await response.json();

        return token;
    }
}

export default APIHelper;