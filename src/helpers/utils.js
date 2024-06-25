//OBTENER EL RESULTADO CON EL OBJETO DESEADO
export const resultToObjectWish = (dish) => {
    return {
        id_dish: dish.id_dish,
        dishes_name: dish.dishes_name,
        description: dish.description,
        price: dish.price,
        image_url: dish.image_url,
        available: dish.available,
        created_at: dish.created_at,
        category: {
            id_category: dish.id_category,
            category_name: dish.category_name
        }
    }
}
