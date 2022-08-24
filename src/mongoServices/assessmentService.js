import { assessmentModel } from '../models';

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

		patientId,
		populate,
	} = query;
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

	if (patientId) {
		whereClause = { ...whereClause, patientId };
	}
	if (scheduleAppointmentID) {
		whereClause = { ...whereClause, scheduleAppointmentID };
	}

	if (populate) {
		data = await assessmentModel
			.find(whereClause)
			.skip(page > 0 ? +limit * (+page - 1) : 0)
			.limit(+limit || 20)
			.sort(sort)
			.populate('patientId')
			.populate('drId')
			.populate('timeSlotId');
	} else {
		data = await assessmentModel
			.find(whereClause)
			.skip(page > 0 ? +limit * (+page - 1) : 0)
			.limit(+limit || 20)
			.sort(sort);
	}

	const totalCount = await assessmentModel.find(whereClause).countDocuments();

	return { data, totalCount };
};

export default {
	findAllQuery,
};
