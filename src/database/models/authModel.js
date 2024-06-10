import conn from "../mysql-db.js";


export class AuthModel {

    static async createUser(data) {

        const { first_name, last_name, password, email, phone } = data;
        try {
            const defaultRole = 3;
            //INSERTAR EL USUARIO EN LA TABLA DE USUARIOS
            const [userResult] = await conn.query('INSERT INTO users (first_name,last_name, password, email, phone) VALUES (?,?,?,?,?)', [first_name, last_name, password, email, phone]);
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
            const { first_name, last_name, password, email, phone, position, salary, id_rol } = data;

            //INSERTAR EL EMPLEADO EN LA TABLA DE USUARIOS
            const [employeeResult] = await conn.query('INSERT INTO users (first_name,last_name, password, email, phone) VALUES (?,?,?,?,?)', [first_name, last_name, password, email, phone]);
            //OBTENER EL ID DEL USUARIO CREADO
            const userId = employeeResult.insertId;
            //OBTENER EL ROL DEL EMPLEADO
            const [rolResult] = await conn.query('SELECT * FROM roles WHERE id_rol = ?', [id_rol]);
            //VERIFICAR SI ES UN ROL DE EMPLEADO O ADMINISTRADOR
            let models;

            if (id_rol === 1) {
                //INSERTAR EL EMPLEADO EN LA TABLA DE EMPLEADOS
                models = await conn.query('INSERT INTO Employees (user_id, position, salary) VALUES (?,?,?)', [userId, position, salary]);
            } else if (id_rol === 2) {
                //INSERTAR EL EMPLEADO EN LA TABLA DE ADMINISTRADORES
                models = await conn.query('INSERT INTO Employees (user_id, position, salary) VALUES (?,?,?)', [userId, position, salary]);
            }
            //INSERTAR  EL USUARIO Y EL ROL EN LA TABLA DE USUARIOS_ROLES
            await conn.query('INSERT INTO user_roles (user_id,role_id) VALUES (?,?)', [userId, id_rol]);
            //OBJETO CON LOS DATOS DEL EMPLEADO
            const employee = {
                id: userId,
                first_name,
                last_name,
                email,
                phone,
                employee: {
                    position,
                    salary
                },
                rol: rolResult[0]
            }
            return employee;

        } catch (error) {
            console.log('Error al crear un empleado', error)
            throw new Error('Error al crear un empleado');
        }
    }

}