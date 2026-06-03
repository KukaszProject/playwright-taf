import { expect, test } from '@playwright/test';
import { getAuthToken } from '../../utils/api-helpers';

test('Multiple users can log in and see their own articles', async ({ page, browser }) => {
    const emailA = 'author@email.com';
    const emailB = 'reader@email.com';
    const password = 'password';

    const authorToken = await getAuthToken(page.request, emailA, password);
    const readerToken = await getAuthToken(page.request, emailB, password);
    expect(authorToken).not.toBeNull();
    expect(readerToken).not.toBeNull();

    const uniqueTitle = `SignalR Test Article ${Date.now()}`;
    const articleResponse = await page.request.post('https://api.realworld.io/api/articles', {
        headers: {'Authorization': `Token ${authorToken}` },
        data: {
            article: {
                title: uniqueTitle,
                description: 'Article created by Author',
                body: 'This is the content of the article created by Author',
                tagList: ['signalr', 'test']
        }
    }});

    const articleData = await articleResponse.json();
    const articleSlug = articleData.article.slug;

    const contextA = await browser.newContext();
    const pageA = await contextA.newPage();
    await pageA.goto(`/`);
    await pageA.evaluate((token) => localStorage.setItem('jwtToken', token), authorToken);

    await pageA.goto(`/article/${articleSlug}`);
    await expect(pageA.locator('h1')).toHaveText(uniqueTitle);


    const contextB = await browser.newContext();
    const pageB = await contextB.newPage();
    await pageB.goto(`/`);
    await pageB.evaluate((token) => localStorage.setItem('jwtToken', token), readerToken);
    await pageB.goto(`/article/${articleSlug}`);
    await expect(pageB.locator('h1')).toHaveText(uniqueTitle);

    const commentText = `Comment from Reader at ${new Date().toISOString()}`;
    await pageB.getByPlaceholder('Write a comment...').fill(commentText);
    await pageB.getByRole('button', { name: 'Post Comment' }).click();

    await pageA.reload();
    await expect(pageA.getByText(commentText)).toBeVisible();
});