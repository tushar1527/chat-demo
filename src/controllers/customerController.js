import { CONSTANTS } from '../constants';
import { errorLogger } from '../utils';
import { appointmentService, CustomerService } from '../mongoServices';
const {
	RESPONSE_MESSAGE: { FAILED_RESPONSE, CUSTOMER_MESSAGE },
	STATUS_CODE: { SUCCESS, FAILED },
} = CONSTANTS;
const ListCustomer = async (req, res) => {
	try {
		const { data, totalCount } = await CustomerService.findAllQuery(req.query);
		if (data) {
			return res.status(SUCCESS).send({
				success: true,
				msg: CUSTOMER_MESSAGE.GET_SUCCESS,
				data,
				totalCount,
			});
		} else {
			throw new Error(CUSTOMER_MESSAGE.GET_FAILED);
		}
	} catch (error) {
		errorLogger(error.message, req.originalUrl, req.ip);
		return res.status(FAILED).json({
			success: false,
			error: error.message || FAILED_RESPONSE,
		});
	}
};
const updateCustomer = async (req, res) => {
	try {
		const { id } = req.params;

		let filter = { _id: id },
			updateData = {
				...req.body,
				isFirstTime: false,
			};
		const updateCustomerData = await CustomerService.updateCustomer(
			filter,
			updateData,
		);
		if (updateCustomerData) {
			return res.status(SUCCESS).send({
				success: true,
				msg: CUSTOMER_MESSAGE.UPDATE_SUCCESS,
				data: [],
			});
		} else {
			throw new Error(CUSTOMER_MESSAGE.UPDATE_FAILED);
		}
	} catch (error) {
		errorLogger(error.message, req.originalUrl, req.ip);
		return res.status(FAILED).json({
			success: false,
			error: error.message || FAILED_RESPONSE,
		});
	}
};
const deleteCustomer = async (req, res) => {
	try {
		const { id } = req.params;
		let filter = { _id: id },
			updateData = {
				isEnabledL: false,
				deletedAt: new Date(),
				deletedBy: req.currentUser._Id,
			};
		const deleteCustomerData = await CustomerService.updateCustomer(
			filter,
			updateData,
		);
		if (deleteCustomerData) {
			return res.status(SUCCESS).send({
				success: true,
				msg: CUSTOMER_MESSAGE.DELETE_SUCCESS,
				data: [],
			});
		} else {
			throw new Error(CUSTOMER_MESSAGE.DELETE_FAILED);
		}
	} catch (error) {
		errorLogger(error.message, req.originalUrl, req.ip);
		return res.status(FAILED).json({
			success: false,
			error: error.message || FAILED_RESPONSE,
		});
	}
};
const socialLogin = async (req, res) => {
	try {
		let { token, type } = req.body;
		let decodedToken = jwt_decode(token);
		let { email } = decodedToken;
		if (type === CONSTANTS.USER_TYPE.CUSTOMER) {
			let { data: customer } = await CustomerService.findAllQuery({ email });
			if (customer.length === 1) {
				let tokenData = jwtGenerate(customer[0]._id, type);
				return res.status(SUCCESS).send({
					success: true,
					msg: CUSTOMER_MESSAGE.CREATE_SUCCESS,
					data: customer[0],
					token: tokenData,
				});
			} else {
				const { hashedPassword, salt } = await hashPassword(process.env.PASS);
				let payload = {
					email: decodedToken.email,
					name: decodedToken.name,
					loginType: 'SOCIAL',
					isEnabled: true,
					password: hashedPassword,
					salt: salt,
				};
				let saveData = new customerModel(payload);
				let data = await saveData.save();
				let tokenData = jwtGenerate(data._id, type);
				return res.status(SUCCESS).send({
					success: true,
					msg: CUSTOMER_MESSAGE.CREATE_SUCCESS,
					data,
					token: tokenData,
				});
			}
		} else {
			let { data: drFind } = await drService.findAllQuery({ email });
			if (drFind.length === 1) {
				let tokenData = jwtGenerate(drFind[0]._id, type);
				return res.status(SUCCESS).send({
					success: true,
					msg: CUSTOMER_MESSAGE.CREATE_SUCCESS,
					data: drFind[0],
					token: tokenData,
				});
			} else {
				const { hashedPassword, salt } = await hashPassword(process.env.PASS);
				let payload = {
					email: decodedToken.email,
					name: decodedToken.name,
					loginType: 'SOCIAL',
					isEnabled: true,
					password: hashedPassword,
					salt: salt,
				};
				let saveData = new drModel(payload);
				let data = await saveData.save();
				let tokenData = jwtGenerate(data._id, type);
				return res.status(SUCCESS).send({
					success: true,
					msg: DR_USER.CREATE_SUCCESS,
					data,
					token: tokenData,
				});
			}
		}
	} catch (error) {
		errorLogger(error.message, req.originalUrl, req.ip);
		return res.status(FAILED).json({
			success: false,
			error: error.message || FAILED_RESPONSE,
		});
	}
};
const getCustomerAppointment = async (req, res) => {
	try {
		console.log('req.query', req.query);
		const payload = {
			...req.query,
			populate: true,
		};
		const { data, totalCount } = await appointmentService.findAllQuery(payload);
		if (data) {
			return res.status(SUCCESS).send({
				success: true,
				msg: CUSTOMER_MESSAGE.GET_SUCCESS,
				data,
				totalCount,
			});
		} else {
			throw new Error(CUSTOMER_MESSAGE.GET_FAILED);
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
	ListCustomer,
	updateCustomer,
	deleteCustomer,
	socialLogin,
	getCustomerAppointment,
};
