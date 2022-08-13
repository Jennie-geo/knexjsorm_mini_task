import express from "express";
import { authlogin } from "../auth/authlogin";
const router = express.Router();

import {
  createUser,
  loginUser,
  // addMoneyToAcct,
  // sendMoneyToAnotherAccount,
  // withdrawAmount
} from "../controllers/user";

router.post("/account/createa-acct", createUser);
router.post("/account/login", loginUser);
// router.post('/account/credit-user-account',authlogin, addMoneyToAcct);
// router.post('/account/cash-transfer',authlogin, sendMoneyToAnotherAccount);
// router.post('/account/cash-withdraw',authlogin, withdrawAmount);

export default router;
