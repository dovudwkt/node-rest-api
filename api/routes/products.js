const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const multer = require("multer");

// Set destination and filename of uploaded file
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname);
  },
});
const fileFIlter = (req, file, cb) => {
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    cb(null, true);
  } else {
    cb(null, false);
  }
};
const upload = multer({
  storage: storage,
  fileFIlter: fileFIlter,
  limits: {
    fileSize: 1024 * 1024 * 6,
  },
});



const Product = require("../models/product");

router.get("/", (req, res, next) => {
  Product.find()
    .select("name price _id productImage") // Select only listed fields
    .exec()
    .then((data) => {
      const result = {
        count: data.length,
        products: data.map((d) => {
          return {
            name: d.name,
            price: d.price,
            _id: d._id,
            productImage: d.productImage,
            request: {
              type: "GET",
              url: "http://localhost:3000/products/" + d._id,
            },
          };
        }),
      };

      res.status(200).json(result);
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
});

router.post("/", upload.single("productImage"), (req, res, next) => {
  console.log(req.file.path);
  const product = new Product({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    price: req.body.price,
    productImage: req.file.path,
  });

  product
    .save()
    .then((result) => {
      res.status(201).json({
        message: "Product created",
        createdProduct: {
          _id: result._id,
          name: result.name,
          productImage: result.productImage,
          fullImagePath: 'http://localhost:3000/'+result.productImage,
          request: {
            type: "GET",
            url: "http://localhost:3000/products/" + result._id,
          },
        },
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
});

router.get("/:productId", (req, res, next) => {
  const id = req.params.productId;
  Product.findById(id)
    .select("name price _id productImage")
    .exec()
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
});
router.patch("/:productId", (req, res, next) => {
  const id = req.params.productId;
  const updateOps = {};
  // Assume req.body is an array of objects. This is done to update only fields present in json payload, otherwise, keep original value
  // Ex: [ {"propName": "name", "value": "Mouse rt20"}, {"propName": "price", "value": "389.98"},  ]
  for (const ops of req.body) {
    updateOps[ops.propName] = ops.value;
  }

  Product.update({ _id: id }, updateOps)
    .exec()
    .then((result) => {
      res.status(200).json({
        message: "Product updated",
        _id: id,
        request: { type: "GET", url: "http://localhost:3000/products/" + id },
      });
    })
    .catch((err) => {
      consosle.log(err);
      res.status(500).json({ error: err });
    });
});
router.delete("/:productId", (req, res, next) => {
  const id = req.params.productId;
  Product.remove({ _id: id })
    .exec()
    .then((result) => {
      res.status(200).json({ message: "Product deleted" });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err });
    });
});

module.exports = router;
