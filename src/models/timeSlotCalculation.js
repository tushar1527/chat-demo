import { Schema, model } from 'mongoose';
const faqsSchema = new Schema(
	{
		totalTimeSlot: {
			type: Number,
		},
		ScheduleTimeSlot: {
			type: String,
		},
		date: {
			type: Date,
		},
	},
	{ timestamps: true },
);
module.exports = new model('Faqs', faqsSchema);
