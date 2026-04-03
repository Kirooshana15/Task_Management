const AppError = require("../utils/AppError");
const HTTP = require("../constants/httpStatus");
const ERRORS = require("../constants/errorCodes");
const MESSAGES = require("../constants/messages");
const WorkItem = require("../models/WorkItem");

// GET /api/v1/work-items — Admin & Coordinator: all work items; Developer: only their assigned
const getAllWorkItems = async (req, res, next) => {
  try {
    const { status, priority, requestId, search } = req.query;

    const filter = {};

    // Developers can only see their assigned work items
    if (req.user.role === "developer") {
      filter.assigneeId = req.user._id;
    }

    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (requestId) filter.requestId = requestId;
    if (search) {
      filter.title = { $regex: search, $options: "i" };
    }

    const workItems = await WorkItem.find(filter)
      .populate("requestId", "title clientName serviceType status")
      .populate("assigneeId", "name email role avatar")
      .populate("notes.addedBy", "name role avatar")
      .select("-__v")
      .sort({ _id: -1 });

    res.status(HTTP.OK).json({
      success: true,
      message: MESSAGES.WORK_ITEM_FETCHED,
      count: workItems.length,
      data: { workItems },
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/v1/work-items/:id
const getWorkItemById = async (req, res, next) => {
  try {
    const workItem = await WorkItem.findById(req.params.id)
      .populate("requestId", "title clientName serviceType status")
      .populate("assigneeId", "name email role avatar")
      .populate("notes.addedBy", "name role avatar")
      .select("-__v");

    if (!workItem) {
      throw new AppError(
        MESSAGES.WORK_ITEM_NOT_FOUND,
        HTTP.NOT_FOUND,
        ERRORS.WORK_ITEM_NOT_FOUND
      );
    }

    // Developer can only access their own work item
    if (
      req.user.role === "developer" &&
      workItem.assigneeId._id.toString() !== req.user._id.toString()
    ) {
      throw new AppError(
        MESSAGES.FORBIDDEN,
        HTTP.FORBIDDEN,
        ERRORS.AUTH_FORBIDDEN
      );
    }

    res.status(HTTP.OK).json({
      success: true,
      message: MESSAGES.WORK_ITEM_FETCHED,
      data: { workItem },
    });
  } catch (err) {
    next(err);
  }
};

// POST /api/v1/work-items — Admin & Coordinator only
const createWorkItem = async (req, res, next) => {
  try {
    const workItem = await WorkItem.create(req.body);

    const populated = await workItem
      .populate("requestId", "title clientName serviceType status")
      .then(() =>
        WorkItem.findById(workItem._id)
          .populate("requestId", "title clientName serviceType status")
          .populate("assigneeId", "name email role avatar")
          .select("-__v")
      );

    res.status(HTTP.CREATED).json({
      success: true,
      message: MESSAGES.WORK_ITEM_CREATED,
      data: { workItem: populated },
    });
  } catch (err) {
    next(err);
  }
};

// PUT /api/v1/work-items/:id — Admin & Coordinator full update
const updateWorkItem = async (req, res, next) => {
  try {
    const workItem = await WorkItem.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    )
      .populate("requestId", "title clientName serviceType status")
      .populate("assigneeId", "name email role avatar")
      .populate("notes.addedBy", "name role avatar")
      .select("-__v");

    if (!workItem) {
      throw new AppError(
        MESSAGES.WORK_ITEM_NOT_FOUND,
        HTTP.NOT_FOUND,
        ERRORS.WORK_ITEM_NOT_FOUND
      );
    }

    res.status(HTTP.OK).json({
      success: true,
      message: MESSAGES.WORK_ITEM_UPDATED,
      data: { workItem },
    });
  } catch (err) {
    next(err);
  }
};

// PATCH /api/v1/work-items/:id/status
const updateWorkItemStatus = async (req, res, next) => {
  try {
    const workItem = await WorkItem.findById(req.params.id);

    if (!workItem) {
      throw new AppError(
        MESSAGES.WORK_ITEM_NOT_FOUND,
        HTTP.NOT_FOUND,
        ERRORS.WORK_ITEM_NOT_FOUND
      );
    }

    // Developer ownership check
    if (
      req.user.role === "developer" &&
      workItem.assigneeId.toString() !== req.user._id.toString()
    ) {
      throw new AppError(
        MESSAGES.WORK_ITEM_WRONG_OWNER,
        HTTP.FORBIDDEN,
        ERRORS.WORK_ITEM_WRONG_OWNER
      );
    }

    // Valid transitions map
    const validTransitions = {
      Todo: ["In Progress"],
      "In Progress": ["Todo", "Review"],
      Review: ["In Progress", "Done"],
      Done: ["Review"], // Allow reverting if needed
    };

    const newStatus = req.body.status;

    if (
      workItem.status !== newStatus &&
      !validTransitions[workItem.status]?.includes(newStatus)
    ) {
      throw new AppError(
        `Cannot transition work item from "${workItem.status}" to "${newStatus}".`,
        HTTP.BAD_REQUEST,
        ERRORS.VALIDATION_ERROR
      );
    }

    workItem.status = newStatus;
    await workItem.save();

    await workItem.populate("assigneeId", "name email role avatar");
    await workItem.populate("requestId", "title clientName serviceType status");

    const responseObj = workItem.toJSON();
    delete responseObj.__v;

    res.status(HTTP.OK).json({
      success: true,
      message: MESSAGES.WORK_ITEM_STATUS_UPDATED,
      data: { workItem: responseObj },
    });
  } catch (err) {
    next(err);
  }
};

// POST /api/v1/work-items/:id/notes
const addNote = async (req, res, next) => {
  try {
    const workItem = await WorkItem.findById(req.params.id);

    if (!workItem) {
      throw new AppError(
        MESSAGES.WORK_ITEM_NOT_FOUND,
        HTTP.NOT_FOUND,
        ERRORS.WORK_ITEM_NOT_FOUND
      );
    }

    // Developer ownership check
    if (
      req.user.role === "developer" &&
      workItem.assigneeId.toString() !== req.user._id.toString()
    ) {
      throw new AppError(
        MESSAGES.WORK_ITEM_WRONG_OWNER,
        HTTP.FORBIDDEN,
        ERRORS.WORK_ITEM_WRONG_OWNER
      );
    }

    workItem.notes.push({
      text: req.body.text,
      addedBy: req.user._id,
    });

    await workItem.save();
    await workItem.populate("notes.addedBy", "name role avatar");
    await workItem.populate("assigneeId", "name email role avatar");
    await workItem.populate("requestId", "title clientName serviceType status");

    const responseObj = workItem.toJSON();
    delete responseObj.__v;

    res.status(HTTP.CREATED).json({
      success: true,
      message: MESSAGES.WORK_ITEM_NOTE_ADDED,
      data: { workItem: responseObj },
    });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/v1/work-items/:id — Admin only
const deleteWorkItem = async (req, res, next) => {
  try {
    const workItem = await WorkItem.findById(req.params.id);

    if (!workItem) {
      throw new AppError(
        MESSAGES.WORK_ITEM_NOT_FOUND,
        HTTP.NOT_FOUND,
        ERRORS.WORK_ITEM_NOT_FOUND
      );
    }

    await workItem.deleteOne();

    res.status(HTTP.OK).json({
      success: true,
      message: MESSAGES.WORK_ITEM_DELETED,
      data: null,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAllWorkItems,
  getWorkItemById,
  createWorkItem,
  updateWorkItem,
  updateWorkItemStatus,
  addNote,
  deleteWorkItem,
};
