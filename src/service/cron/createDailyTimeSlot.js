import moment from 'moment';
import cron from 'node-cron';
import { monthlyTimeSlotModel } from '../../models';
import { drService, scheduleAppointmentService } from '../../mongoServices';
require('dotenv').config({ path: 'src/config/.env' });

const data = cron.schedule('0 1 * * *', async () => {
	console.log('cron');
	try {
		let days = Number(process.env.DAYS);
		let newDate = moment().add(days, 'days');
		console.log('newDate', newDate);
		let filterDate = {
			date: {
				$gte: moment(newDate).startOf('day').toISOString(),
				$lte: moment(newDate).endOf('day').toISOString(),
			},
		};
		let getNewDateTimeSlots = await monthlyTimeSlotModel.find(filterDate);
		if (getNewDateTimeSlots.length === 0) {
			const { data: dr } = await drService.findAllQuery({});
			for (let i = 0; i < 1; i++) {
				for (const element of dr) {
					for (const slot of element.timeSlot) {
						const startDate = moment(newDate)
							.add(i, 'days')
							.startOf('day')
							.toISOString();
						const endDate = moment(newDate)
							.add(i, 'days')
							.endOf('day')
							.toISOString();
						let filter = {
							drId: element._id,
							date: { $gte: startDate, $lte: endDate },
							timeSlotId: slot._id,
						};
						const { data: appointment } =
							await scheduleAppointmentService.findAllQuery(filter);
						if (appointment.length === 0) {
							let payload = {
								drId: element._id,
								timeSlotId: slot._id,
								date: moment(startDate).add(8, 'hours').toISOString(),
							};
							let createTimeSlot = new monthlyTimeSlotModel(payload);
							await createTimeSlot.save();
						}
					}
				}
			}
			//     // const { data: dr } = await drService.findAllQuery({});
		} else {
			throw new Error('Data is available');
		}
		return true;
	} catch (err) {
		return false;
	}
});

export default data;
