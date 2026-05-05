import { prisma } from "../../lib/prisma";

const create = async (payload: {
    code: string;
    discount: number;
    expiresAt: string;
    usageLimit?: number;
    isActive?: boolean;
}) => {
    const existingCoupon = await prisma.coupon.findUnique({
        where: { code: payload.code.toUpperCase() },
    });
    if (existingCoupon) {
        throw new Error("Coupon already exists");
    }
    const expiresAt = new Date(payload.expiresAt);
    const now = new Date();

    if (expiresAt <= now) {
        throw new Error("Invalid expiresAt date. It must be in the future.");
    }
    if (payload.discount <= 0 || payload.discount > 100) {
        throw new Error("Invalid discount percentage. It must be between 1 and 100.");
    }
    return await prisma.coupon.create({
        data: {
            code: payload.code.toUpperCase(),
            discount: payload.discount,
            expiresAt: expiresAt,
            usageLimit: payload.usageLimit || null,
            isActive: payload.isActive ?? true,
        },
    });
};

const getAll = async () => {
    return await prisma.coupon.findMany({
        orderBy: { createdAt: "desc" },
    });
};

const validate = async (code: string) => {
    const coupon = await prisma.coupon.findUnique({
        where: { code: code?.toUpperCase() },
    });

    if (!coupon) throw new Error("Invalid coupon code");
    if (!coupon.isActive) throw new Error("Coupon is inactive");
    if (new Date() > coupon.expiresAt) throw new Error("Coupon has expired");
    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
        throw new Error("Coupon usage limit reached");
    }

    return { discount: coupon.discount, code: coupon.code };
};

const update = async (id: string, payload: {
    code?: string;
    discount?: number;
    expiresAt?: string;
    usageLimit?: number;
    isActive?: boolean;
}) => {
    const coupon = await prisma.coupon.findUnique({ where: { id } });
    if (!coupon) throw new Error("Coupon not found");



    return await prisma.coupon.update({
        where: { id },
        data: {
            code: payload?.code?.toUpperCase() || coupon.code,
            discount: payload?.discount || coupon.discount,
            expiresAt: payload?.expiresAt ? new Date(payload.expiresAt) : coupon.expiresAt,
            usageLimit: payload?.usageLimit || coupon.usageLimit,
            isActive: payload?.isActive ?? coupon.isActive,
        },
    });
};

const remove = async (id: string) => {
    return await prisma.coupon.delete({ where: { id } });
};

export const CouponServices = { create, getAll, validate, update, remove };