import mongoose from "mongoose";

const ticketCollection = "tickets";

const ticketSchema = new mongoose.Schema(
	{
		code: {
			type: String,
			required: true,
			unique: true,
		},
		createdAt: {
			type: Date,
			required: true,
		},
		amount: {
			type: Number,
			required: true,
		},
		purchaser: {
			type: String,
			required: true,
		},
	},
	{
		versionKey: false,
	}
);

export const ticketsModel = mongoose.model(ticketCollection, ticketSchema);
