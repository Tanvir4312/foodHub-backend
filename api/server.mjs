var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// generated/prisma/internal/class.ts
import * as runtime from "@prisma/client/runtime/client";
async function decodeBase64AsWasm(wasmBase64) {
  const { Buffer: Buffer2 } = await import("buffer");
  const wasmArray = Buffer2.from(wasmBase64, "base64");
  return new WebAssembly.Module(wasmArray);
}
function getPrismaClientClass() {
  return runtime.getPrismaClient(config);
}
var config;
var init_class = __esm({
  "generated/prisma/internal/class.ts"() {
    "use strict";
    config = {
      "previewFeatures": [],
      "clientVersion": "7.3.0",
      "engineVersion": "9d6ad21cbbceab97458517b147a6a09ff43aa735",
      "activeProvider": "postgresql",
      "inlineSchema": 'model User {\n  id              String           @id\n  name            String\n  email           String\n  emailVerified   Boolean          @default(false)\n  phone_number    String?          @db.VarChar(15)\n  image           String?\n  role            UserRole         @default(CUSTOMER)\n  status          UserStatus       @default(ACTIVE)\n  createdAt       DateTime         @default(now())\n  updatedAt       DateTime         @updatedAt\n  sessions        Session[]\n  accounts        Account[]\n  providerProfile ProviderProfile?\n  orders          Order[]\n  reviews         Review[]\n  carts           Cart[]\n\n  @@unique([email])\n  @@map("users")\n}\n\nenum UserRole {\n  CUSTOMER\n  PROVIDER\n  ADMIN\n}\n\nenum UserStatus {\n  ACTIVE\n  SUSPENDED\n}\n\nmodel Session {\n  id        String   @id\n  expiresAt DateTime\n  token     String\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n  ipAddress String?\n  userAgent String?\n  userId    String\n  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)\n\n  @@unique([token])\n  @@index([userId])\n  @@map("session")\n}\n\nmodel Account {\n  id                    String    @id\n  accountId             String\n  providerId            String\n  userId                String\n  user                  User      @relation(fields: [userId], references: [id], onDelete: Cascade)\n  accessToken           String?\n  refreshToken          String?\n  idToken               String?\n  accessTokenExpiresAt  DateTime?\n  refreshTokenExpiresAt DateTime?\n  scope                 String?\n  password              String?\n  createdAt             DateTime  @default(now())\n  updatedAt             DateTime  @updatedAt\n\n  @@index([userId])\n  @@map("account")\n}\n\nmodel Verification {\n  id         String   @id\n  identifier String\n  value      String\n  expiresAt  DateTime\n  createdAt  DateTime @default(now())\n  updatedAt  DateTime @updatedAt\n\n  @@index([identifier])\n  @@map("verification")\n}\n\nmodel Cart {\n  id          String          @id @default(ulid())\n  user_id     String\n  user        User            @relation(fields: [user_id], references: [id])\n  provider_id String\n  provider    ProviderProfile @relation(fields: [provider_id], references: [id])\n  cartItems   CartItem[]\n\n  @@unique([user_id, provider_id])\n}\n\nmodel CartItem {\n  id       String @id @default(ulid())\n  cart_id  String\n  cart     Cart   @relation(fields: [cart_id], references: [id], onDelete: Cascade)\n  meal_id  String\n  meal     Meal   @relation(fields: [meal_id], references: [id])\n  quantity Int    @default(1)\n\n  @@unique([cart_id, meal_id])\n}\n\nmodel Category {\n  id          String  @id @default(uuid())\n  name        String  @unique @db.VarChar(50)\n  description String?\n  meals       Meal[]\n\n  @@map("categories")\n}\n\nmodel Meal {\n  id            String            @id @default(uuid())\n  name          String            @db.VarChar(50)\n  description   String\n  price         Float\n  image_url     String?\n  isAvailable   Boolean           @default(true)\n  dietary       DietaryPreference\n  isDeleted     Boolean           @default(false)\n  averageRating Float             @default(0)\n  totalReviews  Float             @default(0)\n  provider_id   String\n  provider      ProviderProfile   @relation(fields: [provider_id], references: [id])\n  category_id   String\n  categories    Category          @relation(fields: [category_id], references: [id])\n  reviews       Review[]\n  orderItems    orderItem[]\n  cartItems     CartItem[]\n\n  @@map("meals")\n}\n\nenum DietaryPreference {\n  VEGAN\n  VEGETARIAN\n  GLUTEN_FREE\n  KETO\n}\n\nmodel Order {\n  id               String          @id @default(uuid())\n  total_amount     Float\n  delivery_address String\n  payment_method   String          @default("Cash on delivery(COD)")\n  status           OrderStatus     @default(PENDING)\n  user_id          String\n  user             User            @relation(fields: [user_id], references: [id])\n  provider_id      String\n  provider         ProviderProfile @relation(fields: [provider_id], references: [id])\n  createdAt        DateTime        @default(now())\n  updatedAt        DateTime        @updatedAt\n  orderItems       orderItem[]\n\n  @@map("orders")\n}\n\nenum OrderStatus {\n  PENDING\n  ACCEPTED\n  PREPARING\n  OUTFORDELIVERY\n  DELIVERED\n  CANCELLED\n}\n\nmodel orderItem {\n  id          String @id @default(ulid())\n  order_id    String\n  order       Order  @relation(fields: [order_id], references: [id], onDelete: Cascade)\n  meal_id     String\n  meal        Meal   @relation(fields: [meal_id], references: [id])\n  quantity    Int    @default(1)\n  price       Float\n  total_price Float\n\n  @@map("order-items")\n}\n\nmodel ProviderProfile {\n  id           String  @id @default(uuid())\n  name         String  @db.VarChar(50)\n  description  String?\n  logo_url     String?\n  location     String\n  phone_number String? @db.VarChar(15)\n  user_id      String  @unique\n  user         User    @relation(fields: [user_id], references: [id])\n  meals        Meal[]\n  orders       Order[]\n  carts        Cart[]\n\n  @@map("providersProfile")\n}\n\nmodel Review {\n  id      String @id @default(uuid())\n  rating  Int\n  comment String\n  meal_id String\n  meal    Meal   @relation(fields: [meal_id], references: [id])\n  user_id String\n  user    User   @relation(fields: [user_id], references: [id])\n\n  @@map("reviews")\n}\n\n// This is your Prisma schema file,\n// learn more about it in the docs: https://pris.ly/d/prisma-schema\n\n// Looking for ways to speed up your queries, or scale easily with your serverless or edge functions?\n// Try Prisma Accelerate: https://pris.ly/cli/accelerate-init\n\ngenerator client {\n  provider = "prisma-client"\n  output   = "../../generated/prisma"\n}\n\ndatasource db {\n  provider = "postgresql"\n}\n',
      "runtimeDataModel": {
        "models": {},
        "enums": {},
        "types": {}
      }
    };
    config.runtimeDataModel = JSON.parse('{"models":{"User":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"email","kind":"scalar","type":"String"},{"name":"emailVerified","kind":"scalar","type":"Boolean"},{"name":"phone_number","kind":"scalar","type":"String"},{"name":"image","kind":"scalar","type":"String"},{"name":"role","kind":"enum","type":"UserRole"},{"name":"status","kind":"enum","type":"UserStatus"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"sessions","kind":"object","type":"Session","relationName":"SessionToUser"},{"name":"accounts","kind":"object","type":"Account","relationName":"AccountToUser"},{"name":"providerProfile","kind":"object","type":"ProviderProfile","relationName":"ProviderProfileToUser"},{"name":"orders","kind":"object","type":"Order","relationName":"OrderToUser"},{"name":"reviews","kind":"object","type":"Review","relationName":"ReviewToUser"},{"name":"carts","kind":"object","type":"Cart","relationName":"CartToUser"}],"dbName":"users"},"Session":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"token","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"ipAddress","kind":"scalar","type":"String"},{"name":"userAgent","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"SessionToUser"}],"dbName":"session"},"Account":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"accountId","kind":"scalar","type":"String"},{"name":"providerId","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"AccountToUser"},{"name":"accessToken","kind":"scalar","type":"String"},{"name":"refreshToken","kind":"scalar","type":"String"},{"name":"idToken","kind":"scalar","type":"String"},{"name":"accessTokenExpiresAt","kind":"scalar","type":"DateTime"},{"name":"refreshTokenExpiresAt","kind":"scalar","type":"DateTime"},{"name":"scope","kind":"scalar","type":"String"},{"name":"password","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"account"},"Verification":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"identifier","kind":"scalar","type":"String"},{"name":"value","kind":"scalar","type":"String"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"verification"},"Cart":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"user_id","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"CartToUser"},{"name":"provider_id","kind":"scalar","type":"String"},{"name":"provider","kind":"object","type":"ProviderProfile","relationName":"CartToProviderProfile"},{"name":"cartItems","kind":"object","type":"CartItem","relationName":"CartToCartItem"}],"dbName":null},"CartItem":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"cart_id","kind":"scalar","type":"String"},{"name":"cart","kind":"object","type":"Cart","relationName":"CartToCartItem"},{"name":"meal_id","kind":"scalar","type":"String"},{"name":"meal","kind":"object","type":"Meal","relationName":"CartItemToMeal"},{"name":"quantity","kind":"scalar","type":"Int"}],"dbName":null},"Category":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"meals","kind":"object","type":"Meal","relationName":"CategoryToMeal"}],"dbName":"categories"},"Meal":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"price","kind":"scalar","type":"Float"},{"name":"image_url","kind":"scalar","type":"String"},{"name":"isAvailable","kind":"scalar","type":"Boolean"},{"name":"dietary","kind":"enum","type":"DietaryPreference"},{"name":"isDeleted","kind":"scalar","type":"Boolean"},{"name":"averageRating","kind":"scalar","type":"Float"},{"name":"totalReviews","kind":"scalar","type":"Float"},{"name":"provider_id","kind":"scalar","type":"String"},{"name":"provider","kind":"object","type":"ProviderProfile","relationName":"MealToProviderProfile"},{"name":"category_id","kind":"scalar","type":"String"},{"name":"categories","kind":"object","type":"Category","relationName":"CategoryToMeal"},{"name":"reviews","kind":"object","type":"Review","relationName":"MealToReview"},{"name":"orderItems","kind":"object","type":"orderItem","relationName":"MealToorderItem"},{"name":"cartItems","kind":"object","type":"CartItem","relationName":"CartItemToMeal"}],"dbName":"meals"},"Order":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"total_amount","kind":"scalar","type":"Float"},{"name":"delivery_address","kind":"scalar","type":"String"},{"name":"payment_method","kind":"scalar","type":"String"},{"name":"status","kind":"enum","type":"OrderStatus"},{"name":"user_id","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"OrderToUser"},{"name":"provider_id","kind":"scalar","type":"String"},{"name":"provider","kind":"object","type":"ProviderProfile","relationName":"OrderToProviderProfile"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"orderItems","kind":"object","type":"orderItem","relationName":"OrderToorderItem"}],"dbName":"orders"},"orderItem":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"order_id","kind":"scalar","type":"String"},{"name":"order","kind":"object","type":"Order","relationName":"OrderToorderItem"},{"name":"meal_id","kind":"scalar","type":"String"},{"name":"meal","kind":"object","type":"Meal","relationName":"MealToorderItem"},{"name":"quantity","kind":"scalar","type":"Int"},{"name":"price","kind":"scalar","type":"Float"},{"name":"total_price","kind":"scalar","type":"Float"}],"dbName":"order-items"},"ProviderProfile":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"logo_url","kind":"scalar","type":"String"},{"name":"location","kind":"scalar","type":"String"},{"name":"phone_number","kind":"scalar","type":"String"},{"name":"user_id","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"ProviderProfileToUser"},{"name":"meals","kind":"object","type":"Meal","relationName":"MealToProviderProfile"},{"name":"orders","kind":"object","type":"Order","relationName":"OrderToProviderProfile"},{"name":"carts","kind":"object","type":"Cart","relationName":"CartToProviderProfile"}],"dbName":"providersProfile"},"Review":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"rating","kind":"scalar","type":"Int"},{"name":"comment","kind":"scalar","type":"String"},{"name":"meal_id","kind":"scalar","type":"String"},{"name":"meal","kind":"object","type":"Meal","relationName":"MealToReview"},{"name":"user_id","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"ReviewToUser"}],"dbName":"reviews"}},"enums":{},"types":{}}');
    config.compilerWasm = {
      getRuntime: async () => await import("@prisma/client/runtime/query_compiler_fast_bg.postgresql.mjs"),
      getQueryCompilerWasmModule: async () => {
        const { wasm } = await import("@prisma/client/runtime/query_compiler_fast_bg.postgresql.wasm-base64.mjs");
        return await decodeBase64AsWasm(wasm);
      },
      importName: "./query_compiler_fast_bg.js"
    };
  }
});

