/* const axios = require('axios');

// Kayıt etmek istediğiniz kullanıcıların verilerini içeren array
const users = [
  { username: 'michael_smith', email: 'michael_smith@example.com', password: '123456' },
  { username: 'sarah_jones', email: 'sarah_jones@example.com', password: '123456' },
  { username: 'david_wilson', email: 'david_wilson@example.com', password: '123456' },
  { username: 'emily_davis', email: 'emily_davis@example.com', password: '123456' },
  { username: 'james_brown', email: 'james_brown@example.com', password: '123456' },
  { username: 'linda_martin', email: 'linda_martin@example.com', password: '123456' },
  { username: 'robert_taylor', email: 'robert_taylor@example.com', password: '123456' },
  { username: 'patricia_moore', email: 'patricia_moore@example.com', password: '123456' },
  { username: 'john_anderson', email: 'john_anderson@example.com', password: '123456' },
  { username: 'mary_thomas', email: 'mary_thomas@example.com', password: '123456' }
];

// Her bir kullanıcıyı kaydetmek için bir döngü
users.forEach(async (user) => {
  try {
    const response = await axios.post('http://localhost:3000/api/auth/register', user);
    console.log('User registered:', response.data);
  } catch (error) {
    console.error('Error registering user:', error.response ? error.response.data : error.message);
  }
});
 */