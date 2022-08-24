import { Schema, model, Types } from 'mongoose';

const feedbackModel = new Schema(
	{

		patientId: {
			type: Schema.Types.ObjectId,
			ref: 'Patient',
		},

		patientName: {
			type: String,
			trim: true,
			max: 255,
			required: true,
		},
		gender: {
			type: String,
			enum: ['MALE', 'FEMALE', 'NULL'],
			default: 'NULL',
			required: true,
		},
		age: {
			type: String,
			enum: ['below 20', '20-40', '40-60', 'above 60'],
			required: true,
		},
		contactNumber: {
			type: Number,
			required: true,
		},
		email: {
			type: String,
			trim: true,
			max: 2000,
			default: null,
			// unique: true,
		},
		location: {
			type: String,
			required: true,
		},
		easyAppointment: {
			type: String,
			enum: ['yes', 'no'],
			required: true,
		},
		rateExercise: {
			type: String,
			enum: ['excellent', 'good', 'average', 'below average', 'poor'],
			required: true,
		},
		exerciseVideo: {
			type: String,
			enum: ['yes', 'no'],
			required: true,
		},
		rateService: {
			type: String,
			enum: ['excellent', 'good', 'average', 'below average', 'poor'],
			required: true,
		},
		comment: {
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
		isEnabled: {
			type: Boolean,
			required: true,
			default: true,
		},
	},
	{ timestamps: true },
);

let autoPopulateLead = function (next) {
	this.populate('timeSlot');

	next();
};

feedbackModel.pre('findOne', autoPopulateLead).pre('find', autoPopulateLead);

module.exports = new model('feedback_details', feedbackModel);