// generated/prisma/internal/prismaNamespace.ts
var prismaNamespace_exports = {};
__export(prismaNamespace_exports, {
  AccountScalarFieldEnum: () => AccountScalarFieldEnum,
  AnyNull: () => AnyNull2,
  CartItemScalarFieldEnum: () => CartItemScalarFieldEnum,
  CartScalarFieldEnum: () => CartScalarFieldEnum,
  CategoryScalarFieldEnum: () => CategoryScalarFieldEnum,
  DbNull: () => DbNull2,
  Decimal: () => Decimal2,
  JsonNull: () => JsonNull2,
  MealScalarFieldEnum: () => MealScalarFieldEnum,
  ModelName: () => ModelName,
  NullTypes: () => NullTypes2,
  NullsOrder: () => NullsOrder,
  OrderItemScalarFieldEnum: () => OrderItemScalarFieldEnum,
  OrderScalarFieldEnum: () => OrderScalarFieldEnum,
  PrismaClientInitializationError: () => PrismaClientInitializationError2,
  PrismaClientKnownRequestError: () => PrismaClientKnownRequestError2,
  PrismaClientRustPanicError: () => PrismaClientRustPanicError2,
  PrismaClientUnknownRequestError: () => PrismaClientUnknownRequestError2,
  PrismaClientValidationError: () => PrismaClientValidationError2,
  ProviderProfileScalarFieldEnum: () => ProviderProfileScalarFieldEnum,
  QueryMode: () => QueryMode,
  ReviewScalarFieldEnum: () => ReviewScalarFieldEnum,
  SessionScalarFieldEnum: () => SessionScalarFieldEnum,
  SortOrder: () => SortOrder,
  Sql: () => Sql2,
  TransactionIsolationLevel: () => TransactionIsolationLevel,
  UserScalarFieldEnum: () => UserScalarFieldEnum,
  VerificationScalarFieldEnum: () => VerificationScalarFieldEnum,
  defineExtension: () => defineExtension,
  empty: () => empty2,
  getExtensionContext: () => getExtensionContext,
  join: () => join2,
  prismaVersion: () => prismaVersion,
  raw: () => raw2,
  sql: () => sql
});
import * as runtime2 from "@prisma/client/runtime/client";
var PrismaClientKnownRequestError2, PrismaClientUnknownRequestError2, PrismaClientRustPanicError2, PrismaClientInitializationError2, PrismaClientValidationError2, sql, empty2, join2, raw2, Sql2, Decimal2, getExtensionContext, prismaVersion, NullTypes2, DbNull2, JsonNull2, AnyNull2, ModelName, TransactionIsolationLevel, UserScalarFieldEnum, SessionScalarFieldEnum, AccountScalarFieldEnum, VerificationScalarFieldEnum, CartScalarFieldEnum, CartItemScalarFieldEnum, CategoryScalarFieldEnum, MealScalarFieldEnum, OrderScalarFieldEnum, OrderItemScalarFieldEnum, ProviderProfileScalarFieldEnum, ReviewScalarFieldEnum, SortOrder, QueryMode, NullsOrder, defineExtension;
var init_prismaNamespace = __esm({
  "generated/prisma/internal/prismaNamespace.ts"() {
    "use strict";
    PrismaClientKnownRequestError2 = runtime2.PrismaClientKnownRequestError;
    PrismaClientUnknownRequestError2 = runtime2.PrismaClientUnknownRequestError;
    PrismaClientRustPanicError2 = runtime2.PrismaClientRustPanicError;
    PrismaClientInitializationError2 = runtime2.PrismaClientInitializationError;
    PrismaClientValidationError2 = runtime2.PrismaClientValidationError;
    sql = runtime2.sqltag;
    empty2 = runtime2.empty;
    join2 = runtime2.join;
    raw2 = runtime2.raw;
    Sql2 = runtime2.Sql;
    Decimal2 = runtime2.Decimal;
    getExtensionContext = runtime2.Extensions.getExtensionContext;
    prismaVersion = {
      client: "7.3.0",
      engine: "9d6ad21cbbceab97458517b147a6a09ff43aa735"
    };
    NullTypes2 = {
      DbNull: runtime2.NullTypes.DbNull,
      JsonNull: runtime2.NullTypes.JsonNull,
      AnyNull: runtime2.NullTypes.AnyNull
    };
    DbNull2 = runtime2.DbNull;
    JsonNull2 = runtime2.JsonNull;
    AnyNull2 = runtime2.AnyNull;
    ModelName = {
      User: "User",
      Session: "Session",
      Account: "Account",
      Verification: "Verification",
      Cart: "Cart",
      CartItem: "CartItem",
      Category: "Category",
      Meal: "Meal",
      Order: "Order",
      orderItem: "orderItem",
      ProviderProfile: "ProviderProfile",
      Review: "Review"
    };
    TransactionIsolationLevel = runtime2.makeStrictEnum({
      ReadUncommitted: "ReadUncommitted",
      ReadCommitted: "ReadCommitted",
      RepeatableRead: "RepeatableRead",
      Serializable: "Serializable"
    });
    UserScalarFieldEnum = {
      id: "id",
      name: "name",
      email: "email",
      emailVerified: "emailVerified",
      phone_number: "phone_number",
      image: "image",
      role: "role",
      status: "status",
      createdAt: "createdAt",
      updatedAt: "updatedAt"
    };
    SessionScalarFieldEnum = {
      id: "id",
      expiresAt: "expiresAt",
      token: "token",
      createdAt: "createdAt",
      updatedAt: "updatedAt",
      ipAddress: "ipAddress",
      userAgent: "userAgent",
      userId: "userId"
    };
    AccountScalarFieldEnum = {
      id: "id",
      accountId: "accountId",
      providerId: "providerId",
      userId: "userId",
      accessToken: "accessToken",
      refreshToken: "refreshToken",
      idToken: "idToken",
      accessTokenExpiresAt: "accessTokenExpiresAt",
      refreshTokenExpiresAt: "refreshTokenExpiresAt",
      scope: "scope",
      password: "password",
      createdAt: "createdAt",
      updatedAt: "updatedAt"
    };
    VerificationScalarFieldEnum = {
      id: "id",
      identifier: "identifier",
      value: "value",
      expiresAt: "expiresAt",
      createdAt: "createdAt",
      updatedAt: "updatedAt"
    };
    CartScalarFieldEnum = {
      id: "id",
      user_id: "user_id",
      provider_id: "provider_id"
    };
    CartItemScalarFieldEnum = {
      id: "id",
      cart_id: "cart_id",
      meal_id: "meal_id",
      quantity: "quantity"
    };
    CategoryScalarFieldEnum = {
      id: "id",
      name: "name",
      description: "description"
    };
    MealScalarFieldEnum = {
      id: "id",
      name: "name",
      description: "description",
      price: "price",
      image_url: "image_url",
      isAvailable: "isAvailable",
      dietary: "dietary",
      isDeleted: "isDeleted",
      averageRating: "averageRating",
      totalReviews: "totalReviews",
      provider_id: "provider_id",
      category_id: "category_id"
    };
    OrderScalarFieldEnum = {
      id: "id",
      total_amount: "total_amount",
      delivery_address: "delivery_address",
      payment_method: "payment_method",
      status: "status",
      user_id: "user_id",
      provider_id: "provider_id",
      createdAt: "createdAt",
      updatedAt: "updatedAt"
    };
    OrderItemScalarFieldEnum = {
      id: "id",
      order_id: "order_id",
      meal_id: "meal_id",
      quantity: "quantity",
      price: "price",
      total_price: "total_price"
    };
    ProviderProfileScalarFieldEnum = {
      id: "id",
      name: "name",
      description: "description",
      logo_url: "logo_url",
      location: "location",
      phone_number: "phone_number",
      user_id: "user_id"
    };
    ReviewScalarFieldEnum = {
      id: "id",
      rating: "rating",
      comment: "comment",
      meal_id: "meal_id",
      user_id: "user_id"
    };
    SortOrder = {
      asc: "asc",
      desc: "desc"
    };
    QueryMode = {
      default: "default",
      insensitive: "insensitive"
    };
    NullsOrder = {
      first: "first",
      last: "last"
    };
    defineExtension = runtime2.Extensions.defineExtension;
  }
});

