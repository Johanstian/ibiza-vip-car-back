const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwtService = require('../services/jwtService');

const signUp = async (req, res) => {
    try {
        let params = req.body;
        if (!params.name || !params.lastName || !params.email || !params.password) {
            return res.status(400).send({
                status: 'error',
                message: 'Theare are fields to fill'
            })
        }
        let user = new User(params);
        const userCreated = await User.findOne({
            $or: [{ email: params.email.toLowerCase() }]
        });
        if (userCreated) {
            return res.status(409).send({
                status: 'error',
                message: 'Email already in Data Base'
            })
        }
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(user.password, salt);
        user.password = hash;

        await user.save();

        return res.status(200).json({
            status: 'success',
            message: 'User created',
            user
        })
    } catch (error) {
        return res.status(500).send({
            status: 'error',
            message: 'Error creating user'
        });
    }
}

const signIn = async (req, res) => {
    try {
        let params = req.body;
        if (!params.email || !params.password) {
            return res.status(400).send({
                status: 'error',
                message: 'Complete all inputs'
            });
        }
        const user = await User.findOne({ email: params.email.toLowerCase() })
        if (!user) {
            return res.status(500).send({
                status: 'error',
                message: 'User not found'
            });
        }
        const validPassword = await bcrypt.compare(params.password, user.password);
        if (!validPassword) {
            return res.status(401).send({
                status: 'error',
                message: 'Incorrect password'
            });
        }
        const token = jwtService.createToken(user);
        return res.status(200).json({
            status: 'success',
            message: 'Login OK',
            token,
            user: {
                id: user._id,
                name: user.name,
                lastName: user.lastName,
                email: user.email
            }
        })
    } catch (error) {
        return res.status(500).send({
            status: 'error',
            message: 'Error Sign In'
        });
    }
}

const getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById( id );

        if (!user) {
            return res.status(400).json( { success: false, message: 'Usuario no encontrado' })
        }

        res.status(200).json({
            success: true,
            user
        })
    } catch (error) {
        return res.status(500).send({
            status: 'error',
            message: 'Error al obtener el usuario'
        })
    }
}

const profile = async (req, res) => {
    try {
        //Get id de user de params de url
        const userId = req.params.id;
        console.log("ID del usuario solicitado:", userId);

        if (!req.user || !req.user.id) {
            return res.status(401).send({
                status: 'error',
                message: 'Usuario no autenticadosss'
            });
        }

        //Buscar user en db y excluir datos que no mostrar
        const userProfile = await User.findById(userId)

        if (!userProfile) {
            return res.status(400).send({
                status: 'error',
                message: 'Usuario no encontrado'
            })
        }

        //return info del profile
        return res.status(200).json({
            status: 'success',
            user: userProfile
        })

    } catch (error) {
        console.log('Error al obtener el perfil del usuario', error)
        return res.status(500).send({
            status: 'error',
            message: 'Error al obtener el perfil del usuario'
        })
    }
}

const update = async (req, res) => {
    try {
        let userIdentity = req.ser;
        let userToUpdate = req.body;

        delete userToUpdate.iat;
        delete userToUpdate.exp;
        delete userToUpdate.role;

        const users = await User.find({
            $or: [{ emal: userToUpdate.email }, { nick: userToUpdate.nick }]
        }).exec();

        const isDuplicateUser = users.some(user => {

            return user && user._id.toString() !== userIdentity.userId;
        })

        if (isDuplicateUser) {
            return res.status(400).send({
                status: 'error',
                message: 'Error, solo se puede actualizar los datos del usuario logueado'
            })
        }

        return res.status(200).json({
            status: 'success',

        })

    } catch (error) {
        
    }
}

module.exports = { signUp, signIn, profile, getUserById }