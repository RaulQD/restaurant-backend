import { AuthModel } from "../database/models/authModel.js";
import { UserModel } from "../database/models/userModel.js";
import { checkCompare, hashPassword } from "../helpers/bcrypt.js";
import { generateJWT } from "../helpers/jwt.js";

export class AuthController {

    static login = async (req, res) => {
        try {
            const { email, password } = req.body;
            if (!email || !password) {
                return res.status(400).json({ message: 'Ingrese su usuario y contraseña para iniciar sesión', status: 400, route: req.originalUrl });
            }
            const user = await UserModel.getUserByEmail({ email });
            if (!user) {
                return res.status(400).json({ message: 'Correo electronico o contraseña incorrecta, por favor vuelve a intentarlo nuevamente', status: 400, route: req.originalUrl });
            }
            const isPasswordCorrect = await checkCompare(password, user[0].password);
            if (!isPasswordCorrect) {
                return res.status(400).json({ message: 'Correo electronico o contraseña incorrecta, por favor vuelve a intentarlo nuevamente', status: 400, route: req.originalUrl });
            }
            //GENERAR TOKEN
            const token = generateJWT({ id: user[0].id_user, email: user[0].email })

            res.status(200).json({ message: 'Bienvenido disfruta de tus comidas favoritas', status: 200, token });
        } catch (error) {
            console.log(error)
            res.status(500).json({ message: 'Error al iniciar sesion', status: 500, route: req.originalUrl });
        }
    }

    static async createAccountClient(req, res) {
        try {
            const { first_name, last_name, password, email, dni, phone } = req.body;
            //VERIFICAR SI EL EMAIL YA EXISTE
            const isEmailExist = await UserModel.getUserByEmail({ email });
            if (isEmailExist.length) {
                return res.status(400).json({ message: 'El email ya esta registrado', status: 400, route: req.originalUrl });
            }

            //HASH PASSWORD
            const passwordHashed = await hashPassword(password);
            //CREAR USUARIO  
            const user = await AuthModel.createUser({ first_name, last_name, password: passwordHashed, dni, email, phone });

            res.status(201).json({ message: 'Usuario creado exitosamente', user });
        } catch (error) {
            console.log(error)
            res.status(500).json({ message: 'Error al crear un usuario', status: 500, route: req.originalUrl })
        }
    }
    static async createAccountEmployee(req, res) {
        try {
            const { first_name, last_name, password, email, dni, phone, position, salary, roles } = req.body;
            //VERIFICAR SI EL EMAIL YA EXISTE
            const isEmailExist = await UserModel.getUserByEmail({ email });
            if (isEmailExist.length) {
                return res.status(400).json({ message: 'El email ya esta registrado', status: 400, route: req.originalUrl });
            }
            //HASH PASSWORd
            const passwordHashed = await hashPassword(password);

            const userEmployee = await AuthModel.createEmployee({ first_name, last_name, password: passwordHashed, email, dni, phone, position, salary, roles });
            res.status(201).json({ message: 'Empleado creado correctamente', userEmployee });
        } catch (error) {
            console.log(error)
            res.status(500).json({ message: 'Error al crear un empleado' })
        }
    }
}