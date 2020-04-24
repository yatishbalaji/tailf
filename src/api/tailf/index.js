const fs = require('fs');

const bytesToRead = 100;
let watching = false;
let last_read_position = 0;
let last_modified = '';
let socketIo = '';

function readFile(loc, start, end, socket = false, prevData = '') {
    const fileStream = fs.createReadStream(loc, { start: start, end: end });

    fileStream.on('data', function(data) {
        if (socket) {
            const data2 = `${data.toString()}${prevData}`;
            const count = data2.split(/[\r\n]/g).length;

            if ( count === 10 || start-bytesToRead < 0) {
                socket.emit('last10', data2);
            } else if (count < 10) {
                readFile(loc, start-bytesToRead, start, socket, data2);
            } else {
                socket.emit('last10', data2.split(/[\n\r]/g).splice(-10).join('</br>'));
            }
        } else {
            socketIo.sockets.emit('newLines', data.toString().trim());
        }
    });
}

module.exports = async (io, filePath) => {
    socketIo = io;
    loc = filePath;

    io.on('connection', async (socket) => {
        fs.stat(loc, function(err, stats) {
            last_read_position = stats.size;
            last_modified = stats.mtime;
            start = (bytesToRead >= stats.size) ? 0 : (stats.size - bytesToRead);
            end = stats.size;

            readFile(loc, end-bytesToRead, end, socket);
        });

        fs.watch(loc, function (curr, prev) {
            if (!watching) {
                fs.stat(loc, function (err, stats) {
                    if (!stats.size) return;
    
                    if (
                        (stats.mtime >  last_modified)
                        && (stats.size > last_read_position)
                    ) {
                        readFile(loc, last_read_position, stats.size, false); 
                    }
    
                    last_read_position = stats.size;
                    last_modified = stats.mtime;

                    watching = true;

                    setTimeout(() => {
                        watching = false;
                    }, 100);
                });
            }
        });
    });
}