const fs = require('fs');
const path = require('path');

const uploadChunk = async (fileChunkData, clientSocket) => {
    let { fileType, chunkIndex, totalChunks, fileName, chunk } = fileChunkData;

    if (!fileType || !Number.isInteger(chunkIndex) || !Number.isInteger(totalChunks) || !fileName || !chunk) {
        clientSocket.send(JSON.stringify({ message: 'Invalid data received' }));
        return;
    }

    const base64Data = chunk.split(',')[1];

    const filePath = path.join(process.cwd(), 'uploads', fileType.split('/')[0], fileName);
    let buffer = Buffer.from(base64Data, 'base64');

    try {
        await fs.promises.mkdir(path.dirname(filePath), { recursive: true });
    } catch (error) {
        clientSocket.send(JSON.stringify({ message: 'Directory creation failed', error: error.message }));
        return;
    }

    try {
        const fileStream = fs.createWriteStream(filePath, { flags: 'a' });
        fileStream.write(buffer);
        fileStream.end();
    } catch (error) {
        await fs.promises.unlink(filePath);
        clientSocket.send(JSON.stringify({ message: 'File upload failed', error: error.message }));
        return;
    }

    if (chunkIndex === totalChunks - 1) {
        clientSocket.send(JSON.stringify({ 
            message: 'File uploaded successfully',
            path: 'uploads/' + fileType.split('/')[0] + '/' + fileName
        }));
    } else {
        clientSocket.send(JSON.stringify({ 
            message: 'Chunk uploaded successfully'
        }));
    }
};

module.exports = {
    uploadChunk
};