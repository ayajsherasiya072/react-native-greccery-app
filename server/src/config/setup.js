import AdminJS from 'adminjs'
import AdminJSFastify from '@adminjs/fastify'
import * as AdminJSMongoose from '@adminjs/mongoose'
import { Customer, DeliveryPartner, Admin } from '../models/user.model.js'
import { Branch } from '../models/branch.model.js'
import { Category } from '../models/category.model.js'
import { Product } from '../models/product.model.js'
import { Counter } from '../models/counter.model.js'
import { Order } from '../models/order.model.js'
import { authenticate, COOKIE_PASSWORD, sessionStore } from './config.js'
import { dark, light, noSidebar } from '@adminjs/themes'

// Register Mongoose adapter properly
AdminJS.registerAdapter(AdminJSMongoose)

export const admin = new AdminJS({
    resources: [
        {
            resource: Customer,
            options: {
                listProperties: ["phone", "role", "isActivated"],
                filterProperties: ["phone", "role"]
            }
        },
        {
            resource: DeliveryPartner,
            options: {
                listProperties: ["email", "role", "isActivated"],
                filterProperties: ["email", "role"]
            }
        },
        {
            resource: Admin,
            options: {
                listProperties: ["email", "role", "isActivated"], // Removed semicolon from "email;"
                filterProperties: ["email", "role"]
            }
        },
        { resource: Branch },
        { resource: Product },
        { resource: Order },
        { resource: Category },
        { resource: Counter }
    ],
    branding: {
        companyName: "Grocery App",
        withMadeWithLove: false
    },
    defaultTheme: dark.id,
    availableThemes: [dark, light, noSidebar],
    rootPath: "/admin"
})

export const buildRouter=async(app)=>{
    await AdminJSFastify.buildAuthenticatedRouter(
        admin,
        {
            authenticate,
            cookiePassword:COOKIE_PASSWORD,
            cookieName:"adminjs"
        },
        app,
        {
            store:sessionStore,
            saveUninitialized:true,
            secret:COOKIE_PASSWORD,
            cookie:{
                httpOnly:true,
                secure:false
            }
        }
    )
}
