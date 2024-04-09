# Chunked File Upload

This project provides a utility function for handling large file uploads using chunked data transfer. It consists of a back-end server and a front-end client.

## Back-end

The back-end server is implemented in Node.js and uses the WebSocket protocol for real-time communication with the client. The server listens for incoming file chunks from the client and writes them to the file system. The server is implemented in the following files:

- `handleUpload.js`: This file contains the `uploadChunk` function which handles the incoming file chunks.
- `index.js`: This file sets up the WebSocket server and listens for incoming connections and messages.

To run the server, navigate to the `Back-end` directory and run `node index.js`.

## Front-end

The front-end client is implemented in TypeScript and uses the WebSocket API to send file chunks to the server. The client splits the files into chunks and sends each chunk to the server. The client is implemented in the following file:

- `uploadHandler.ts`: This file contains the `uploadFiles` function which handles the file splitting and chunk sending.

Please adjust the content as needed to match your project's specifics.