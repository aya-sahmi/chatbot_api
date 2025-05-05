import express from 'express';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import packageRoutes from './routes/packageRoutes.js';
import domaineRoutes from './routes/domaineRoutes.js';
import workspaceRoutes from './routes/workspaceRoutes.js';
import chatbotRoutes from './routes/chatbotRoutes.js';
import roleRoutes from './routes/roleRoutes.js';
import { swaggerDocs, swaggerUi } from './config/swagger.js';
import cors from 'cors';

const app = express();
const corsOptions = {
    origin: 'https://chatbotapi-production-319b.up.railway.app/docs/',
    methods: ['GET', 'POST', 'PUT', 'PATCH' ,'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  };
app.use(cors(corsOptions));
app.use(express.json());
const PORT = process.env.PORT ;

app.use(express.json());

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/packages', packageRoutes);
app.use('/api/v1/domaines', domaineRoutes);
app.use('/api/v1/workspaces', workspaceRoutes);
app.use('/api/v1/chatbots', chatbotRoutes);
app.use('/api/v1/roles',roleRoutes)

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running`);
});