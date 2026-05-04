import { Request, Response } from "express";

import { CouponServices } from "./coupon.service";



const create = async (req: Request, res: Response) => {
    try {
        const result = await CouponServices.create(req.body)
        if (!result) {
            throw new Error("Coupon not created");
        }
        res.status(200).json(result);
    } catch (error: any) {
        res.status(400).json(error.message);
    }

}

const getAll = async (req: Request, res: Response) => {
    try {
        const result = await CouponServices.getAll();
        if (!result) {
            throw new Error("Coupons not found");
        }
        res.status(200).json(result);
    } catch (error: any) {
        res.status(400).json(error.message)
    }
}

const validate = async (req: Request, res: Response) => {
    try {
        const result = await CouponServices.validate(req.body.code)
        if (!result) {
            throw new Error("Coupon not valid");
        }
        res.status(200).json(result);
    } catch (error: any) {
        res.status(400).json(error.message)
    }
}

const update = async (req: Request, res: Response) => {
    const { id } = req.params;
    const payload = req.body;
    try {
        const result = await CouponServices.update(id as string, payload);
        if (!result) {
            throw new Error("Coupon not updated");
        }
        res.status(200).json(result);
    } catch (error: any) {
        res.status(400).json(error.message)
    }
}

const remove = async (req: Request, res: Response) => {
    try {
        const result = await CouponServices.remove(req.params.id as string);
        if (!result) {
            throw new Error("Coupon not deleted");
        }
        res.status(200).json(result);
    } catch (error: any) {
        res.status(400).json(error.message)
    }
}

export const CouponController = { create, getAll, validate, update, remove };