const express = require('express');
const editRoute = express.Router();
const taskModel = require('../model/TaskModel.js');
const logger = require('../logger/logger.js');

editRoute.get('/:id', async(req, res) => {
    try {
        const taskId = req.params.id;
        const taskToEdit = await taskModel.findById(taskId);

        if (!taskToEdit) {
            logger.error('Task not found')
            return res.status(404).json({ error: 'Task not found!' });
        }
        
        res.status(200).render('edit', {
            title: 'Edit Task',
            links: [{ link_name: 'Logout', url: '/logout' }],
            task: taskToEdit,
            message: {},
            req: req,
        })

    } catch (error) {
        logger.error(error);    
        res.status(500).json({ error: 'Failed to edit the task!' })
    }
});

editRoute.get('/task', async(req, res) => {
    logger.info('Task fetched successfully')
    res.render('task')
});

editRoute.post('/:id', async(req, res) => {
    try {
        const taskId = req.params.id;
        const { title, description, state } = req.body;

        const updatedTask = await taskModel.findByIdAndUpdate(
            taskId,
            { title, description, state },
            { new: true }
        );

        if (!updatedTask) {
            logger.error('Task not found')
            return res.status(404).json({ error: 'Task not found!' });
        }

        logger.info('Task updated successfully')
        res.redirect('/tasks')

    } catch (error) {
        logger.error(error);
        res.status(500).json({ error: 'Failed to update the task!' });
    }
})

module.exports = editRoute;