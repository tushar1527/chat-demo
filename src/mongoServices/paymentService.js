import { paymentModel } from '../models';
const findAllQuery = async (query) => {
	let {
		search,
		_id,
		limit,
		page,
		sortField,
		sortValue,
		paymentId,
		appointmentId,
	} = query;
	let sort = {};
	let whereClause = { deletedAt: null };
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
			$or: [{ displayName: search }, { path: search }],
		};
	}
	if (_id) {
		whereClause = { ...whereClause, _id };
	}
	if (paymentId) {
		whereClause = { ...whereClause, paymentId };
	}
	if (appointmentId) {
		whereClause = { ...whereClause, appointmentId };
	}
	const data = await paymentModel
		.find(whereClause)
		.skip(page > 0 ? +limit * (+page - 1) : 0)
		.limit(+limit || 20)
		.sort(sort);
	const totalCount = await paymentModel.find(whereClause).countDocuments();
	return { data, totalCount };
};

const updateOneQuery = async (filter, update, projection) => {
	let options = { new: true, fields: { ...projection } };

	const data = await paymentModel.findOneAndUpdate(filter, update, options);
	return data;
};

export default {
	findAllQuery,
	updateOneQuery,
};
