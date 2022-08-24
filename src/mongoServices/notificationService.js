import { notificationModel } from '../models';
const findAllQuery = async (query) => {
	let {
		search,
		_id,
		limit,
		page,
		sortField,
		sortValue,
		pagination,
		timeSlot,
		drId,
		patientId,
		email,
		populate,
	} = query;
	console.log('query', query);
	let sort = {},
		data;
	let whereClause = {};
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
			$or: [{ email: search }, { name: search }, { mobileNumber: search }],
		};
	}
	if (_id) {
		whereClause = { ...whereClause, _id };
	}
	if (email) {
		whereClause = { ...whereClause, email };
	}
	if (timeSlot) {
		whereClause = { ...whereClause, timeSlot };
	}
	if (drId) {
		whereClause = { ...whereClause, drId };
	}
	if (patientId) {
		whereClause = { ...whereClause, patientId };
	}
	if (populate) {
		data = await notificationModel
			.find(whereClause)
			.populate('patientId')
			.populate('drId')
			.populate('timeSlotId')
			.skip(page > 0 ? +limit * (+page - 1) : 0)
			.limit(+limit || 20)
			.sort(sort);
	} else {
		data = await notificationModel
			.find(whereClause)
			.skip(page > 0 ? +limit * (+page - 1) : 0)
			.limit(+limit || 20)
			.sort(sort);
	}
	const totalCount = await notificationModel.find(whereClause).countDocuments();
	return { data, totalCount };
};

export default {
	findAllQuery,
};
