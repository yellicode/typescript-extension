"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const model = require("@yellicode/model");
const templating_1 = require("@yellicode/templating");
class TypeScriptTypeNameProvider extends templating_1.DefaultTypeNameProvider {
    getPrimitiveTypeName(type) {
        if (model.isPrimitiveBoolean(type))
            return "boolean";
        if (model.isPrimitiveInteger(type) || model.isPrimitiveReal(type))
            return "number";
        if (model.isPrimitiveString(type))
            return "string";
        if (model.isPrimitiveObject(type))
            return "any";
        return super.getPrimitiveTypeName(type);
    }
}
exports.TypeScriptTypeNameProvider = TypeScriptTypeNameProvider;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHlwZXNjcmlwdC10eXBlLW5hbWUtcHJvdmlkZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJ0eXBlc2NyaXB0LXR5cGUtbmFtZS1wcm92aWRlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLDBDQUEwQztBQUMxQyxzREFBZ0U7QUFFaEUsZ0NBQXdDLFNBQVEsb0NBQXVCO0lBQzVDLG9CQUFvQixDQUFDLElBQXlCO1FBQ2pFLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUM7UUFDckQsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLGtCQUFrQixDQUFDLElBQUksQ0FBQyxJQUFJLEtBQUssQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDOUQsTUFBTSxDQUFDLFFBQVEsQ0FBQztRQUVwQixFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsaUJBQWlCLENBQUMsSUFBSSxDQUFDLENBQUM7WUFBQyxNQUFNLENBQUMsUUFBUSxDQUFDO1FBQ25ELEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUM7UUFDaEQsTUFBTSxDQUFDLEtBQUssQ0FBQyxvQkFBb0IsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUM1QyxDQUFDO0NBQ0o7QUFWRCxnRUFVQyJ9