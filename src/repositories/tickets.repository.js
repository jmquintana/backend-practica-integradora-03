import { ticketsModel } from "../models/tickets.model.js";
import { ObjectId } from "mongodb";

export default class TicketsRepository {
	constructor() {}

	getTickets = async () => {
		try {
			const tickets = await ticketsModel.find();
			return tickets;
		} catch (error) {
			console.log(error);
			return error;
		}
	};

	addTicket = async (ticket) => {
		try {
			const createdTicket = ticketsModel.create(ticket);
			return createdTicket;
		} catch (error) {
			console.log(error);
			return error;
		}
	};

	getTicketById = async (ticketId) => {
		try {
			const ticket = await ticketsModel
				.findOne({ _id: new ObjectId(ticketId) })
				.lean();
			return ticket;
		} catch (error) {
			console.log(error);
			return error;
		}
	};
}
