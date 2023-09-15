const { response } = require("express");
const bcrypt = require('bcryptjs');
const User = require("../models/user");
const { generateJWT } = require("../helpers/jwt");

const createUser = async (req, res = response) => {

    try {
        const { email, password, name } = req.body
        //verificar que el email no exista
        const existsEmail = await User.findOne({ email });

        if (existsEmail) {
            return res.status(400).json({
                ok: false,
                msg: 'Correo ya existente'
            });
        }

        const user = new User(req.body);

        //Encriptar contraseña
        const salt = bcrypt.genSaltSync();
        user.password = bcrypt.hashSync(password, salt);

        //Guardar en BD
        await user.save();

        //Generar JWT
        const token = await generateJWT(user.id);

        res.json({
            ok: true,
            user,
            token
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hablar con el administrador'
        })
    }


}

const login = async (req, res = response) => {

    const { email, password } = req.body;

    try {

        const userDB = await User.findOne({ email });
        if (!userDB) {
            return res.status(404).json({
                ok: false,
                msg: 'Datos suministrados incorrectos'
            });
        }

        //validar password
        const validPassword = bcrypt.compareSync(password, userDB.password);
        if (!validPassword) {
            return res.status(404).json({
                ok: false,
                msg: 'Datos suministrados incorrectos'
            });
        }

        //Generar JWT
        const token = await generateJWT(userDB.id);

        res.json({
            ok: true,
            user: userDB,
            token
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hablar con el administrador'
        })
    }
}

const renewToken = async (req, res = response) => {

    const uid = req.uid;

    //Generar nuevo JWT
    const token = await generateJWT(uid);

    //Obtener el usuario por UID
    const user = await User.findById(uid);

    res.json({
        ok: true,
        token,
        user
    });
}

module.exports = {
    createUser,
    login,
    renewToken
}