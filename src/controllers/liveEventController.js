import { liveEventModel } from '../models';
import { liveEventService } from '../mongoServices';
import { CONSTANTS } from '../constants';
import { errorLogger } from '../utils';

const {
	RESPONSE_MESSAGE: { LIVEEVENT, FAILED_RESPONSE },
	STATUS_CODE: { SUCCESS, FAILED },
} = CONSTANTS;
const createLiveEvent = async (req, res) => {
	try {
		let payload = {
			...req.body,
		};
		const Model = new liveEventModel(payload);
		const saveResponse = await Model.save();
		if (saveResponse) {
			res.status(SUCCESS).json({
				success: true,
				message: LIVEEVENT.CREATE_SUCCESS,
				data: [],
			});
		}
	} catch (error) {
		errorLogger(error.message, req.originalUrl, req.ip);
		res.status(FAILED).json({
			success: false,
			error: error.message || FAILED_RESPONSE,
		});
	}
};
const getLiveEvent = async (req, res) => {
	try {
		let { data, totalCount } = await liveEventService.findAllQuery(req.query);
		if (data) {
			res.status(SUCCESS).json({
				success: true,
				message: LIVEEVENT.GET_SUCCESS,
				data,
				totalCount,
			});
		} else {
			throw new Error(LIVEEVENT.GET_FAILED);
		}
	} catch (error) {
		errorLogger(error.message, req.originalUrl, req.ip);

		res.status(FAILED).json({
			success: false,
			error: error.message || FAILED_RESPONSE,
		});
	}
};

const deleteLiveEvent = async (req, res) => {
	try {
		const { id } = req.params;
		let filter = { _id: id },
			updateData = {
				isEnabledL: false,
				deletedAt: new Date(),
				deletedBy: req.currentUser._id,
			};
		const response = await liveEventService.updateOneQuery(filter, updateData);
		if (response) {
			res.status(SUCCESS).json({
				success: true,
				message: LIVEEVENT.DELETE_SUCCESS,
				data: [],
			});
		} else {
			throw new Error(LIVEEVENT.DELETE_FAILED);
		}
	} catch (error) {
		errorLogger(error.message, req.originalUrl, req.ip);
		res.status(FAILED).json({
			success: false,
			error: error.message || FAILED_RESPONSE,
		});
	}
};

const updateLiveEvent = async (req, res) => {
	try {
		const { id } = req.params,
			filter = { _id: id };

		const { data } = await liveEventService.findAllQuery(filter);
		if (data) {
			let payload = {
				...req.body,
			};

			const response = liveEventService.updateOneQuery(filter, payload);
			if (response) {
				res.status(SUCCESS).json({
					success: true,
					message: LIVEEVENT.UPDATE_SUCCESS,
					data: [],
				});
			} else {
				throw new Error(LIVEEVENT.UPDATE_FAILED);
			}
		} else {
			throw new Error(LIVEEVENT.NOT_AVAILABLE);
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
	createLiveEvent,
	getLiveEvent,
	deleteLiveEvent,
	updateLiveEvent,
};
