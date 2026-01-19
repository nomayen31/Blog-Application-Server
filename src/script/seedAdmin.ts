import { prisma } from "../lib/prisma";
import { UserRole } from "../middleware/auth";

async function seedAdmin() {
    try {
        const adminData = {
            name: "Admin4",
            email: "admin4@admin.com",
            role: UserRole.ADMIN,
            password: "password123",
            emailVerified: true
        }
        // check user exist or not
        const existUser = await prisma.user.findUnique({
            where: {
                email: adminData.email
            }
        })
        if (existUser) {
            throw new Error("Admin already exist");
        }
        // if user not exist then create admin user
        const signUpAdmin = await fetch("http://localhost:3000/api/auth/sign-up/email", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Origin": "http://localhost:3000" // Required for Better-Auth
            },
            body: JSON.stringify(adminData),
        });
        const data = await signUpAdmin.json();
        console.log(data);
        if (signUpAdmin.ok) {
            await prisma.user.update({
                where: {
                    email: adminData.email
                },
                data: {
                    emailVerified: true
                }
            })
        }
    } catch (error: any) {
        if (error.cause?.code === 'ECONNREFUSED') {
            console.error("Error: Could not connect to server. Please ensure the server is running (npm run dev) on port 3000.");
        } else {
            console.log(error);
        }
    }
}

seedAdmin();
