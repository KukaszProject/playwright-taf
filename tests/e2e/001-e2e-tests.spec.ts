import { test, expect, APIRequestContext } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { getAuthToken } from '../../utils/api-helpers';

const email = 'test@example.com';
const password = 'password';

test('User can log in and receive a token', async ({ request, page }) => {

    const token = await getAuthToken(request, email, password);
    expect(token).not.toBeNull();

    const response = await request.post('https://api.realworld.io/api/articles', {
        headers: {
            'Authorization': `Token ${token}`
        },
        data: {
            article: {
                title: 'My Article',
                description: 'This is a test article',
                body: 'This is the content of the test article'
            }
        }
    });
    expect(response.ok()).toBeTruthy();
    const responseBody = await response.json();
    const articleTitle = responseBody.article.title;

    await page.goto(`/`);
    const articleLink = page.getByRole('link', { name: articleTitle });
    await expect(articleLink).toBeVisible();
    await articleLink.click();
    
    await expect(page.locator('h1')).toHaveText(articleTitle);
    
    const axe = new AxeBuilder({ page });
    const accessibilityScanResults = await axe.analyze();
    expect(accessibilityScanResults.violations).toEqual([]);

});