import { appointmentModel } from '../models';

const findAllQuery = async (query) => {
	let {
		search,
		_id,
		limit,
		page,
		sortField,
		sortValue,
		scheduleAppointmentID,
		date,
		timeSlotId,
		patientId,
		populate,
	} = query;
	console.log('query', query);

	let sort = {},
		data,
		whereClause = { deletedAt: null };
	if (sortField) {
		sort = {
			[sortField]: sortValue === 'ASC' ? 1 : -1,
		};
	} else {
		sort = {
			displayName: 1,
		};
	}
	if (search) {
		search = new RegExp(search, 'ig');
		whereClause = {
			$or: [{ deviceName: search }, { deviceType: search }],
		};
	}
	if (_id) {
		whereClause = { ...whereClause, _id };
	}

	if (date) {
		whereClause = { ...whereClause, date };
	}
	if (timeSlotId) {
		whereClause = { ...whereClause, timeSlotId };
	}

	if (patientId) {
		whereClause = { ...whereClause, patientId };
	}
	if (scheduleAppointmentID) {
		whereClause = { ...whereClause, scheduleAppointmentID };
	}

	if (populate) {
		data = await appointmentModel
			.find(whereClause)
			.skip(page > 0 ? +limit * (+page - 1) : 0)
			.limit(+limit || 20)
			.sort(sort)
			.populate('patientId')
			.populate('drId')
			.populate('timeSlotId');
	} else {
		data = await appointmentModel
			.find(whereClause)
			.skip(page > 0 ? +limit * (+page - 1) : 0)
			.limit(+limit || 20)
			.sort(sort);
	}

	const totalCount = await appointmentModel.find(whereClause).countDocuments();

	return { data, totalCount };
};

const updateOneQuery = async (filter, update, projection) => {
	let options = { new: true, fields: { ...projection } };

	const data = await appointmentModel.findOneAndUpdate(filter, update, options);
	return data;
};
const deleteOneQuery = async (appointmentId) => {
	await appointmentModel.findOneAndDelete({ _id: appointmentId });
	return true;
};
export default {
	findAllQuery,
	updateOneQuery,
	deleteOneQuery,
};
