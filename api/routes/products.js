const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
    res.status(200).json({
        message: 'Handling GET requests to /products'
    });
});
router.post('/', (req, res, next) => {
    const product = {
        name: req.body.name,
        quantity: req.body.quantity
    }
    res.status(201).json({
        message: 'Handling POST requests to /products',
        createdProduct: product
    });
});


router.get('/:productId', (req, res, next) => {
    const id = req.params.productId;
    res.status(201).json({
        message: `Handling GET requests to /products/${id}`,
        id: id
    });
});
router.post('/:prductId', (req, res, next) => {
    const id = req.params.productId;
    res.status(200).json({
        message: `Handling POST requests to /products/${id}`,
    });
});
router.delete('/:productId', (req, res, next) => {
    const id = req.params.productId;
    res.status(200).json({
        message: `Handling DELETE requests to /products/${id}`,
    });
});


module.exports = router;