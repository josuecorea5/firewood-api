export const imageFilter = (req: Express.Request, file: Express.Multer.File, callback: Function) => {

  if(!file) return callback(new Error('Image not found'), false);

  const imageExtension = file.mimetype.split('/')[1];

  const validImageExtensions = ['jpg', 'jpeg', 'png'];

  if(validImageExtensions.includes(imageExtension)) {
    return callback(null, true);
  }

  callback(null, false)
}
