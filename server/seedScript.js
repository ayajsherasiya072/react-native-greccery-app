import 'dotenv/config.js'
import mongoose from 'mongoose';
import {Category} from "./src/models/category.model.js"
import {Product} from './src/models/product.model.js'
import { categories,products } from './seedData.js';

async function seedDatabase() {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        await Product.deleteMany({});
        await Category.deleteMany({});

        const categoryDocs=await Category.insertMany(categories);
        
        const categoryMap=categoryDocs.reduce((map,category)=>{
            map[category.name]=category._id
            return map
        },{})

        const productwithCategoryId=products.map((product)=>({
            ...product,
            category:categoryMap[product.category],
        }))

        await Product.insertMany(productwithCategoryId);

        console.log("database seeded successfully");
        
    } catch (error) {
        console.error("error seeding database", error);
    }
    finally{
        mongoose.connection.close()
    }
}

seedDatabase()