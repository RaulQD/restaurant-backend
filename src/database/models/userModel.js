import conn from "../mysql-db.js";

export class UserModel {
    static async getAllEmployees() {
        try {
            const [result] = await conn.query('SELECT u.id_user, u.first_name, u.last_name, u.email, u.phone, u.dni, e.position, e.salary, GROUP_CONCAT(r.id_rol) AS roles_ids, GROUP_CONCAT(r.role_name) AS roles_names FROM users u JOIN user_roles ur ON u.id_user = ur.user_id JOIN roles r ON ur.role_id = r.id_rol LEFT JOIN Employees e ON u.id_user = e.user_id  GROUP BY u.id_user, e.position, e.salary');


            return result;
        } catch (error) {
            console.error('Error al obtener los usuarios:', error);
            throw new Error('Error al obtener los usuarios');
        }
    }
    static async getUserById({ id }) {
        try {
            const query = 'SELECT u.id_user, u.first_name, u.last_name, u.email, u.phone, u.dni, e.position, e.salary, GROUP_CONCAT(r.id_rol) AS roles_ids, GROUP_CONCAT(r.role_name) AS roles_names FROM users u JOIN user_roles ur ON u.id_user = ur.user_id JOIN roles r ON ur.role_id = r.id_rol LEFT JOIN Employees e ON u.id_user = e.user_id WHERE u.id_user = ? GROUP BY u.id_user, e.position, e.salary'
            const [resultUser] = await conn.query(query, [id])

            return resultUser;
        } catch (error) {
            console.error('Error al obtener el usuario por id y rol:', error);
            throw new Error('Error al obtener el usuario por id y rol');
        }
    }
    static async getUserByEmail({ email }) {
        try {
            const [resultUser] = await conn.query('SELECT * FROM users WHERE email = ?', [email]);
            return resultUser;
        } catch (error) {
            console.error('Error al obtener el usuario por email:', error);
            throw new Error('Error al obtener el usuario por email');
        }
    }
    static async updateUser(data) {

    }
}