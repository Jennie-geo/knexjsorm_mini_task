import { Request, Response, NextFunction } from "express";
import db from "../database/db";
import jwt, { JwtPayload } from "jsonwebtoken";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import { CustomRequest } from "../middleware/authlogin copy";
require("dotenv").config();

const userDetail = {
  id: "",
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  account_number: "",
  balance: 0,
  created_at: "",
  updated_at: "",
};

export async function createUser(req: Request, res: Response) {
  try {
    const accountNum = Math.floor(100000 + Math.random() * 90000000000);
    const hashPasswd = await bcrypt.hash(req.body.password, 8);
    const user = await db("users").insert({
      id: uuidv4(),
      first_name: req.body.firstName,
      last_name: req.body.lastName,
      email: req.body.email,
      password: hashPasswd,
      account_number: accountNum,
    });
    return res
      .status(200)
      .json({ success: true, message: "User signup successfully", data: user });
  } catch (error: any) {
    return res
      .status(500)
      .json({ success: false, errorMessage: error.message });
  }
}

export async function loginUser(req: Request, res: Response) {
  try {
    const user = await db.from("users").where({ email: req.body.email });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, errorMessage: "No email found", data: [] });
    }
    user.forEach((data) => {
      userDetail.id = data.id;
      userDetail.firstName = data.first_name;
      userDetail.lastName = data.last_name;
      userDetail.email = data.email;
      userDetail.password = data.password;
      userDetail.account_number = data.account_number;
      userDetail.balance = data.balance;
      userDetail.created_at = data.created_at;
      userDetail.updated_at = data.updated_at;
    });
    const matchPasswd = await bcrypt.compare(
      req.body.password,
      userDetail.password
    );
    if (!matchPasswd) {
      return res
        .status(400)
        .json({ success: false, errorMessage: "Password does not match" });
    } else {
      const token = jwt.sign(
        { userId: userDetail.id },
        process.env.JWT_SECRET as string,
        {
          expiresIn: "365d",
        }
      );
      res.setHeader("Authorization", token);
      return res.status(200).json({
        success: true,
        message: "Auth successful",
        token: token,
      });
    }
  } catch (error: any) {
    console.log("ERROR", error);
    return res
      .status(500)
      .json({ success: false, errorMessage: error.message });
  }
}

// export async function loginUser(req: Request, res: Response) {
//     try {
//       const user = db.select("email").from('users').where("email", req.body.email);
//       if (!user) {
//         return res
//           .status(400)
//           .json({ success: false, errorMessage: "No email found", data: [] });
//       }
//       const matchPasswd = await bcrypt.compare(req.body.password, user.password);
//       if (!matchPasswd) {
//         return res
//           .status(400)
//           .json({ success: false, errorMessage: "Password does not match" });
//       } else {
//         const token = jwt.sign(
//           { userId: user.id },
//           process.env.JWT_SECRET as string,
//           {
//             expiresIn: "365d",
//           }
//         );
//         //res.cookie('Authorization', token, { httpOnly: true });
//         res.setHeader("Authorization", token);
//         return res.status(200).json({
//           success: true,
//           message: "Auth successful",
//           token: token,
//         });
//       }
//     } catch (error: any) {
//       return res
//         .status(500)
//         .json({ success: false, errorMessage: error.message });
//     }
//   }

export async function addMoneyToAcct(req: CustomRequest, res: Response) {
  try {
    console.log(">>>>userinfo");
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorize." });
    }
    const user = req.user;
    console.log(">>>>userinfo", user);
    const { amountToSend, accountNumber } = req.body;
    const userInfo = await db("users").first({
      id: user.id,
      account_number: accountNumber,
    });
    if (!userInfo) {
      return res
        .status(400)
        .json({ success: false, errorMessage: "User account doesn't exist" });
    }
    console.log(">>>>userinfo", userInfo);
    const sendMoney = await db("accounts").insert({
      amount: amountToSend,
      senderId: user.id,
      balance: userInfo.balance + amountToSend,
      account_number: userInfo.account_number,
    });
    await db("users").update({
      id: user.id,
      balance: userInfo.balance + amountToSend,
    });

    return res.status(200).json({
      success: true,
      message: `An amount of ${amountToSend} has been sent successfully`,
      data: sendMoney,
    });
  } catch (error: any) {
    return res
      .status(500)
      .json({ success: false, errorMessage: error.message });
  }
}

// export async function addMoneyToAcct(req: Request, res: Response) {
//     try {
//       const user = await db('users').select().where(req.user);
//       if(!user) {
//           return res.send('No user found')
//       }
//       const {amountToSend, accountNumber} = req.body;

//       const userInfo = await db('users').where({'id': user.id, 'account_number': accountNumber });
//       if(!userInfo) {
//           return res.status(400).json({success: false, errorMessage: "User account doesn't exist"})
//       }
//       console.log('>>>>userinfo', userInfo)
//       const sendMoney = await db('users').insert(
//           {
//             amount: amountToSend,
//             senderId: user.id,
//             balance:   userInfo.balance + amountToSend,
//             sender_name: `${user.first_name} ${user.last_name}`,
//             account_number: userInfo.account_number
//         });
//         return res.status(200).json({ success: true, message: `An amount of ${amountToSend} has been sent successfully`, data: sendMoney })
//     }catch(error: any) {
//         return res
//       .status(500)
//       .json({ success: false, errorMessage: error.message });
//     }
// }

// export async function sendMoneyToAnotherAccount(req: Request, res: Response) {
//     try {
//       const user = await db('users').where('id', req.user);
//       if(!user) {
//           return res.send('No user found')
//       }
//       const {amountToSend, accountNumber} = req.body;

//       const acctInfo = await db('users').select().where({'id': req.params.id, 'account_number': accountNumber });
//       if(!acctInfo) {
//           return res.status(400).json({success: false, errorMessage: "The account number doesn't exist"})
//       }
//       const sendMoney = await db('accounts').where({'userId': acctInfo.userId })
//          .insert({
//             amount: amountToSend,
//             userId: acctInfo.userId,
//             balance:  acctInfo.balance + amountToSend,
//             senderId: user.id,
//             sender_name: `${user.first_name} ${user.last_name}`
//           })
//           return res.status(200).json({ success: true, message: "Money sent to self successfully", data: sendMoney })

//     }catch(error: any) {
//         return res
//       .status(500)
//       .json({ success: false, errorMessage: error.message });
//     }
// }

// export async function withdrawAmount(req: Request, res: Response) {
//     try {
//         const user = await db('users').where('id', req.user);
//         if(!user) {
//             return res.send('No user found')
//         }

//         const {amount, accountNumber} = req.body;
//         const acctInfo = await db('users').where({'id': user.id,'account_number': accountNumber });
//         if(!acctInfo) {
//             return res.status(400).json({success: false, errorMessage: "Either the account number doesn't exist/it doesn't belong to you."})
//       }
//       if(acctInfo.balance < amount) {
//           return res.status(400).json({ success: false, errorMessage: "Insufficient fund!"})
//       }
//       const accountBal = acctInfo.balance - amount
//        const acctSummary = await db('users').update({
//            first_name: user.first_name,
//            last_name: user.last_name,
//            amount: amount,
//            balance: accountBal,
//            account_number: acctInfo.account_number
//        })
//       return res.status(200).json({success: true, successMessage: `An amount of ${amount} has been withdrew from account
//            number ${acctInfo.account_number}`, data: acctSummary})
//     } catch(error: any) {
//         return res
//       .status(500)
//       .json({ success: false, errorMessage: error.message });
//     }
// }
