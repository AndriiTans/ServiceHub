import express from 'express';
import parserRoutes from './parserRoutes';

const router = express.Router();

router.use('/parser', parserRoutes);

export default router;
