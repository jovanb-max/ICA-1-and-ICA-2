const bcrypt = require('bcryptjs');

const plaintextPassword = 'T@rajova1623';

// Generate a salt
bcrypt.genSalt(10, (err, salt) => {
  if (err) throw err;

  // Hash the password using the generated salt
  bcrypt.hash(plaintextPassword, salt, (err, hash) => {
    if (err) throw err;

    // `hash` is the hashed password
    console.log('Hashed Password:', hash);
  });
});


bcrypt.genSalt(10, (err, salt) => {
    if (err) {
      console.error('Error generating salt:', err);
      return;
    }
  
    bcrypt.hash(plaintextPassword, salt, (err, hash) => {
      if (err) {
        console.error('Error hashing password:', err);
        return;
      }
  
      console.log('Hashed password:', hash);
    });
  });

  
  const hashedPasswordFromDatabase = 'hashed_password_from_database';

  bcrypt.compare(plaintextPassword, hashedPasswordFromDatabase, (err, result) => {
    if (err) {
      console.error('Error comparing passwords:', err);
      return;
    }
  
    if (result) {
      console.log('Password matched!');
    } else {
      console.log('Incorrect password!');
    }
  });
  