// generated/prisma/enums.ts
var UserRole;
var init_enums = __esm({
  "generated/prisma/enums.ts"() {
    "use strict";
    UserRole = {
      CUSTOMER: "CUSTOMER",
      PROVIDER: "PROVIDER",
      ADMIN: "ADMIN"
    };
  }
});

// generated/prisma/client.ts
import * as path from "path";
import { fileURLToPath } from "url";
var PrismaClient;
var init_client = __esm({
  "generated/prisma/client.ts"() {
    "use strict";
    init_class();
    init_prismaNamespace();
    init_enums();
    init_enums();
    globalThis["__dirname"] = path.dirname(fileURLToPath(import.meta.url));
    PrismaClient = getPrismaClientClass();
  }
});

// src/lib/prisma.ts
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
var connectionString, adapter, prisma;
var init_prisma = __esm({
  "src/lib/prisma.ts"() {
    "use strict";
    init_client();
    connectionString = `${process.env.DATABASE_URL}`;
    adapter = new PrismaPg({ connectionString });
    prisma = new PrismaClient({ adapter });
  }
});

// src/lib/auth.ts
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
var auth;
var init_auth = __esm({
  "src/lib/auth.ts"() {
    "use strict";
    init_prisma();
    auth = betterAuth({
      database: prismaAdapter(prisma, {
        provider: "postgresql"
      }),
      trustedOrigins: [process.env.APP_URL],
      user: {
        additionalFields: {
          role: {
            type: "string",
            defaultValue: "CUSTOMER",
            required: false
          },
          phone_number: {
            type: "string",
            required: false
          },
          status: {
            type: "string",
            defaultValue: "ACTIVE",
            required: false
          }
        }
      },
      emailAndPassword: {
        enabled: true,
        autoSignIn: false
      }
    });
  }
});

