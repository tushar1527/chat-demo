import { Schema, model, Types } from 'mongoose';

const notificationModel = new Schema(
	{
		drId: {
			type: Types.ObjectId,
			ref: 'dr_details',
		},
		patientId: {
			type: Types.ObjectId,
			required: true,
			ref: 'customer_details',
		},
		timeSlotId: {
			type: Types.ObjectId,
			ref: 'timeSlotALL',
		},
		notificationType: {
			type: Types.ObjectId,
			ref: 'notificationType_details',
		},
		deletedAt: {
			type: Date,
			default: null,
		},
		deletedBy: {
			type: Types.ObjectId,
			default: null,
		},
		isRead: {
			type: Boolean,
			default: false,
		},
	},
	{ timestamps: true },
);

module.exports = new model('notification_details', notificationModel);
