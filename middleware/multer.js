import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';

const videoFilter = function (req, file, cb) {
  // Your video file filter logic here
  // Example: Allow only video files with extensions mp4, avi, or mkv
  const allowedExtensions = ['mp4', 'avi', 'mkv', 'mov', 'flv', 'wmv'];
  const fileExtension = file.originalname.split('.').pop().toLowerCase();

  if (allowedExtensions.includes(fileExtension)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only mp4, avi, or mkv files are allowed.'));
  }
};

// export const videoUpload = multer({
//   fileFilter: videoFilter,
//   storage: multer.diskStorage({
//     destination: 'tmp',
//     filename: function (req, file, cb) {
//       const key = `${Date.now().toString()}-${uuidv4()}.${file.mimetype.split('/')[1]
//         }`;
//       cb(null, key);
//     },
//   }),
// })

export const videoUpload = multer({
  fileFilter: videoFilter,
  storage: multer.diskStorage({
    destination: 'tmp',
    filename: function (req, file, cb) {
      const key = `${Date.now().toString()}-${uuidv4()}.${file.mimetype.split('/')[1]}`;
      cb(null, key);
    },
  }),
  limits: { fileSize: 1000 * 1024 * 1024 }, // 500MB limit
});

export const upload = multer({ dest: './uploads' });

const storage = multer.memoryStorage();

export const uploadbadges = multer({ storage: storage });
// export const upload = multer({ storage: storage });
