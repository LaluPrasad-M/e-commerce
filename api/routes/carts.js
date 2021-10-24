const express = require("express");
const router = express.Router();

const userController = require("../controller/carts");

router.get('/',userController.getUsers);
router.post('/',userController.postUsers);
router.get('/:id',userController.getUserDetails);
router.put('/:id',userController.updateUsers);
router.delete('/:id',userController.deleteUser);

module.exports = router;