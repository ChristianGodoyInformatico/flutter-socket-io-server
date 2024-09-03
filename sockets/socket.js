const { io } = require('../index');
const Bands = require('../models/bands');
const Band = require('../models/band');

const bands = new Bands();
bands.addBand(new Band('Slipknot'));
bands.addBand(new Band('Rammstein'));
bands.addBand(new Band('SOAD'));
bands.addBand(new Band('Korn'));

// Mensajes del Socket
io.on('connection', client => {
    // client.on('event', data => {});
    console.log('cliente conectado');

    client.emit('active-bands', bands.getBands());

    client.on('disconnect', () => {
        console.log('Cliente desconectado')
    })

    client.on('mensaje', (payload) => {
        console.log('mensaje!!!', payload);
        io.emit('mensaje', { admin: 'Nuevo mensaje' });
    });

    client.on('vote-band', (payload) => {
        bands.voteBand(payload.id);

        io.emit('active-bands', bands.getBands());
    });

    client.on('add-band', (payload) => {
        const newBand = new Band( payload.name)
        bands.addBand(newBand);
        io.emit('active-bands', bands.getBands());
    });

    client.on('delete-band', (payload) => {
        bands.deleteBand(payload.id);
        io.emit('active-bands', bands.getBands());
    });

    // client.on('emitir-mensaje', (payload) => {
    //     client.broadcast.emit('nuevo-mensaje', payload);
    // });
});