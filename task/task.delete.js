const express = require('express');
const deleteRoute = express.Router();
const taskModel = require('../model/TaskModel');
const logger = require('../logger/logger.js');

deleteRoute.get('/:id', async(req, res) => {
    try {
        const taskId = req.params.id;
        const taskToEdit = await taskModel.findById(taskId);

        if (!taskToEdit) {
            logger.error('Task not found')
            return res.status(404).json({ error: 'Task not found!' });
        }
        
        logger.info('Task fetched successfully')
        res.status(200).render('confirmdelete', {
            title: 'Edit Task',
            task: taskToEdit,
            message: {},
            req: req,
        })

    } catch (error) {
        logger.error(error);
        res.status(500).json({ error: 'Failed to edit the task!' })
    }
});

deleteRoute.post('/:id', async (req, res) => {
    try {
        const taskId = req.params.id;
        const taskToDelete = await taskModel.findById(taskId);

        if (!taskToDelete) {
            logger.error('Task not found')
            return res.status(404).json({ error: 'Task not found!' })
        }

        await taskModel.findByIdAndDelete(taskId);
        logger.info('Task deleted successfully')
        res.redirect('/tasks')

    } catch (error) {
        logger.error(error);
        res.status(500).json({ error: 'Failed to delete the task!' })
    }
})

module.exports = deleteRoute;