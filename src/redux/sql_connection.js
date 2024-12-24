import sql from 'mssql';
import bcrypt from 'bcryptjs';
import App from "../App";

const config = {
    user: 'social-media-optimizer',
    password: 'social-media-optimizer',
    server: 'HYRAIKSA22',
    database: 'social-media-optimizer',
    options: {
        encrypt: false,
    }
};

async function userExists(username) {
    try {
        await sql.connect(config);
        const result = await sql.query`SELECT 1 FROM Users WHERE Username = ${username}`;
        return result.recordset.length > 0;
    } catch (err) {
        console.error('Database query failed:', err);
        return false;
    }
}

async function createUser(username, passwordHash, email) {
    if (await userExists(username)) {
        return false;  // User already exists
    }
    try {
        await sql.connect(config);
        await sql.query`INSERT INTO Users (Username, PasswordHash, Email) VALUES (${username}, ${passwordHash}, ${email})`;
        return true;
    } catch (err) {
        console.error('Failed to create user:', err);
        return false;
    }
}

// Example usage in an Express.js route
App.post('/signup', async (req, res) => {
    console.log("Received signup request:", req.body);
    const { username, password, email } = req.body;
    const passwordHash = await bcrypt.hash(password, 8);

    try {
        const userCreated = await createUser(username, passwordHash, email);
        if (userCreated) {
            console.log("User created successfully");
            res.send('User created successfully.');
        } else {
            console.log("User already exists");
            res.send('User already exists or failed to create.');
        }
    } catch (error) {
        console.error("Error in signup:", error);
        res.status(500).send('An error occurred during signup.');
    }
});