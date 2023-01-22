import LoginPage from '../pageobjects/login.page'

describe('My Game', () => {
    it('should remove create layout btn when click on it', async () => {
        await LoginPage.open();
        await LoginPage.clickOnCreateLayoutBtn();
        expect((await (await LoginPage.buttonCreateLayout).getAttribute('class')).includes('battle-field_layout-is-active')).toBe(true);
    })
})


