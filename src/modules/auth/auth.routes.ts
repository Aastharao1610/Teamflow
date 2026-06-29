// import {Router} from "express";
// import { login, register  ,getMe , refreshToken ,logout} from "./auth.controller";
// import { authenticate } from "../../middlewares/auth.middleware";

// const router = Router();


// router.post("/register" , register)
// router.post("/login" ,login)
// router.post("/refresh-token", refreshToken);
// router.post("/logout" ,authenticate ,logout)

// router.get("/me", authenticate, getMe);



// export default router;



import { Router } from "express";

import {
  register,
  login,
  refreshToken,
  logout,
  logoutAll,
  getMe,
} from "./auth.controller";

import { authenticate } from "../../middlewares/auth.middleware";

const router = Router();

router.post("/register", register);

router.post("/login", login);

router.post("/refresh-token", refreshToken);

router.post("/logout", authenticate, logout);

router.post("/logout-all", authenticate, logoutAll);

router.get("/me", authenticate, getMe);

export default router;