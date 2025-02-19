import express from "express";
import getUserProfile from "../controllers/user/getUserProfile.js";
import checkAuth from "../middleware/checkAuthMiddleware.js";
import updateUserProfile from "../controllers/user/updateUserProfile.js";
import deleteMyAccount from "../controllers/user/deleteMyAccount.js";
import getAllUserAccount from "../controllers/user/getAllUserAccount.js";
import role from "../middleware/roleMiddleware.js";
import deleteUserAccount from "../controllers/user/deleteUserAccount.js";
import deactivateUser from "../controllers/user/deactivateUser.js";

const router = express.Router();

router
  .route("/profile")
  .get(checkAuth, getUserProfile)
  .patch(checkAuth, updateUserProfile)
  .delete(checkAuth, deleteMyAccount);

router
  .route("/all")
  .get(checkAuth, role.checkRole(role.ROLES.Admin), getAllUserAccount);

router
  .route("/:id")
  .delete(checkAuth, role.checkRole(role.ROLES.Admin), deleteUserAccount);

router
  .route("/:id/deactivate")
  .patch(checkAuth, role.checkRole(role.ROLES.Admin), deactivateUser);

export default router;
