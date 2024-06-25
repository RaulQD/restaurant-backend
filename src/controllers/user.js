import { UserModel } from "../models/users.js";

export class UserController {

    static async getAllEmployees(req, res) {
        try {
            const resultEmployees = await UserModel.getAllEmployees();
            if (resultEmployees.length === 0) {
                return res.status(404).json({ message: 'No se encontraron empleados', status: 404, routes: req.originalUrl });
            }
            const employees = resultEmployees.map(employee => {
                const roleGroupArray = employee.roles_ids.split(',').map((id, index) => ({
                    id: id,
                    name: employee.roles_names.split(',')[index]
                }))
                return {
                    id_user: employee.id_user,
                    first_name: employee.first_name,
                    last_name: employee.last_name,
                    email: employee.email,
                    phone: employee.phone,
                    dni: employee.dni,
                    position: employee.position,
                    salary: employee.salary,
                    roles: roleGroupArray
                }
            })


            res.status(200).json(employees);
        } catch (error) {
            console.error('Error al obtener los empleados:', error);
            res.status(500).json({ message: 'Error al obtener los empleados', status: 500 });
        }
    }

    static async getUserByIdWithRole(req, res) {
        try {
            const { id } = req.params;

            //VALIDA QUE EL ID SEA UN NUMERO POSITIVO Y NO UNA CADENA DE TEXTO
            if (!id || isNaN(parseInt(id)) || parseInt(id) <= 0) {
                return res.status(400).json({ message: "El id del usuario no es valido, por favor ingrese un id correcto.", status: 400, routes: req.originalUrl },);
            }
            const user = await UserModel.getUserById({ id });
            //SI NO SE ENCUENTRA NINGUN USUARIO CON EL ID 
            if (user.length === 0) {
                return res.status(404).json({ message: `No se encontro el usuario con el id ${id}`, status: 404, routes: req.originalUrl });
            }
            //OBTENER EL RESULTADO EN UN OBJETO CON EL FORMATO DESEADO
            const getUser = user.map(employee => {
                //CONVERTIR LOS ROLES EN UN ARRAY DE OBJETOS
                const rolesGroupArray = employee.roles_ids.split(',').map((id, index) => ({
                    id: id,
                    name: employee.roles_names.split(',')[index]
                }));
                return {
                    id_user: employee.id_user,
                    first_name: employee.first_name,
                    last_name: employee.last_name,
                    email: employee.email,
                    phone: employee.phone,
                    dni: employee.dni,
                    position: employee.position,
                    salary: employee.salary,
                    roles: rolesGroupArray
                }
            })

            res.status(200).json(getUser);
        } catch (error) {
            console.error('Error al obtener el usuario por id y rol:', error);
            res.status(500).json({ message: 'Error al obtener el usuario por id y rol', status: 500 });
        }
    }

}