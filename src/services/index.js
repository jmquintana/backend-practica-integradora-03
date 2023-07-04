import CartsService from "./carts.service.js";
import ProductsService from "./products.service.js";
import UsersService from "./users.service.js";
import TicketsService from "./tickets.service.js";
import { mailingService } from "./mailing.service.js";

export const cartsService = new CartsService();
export const productsService = new ProductsService();
export const usersService = new UsersService(mailingService);
export const ticketsService = new TicketsService();
