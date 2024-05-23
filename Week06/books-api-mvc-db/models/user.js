// models/user.js
const sql = require('mssql');
const config = require('../dbConfig'); // Make sure this file contains your DB configuration

class User {
    constructor(id, username, email) {
        this.id = id;
        this.username = username;
        this.email = email;
    }

    static async createUser(user) {
        try {
            let pool = await sql.connect(config);
            let result = await pool.request()
                .input('username', sql.VarChar, user.username)
                .input('email', sql.VarChar, user.email)
                .query('INSERT INTO Users (username, email) OUTPUT INSERTED.* VALUES (@username, @email)');
            return result.recordset[0];
        } catch (err) {
            console.error(err);
        } finally {
            sql.close();
        }
    }

    static async getAllUsers() {
        try {
            let pool = await sql.connect(config);
            let result = await pool.request().query('SELECT * FROM Users');
            return result.recordset;
        } catch (err) {
            console.error(err);
        } finally {
            sql.close();
        }
    }

    static async getUserById(id) {
        try {
            let pool = await sql.connect(config);
            let result = await pool.request()
                .input('id', sql.Int, id)
                .query('SELECT * FROM Users WHERE id = @id');
            return result.recordset[0] || null;
        } catch (err) {
            console.error(err);
        } finally {
            sql.close();
        }
    }

    static async updateUser(id, updatedUser) {
        try {
            let pool = await sql.connect(config);
            await pool.request()
                .input('id', sql.Int, id)
                .input('username', sql.VarChar, updatedUser.username)
                .input('email', sql.VarChar, updatedUser.email)
                .query('UPDATE Users SET username = @username, email = @email WHERE id = @id');
            return { message: 'User updated successfully' };
        } catch (err) {
            console.error(err);
        } finally {
            sql.close();
        }
    }

    static async deleteUser(id) {
        try {
            let pool = await sql.connect(config);
            await pool.request()
                .input('id', sql.Int, id)
                .query('DELETE FROM Users WHERE id = @id');
            return { message: 'User deleted successfully' };
        } catch (err) {
            console.error(err);
        } finally {
            sql.close();
        }
    }

    static async searchUsers(searchTerm) {
        try {
            let pool = await sql.connect(config);
            let query = `
                SELECT *
                FROM Users
                WHERE username LIKE @searchTerm
                   OR email LIKE @searchTerm
            `;
            let result = await pool.request()
                .input('searchTerm', sql.VarChar, `%${searchTerm}%`)
                .query(query);
            return result.recordset;
        } catch (err) {
            console.error(err);
            throw new Error("Error searching users");
        } finally {
            sql.close();
        }
    }

    static async getUsersWithBooks() {
        try {
            let pool = await sql.connect(config);
            const query = `
                SELECT u.id AS user_id, u.username, u.email, b.id AS book_id, b.title, b.author
                FROM Users u
                LEFT JOIN UserBooks ub ON ub.user_id = u.id
                LEFT JOIN Books b ON ub.book_id = b.id
                ORDER BY u.username;
            `;

            const result = await pool.request().query(query);

            // Group users and their books
            const usersWithBooks = {};
            for (const row of result.recordset) {
                const userId = row.user_id;
                if (!usersWithBooks[userId]) {
                    usersWithBooks[userId] = {
                        id: userId,
                        username: row.username,
                        email: row.email,
                        books: [],
                    };
                }
                if (row.book_id) {
                    usersWithBooks[userId].books.push({
                        id: row.book_id,
                        title: row.title,
                        author: row.author,
                    });
                }
            }

            return Object.values(usersWithBooks);
        } catch (err) {
            console.error(err);
            throw new Error("Error fetching users with books");
        } finally {
            sql.close();
        }
    }
}

module.exports = User;
