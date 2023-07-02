import CartsService from "./carts.service.js";
import ProductsService from "./products.service.js";
import UsersService from "./users.service.js";
import TicketsService from "./tickets.service.js";

export const cartsService = new CartsService();
export const productsService = new ProductsService();
export const usersService = new UsersService();
export const ticketsService = new TicketsService();
