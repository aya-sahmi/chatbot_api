import express from 'express';
import userRoutes from './routes/userRoutes.js';
import packageRoutes from './routes/packageRoutes.js';
import domaineRoutes from './routes/domaineRoutes.js';
import workspaceRoutes from './routes/workspaceRoutes.js';
import chatbotRoutes from './routes/chatbotRoutes.js';
import { swaggerDocs, swaggerUi } from './config/swagger.js';

const app = express();

app.use(express.json());
const PORT = process.env.PORT ;

app.use(express.json());

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use('/api/v1/users', userRoutes);
app.use('/api/v1/packages', packageRoutes);
app.use('/api/v1/domaines', domaineRoutes);
app.use('/api/v1/workspaces', workspaceRoutes);
app.use('/api/v1/chatbots', chatbotRoutes);

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running`);
});
