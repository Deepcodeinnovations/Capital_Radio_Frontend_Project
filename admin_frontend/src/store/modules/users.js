// Sample admin users for authentication

export const sampleUsers = [
  {
    id: 1,
    email: 'admin@capitalfm.com',
    password: 'admin123',
    name: 'Admin User',
    role: 'admin',
    avatar: null
  },
  {
    id: 2,
    email: 'editor@capitalfm.com',
    password: 'editor123',
    name: 'Content Editor',
    role: 'editor',
    avatar: null
  },
  {
    id: 3,
    email: 'host@capitalfm.com',
    password: 'host123',
    name: 'Radio Host',
    role: 'host',
    avatar: null
  }
];

// Function to find user by credentials
export const findUserByCredentials = (email, password) => {
  return sampleUsers.find(user => 
    user.email.toLowerCase() === email.toLowerCase() && 
    user.password === password
  );
};