const HTTP = require("../constants/httpStatus");
const MESSAGES = require("../constants/messages");
const ServiceRequest = require("../models/ServiceRequest");
const WorkItem = require("../models/WorkItem");

const getDashboard = async (req, res, next) => {
  try {
    if (req.user.role === "developer") {
      const devFilter = { assigneeId: req.user._id };

      const [
        totalTasks,
        pendingTasks,
        inProgressTasks,
        reviewTasks,
        completedTasks,
        recentTasks
      ] = await Promise.all([
        WorkItem.countDocuments(devFilter),
        WorkItem.countDocuments({ ...devFilter, status: "Todo" }),
        WorkItem.countDocuments({ ...devFilter, status: "In Progress" }),
        WorkItem.countDocuments({ ...devFilter, status: "Review" }),
        WorkItem.countDocuments({ ...devFilter, status: "Done" }),
        WorkItem.find(devFilter)
          .populate("requestId", "title clientName serviceType status")
          .sort({ updatedAt: -1 })
          .limit(5)
      ]);

      return res.status(HTTP.OK).json({
        success: true,
        message: MESSAGES.DASHBOARD_FETCHED,
        data: {
          role: "developer",
          workItems: {
            total: totalTasks,
            pending: pendingTasks,
            inProgress: inProgressTasks,
            inReview: reviewTasks,
            completed: completedTasks,
          },
          recentTasks,
        },
      });
    }

    const [
      totalRequests,
      approvedRequests,
      rejectedRequests,
      draftRequests,
      submittedRequests,
      underReviewRequests,

      totalWorkItems,
      pendingWorkItems,
      inProgressWorkItems,
      reviewWorkItems,
      completedWorkItems,
      recentRequests,
      workItemsByPriority,
    ] = await Promise.all([
      ServiceRequest.countDocuments(),
      ServiceRequest.countDocuments({ status: "Approved" }),
      ServiceRequest.countDocuments({ status: "Rejected" }),
      ServiceRequest.countDocuments({ status: "Draft" }),
      ServiceRequest.countDocuments({ status: "Submitted" }),
      ServiceRequest.countDocuments({ status: "Under Review" }),

      WorkItem.countDocuments(),
      WorkItem.countDocuments({ status: "Todo" }),
      WorkItem.countDocuments({ status: "In Progress" }),
      WorkItem.countDocuments({ status: "Review" }),
      WorkItem.countDocuments({ status: "Done" }),

      ServiceRequest.find()
        .populate("createdBy", "name email role avatar")
        .sort({ createdAt: -1 })
        .limit(5)
        .select("title clientName serviceType status createdAt"),

      WorkItem.aggregate([
        {
          $group: {
            _id: "$priority",
            count: { $sum: 1 },
          },
        },
      ]),
    ]);

    res.status(HTTP.OK).json({
      success: true,
      message: MESSAGES.DASHBOARD_FETCHED,
      data: {
        role: req.user.role,
        requests: {
          total: totalRequests,
          approved: approvedRequests,
          rejected: rejectedRequests,
          draft: draftRequests,
          submitted: submittedRequests,
          underReview: underReviewRequests,
        },
        workItems: {
          total: totalWorkItems,
          pending: pendingWorkItems,
          inProgress: inProgressWorkItems,
          inReview: reviewWorkItems,
          completed: completedWorkItems,
        },
        recentRequests,
        workItemsByPriority: workItemsByPriority.reduce((acc, item) => {
          acc[item._id] = item.count;
          return acc;
        }, {}),
      },
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { getDashboard };
