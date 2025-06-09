import client from "@repo/db/client";

const prismaSingleton = () => {
	return client;
};

declare const globalThis: {
	prismaGlobal: ReturnType<typeof prismaSingleton>;
} & typeof global;

const prisma = globalThis.prismaGlobal ?? prismaSingleton();

export default prisma;

if (process.env.NODE_ENV !== "production") globalThis.prismaGlobal = prisma;