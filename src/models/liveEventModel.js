import { Schema, model, Types } from 'mongoose';
const liveEvent = new Schema(
	{
		eventName: {
			type: String,
		},
		date: {
			type: Date,
		},
		shortDescription: {
			type: String,
		},
		link: {
			type: String,
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

module.exports = new model('liveEvent', liveEvent);
