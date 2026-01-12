const axios = require('axios');

async function testLogin() {
  try {
    console.log('Testing Local Login...');
    const res = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'madhanac0711@gmail.com',
      password: '123456'
    });

    if (res.data.success) {
      console.log('✅ LOCAL LOGIN SUCCESSFUL!');
      console.log('User:', res.data.data.user.email);
      console.log('Token:', res.data.data.token.substring(0, 20) + '...');
    } else {
      console.log('❌ Login passed valid HTTP check but returned success:false');
      console.log(res.data);
    }
  } catch (error) {
    console.error('❌ LOCAL LOGIN FAILED');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    } else {
      console.error(error.message);
    }
  }
}

testLogin();
