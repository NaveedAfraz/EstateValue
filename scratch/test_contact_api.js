const axios = require('axios');

async function testContactAPI() {
    try {
        console.log('--- Testing Contact API ---');

        // 1. POST Message
        console.log('1. Submitting test message...');
        const postRes = await axios.post('http://localhost:5000/api/contacts', {
            firstName: 'Integration',
            lastName: 'Test',
            email: 'test@estatevalue.com',
            message: 'Testing CRUD functionality'
        });
        console.log('✅ POST Success:', postRes.data);

        // 2. Login as admin to get token
        console.log('2. Logging in as admin...');
        const loginRes = await axios.post('http://localhost:5000/api/auth/login', {
            email: 'admin@estatevalue.com',
            password: 'admin'
        });
        const token = loginRes.data.token;
        console.log('✅ Admin Token retrieved');

        // 3. GET all messages
        console.log('3. Fetching all messages as admin...');
        const getRes = await axios.get('http://localhost:5000/api/contacts', {
            headers: { Authorization: `Bearer ${token}` }
        });
        const testMsg = getRes.data.find(m => m.email === 'test@estatevalue.com');
        if (testMsg) {
            console.log('✅ Message found in database:', testMsg);
        } else {
            throw new Error('Message not found!');
        }

        // 4. DELETE message
        console.log(`4. Deleting message ID ${testMsg.id}...`);
        const delRes = await axios.delete(`http://localhost:5000/api/contacts/${testMsg.id}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log('✅ DELETE Success:', delRes.data);

        console.log('\n🎉 ALL INTEGRATION TESTS PASSED!');
    } catch (err) {
        console.error('❌ Test failed:', err.response?.data || err.message);
        process.exit(1);
    }
}

testContactAPI();
