import { notificationModel } from '../models';
import { CONSTANTS } from '../constants';
import { errorLogger } from '../utils';
import { notificationService } from '../mongoServices';
const {
	RESPONSE_MESSAGE: { FAILED_RESPONSE, NOTIFICATION },
	STATUS_CODE: { SUCCESS, FAILED },
} = CONSTANTS;

const getCustomerNotification = async (req, res) => {
	try {
		let drIds = req.query.drIds;
		let patientIds = req.query.patientIds;
		if (patientIds) {
			const notificationCustomerData = await notificationService.findAllQuery({
				patientId: patientIds,
				populate: true,
			});
			return res.status(SUCCESS).send({
				success: true,
				msg: NOTIFICATION.CREATE_SUCCESS,
				data: notificationCustomerData,
			});
		}
		if (drIds) {
			const notificationDrData = await notificationService.findAllQuery({
				patientId: patientIds,
				populate: true,
			});
			return res.status(SUCCESS).send({
				success: true,
				msg: NOTIFICATION.CREATE_SUCCESS,
				data: notificationDrData,
			});
		}
	} catch (error) {
		errorLogger(error.message, req.originalUrl, req.ip);
		return res.status(FAILED).json({
			success: false,
			error: error.message || FAILED_RESPONSE,
		});
	}
};

export default {
	getCustomerNotification,
};
