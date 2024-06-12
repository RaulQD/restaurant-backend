import jwt from 'jsonwebtoken';


export const generateJWT = (payload) => {

    const token = jwt.sign(payload, process.env.SECRET_KEY, {
        expiresIn: '2h'
    })
    return token;
}
