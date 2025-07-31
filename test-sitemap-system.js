#!/usr/bin/env node

/**
 * WordPress Sitemap Automation Test Script
 * This script tests all components of the automatic sitemap system
 */

const axios = require('axios');
const crypto = require('crypto');

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
const WEBHOOK_SECRET = process.env.WORDPRESS_WEBHOOK_SECRET || 'development-webhook-secret-key';

console.log('🚀 Testing WordPress Sitemap Automation System');
console.log('='.repeat(50));

async function testSitemapGeneration() {
  console.log('\n1. Testing sitemap generation...');
  try {
    const response = await axios.get(`${BASE_URL}/api/sitemap.xml`);
    
    if (response.status === 200 && response.data.includes('<?xml version="1.0"')) {
      console.log('✅ Sitemap generation: SUCCESS');
      console.log(`   Response length: ${response.data.length} characters`);
      
      // Count URLs in sitemap
      const urlCount = (response.data.match(/<url>/g) || []).length;
      console.log(`   URLs in sitemap: ${urlCount}`);
      
      return true;
    } else {
      console.log('❌ Sitemap generation: FAILED');
      return false;
    }
  } catch (error) {
    console.log('❌ Sitemap generation: ERROR');
    console.log(`   Error: ${error.message}`);
    return false;
  }
}

async function testSitemapRefresh() {
  console.log('\n2. Testing sitemap refresh endpoint...');
  try {
    const response = await axios.get(`${BASE_URL}/api/sitemap-refresh`);
    
    if (response.status === 200 && response.data.success) {
      console.log('✅ Sitemap refresh: SUCCESS');
      console.log(`   Timestamp: ${response.data.timestamp}`);
      return true;
    } else {
      console.log('❌ Sitemap refresh: FAILED');
      console.log(`   Response: ${JSON.stringify(response.data)}`);
      return false;
    }
  } catch (error) {
    console.log('❌ Sitemap refresh: ERROR');
    console.log(`   Error: ${error.message}`);
    return false;
  }
}

async function testWebhookEndpoint() {
  console.log('\n3. Testing WordPress webhook endpoint...');
  try {
    const payload = {
      hook: 'post_published',
      post_type: 'post',
      post_status: 'publish',
      post_id: 123,
      post_title: 'Test Blog Post'
    };

    // Generate signature if secret is provided
    let headers = { 'Content-Type': 'application/json' };
    if (WEBHOOK_SECRET) {
      const signature = crypto
        .createHmac('sha256', WEBHOOK_SECRET)
        .update(JSON.stringify(payload))
        .digest('hex');
      headers['X-WP-Signature'] = `sha256=${signature}`;
    }

    const response = await axios.post(`${BASE_URL}/api/webhook/wordpress`, payload, { headers });
    
    if (response.status === 200 && response.data.success) {
      console.log('✅ WordPress webhook: SUCCESS');
      console.log(`   Processed: ${response.data.processed}`);
      return true;
    } else {
      console.log('❌ WordPress webhook: FAILED');
      console.log(`   Response: ${JSON.stringify(response.data)}`);
      return false;
    }
  } catch (error) {
    console.log('❌ WordPress webhook: ERROR');
    console.log(`   Error: ${error.message}`);
    return false;
  }
}

async function testSitemapRedirect() {
  console.log('\n4. Testing sitemap.xml redirect...');
  try {
    const response = await axios.get(`${BASE_URL}/sitemap.xml`, {
      maxRedirects: 1,
      validateStatus: (status) => status >= 200 && status < 400
    });
    
    if (response.status === 200 && response.data.includes('<?xml version="1.0"')) {
      console.log('✅ Sitemap redirect: SUCCESS');
      return true;
    } else {
      console.log('❌ Sitemap redirect: FAILED');
      return false;
    }
  } catch (error) {
    console.log('❌ Sitemap redirect: ERROR');
    console.log(`   Error: ${error.message}`);
    return false;
  }
}

async function testFullWorkflow() {
  console.log('\n5. Testing full webhook → refresh workflow...');
  try {
    // First, trigger webhook
    const payload = {
      hook: 'post_published',
      post_type: 'post',
      post_status: 'publish',
      post_id: 456,
      post_title: 'Workflow Test Post'
    };

    let headers = { 'Content-Type': 'application/json' };
    if (WEBHOOK_SECRET) {
      const signature = crypto
        .createHmac('sha256', WEBHOOK_SECRET)
        .update(JSON.stringify(payload))
        .digest('hex');
      headers['X-WP-Signature'] = `sha256=${signature}`;
    }

    const webhookResponse = await axios.post(`${BASE_URL}/api/webhook/wordpress`, payload, { headers });
    
    if (webhookResponse.status === 200 && webhookResponse.data.success) {
      console.log('✅ Full workflow: SUCCESS');
      console.log('   Webhook triggered sitemap refresh automatically');
      return true;
    } else {
      console.log('❌ Full workflow: FAILED');
      return false;
    }
  } catch (error) {
    console.log('❌ Full workflow: ERROR');
    console.log(`   Error: ${error.message}`);
    return false;
  }
}

async function runAllTests() {
  console.log(`Base URL: ${BASE_URL}`);
  console.log(`Webhook Secret: ${WEBHOOK_SECRET ? '***' + WEBHOOK_SECRET.slice(-4) : 'Not set'}`);
  
  const results = [];
  
  results.push(await testSitemapGeneration());
  results.push(await testSitemapRefresh());
  results.push(await testWebhookEndpoint());
  results.push(await testSitemapRedirect());
  results.push(await testFullWorkflow());
  
  const passed = results.filter(Boolean).length;
  const total = results.length;
  
  console.log('\n' + '='.repeat(50));
  console.log(`📊 Test Results: ${passed}/${total} tests passed`);
  
  if (passed === total) {
    console.log('🎉 All tests passed! WordPress sitemap automation is working correctly.');
  } else {
    console.log('⚠️  Some tests failed. Please check the output above for details.');
  }
  
  console.log('\n📝 Next Steps:');
  console.log('1. Configure WordPress webhook in production');
  console.log('2. Set WORDPRESS_WEBHOOK_SECRET in production environment');
  console.log('3. Test with real WordPress post publication');
  console.log('4. Monitor sitemap updates in search engines');
}

// Run tests
runAllTests().catch(console.error);
