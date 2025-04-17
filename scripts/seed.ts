import { faker } from '@faker-js/faker';
import { query } from '../src/shared/db';

const seedDatabase = async () => {
  try {
    // Begin transaction to ensure the seed data is inserted correctly
    await query(`BEGIN`);

    // Create some sample users
    const users: string[] = [];
    for (let i = 0; i < 5; i++) {
      const username = faker.internet.username().toLowerCase(); // Unique username
      users.push(username);

      const result = await query(`
        INSERT INTO users (username) 
        VALUES ($1)
        RETURNING id;
      `, [username]);

      users[i] = result.rows[0].id; // Storing user IDs for future reference
    }

    // Define some message themes
    const messageThemes = [
      'Hello, how can I help you today?',
      'I hope you are having a great day!',
      'Let me know if you need any assistance.',
      'Here is an update on your request.',
      'Thank you for your message, I’ll get back to you soon!',
      'Just checking in to see if everything is okay.',
      'How is everything going on your end?',
      'I’m happy to assist with anything you need.'
    ];

    // Create some messages associated with users
    const messageCount = 20;
    for (let i = 0; i < messageCount; i++) {
      const userId = faker.helpers.arrayElement(users);  // Using `faker.helpers.arrayElement` to pick a random user
      const content = faker.helpers.arrayElement(messageThemes); // Select a message from predefined themes
      const createdAt = faker.date.recent(); // You can modify this to be more controlled if needed

      await query(`
        INSERT INTO messages (user_id, content, created_at) 
        VALUES ($1, $2, $3);
      `, [userId, content, createdAt]);
    }

    // Commit the transaction
    await query(`COMMIT`);

    console.log('Database seeded successfully with meaningful messages!');
  } catch (error) {
    // Rollback in case of an error
    await query(`ROLLBACK`);
    console.error('Error seeding database:', error);
  }
};

// Call the seed function
seedDatabase().catch((error) => console.error('Error during seeding:', error));