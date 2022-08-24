import { Schema, model, Types } from 'mongoose';
const assessment = new Schema(
	{
		name: {
			type: String,
			required: true,
		},
		number: {
			type: Number,
			required: true,
		},
		email: {
			type: String,
			required: true,
		},
		drId: {
			type: Types.ObjectId,
			ref: 'dr_details',
		},
		doctorNumber: {
			type: Number,
			required: true,
		},
		statement: {
			type: String,
			required: true,
		},
		deletedAt: {
			type: Date,
			default: null,
		},
		deletedBy: {
			type: Types.ObjectId,
			default: null,
		},
		isDeleted: {
			type: Boolean,
			default: false,
		},
	},
	{ timestamps: true },
);

module.exports = new model('assessment', assessment);
