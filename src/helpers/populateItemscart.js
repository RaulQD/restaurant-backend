export const populateItemscart = (cart) => {
  const items = cart.map((item) => ({
    dishId: item.dishId._id,
    image: item.dishId.images,
    title: item.dishId.name,
    price: item.dishId.originalPrice,
    quantity: item.quantity
  }))
  return items
}
