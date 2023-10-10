import { v4 as uuid } from 'uuid';

export const generateImageName = (req: Express.Request, file: Express.Multer.File, callback: Function) => {
  if(!file) return callback(new Error('File not found'), false);

  const imageExtension = file.mimetype.split('/')[1];

  const imageName = `${uuid()}.${imageExtension}`;

  callback(null, imageName);
}
