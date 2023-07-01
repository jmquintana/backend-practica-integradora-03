export const generateProductErrorInfo = (product) => {
	return `One or more properties were incomplete or not valid.
    List of required properties:
    * title: needs to be a String, recieved ${product.title}
    * description: needs to be a String, recieved ${product.description}
    * category: needs to be a String, recieved ${product.category}
    * code: needs to be a String, recieved ${product.code}
    * price: needs to be a Float Number, recieved ${product.price}
    * stock: needs to be an Integer Number, recieved ${product.stock}
    * stock: needs to be a String, recieved ${product.stock}
    `;
};
