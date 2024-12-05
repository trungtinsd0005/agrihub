const express = require("express");
const router = express.Router();
const userController = require("../controllers/UserController");
// const { authMiddleWare, authUserMiddleWare } = require('../middleware/authMiddleWare');

router.post("/sign-up", userController.createUser);
router.post("/create", userController.createNewUser);
router.post("/sign-in", userController.loginUser);
router.put("/update-user/:id", userController.updateUser);
router.delete("/delete-user/:id", userController.deleteUser);
router.get("/getAllUser", userController.getAllUser);
router.get("/get-details/:id", userController.getDetailsUser);
router.get("/get-vouchers/:userId", userController.getUserVouchers);
router.post("/refresh-token", userController.refreshToken);

module.exports = router;
