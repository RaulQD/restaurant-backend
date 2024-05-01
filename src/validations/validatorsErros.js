

const validatorsErrors = (data) => {

    const { dishesName, description, price, enable, id_category } = data;
    const errors = [];


    if (description.length > 100) {
        errors.push({ message: 'Description must be at least 100 characters', status: 400 });
    }
    if (typeof price === 'number' || price <= 0 || isNaN(price)) {
        errors.push({ message: 'Price must be a number', status: 400 });
    }
    if (!price || price.trim() === '') {
        errors.push({ message: 'Price is required', status: 400 });
    }
    //SELECCIONAR UNA CATEGORIA
    if (!id_category) {
        errors.push({ message: 'Should select a category', status: 400 });
    }
    return errors;
}
export default validatorsErrors;