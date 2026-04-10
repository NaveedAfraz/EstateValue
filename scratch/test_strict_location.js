const axios = require('axios');

async function testStrictLocation() {
    try {
        console.log('--- Testing Strict Location Mode ---');

        // 1. Test Unknown Location (Mumbai)
        console.log('\n1. Testing "Mumbai" (Should return location_found: false)');
        const res1 = await axios.post('http://localhost:8000/predict', {
            location: 'Mumbai',
            square_feet: 2000,
            bedrooms: 2,
            bathrooms: 2
        });
        console.log('Response:', res1.data);
        if (res1.data.location_found === false) {
            console.log('✅ Correct: location_found is false');
        } else {
            throw new Error('FAILED: location_found should be false for Mumbai');
        }

        // 2. Test Known Location (Indira Nagar)
        console.log('\n2. Testing "indira nagar" (Should return location_found: true)');
        const res2 = await axios.post('http://localhost:8000/predict', {
            location: 'indira nagar',
            square_feet: 2000,
            bedrooms: 2,
            bathrooms: 2
        });
        console.log('Response:', res2.data);
        if (res2.data.location_found === true) {
            console.log('✅ Correct: location_found is true');
        } else {
            throw new Error('FAILED: location_found should be true for Indira Nagar');
        }

        console.log('\n🎉 STRICT LOCATION MODE VERIFIED!');
    } catch (err) {
        console.error('❌ Test failed:', err.response?.data || err.message);
        process.exit(1);
    }
}

testStrictLocation();
