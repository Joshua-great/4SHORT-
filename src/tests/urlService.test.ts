import UrlService from '../services/urlService';

describe('UrlService', () => {
  test('should shorten URL', async () => {
    const originalUrl = 'https://example.com';
    const shortUrl = await UrlService.shortenUrl(originalUrl);
    expect(shortUrl).toBeDefined();
  });

 
});
