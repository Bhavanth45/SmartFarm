const Task = require('../models/Task');
const { isAtlasConnected } = require('../config/db');
const dataStore = require('../services/dataStore');

// @desc    Get all tasks
// @route   GET /api/tasks
exports.getTasks = async (req, res, next) => {
  try {
    const userId = req.user._id || req.user.id;
    const { fieldId } = req.query;

    if (isAtlasConnected()) {
      try {
        const query = { userId };
        if (fieldId) query.fieldId = fieldId;
        const tasks = await Task.find(query).sort({ done: 1, createdAt: -1 });
        return res.json({ success: true, storageMode: 'MONGODB_ATLAS', data: tasks });
      } catch (atlasErr) {
        console.warn('[Tasks] Atlas read failed, checking local store:', atlasErr.message);
      }
    }

    const localTasks = dataStore.getTasks(userId, fieldId);
    res.json({ success: true, storageMode: 'LOCAL_PERSISTENT_STORE', data: localTasks });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new task
// @route   POST /api/tasks
exports.createTask = async (req, res, next) => {
  try {
    const userId = req.user._id || req.user.id;
    const { text, time, priority, fieldId } = req.body;

    if (isAtlasConnected()) {
      try {
        const task = await Task.create({
          userId,
          fieldId: fieldId || null,
          text,
          time: time || 'Today',
          priority: priority || 'Normal'
        });

        // Mirror to local store
        dataStore.createTask(userId, req.body);

        return res.status(201).json({ success: true, storageMode: 'MONGODB_ATLAS', data: task });
      } catch (atlasErr) {
        console.warn('[Tasks] Atlas create failed, using local store:', atlasErr.message);
      }
    }

    const localTask = dataStore.createTask(userId, req.body);
    res.status(201).json({ success: true, storageMode: 'LOCAL_PERSISTENT_STORE', data: localTask });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle task status
// @route   PATCH /api/tasks/:id/toggle
exports.toggleTask = async (req, res, next) => {
  try {
    const userId = req.user._id || req.user.id;
    const taskId = req.params.id;

    if (isAtlasConnected()) {
      try {
        const task = await Task.findOne({ _id: taskId, userId });
        if (task) {
          task.done = !task.done;
          task.completedAt = task.done ? new Date() : null;
          await task.save();

          dataStore.toggleTask(taskId, userId);
          return res.json({ success: true, storageMode: 'MONGODB_ATLAS', data: task });
        }
      } catch (atlasErr) {
        console.warn('[Tasks] Atlas toggle failed, using local store:', atlasErr.message);
      }
    }

    const localTask = dataStore.toggleTask(taskId, userId);
    if (!localTask) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    res.json({ success: true, storageMode: 'LOCAL_PERSISTENT_STORE', data: localTask });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a task
// @route   DELETE /api/tasks/:id
exports.deleteTask = async (req, res, next) => {
  try {
    const userId = req.user._id || req.user.id;
    const taskId = req.params.id;

    if (isAtlasConnected()) {
      try {
        await Task.findOneAndDelete({ _id: taskId, userId });
      } catch (err) {}
    }

    dataStore.deleteTask(taskId, userId);
    res.json({ success: true, message: 'Task deleted successfully' });
  } catch (error) {
    next(error);
  }
};
