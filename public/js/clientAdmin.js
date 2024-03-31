const deleteProduct = async btn => {
	try {
		const productId =
			btn.parentNode.querySelector('[name=productId]').value;
		const csrf = btn.parentNode.querySelector('[name=CSRFToken]').value;
    const productElement = btn.closest('article')

		const result = await fetch(`/admin/product/${productId}`, {
			method: 'DELETE',
			headers: {
				'x-csrf-token': csrf
			}
		});
    const data = result.json()
    console.log(data)
    productElement.remove()
	} catch (error) {
		console.log(error);
	}
};
