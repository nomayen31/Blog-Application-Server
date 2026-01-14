import app from "./app";
import { prisma } from "./lib/prisma";
const PORT = process.env.PORT || 3000;
async function main() {
    try {
        await prisma.$connect();
        console.log("Connetct to database successfully ");
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    }
    catch (error) {
        console.log("An error occurred", error);
        await prisma.$disconnect();
        process.exit(1);
    }
}
main();
//# sourceMappingURL=server.js.map