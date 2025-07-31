# WordPress Sitemap Automation Setup

This system automatically updates the sitemap whenever new WordPress posts are published.

## System Overview

1. **WordPress Webhook**: Sends notifications when posts are published
2. **Webhook Handler**: Processes WordPress notifications (`/api/webhook/wordpress`)
3. **Sitemap Refresh**: Regenerates sitemap on demand (`/api/sitemap-refresh`)
4. **Dynamic Sitemap**: Includes WordPress posts and database content (`/api/sitemap.xml`)

## Required Environment Variables

Add these to your `.env.local` or production environment:

```bash
# WordPress Integration
WORDPRESS_API_URL=https://beyond2c.org/wp-json/wp/v2
WORDPRESS_WEBHOOK_SECRET=your_secure_webhook_secret_key
NEXT_PUBLIC_BASE_URL=https://beyond2c.org

# Optional: Search Engine Submission
GOOGLE_SEARCH_CONSOLE_API_KEY=your_google_api_key
BING_WEBMASTER_API_KEY=your_bing_api_key

# Optional: CDN Cache Clearing
CLOUDFLARE_ZONE_ID=your_zone_id
CLOUDFLARE_API_TOKEN=your_api_token
```

## WordPress Setup Instructions

### 1. Install Webhook Plugin

Install the "WP Webhooks" plugin or similar webhook plugin on your WordPress site.

### 2. Configure Webhook

In WordPress admin, go to **Settings > WP Webhooks** and add a new webhook:

- **URL**: `https://beyond2c.org/api/webhook/wordpress`
- **Method**: `POST`
- **Trigger**: `Post Published` or `Post Status Changed to Published`
- **Secret**: Use the same value as `WORDPRESS_WEBHOOK_SECRET`

### 3. Test Webhook

1. Publish a test post on WordPress
2. Check your Next.js logs for webhook processing
3. Verify sitemap was updated at `https://beyond2c.org/api/sitemap.xml`

## Manual Testing

### Test Webhook Endpoint

```bash
curl -X POST https://beyond2c.org/api/webhook/wordpress \
  -H "Content-Type: application/json" \
  -H "X-WP-Signature: sha256=your_signature" \
  -d '{
    "hook": "post_published",
    "post_type": "post",
    "post_status": "publish",
    "post_id": 123
  }'
```

### Test Sitemap Refresh

```bash
curl https://beyond2c.org/api/sitemap-refresh
```

### Test Sitemap Generation

```bash
curl https://beyond2c.org/api/sitemap.xml
```

## How It Works

1. **Post Published**: User publishes a post in WordPress
2. **Webhook Triggered**: WordPress sends notification to `/api/webhook/wordpress`
3. **Verification**: Webhook signature is verified for security
4. **Sitemap Refresh**: System calls `/api/sitemap-refresh`
5. **Regeneration**: Sitemap is regenerated with new posts
6. **Cache Clearing**: CDN cache is cleared (if configured)
7. **Search Engines**: Updated sitemap is submitted to search engines (if configured)

## Sitemap Structure

The sitemap includes:

- **Static Pages**: Home, About, Issues, etc. (Priority: 0.5-1.0)
- **Database Posts**: Posts from MongoDB (Priority: 0.7)
- **Database Voices**: Voices from MongoDB (Priority: 0.6)
- **WordPress Posts**: Blog posts from WordPress API (Priority: 0.7)
- **WordPress Voices**: Voices from WordPress API (Priority: 0.6)

## Security Features

- **Signature Verification**: Webhooks are verified using HMAC-SHA256
- **Method Validation**: Only POST requests accepted for webhooks
- **Error Handling**: Graceful degradation if WordPress API is unavailable

## Monitoring

Monitor the system through:

1. **Application Logs**: Check Next.js logs for webhook processing
2. **Sitemap URL**: Visit `/api/sitemap.xml` to verify content
3. **Search Console**: Check Google Search Console for sitemap status
4. **Webhook Testing**: Use WordPress webhook testing tools

## Troubleshooting

### Webhook Not Working

1. Check WordPress webhook configuration
2. Verify `WORDPRESS_WEBHOOK_SECRET` matches in both systems
3. Check Next.js logs for error messages
4. Test webhook manually with curl

### Sitemap Not Updating

1. Test `/api/sitemap-refresh` endpoint directly
2. Check WordPress API connectivity
3. Verify MongoDB connection
4. Check CDN cache settings

### Performance Issues

1. Consider caching sitemap responses
2. Implement rate limiting for webhooks
3. Use background job queues for large sitemaps
4. Monitor API response times

## Future Enhancements

- **Background Jobs**: Use queue system for large sitemap updates
- **Incremental Updates**: Only update changed URLs instead of full regeneration
- **Multiple Languages**: Support for multilingual sitemaps
- **Image Sitemaps**: Include image URLs in sitemap
- **Video Sitemaps**: Support for video content sitemaps
