
const bcrypt = require('bcrypt');

const users = [
  { username: 'Samu', password: 'NapoliEsplosa11' },
  { username: 'poseidone', password: 'dionettuno' },
  { username: 'AlexDeCeglie', password: 'kitemmurtstravev' },
  { username: 'LUCA', password: 'TETTECULO1' }
];

async function hashPasswords() {
  const hashedUsers = [];
  
  for (let i = 0; i < users.length; i++) {
    const user = users[i];
    const hashedPassword = await bcrypt.hash(user.password, 12);
    hashedUsers.push({
      id: i + 1,
      username: user.username,
      password: hashedPassword,
      role: "admin",
      createdAt: "2024-01-01T00:00:00.000Z",
      lastLogin: null
    });
  }
  
  console.log(JSON.stringify(hashedUsers, null, 2));
}

hashPasswords();
