import { feedbackModel } from '../models';
import { CONSTANTS } from '../constants';
import { errorLogger } from '../utils';
import { feedbackService } from '../mongoServices';
const {
	RESPONSE_MESSAGE: { FEEDBACK, FAILED_RESPONSE },
	STATUS_CODE: { SUCCESS, FAILED },
} = CONSTANTS;
const setFeedback = async (req, res) => {
	try {
		const currentUserId = req.currentUser._id;
		const { body } = req;
		let payload = {
			...body,
			patientId: currentUserId,
		};
		const feedback = new feedbackModel(payload);

		const data = await feedback.save();
		if (data) {
			res.status(SUCCESS).json({
				status: true,
				msg: FEEDBACK.CREATE_SUCCESS,
				data: [],
			});
		} else {
			throw new Error(FEEDBACK.CREATE_FAILED);
		}
	} catch (error) {
		errorLogger(error);
		res.status(FAILED).json({
			status: false,
			error: error.message || FEEDBACK.CREATE_FAILED,
		});
	}
};

const getFeedback = async (req, res) => {
	try {
		const { data, totalCount } = await feedbackService.findAllQuery(req.query);
		if (data) {
			res.status(SUCCESS).json({
				status: true,
				msg: FEEDBACK.GET_SUCCESS,
				data: data,
				totalCount,
			});
		}
	} catch (error) {
		errorLogger(error);
		res.status(FAILED).json({
			status: false,
			error: error.message || FEEDBACK.GET_FAILED,
		});
	}
};

const updateFeedback = async (req, res) => {
	try {
		const { id } = req.params,
			filter = { _id: id };
		const { data } = await feedbackService.findAllQuery(filter);
		if (data) {
			let payload = {
				...req.body,
			};

			const response = feedbackService.updateOneQuery(filter, payload);
			if (response) {
				res.status(SUCCESS).json({
					success: true,
					message: FEEDBACK.UPDATE_SUCCESS,
					data: [],
				});
			} else {
				throw new Error(FEEDBACK.UPDATE_FAILED);
			}
		} else {
			throw new Error(FEEDBACK.UPDATE_FAILED);
		}
	} catch (error) {
		errorLogger(error.message, req.originalUrl, req.ip);
		res.status(FAILED).json({
			success: false,
			error: error.message || FAILED_RESPONSE,
		});
	}
};

const deleteFeedback = async (req, res) => {
	try {
		const filter = { _id: req.params.id };
		const update = {
			isDeleted: true,
			deletedBy: req.currentUser._id,
			deletedAt: Date.now(),
			isEnabled: false,
		};
		const projection = {};
		const deleteData = await feedbackService.updateOneQuery(
			filter,
			update,
			projection,
		);
		if (deleteData) {
			res.status(SUCCESS).json({
				status: true,
				msg: FEEDBACK.DELETE_SUCCESS,
				data: [],
			});
		} else {
			throw new Error(FEEDBACK.DELETE_FAILED);
		}
	} catch (error) {
		errorLogger(error.message, req.originalUrl, req.ip);
		res.status(FAILED).json({
			success: false,
			error: error.message || FAILED_RESPONSE,
		});
	}
};

export default {
	setFeedback,
	getFeedback,
	updateFeedback,
	deleteFeedback,
};
