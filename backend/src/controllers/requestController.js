const AppError = require("../utils/AppError");
const HTTP = require("../constants/httpStatus");
const ERRORS = require("../constants/errorCodes");
const MESSAGES = require("../constants/messages");
const ServiceRequest = require("../models/ServiceRequest");

// GET /api/v1/requests — Admin & Coordinator: get all requests
const getAllRequests = async (req, res, next) => {
  try {
    const { status, serviceType, search } = req.query;

    const filter = {};
    if (status) filter.status = status;
    if (serviceType) filter.serviceType = serviceType;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { clientName: { $regex: search, $options: "i" } },
      ];
    }

    const requests = await ServiceRequest.find(filter)
      .populate("createdBy", "name email role avatar")
      .select("-__v")
      .sort({ _id: -1 });

    res.status(HTTP.OK).json({
      success: true,
      message: MESSAGES.REQUEST_FETCHED,
      count: requests.length,
      data: { requests },
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/v1/requests/:id — Get single request by ID
const getRequestById = async (req, res, next) => {
  try {
    const request = await ServiceRequest.findById(req.params.id)
      .populate("createdBy", "name email role avatar")
      .populate("workItems"); // Virtual field

    if (!request) {
      throw new AppError(
        MESSAGES.REQUEST_NOT_FOUND,
        HTTP.NOT_FOUND,
        ERRORS.REQUEST_NOT_FOUND
      );
    }

    res.status(HTTP.OK).json({
      success: true,
      message: MESSAGES.REQUEST_FETCHED,
      data: { request },
    });
  } catch (err) {
    next(err);
  }
};

// POST /api/v1/requests — Create a new service request
const createRequest = async (req, res, next) => {
  try {
    const request = await ServiceRequest.create({
      ...req.body,
      createdBy: req.user._id,
    });

    const populated = await request.populate("createdBy", "name email role avatar");

    res.status(HTTP.CREATED).json({
      success: true,
      message: MESSAGES.REQUEST_CREATED,
      data: { request: populated },
    });
  } catch (err) {
    next(err);
  }
};

// PUT /api/v1/requests/:id — Update request fields (Admin & Coordinator)
const updateRequest = async (req, res, next) => {
  try {
    const request = await ServiceRequest.findById(req.params.id);

    if (!request) {
      throw new AppError(
        MESSAGES.REQUEST_NOT_FOUND,
        HTTP.NOT_FOUND,
        ERRORS.REQUEST_NOT_FOUND
      );
    }

    // Prevent editing Approved/Rejected requests (reviewNote excepted)
    const lockedStatuses = ["Approved", "Rejected"];
    if (lockedStatuses.includes(request.status)) {
      throw new AppError(
        "Cannot edit a request that has been Approved or Rejected.",
        HTTP.BAD_REQUEST,
        ERRORS.REQUEST_INVALID_STATUS
      );
    }

    const updated = await ServiceRequest.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    ).populate("createdBy", "name email role avatar");

    res.status(HTTP.OK).json({
      success: true,
      message: MESSAGES.REQUEST_UPDATED,
      data: { request: updated },
    });
  } catch (err) {
    next(err);
  }
};

// PATCH /api/v1/requests/:id/status — Change status (Admin & Coordinator)
const updateRequestStatus = async (req, res, next) => {
  try {
    const { status, reviewNote } = req.body;

    const request = await ServiceRequest.findById(req.params.id);
    if (!request) {
      throw new AppError(
        MESSAGES.REQUEST_NOT_FOUND,
        HTTP.NOT_FOUND,
        ERRORS.REQUEST_NOT_FOUND
      );
    }

    // Valid transitions map
    const validTransitions = {
      Draft: ["Submitted"],
      Submitted: ["Under Review", "Rejected"],
      "Under Review": ["Approved", "Rejected"],
      Approved: [], // Terminal state
      Rejected: ["Submitted"], // Allow re-submission
    };

    if (!validTransitions[request.status]?.includes(status)) {
      throw new AppError(
        `Cannot transition from "${request.status}" to "${status}".`,
        HTTP.BAD_REQUEST,
        ERRORS.REQUEST_INVALID_STATUS
      );
    }

    request.status = status;
    if (reviewNote !== undefined) request.reviewNote = reviewNote;
    await request.save();

    await request.populate("createdBy", "name email role avatar");

    res.status(HTTP.OK).json({
      success: true,
      message: MESSAGES.REQUEST_STATUS_UPDATED,
      data: { request },
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAllRequests,
  getRequestById,
  createRequest,
  updateRequest,
  updateRequestStatus,
};
