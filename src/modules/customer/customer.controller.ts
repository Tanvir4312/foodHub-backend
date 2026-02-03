import { Request, Response } from "express"
import { customerservices } from "./customer.services";

const updateCustomerProfile = async(req : Request, res : Response) =>{
    const id = req.user?.id
    const data = req.body
 
     try {
    const result = await customerservices.updateCustomerProfile(id as string, data);

    res.status(200).json(result);
  } catch (e) {
    res.status(400).json({
      message: "User not found",
    });
  }
      }



export const customerController = {
    updateCustomerProfile
}