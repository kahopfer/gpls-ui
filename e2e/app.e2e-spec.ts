import { GplsUiPage } from './app.po';

describe('gpls-ui App', () => {
  let page: GplsUiPage;

  beforeEach(() => {
    page = new GplsUiPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});
