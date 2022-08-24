import { Schema, model, Types } from 'mongoose';

const sliderModel = new Schema(
	{
		sliderPath: {
			type: String,
			required: true,
		},
		image: {
			type: Array,
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
	},
	{ timestamps: true },
);

module.exports = new model('slider', sliderModel);