// src/modules/admin/admin.service.ts
var getAllUser, updateUserStatus, createCategories, getAllCategory, updateCategory, deleteCategory, getAllOrder, updateOrderStatus, mealIsDeleted, adminServices;
var init_admin_service = __esm({
  "src/modules/admin/admin.service.ts"() {
    "use strict";
    init_prisma();
    getAllUser = async () => {
      const allUser = await prisma.user.findMany({
        include: {
          providerProfile: true
        }
      });
      return allUser;
    };
    updateUserStatus = async (id, status) => {
      const updateUser = await prisma.user.update({
        where: { id },
        data: { status }
      });
      return updateUser;
    };
    createCategories = async (category) => {
      const existingCategory = await prisma.category.findUnique({
        where: { name: category.name }
      });
      if (existingCategory) {
        throw new Error("This category name already exists");
      }
      const createCategory = await prisma.category.create({
        data: category
      });
      return createCategory;
    };
    getAllCategory = async () => {
      const allCategory = await prisma.category.findMany({
        include: {
          meals: true
        }
      });
      const totalCategory = await prisma.category.count();
      return { data: allCategory, totalCategory };
    };
    updateCategory = async (id, data) => {
      const categoryUpdate = await prisma.category.update({
        where: {
          id
        },
        data
      });
      return categoryUpdate;
    };
    deleteCategory = async (id) => {
      const categoryDelete = await prisma.category.delete({
        where: {
          id
        }
      });
      return categoryDelete;
    };
    getAllOrder = async () => {
      const allUser = await prisma.order.findMany({
        include: {
          provider: {
            select: {
              name: true,
              location: true,
              phone_number: true
            }
          },
          orderItems: {
            select: {
              meal: {
                select: {
                  name: true,
                  price: true
                }
              }
            }
          }
        }
      });
      return allUser;
    };
    updateOrderStatus = async (id, status) => {
      return await prisma.order.update({
        where: { id },
        data: { status }
      });
    };
    mealIsDeleted = async (id, data) => {
      return await prisma.meal.update({
        where: { id },
        data: {
          isDeleted: data
        }
      });
    };
    adminServices = {
      getAllUser,
      updateUserStatus,
      createCategories,
      getAllCategory,
      updateCategory,
      deleteCategory,
      getAllOrder,
      updateOrderStatus,
      mealIsDeleted
    };
  }
});

// src/modules/admin/admin.controller.ts
var getAllUser2, updateUserStatus2, createCategories2, getAllCategory2, updateCategories, deleteCategories, getAllOrder2, updateOrderStatus2, mealIsDeleted2, adminController;
var init_admin_controller = __esm({
  "src/modules/admin/admin.controller.ts"() {
    "use strict";
    init_admin_service();
    getAllUser2 = async (req, res) => {
      try {
        const result = await adminServices.getAllUser();
        res.status(200).json(result);
      } catch (e) {
        res.status(404).json({
          message: e.message || "An unexpected error occurred"
        });
      }
    };
    updateUserStatus2 = async (req, res, next) => {
      const userId = req.params.id;
      const { status } = req.body;
      try {
        if (!["ACTIVE", "SUSPENDED"].includes(status)) {
          return res.status(400).json({ message: "Invalid status" });
        }
        const result = await adminServices.updateUserStatus(
          userId,
          status
        );
        res.status(200).json(result);
      } catch (err) {
        next(err);
      }
    };
    createCategories2 = async (req, res) => {
      try {
        const result = await adminServices.createCategories(req.body);
        res.status(200).json(result);
      } catch (e) {
        res.status(404).json({
          message: e.message || "An unexpected error occurred"
        });
      }
    };
    getAllCategory2 = async (req, res) => {
      try {
        const result = await adminServices.getAllCategory();
        res.status(200).json(result);
      } catch (e) {
        res.status(404).json({
          message: e.message || "An unexpected error occurred"
        });
      }
    };
    updateCategories = async (req, res, next) => {
      const id = req.params.id;
      const data = req.body;
      try {
        const result = await adminServices.updateCategory(id, data);
        res.status(200).json(result);
      } catch (e) {
        next(e);
      }
    };
    deleteCategories = async (req, res, next) => {
      const id = req.params.id;
      try {
        const result = await adminServices.deleteCategory(id);
        res.status(200).json(result);
      } catch (e) {
        next(e);
      }
    };
    getAllOrder2 = async (req, res) => {
      try {
        const result = await adminServices.getAllOrder();
        res.status(200).json(result);
      } catch (e) {
        res.status(404).json({
          message: e.message || "An unexpected error occurred"
        });
      }
    };
    updateOrderStatus2 = async (req, res) => {
      const id = req.params.id;
      const status = req.body.status;
      try {
        const result = await adminServices.updateOrderStatus(id, status);
        res.status(200).json(result);
      } catch (e) {
        res.status(404).json({
          message: e.message || "An unexpected error occurred"
        });
      }
    };
    mealIsDeleted2 = async (req, res) => {
      const id = req.params.id;
      const data = req.body.isDeleted;
      try {
        const result = await adminServices.mealIsDeleted(id, data);
        res.status(200).json(result);
      } catch (e) {
        res.status(404).json({
          message: e.message || "An unexpected error occurred"
        });
      }
    };
    adminController = {
      getAllUser: getAllUser2,
      updateUserStatus: updateUserStatus2,
      createCategories: createCategories2,
      getAllCategory: getAllCategory2,
      updateCategories,
      deleteCategories,
      getAllOrder: getAllOrder2,
      updateOrderStatus: updateOrderStatus2,
      mealIsDeleted: mealIsDeleted2
    };
  }
});

