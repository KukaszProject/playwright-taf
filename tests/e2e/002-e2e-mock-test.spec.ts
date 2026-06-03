import { expect, test} from "@playwright/test";

test('Mock API response and verify UI updates', async ({ page }) => {

    
    await page.route('**/api/articles**', async (route) => {
        route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({
                articles: [
                    { 
                        title: 'Hacked Article by QA', 
                        description: 'Description for mocked article',
                        author: { username: 'qa_tester' },
                        slug: 'hacked-article-by-qa',
                        createdAt: '2024-01-01T00:00:00.000Z',
                        favoritesCount: 0,
                        tagList: []
                    }
                ],
                articlesCount: 1
            })
        });
    });
    
    await page.goto('/');
    const article1 = page.getByText('Hacked Article by QA');
    await expect(article1).toBeVisible();
});
