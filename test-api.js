// Simple test script to verify API endpoints
const API_BASE = 'http://localhost:3001';

async function testAPI() {
  console.log('🧪 Testing Properti Prime API...\n');

  try {
    // Test health endpoint
    console.log('1. Testing health endpoint...');
    const healthResponse = await fetch(`${API_BASE}/health`);
    const healthData = await healthResponse.json();
    console.log('✅ Health check:', healthData);

    // Test GET /properties
    console.log('\n2. Testing GET /properties...');
    const getResponse = await fetch(`${API_BASE}/properties`);
    const getProperties = await getResponse.json();
    console.log('✅ GET properties:', getProperties);

    // Test POST /properties
    console.log('\n3. Testing POST /properties...');
    const newProperty = {
      title: 'Test Property',
      price: 2500,
      location: '123 Test Street, Test City',
      type: 'apartment',
      beds: 2,
      baths: 1,
      imageUrl: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop'
    };

    const postResponse = await fetch(`${API_BASE}/properties`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newProperty),
    });

    const createdProperty = await postResponse.json();
    console.log('✅ POST property:', createdProperty);

    // Test validation error
    console.log('\n4. Testing validation error...');
    const invalidProperty = {
      title: '', // Missing required field
      price: -100, // Invalid price
    };

    const errorResponse = await fetch(`${API_BASE}/properties`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(invalidProperty),
    });

    const errorData = await errorResponse.json();
    console.log('✅ Validation error:', errorData);

    console.log('\n🎉 All API tests completed successfully!');

  } catch (error) {
    console.error('❌ API test failed:', error.message);
    console.log('\n💡 Make sure the server is running with: cd server && npm start');
  }
}

testAPI();
