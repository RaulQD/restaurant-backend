import conn from "../mysql-db.js";

export class UserModel {
    static async getUserByEmail({ email }) {
        try {
            const [resultUser] = await conn.query('SELECT * FROM users WHERE email = ?', [email]);
            return resultUser;
        } catch (error) {
            console.error('Error al obtener el usuario por email:', error);
            throw new Error('Error al obtener el usuario por email');
        }

    }
}