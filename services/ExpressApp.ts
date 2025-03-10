import express, { Application } from 'express';
import compression from 'compression';
import {  TodosRoutes , UserRoutes } from '../routes'
import cors from 'cors'

export default async (app: Application) => {
    
    app.use(cors())

    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));
    app.use(compression());

    app.use('/api/user', UserRoutes);
    app.use('/api/todos', TodosRoutes);

    return app;
}