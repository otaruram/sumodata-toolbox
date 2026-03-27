// Quick API test script - run with: node out/test-api.js
import { ApiProvider } from './apiProvider';

const API_KEY = 'sk-EHhzGdATSQS5iR7CG-Avwg';
const BASE_URL = 'https://ai.sumopod.com';

async function testApi() {
  console.log('🧪 Testing SumoData API Provider...\n');

  const provider = new ApiProvider(API_KEY, BASE_URL, 30);

  // Test 1: Connection test
  console.log('Test 1: Connection test');
  try {
    const connected = await provider.testConnection();
    console.log(`✅ Connection: ${connected ? 'SUCCESS' : 'FAILED'}\n`);
  } catch (error) {
    console.log(`❌ Connection failed: ${error}\n`);
  }

  // Test 2: Simple request
  console.log('Test 2: SQL Optimizer');
  const sqlCode = `SELECT * FROM users WHERE id = 1;`;
  const sqlPrompt = `Analyze the SQL query and return ONLY optimized SQL code. No explanations.`;
  
  try {
    const response = await provider.sendRequest(sqlPrompt, sqlCode, 'claude-haiku-4-5');
    if (response.success) {
      console.log('✅ SQL Optimizer response:');
      console.log(response.data);
    } else {
      console.log(`❌ Error: ${response.error}`);
    }
  } catch (error) {
    console.log(`❌ Request failed: ${error}`);
  }

  console.log('\n🎉 API tests complete!');
  provider.dispose();
}

testApi().catch(console.error);
