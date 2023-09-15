const { userConnected, userDisconnected, getUsers, saveMessange } = require("../controllers/sockets");
const { verifyJWT } = require("../helpers/jwt");


class Sockets {

    constructor(io) {

        this.io = io;

        this.socketEvents();
    }

    socketEvents() {
        // On connection
        this.io.on('connection', async (socket) => {

            //Validar el JWT 
            //si el token no es valido desconectar
            const [valid, uid] = verifyJWT(socket.handshake.query['x-token']);

            if (!valid) {

                console.log('Token no valido');
                return socket.disconnect();
            }

            await userConnected(uid);

            //unir  al usuario a una sala de socket.io
            socket.join( uid );

            //Emitir todos los usuarios conectados
            this.io.emit('users-list', await getUsers())

            //Escuchar cuando el cliente manda un mensaje
            //mensaje personal
            socket.on('personal-message', async (payload) =>{
                const message = await saveMessange(payload);
                this.io.to(payload.to).emit('personal-message', message);
                this.io.to(payload.from).emit('personal-message', message);
            });

            // Desconectar
            //marcar en la BD que el usuario se deconecto
            socket.on('disconnect', async () => {
                await userDisconnected(uid);
                this.io.emit('users-list', await getUsers());
            });


            //TODO: Emitir todos los usuarios conectados

        });
    }


}


module.exports = Sockets;