// src/middleware/auth_middleware.ts
var auth2, auth_middleware_default;
var init_auth_middleware = __esm({
  "src/middleware/auth_middleware.ts"() {
    "use strict";
    init_auth();
    auth2 = (...role) => {
      return async (req, res, next) => {
        try {
          const session = await auth.api.getSession({
            headers: req.headers
          });
          if (!session) {
            return res.status(403).json({
              success: false,
              message: "Unauthorized"
            });
          }
          req.user = {
            id: session.user.id,
            email: session.user.email,
            name: session.user.name,
            role: session.user.role,
            emailVerified: session.user.emailVerified
          };
          if (role.length && !role.includes(req.user.role)) {
            return res.status(400).json({
              success: false,
              message: "Forbidden"
            });
          }
          next();
        } catch (err) {
        }
      };
    };
    auth_middleware_default = auth2;
  }
});

// src/modules/admin/admin.router.ts
import { Router } from "express";
var router, adminRouter;
var init_admin_router = __esm({
  "src/modules/admin/admin.router.ts"() {
    "use strict";
    init_admin_controller();
    init_auth_middleware();
    init_enums();
    router = Router();
    router.get("/users", auth_middleware_default(UserRole.ADMIN), adminController.getAllUser);
    router.patch("/users/:id", auth_middleware_default(UserRole.ADMIN), adminController.updateUserStatus);
    router.get("/categories", auth_middleware_default(UserRole.ADMIN), adminController.getAllCategory);
    router.post("/categories", auth_middleware_default(UserRole.ADMIN), adminController.createCategories);
    router.patch("/categories/:id", auth_middleware_default(UserRole.ADMIN), adminController.updateCategories);
    router.delete("/categories/:id", auth_middleware_default(UserRole.ADMIN), adminController.deleteCategories);
    router.get("/orders", auth_middleware_default(UserRole.ADMIN), adminController.getAllOrder);
    router.patch("/orders/:id", auth_middleware_default(UserRole.ADMIN), adminController.updateOrderStatus);
    router.patch("/meals/:id", auth_middleware_default(UserRole.ADMIN), adminController.mealIsDeleted);
    adminRouter = router;
  }
});

// src/middleware/globalErrorHandler.ts
function errorHandler(err, req, res, next) {
  let statusCode = 500;
  let errorMessage = "Interval server error!!";
  let errorDetails = err;
  if (err instanceof prismaNamespace_exports.PrismaClientKnownRequestError) {
    if (err.code === "P2025") {
      statusCode = 404, errorMessage = "not found";
    }
    if (err.code === "P2002") {
      statusCode = 404, errorMessage = "duplicate";
    }
  }
  if (err instanceof prismaNamespace_exports.PrismaClientValidationError) {
    statusCode = 400, errorMessage = "creation failed";
  }
  res.status(500);
  res.json({
    message: errorMessage
  });
}
var globalErrorHandler_default;
var init_globalErrorHandler = __esm({
  "src/middleware/globalErrorHandler.ts"() {
    "use strict";
    init_client();
    globalErrorHandler_default = errorHandler;
  }
});

// src/modules/provider/provider.service.ts
var createProviderProfile, getAllProvider, getProviderById, getAllMeal, getProviderOwnMeals, getMealsById, createMeals, updateMeals, deleteMeals, providerServices;
var init_provider_service = __esm({
  "src/modules/provider/provider.service.ts"() {
    "use strict";
    init_prisma();
    createProviderProfile = async (data, id) => {
      const result = await prisma.providerProfile.create({
        data: {
          ...data,
          user_id: id
        }
      });
      return result;
    };
    getAllProvider = async () => {
      return await prisma.providerProfile.findMany({
        include: {
          meals: {
            include: {
              categories: {
                select: {
                  name: true
                }
              }
            }
          }
        }
      });
    };
    getProviderById = async (id) => {
      return await prisma.providerProfile.findUniqueOrThrow({
        where: {
          id
        },
        include: {
          meals: {
            include: {
              categories: {
                select: {
                  name: true
                }
              }
            }
          }
        }
      });
    };
    getAllMeal = async (search, minPrice, maxPrice) => {
      const andCondition = [];
      if (search) {
        andCondition.push({
          OR: [
            {
              categories: {
                name: {
                  contains: search,
                  mode: "insensitive"
                }
              }
            },
            {
              name: {
                contains: search,
                mode: "insensitive"
              }
            }
          ]
        });
      }
      if (minPrice || maxPrice) {
        andCondition.push({
          price: {
            ...minPrice && { gte: minPrice },
            ...maxPrice && { lte: maxPrice }
          }
        });
      }
      const result = await prisma.meal.findMany({
        where: andCondition.length > 0 ? {
          AND: [...andCondition, { isAvailable: true, isDeleted: false }]
        } : { isAvailable: true, isDeleted: false },
        include: {
          categories: {
            select: {
              name: true,
              description: true
            }
          },
          reviews: {
            select: {
              comment: true,
              rating: true,
              user_id: true
            }
          }
        }
      });
      return result;
    };
    getProviderOwnMeals = async (userId) => {
      return await prisma.$transaction(async (tx) => {
        const provider = await tx.providerProfile.findUniqueOrThrow({
          where: {
            user_id: userId
          }
        });
        const providerId = provider.id;
        if (!providerId) {
          throw new Error("Provider Not Found!!");
        }
        return await tx.meal.findMany({
          where: {
            provider_id: providerId
          }
        });
      });
    };
    getMealsById = async (id) => {
      return await prisma.meal.findUniqueOrThrow({
        where: {
          id
        },
        include: {
          categories: {
            select: {
              name: true
            }
          }
        }
      });
    };
    createMeals = async (payload) => {
      await prisma.providerProfile.findFirstOrThrow({
        where: {
          id: payload.provider_id
        }
      });
      await prisma.category.findFirstOrThrow({
        where: {
          id: payload.category_id
        }
      });
      const result = await prisma.meal.create({
        data: payload
      });
      return result;
    };
    updateMeals = async (mealsData, id, userId) => {
      return await prisma.$transaction(async (tx) => {
        const provider = await tx.providerProfile.findUniqueOrThrow({
          where: {
            user_id: userId
          }
        });
        const providerOwnMeals = await tx.meal.findMany({
          where: {
            provider_id: provider.id
          }
        });
        const matched = providerOwnMeals.find(
          (providerOwnMeal) => providerOwnMeal.id === id
        );
        if (!matched) {
          throw new Error("This is not your meal");
        }
        const mathedId = matched?.id;
        if (!mathedId) {
          throw new Error("Not Found");
        }
        return await tx.meal.update({
          where: {
            id: mathedId
          },
          data: mealsData
        });
      });
    };
    deleteMeals = async (id) => {
      const result = await prisma.meal.delete({
        where: {
          id
        }
      });
      return result;
    };
    providerServices = {
      createProviderProfile,
      getAllProvider,
      getProviderById,
      getAllMeal,
      getProviderOwnMeals,
      getMealsById,
      createMeals,
      updateMeals,
      deleteMeals
    };
  }
});

