import dotenv from 'dotenv';
dotenv.config();

import app from './app';

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Server is running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
