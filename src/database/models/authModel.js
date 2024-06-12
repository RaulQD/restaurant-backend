import conn from "../mysql-db.js";


export class AuthModel {

    static async createUser(data) {

        const { first_name, last_name, password, email, dni, phone } = data;
        try {
            const defaultRole = 3;
            //INSERTAR EL USUARIO EN LA TABLA DE USUARIOS
            const [userResult] = await conn.query('INSERT INTO users (first_name, last_name, password, email, dni, phone) VALUES (?,?,?,?,?,?)', [first_name, last_name, password, email, dni, phone]);
            //OBTENER EL ID DEL USUARIO CREADO
            const userId = userResult.insertId;
            const [rolResult] = await conn.query('SELECT * FROM roles WHERE id_rol = ?', [defaultRole]);
            await conn.query('INSERT INTO clients (user_id) VALUES (?)', [userId]);
            //INSERTAR EL USUARIO Y EL ROL EN LA TABLA DE USUARIOS_ROLES
            await conn.query('INSERT INTO user_roles (user_id,role_id) VALUES (?,?)', [userId, defaultRole]);
            //OBJETO CON LOS DATOS DEL USUARIO
            const user = {
                id: userId,
                first_name,
                last_name,
                email,
                dni,
                phone,
                rol: rolResult[0]
            }
            return user;
        } catch (error) {
            throw new Error('Error al crear un usuario');
        }
    }
    static async createEmployee(data) {
        try {
            const { first_name, last_name, password, dni, email, phone, position, salary, roles } = data;

            //INSERTAR EL EMPLEADO EN LA TABLA DE USUARIOS
            const [employeeResult] = await conn.query('INSERT INTO users (first_name, last_name, password, email, dni, phone) VALUES (?,?,?,?,?,?)', [first_name, last_name, password, email, dni, phone]);
            //OBTENER EL ID DEL USUARIO CREADO
            const userId = employeeResult.insertId;
            //INSERTAR EL EMPLEADO EN LA TABLA DE EMPLEADOS
            await conn.query('INSERT INTO employees (user_id, position, salary) VALUES (?,?,?)', [userId, position, salary]);

            //AGREGAR 1 O 2 ROLES DEPENDIENDO DEL ROL DEL EMPLEADO
            for (const roleId of roles) {
                await conn.query('INSERT INTO user_roles (user_id,role_id) VALUES (?,?)', [userId, roleId]);
            }
            //OBTENER EL ROL DEL EMPLEADO
            const [rolesResult] = await conn.query('SELECT r.* FROM roles r JOIN user_roles ur ON r.id_rol = ur.role_id WHERE ur.user_id = ?', [userId]);

            //OBTENER LOS ROLES DEL USUARIO EN UN ARRAY

            const rolesGroup = rolesResult.map(role => {
                return {
                    id: role.id_rol,
                    name: role.role_name
                }
            });

            //OBJETO CON LOS DATOS DEL EMPLEADO
            const employee = {
                id: userId,
                first_name,
                last_name,
                email,
                dni,
                phone,
                employee: {
                    position,
                    salary
                },
                roles: rolesGroup
            }
            return employee;

        } catch (error) {
            console.log('Error al crear un empleado', error)
            throw new Error('Error al crear un empleado');
        }
    }

}