// src/modules/provider/provider.controller.ts
var createProviderProfile2, getAllProvider2, getProviderById2, getAllMeal2, getProviderOwnMeals2, getMealsById2, createMeals2, updateMeals2, deleteMeals2, providerController;
var init_provider_controller = __esm({
  "src/modules/provider/provider.controller.ts"() {
    "use strict";
    init_provider_service();
    createProviderProfile2 = async (req, res, next) => {
      const id = req.user?.id;
      if (!id) {
        return res.status(400).json({ message: "user not found" });
      }
      try {
        const providerProfileCreate = await providerServices.createProviderProfile(
          req.body,
          id
        );
        res.status(200).json(providerProfileCreate);
      } catch (e) {
        if (e.code === "P2002") {
          e.message = "An account with this email already exists.";
        } else {
          e.message = "Something went wrong while adding the item to the cart.";
        }
        next(e);
      }
    };
    getAllProvider2 = async (req, res) => {
      try {
        const allProvider = await providerServices.getAllProvider();
        res.status(200).json(allProvider);
      } catch (e) {
        res.status(404).json({
          message: "Provider not found",
          error: e
        });
      }
    };
    getProviderById2 = async (req, res) => {
      const id = req.params.id;
      try {
        const getSpecificProvider = await providerServices.getProviderById(
          id
        );
        res.status(200).json(getSpecificProvider);
      } catch (e) {
        res.status(404).json({
          message: "Provider not found",
          error: e
        });
      }
    };
    getAllMeal2 = async (req, res) => {
      const search = req.query.search;
      const minPriceStr = req.query.minPrice;
      const maxPriceStr = req.query.maxPrice;
      const minPrice = Number(minPriceStr);
      const maxPrice = Number(maxPriceStr);
      try {
        const mealsCreate = await providerServices.getAllMeal(
          search,
          minPrice,
          maxPrice
        );
        res.status(200).json(mealsCreate);
      } catch (e) {
        res.status(404).json({
          message: e.message || "An unexpected error occurred"
        });
      }
    };
    getProviderOwnMeals2 = async (req, res) => {
      const userId = req.user?.id;
      try {
        const providerOwnMeal = await providerServices.getProviderOwnMeals(
          userId
        );
        res.status(200).json(providerOwnMeal);
      } catch (e) {
        res.status(404).json({
          message: e.message || "An unexpected error occurred"
        });
      }
    };
    getMealsById2 = async (req, res) => {
      const id = req.params.id;
      try {
        const mealDetails = await providerServices.getMealsById(id);
        res.status(200).json(mealDetails);
      } catch (e) {
        res.status(404).json({
          message: e.message || "An unexpected error occurred"
        });
      }
    };
    createMeals2 = async (req, res, next) => {
      try {
        const mealsCreate = await providerServices.createMeals(req.body);
        res.status(200).json(mealsCreate);
      } catch (e) {
        next(e);
      }
    };
    updateMeals2 = async (req, res) => {
      const id = req.params.id;
      const userId = req.user?.id;
      try {
        const mealsUpdate = await providerServices.updateMeals(
          req.body,
          id,
          userId
        );
        res.status(200).json(mealsUpdate);
      } catch (e) {
        res.status(404).json({
          message: e.message || "An unexpected error occurred"
        });
      }
    };
    deleteMeals2 = async (req, res, next) => {
      const id = req.params.id;
      try {
        const mealsDelete = await providerServices.deleteMeals(id);
        res.status(200).json(mealsDelete);
      } catch (e) {
        next(e);
      }
    };
    providerController = {
      createProviderProfile: createProviderProfile2,
      getAllProvider: getAllProvider2,
      getProviderById: getProviderById2,
      getAllMeal: getAllMeal2,
      getProviderOwnMeals: getProviderOwnMeals2,
      getMealsById: getMealsById2,
      createMeals: createMeals2,
      updateMeals: updateMeals2,
      deleteMeals: deleteMeals2
    };
  }
});

// src/modules/provider/provider.router.ts
import { Router as Router2 } from "express";
var router2, providerRouter;
var init_provider_router = __esm({
  "src/modules/provider/provider.router.ts"() {
    "use strict";
    init_provider_controller();
    init_auth_middleware();
    init_enums();
    router2 = Router2();
    router2.get("/providers", providerController.getAllProvider);
    router2.get("/providers/:id", providerController.getProviderById);
    router2.post(
      "/provider-profile",
      auth_middleware_default(UserRole.PROVIDER),
      providerController.createProviderProfile
    );
    router2.get("/meals", providerController.getAllMeal);
    router2.get("/meals/own-meals", auth_middleware_default(UserRole.PROVIDER), providerController.getProviderOwnMeals);
    router2.get("/meals/:id", providerController.getMealsById);
    router2.post("/meals", auth_middleware_default(UserRole.PROVIDER), providerController.createMeals);
    router2.put("/meals/:id", auth_middleware_default(UserRole.PROVIDER), providerController.updateMeals);
    router2.delete("/meals/:id", auth_middleware_default(UserRole.PROVIDER), providerController.deleteMeals);
    providerRouter = router2;
  }
});

