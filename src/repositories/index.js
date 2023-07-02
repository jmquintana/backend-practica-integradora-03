import CartsRepository from "./carts.repository.js";
import ProductsRepository from "./products.repository.js";
import UsersRepository from "./users.repository.js";
import TicketsRepository from "./tickets.repository.js";

export const cartsRepository = new CartsRepository();
export const productsRepository = new ProductsRepository();
export const usersRepository = new UsersRepository();
export const ticketsRepository = new TicketsRepository();
