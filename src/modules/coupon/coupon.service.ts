import { prisma } from "../../lib/prisma";

const create = async (payload: {
    code: string;
    discount: number;
    expiresAt: string;
    usageLimit?: number;
}) => {
    return await prisma.coupon.create({
        data: {
            code: payload.code.toUpperCase(),
            discount: payload.discount,
            expiresAt: new Date(payload.expiresAt),
            usageLimit: payload.usageLimit || null,
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
            isActive: payload?.isActive || coupon.isActive,
        },
    });
};

const remove = async (id: string) => {
    return await prisma.coupon.delete({ where: { id } });
};

export const CouponServices = { create, getAll, validate, update, remove };