/**
 * Initialize WebSocket connection with the server
 * 
 * @returns {Promise<WebSocket>}
 */
export async function initConnection() : Promise<WebSocket> {
    const socket = new WebSocket('ws://localhost:8080');
    return socket;
}

/**
 * Upload multiple files to the server using WebSocket
 * 
 * @param socket - WebSocket connection object
 * @param files - Array of files to be uploaded
 * @param onSuccess - Callback function to be called on successful upload
 * @param onError - Callback function to be called on error
 * @param onUploading - Callback function to be called on uploading
 * @returns {Promise<boolean>}
 */
export const uploadFiles = async (socket : WebSocket, files: File[], onSuccess: (filePath: string) => void, onError: (error: any) => void, onUploading?: (progress: number) => void) : Promise<boolean> => {
  const progress: number[] = [];

  if(!socket) {
    console.error('Connection not established');
    return false;
  }

  socket.onopen = () => {
    console.log('Connection established');
  };

  socket.onmessage = (event) => {
    const response = JSON.parse(event.data);
    onSuccess(response.path);
  };

  if(files.some(file => file.size > 50 * 1024 * 1024)) {
    console.error('File size should not exceed 50MB');
    return false;
  }

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    if (!file) continue;

    const chunkSize = 1 * 1024 * 1024;
    const totalChunks = Math.ceil(file.size / chunkSize);
    const fileType = file.type;

    for (let start = 0, chunkIndex = 0; start < file.size; chunkIndex++) {
      let end = Math.min(start + chunkSize, file.size);
      const chunk = file.slice(start, end);

      const reader = new FileReader();
      reader.readAsDataURL(chunk);
      await new Promise((resolve) => {
        reader.onloadend = async () => {
          const base64data = reader.result;

          const payload = {
            chunk: base64data,
            chunkIndex: chunkIndex,
            totalChunks: totalChunks,
            fileType: fileType,
            fileName: file.name,
          };

          try {
            socket.send(JSON.stringify(payload));
            if (end === file.size) {
              progress[i] = 100;
            } else {
              progress[i] = (chunkIndex / totalChunks) * 100;
              onUploading && onUploading(progress[i]);
            }
            resolve(null);
          } catch (error) {
            onError(error);
          }
        };
      });

      start = end;
    }
  }

  return true;
};