// src/modules/order/order.service.ts
var createOrder, getUserOwnOrder, getOrderById, getIncomingOrder, updateOrderStatus3, deleteOrder, orderServices;
var init_order_service = __esm({
  "src/modules/order/order.service.ts"() {
    "use strict";
    init_prisma();
    createOrder = async (payload, userId) => {
      const { delivery_address, items } = payload;
      const mealIds = items.map((item) => item.mealId);
      return await prisma.$transaction(async (tx) => {
        const meals = await tx.meal.findMany({
          where: {
            id: { in: mealIds }
          }
        });
        if (mealIds.length !== meals.length) {
          throw new Error("Some meal missing!!Please try again.");
        }
        const providerId = meals[0]?.provider_id;
        if (!providerId) {
          throw new Error("Provider not found for this order");
        }
        let calculateAmount = 0;
        const orderItemsData = items.map((item) => {
          const meal = meals.find((m) => item.mealId === m.id);
          if (!meal) {
            throw new Error("Meal not found!!");
          }
          const individualOrderTotapPrice = meal.price * item.quantity;
          calculateAmount += meal.price * item.quantity;
          return {
            meal_id: meal.id,
            quantity: item.quantity,
            price: meal.price,
            total_price: individualOrderTotapPrice
          };
        });
        return await tx.order.create({
          data: {
            user_id: userId,
            provider_id: providerId,
            total_amount: calculateAmount,
            delivery_address,
            orderItems: {
              create: orderItemsData
            }
          },
          include: {
            orderItems: {
              include: {
                meal: {
                  select: {
                    name: true
                  }
                }
              }
            }
          }
        });
      });
    };
    getUserOwnOrder = async (userId) => {
      return await prisma.order.findMany({
        where: {
          user_id: userId
        },
        include: {
          orderItems: {
            include: {
              meal: {
                select: {
                  name: true,
                  price: true
                }
              }
            }
          }
        }
      });
    };
    getOrderById = async (orderId) => {
      return await prisma.order.findUniqueOrThrow({
        where: {
          id: orderId
        },
        include: {
          orderItems: {
            include: {
              meal: {
                select: {
                  name: true,
                  price: true
                }
              }
            }
          }
        }
      });
    };
    getIncomingOrder = async (userId) => {
      return await prisma.$transaction(async (tx) => {
        const provider = await tx.providerProfile.findUniqueOrThrow({
          where: {
            user_id: userId
          }
        });
        const providerId = provider?.id;
        if (!providerId) {
          throw new Error("Provider not found");
        }
        return await tx.order.findMany({
          where: {
            provider_id: providerId
          },
          include: {
            orderItems: {
              include: {
                meal: {
                  select: {
                    name: true,
                    dietary: true,
                    categories: {
                      select: {
                        name: true
                      }
                    }
                  }
                }
              }
            }
          }
        });
      });
    };
    updateOrderStatus3 = async (id, status, userId) => {
      return await prisma.$transaction(async (tx) => {
        const provider = await tx.providerProfile.findUniqueOrThrow({
          where: {
            user_id: userId
          }
        });
        const providerId = provider.id;
        if (!provider) {
          throw new Error("Provider not found");
        }
        return await prisma.order.update({
          where: {
            id,
            provider_id: providerId
          },
          data: {
            status
          }
        });
      });
    };
    deleteOrder = async (id, userId) => {
      const order = await prisma.order.findUnique({
        where: {
          id
        }
      });
      if (!order || order.user_id !== userId) {
        throw new Error("Order not found");
      }
      if (order.status !== "PENDING") {
        throw new Error("This Order alredy ACCEPTED, do not delete this order");
      }
      return await prisma.order.delete({
        where: {
          id
        }
      });
    };
    orderServices = {
      createOrder,
      getUserOwnOrder,
      getOrderById,
      getIncomingOrder,
      updateOrderStatus: updateOrderStatus3,
      deleteOrder
    };
  }
});

// src/modules/order/order.controller.ts
var createOrder2, getUserOwnOrder2, getOrderById2, getIncomingOrder2, updateOrderStatus4, deleteOrder2, orderController;
var init_order_controller = __esm({
  "src/modules/order/order.controller.ts"() {
    "use strict";
    init_order_service();
    createOrder2 = async (req, res) => {
      const userId = req.user?.id;
      try {
        const orderCreate = await orderServices.createOrder(
          req.body,
          userId
        );
        res.status(200).json(orderCreate);
      } catch (e) {
        res.status(404).json({
          message: e.message || "An unexpected error occurred"
        });
      }
    };
    getUserOwnOrder2 = async (req, res) => {
      const userId = req.user?.id;
      try {
        const order = await orderServices.getUserOwnOrder(userId);
        res.status(200).json(order);
      } catch (e) {
        res.status(404).json({
          message: e.message || "An unexpected error occurred"
        });
      }
    };
    getOrderById2 = async (req, res) => {
      const orderId = req.params.id;
      try {
        const order = await orderServices.getOrderById(orderId);
        res.status(200).json(order);
      } catch (e) {
        res.status(404).json({
          message: e.message || "An unexpected error occurred"
        });
      }
    };
    getIncomingOrder2 = async (req, res) => {
      const userId = req.user?.id;
      try {
        const order = await orderServices.getIncomingOrder(userId);
        res.status(200).json(order);
      } catch (e) {
        res.status(404).json({
          message: e.message || "An unexpected error occurred"
        });
      }
    };
    updateOrderStatus4 = async (req, res) => {
      const id = req.params.id;
      const status = req.body.status;
      const userId = req.user?.id;
      try {
        const order = await orderServices.updateOrderStatus(
          id,
          status,
          userId
        );
        res.status(200).json(order);
      } catch (e) {
        res.status(404).json({
          message: e.message || "An unexpected error occurred"
        });
      }
    };
    deleteOrder2 = async (req, res) => {
      const id = req.params.id;
      const userId = req.user?.id;
      try {
        const order = await orderServices.deleteOrder(
          id,
          userId
        );
        res.status(200).json(order);
      } catch (e) {
        res.status(404).json({
          message: e.message || "An unexpected error occurred"
        });
      }
    };
    orderController = {
      createOrder: createOrder2,
      getUserOwnOrder: getUserOwnOrder2,
      getOrderById: getOrderById2,
      getIncomingOrder: getIncomingOrder2,
      updateOrderStatus: updateOrderStatus4,
      deleteOrder: deleteOrder2
    };
  }
});

// src/modules/order/order.router.ts
import { Router as Router3 } from "express";
var router3, orderRouter;
var init_order_router = __esm({
  "src/modules/order/order.router.ts"() {
    "use strict";
    init_auth_middleware();
    init_enums();
    init_order_controller();
    router3 = Router3();
    router3.get("/orders", auth_middleware_default(UserRole.CUSTOMER), orderController.getUserOwnOrder);
    router3.get("/orders/:id", auth_middleware_default(UserRole.CUSTOMER), orderController.getOrderById);
    router3.get("/incoming-orders", auth_middleware_default(UserRole.PROVIDER), orderController.getIncomingOrder);
    router3.post("/orders", auth_middleware_default(UserRole.CUSTOMER), orderController.createOrder);
    router3.patch("/orders/:id", auth_middleware_default(UserRole.PROVIDER), orderController.updateOrderStatus);
    router3.delete("/:id", auth_middleware_default(UserRole.CUSTOMER), orderController.deleteOrder);
    orderRouter = router3;
  }
});

