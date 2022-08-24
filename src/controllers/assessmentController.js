const { CONSTANTS } = require('../constants');
const { assessmentModel } = require('../models');
import { assessmentService } from '../mongoServices';
import { errorLogger } from '../utils';

const {
	RESPONSE_MESSAGE: { FAILED_RESPONSE, ASSESSMENT },
	STATUS_CODE: { SUCCESS, FAILED },
} = CONSTANTS;
const setAssessment = async (req, res) => {
	try {
		const payload = {
			...req.body,
		};
		const createAssessment = new assessmentModel(payload);
		createAssessment.save();
		return res.status(SUCCESS).send({
			success: true,
			msg: ASSESSMENT.CREATE_SUCCESS,
			data: createAssessment,
		});
	} catch (error) {
		errorLogger(error.message, req.originalUrl, req.ip);
		return res.status(FAILED).json({
			success: false,
			error: error.message || FAILED_RESPONSE,
		});
	}
};
const getAssessment = async (req, res) => {
	try {
		let payload = {
			...req.query,
			populate: true,
		};
		const { data, totalCount } = await assessmentService.findAllQuery(payload);
		return res.status(SUCCESS).send({
			success: true,
			msg: ASSESSMENT.GET_SUCCESS,
			data,
			totalCount,
		});
	} catch (error) {
		errorLogger(error.message, req.originalUrl, req.ip);
		return res.status(FAILED).json({
			success: false,
			error: error.message || FAILED_RESPONSE,
		});
	}
};

module.exports = {
	setAssessment,
	getAssessment,
};
