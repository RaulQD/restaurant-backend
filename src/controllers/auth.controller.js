import { AuthModel } from "../database/models/authModel.js";
import { hashPassword } from "../helpers/bcrypt.js";

export class AuthController {

    static async createAccountClient(req, res) {
        try {
            const { first_name, last_name, password, email, phone } = req.body;
            const user = await AuthModel.createUser({ first_name, last_name, password, email, phone });

            //HASH PASSWORD
            const passwordHashed = await hashPassword(password);
            user.password = passwordHashed;

            res.status(201).json({ message: 'Usuario creado', user });
        } catch (error) {
            console.log(error)
            res.status(500).json({ message: 'Error al crear un usuario' })
        }
    }
    static async createAccountEmployee(req, res) {
        try {
            const { first_name, last_name, password, email, phone, position, salary, id_rol } = req.body;
            const userEmployee = await AuthModel.createEmployee({ first_name, last_name, password, email, phone, position, salary, id_rol });
            //HASH PASSWORd
            const passwordHashed = await hashPassword(password);
            userEmployee.password = passwordHashed;

            res.status(201).json({ message: 'Empleado creado correctamente', userEmployee });
        } catch (error) {
            console.log(error)
            res.status(500).json({ message: 'Error al crear un empleado' })
        }
    }
}