// src/modules/customer/customer.services.ts
var updateCustomerProfile, crateCustomerReview, addToCart, getOwnCart, customerservices;
var init_customer_services = __esm({
  "src/modules/customer/customer.services.ts"() {
    "use strict";
    init_prisma();
    updateCustomerProfile = async (id, payload = {}) => {
      return await prisma.user.update({
        where: { id },
        data: {
          ...payload.name && { name: payload.name },
          ...payload.image && { image: payload.image },
          ...payload.phone_number && { phone_number: payload.phone_number }
        }
      });
    };
    crateCustomerReview = async (userId, data, mealId) => {
      return await prisma.$transaction(async (tx) => {
        const isEligible = await tx.order.findFirst({
          where: {
            user_id: userId,
            status: "DELIVERED",
            orderItems: {
              some: {
                meal_id: mealId
              }
            }
          }
        });
        if (!isEligible) {
          throw new Error("You can only review meals from your delivered orders.");
        }
        if (data.rating < 1 || data.rating > 5) {
          throw new Error("You can rating 1 to 5.");
        }
        const alreadyReviewed = await tx.review.findFirst({
          where: {
            user_id: userId,
            meal_id: mealId
          }
        });
        if (alreadyReviewed) {
          throw new Error("You have already reviewed this meal.");
        }
        const newReview = await tx.review.create({
          data: {
            user_id: userId,
            meal_id: mealId,
            rating: data.rating,
            comment: data.comment
          }
        });
        const states = await tx.review.aggregate({
          where: { meal_id: mealId },
          _avg: { rating: true },
          _count: { rating: true }
        });
        const averageRating = Number(states._avg.rating?.toFixed(1)) || 0;
        await tx.meal.update({
          where: { id: mealId },
          data: {
            averageRating,
            totalReviews: states._count.rating || 0
          }
        });
        return newReview;
      });
    };
    addToCart = async (userId, mealId, quyantity) => {
      return await prisma.$transaction(async (tx) => {
        const provider = await tx.meal.findUnique({
          where: {
            id: mealId
          }
        });
        const providerId = provider?.provider_id;
        if (!providerId) {
          throw new Error("Meal not found");
        }
        let cart = await tx.cart.findUnique({
          where: {
            user_id_provider_id: { user_id: userId, provider_id: providerId }
          }
        });
        if (!cart) {
          cart = await tx.cart.create({
            data: {
              user_id: userId,
              provider_id: providerId
            }
          });
        }
        const total_cart = await tx.cart.count();
        const existingItem = await tx.cartItem.findUnique({
          where: {
            cart_id_meal_id: {
              cart_id: cart.id,
              meal_id: mealId
            }
          }
        });
        if (existingItem) {
          const cartItem = await tx.cartItem.update({
            where: {
              id: existingItem.id
            },
            data: {
              quantity: existingItem.quantity + quyantity
            },
            include: {
              meal: {
                select: {
                  name: true,
                  image_url: true,
                  price: true,
                  provider: {
                    select: {
                      name: true,
                      logo_url: true
                    }
                  }
                }
              }
            }
          });
          return {
            data: cartItem,
            total_cart
          };
        } else {
          const cartItem = await tx.cartItem.create({
            data: {
              cart_id: cart.id,
              meal_id: mealId,
              quantity: quyantity
            },
            include: {
              meal: {
                select: {
                  name: true,
                  image_url: true,
                  price: true,
                  provider: {
                    select: {
                      name: true,
                      logo_url: true
                    }
                  }
                }
              }
            }
          });
          return { data: cartItem, total_cart };
        }
      });
    };
    getOwnCart = async (id) => {
      return await prisma.cart.findMany({
        where: {
          user_id: id
        },
        include: {
          cartItems: {
            include: {
              meal: {
                select: {
                  name: true,
                  price: true,
                  image_url: true
                }
              }
            }
          }
        }
      });
    };
    customerservices = {
      updateCustomerProfile,
      crateCustomerReview,
      addToCart,
      getOwnCart
    };
  }
});

// src/modules/customer/customer.controller.ts
var updateCustomerProfile2, crateCustomerReview2, addToCart2, getOwnCart2, customerController;
var init_customer_controller = __esm({
  "src/modules/customer/customer.controller.ts"() {
    "use strict";
    init_customer_services();
    updateCustomerProfile2 = async (req, res) => {
      const id = req.user?.id;
      const data = req.body;
      try {
        const result = await customerservices.updateCustomerProfile(
          id,
          data
        );
        res.status(200).json(result);
      } catch (e) {
        res.status(400).json({
          message: "User not found"
        });
      }
    };
    crateCustomerReview2 = async (req, res) => {
      const id = req.user?.id;
      const mealId = req.params.mealId;
      const data = req.body;
      try {
        const result = await customerservices.crateCustomerReview(
          id,
          data,
          mealId
        );
        res.status(200).json(result);
      } catch (e) {
        res.status(404).json({
          message: e.message || "An unexpected error occurred"
        });
      }
    };
    addToCart2 = async (req, res) => {
      const id = req.user?.id;
      const mealId = req.params.id;
      const { quantity } = req.body;
      try {
        const result = await customerservices.addToCart(
          id,
          mealId,
          quantity
        );
        res.status(200).json(result);
      } catch (e) {
        res.status(400).json({
          message: e.message || "An unexpected error occurred"
        });
      }
    };
    getOwnCart2 = async (req, res) => {
      const id = req.user?.id;
      try {
        const result = await customerservices.getOwnCart(
          id
        );
        res.status(200).json(result);
      } catch (e) {
        res.status(400).json({
          message: e.message || "An unexpected error occurred"
        });
      }
    };
    customerController = {
      updateCustomerProfile: updateCustomerProfile2,
      crateCustomerReview: crateCustomerReview2,
      addToCart: addToCart2,
      getOwnCart: getOwnCart2
    };
  }
});

// src/modules/customer/customer.router.ts
import { Router as Router4 } from "express";
var router4, customerRouter;
var init_customer_router = __esm({
  "src/modules/customer/customer.router.ts"() {
    "use strict";
    init_customer_controller();
    init_auth_middleware();
    init_enums();
    router4 = Router4();
    router4.patch(
      "/customer-profile",
      auth_middleware_default(UserRole.CUSTOMER),
      customerController.updateCustomerProfile
    );
    router4.post(
      "/customer-review/:mealId",
      auth_middleware_default(UserRole.CUSTOMER),
      customerController.crateCustomerReview
    );
    router4.post(
      "/addToCart/:id",
      auth_middleware_default(UserRole.CUSTOMER),
      customerController.addToCart
    );
    router4.get(
      "/cart",
      auth_middleware_default(UserRole.CUSTOMER),
      customerController.getOwnCart
    );
    customerRouter = router4;
  }
});

// src/app.ts
import { toNodeHandler } from "better-auth/node";
import express from "express";
import cors from "cors";
var app, app_default;
var init_app = __esm({
  "src/app.ts"() {
    "use strict";
    init_auth();
    init_admin_router();
    init_globalErrorHandler();
    init_provider_router();
    init_order_router();
    init_customer_router();
    app = express();
    app.use(
      cors({
        origin: process.env.APP_URL || "http://localhost:3000",
        credentials: true
      })
    );
    app.use(express.json());
    app.all("/api/auth/*splat", toNodeHandler(auth));
    app.use("/api/admin", adminRouter);
    app.use("/api/provider", providerRouter);
    app.use("/api/order", orderRouter);
    app.use("/api/customer", customerRouter);
    app.use(globalErrorHandler_default);
    app.get("/", async (req, res) => {
      res.send("Server Running");
    });
    app_default = app;
  }
});

// src/server.ts
var require_server = __commonJS({
  "src/server.ts"() {
    init_app();
    init_prisma();
    var port = process.env.PORT || 5e3;
    async function main() {
      try {
        await prisma.$connect();
        console.log("Connect to the db successfully");
        app_default.listen(port, () => {
          console.log(`Server is running on port, ${port}`);
        });
      } catch (err) {
        console.log("An error ocured!!", err);
        await prisma.$disconnect();
        process.exit(1);
      }
    }
    main();
  }
});
export default require_server();
