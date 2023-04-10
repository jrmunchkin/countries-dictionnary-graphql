"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const express_graphql_1 = require("express-graphql");
const mongoose_1 = __importDefault(require("mongoose"));
const schema_1 = __importDefault(require("./schema/schema"));
const cors_1 = __importDefault(require("cors"));
dotenv_1.default.config();
const MODE = process.env.MODE;
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json({ limit: "10mb" }));
if (MODE == "db") {
    const MONGO_URL = process.env.MONGO_URL;
    mongoose_1.default.connect(MONGO_URL);
    mongoose_1.default.connection.once("open", () => {
        console.log("connected to database");
    });
}
app.use("/", (0, express_graphql_1.graphqlHTTP)({
    schema: schema_1.default,
    graphiql: true,
    context: {
        environment: MODE,
    },
}));
app.listen(process.env.PORT, () => {
    console.log(`🚀  Server ready at http://localhost:${process.env.PORT}/`);
});
//# sourceMappingURL=index.js.map