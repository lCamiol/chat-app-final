/*
    path: api/login
*/

const { Router } = require('express');
const { check } = require('express-validator')
//controladores
const { createUser, login, renewToken } = require('../controllers/auth');
const { validateFields } = require('../middlewares/validateFields');
const { validateJWT } = require('../middlewares/validateJWT');

const router = Router();

//Crear nuevos usuarios
router.post('/new', [
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    check('email', 'El email es obligatorio').isEmail(),
    check('password', 'La contraseña es obligatoria').not().isEmpty(),
    validateFields
], createUser);

//Login
router.post('/', [
    check('email', 'El email es obligatorio').isEmail(),
    check('password', 'La contraseña es obligatoria').not().isEmpty(),
    validateFields
], login);

//Revalidar token
router.get('/renew', validateJWT, renewToken);


module.exports = router;