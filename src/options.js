"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Defines options for dealing with elements that are 'optional', meaning that they have a lower bound of 0.
 */
var OptionalityModifier;
(function (OptionalityModifier) {
    /**
     * Don't write any modifier.
     */
    OptionalityModifier[OptionalityModifier["Ignore"] = 0] = "Ignore";
    /**
     * Write a 'null' keyword, for example 'myProperty: string | null;';
     */
    OptionalityModifier[OptionalityModifier["NullKeyword"] = 1] = "NullKeyword";
    /**
     * Write a question token, for example 'myProperty?: string;';
     */
    OptionalityModifier[OptionalityModifier["QuestionToken"] = 2] = "QuestionToken";
})(OptionalityModifier = exports.OptionalityModifier || (exports.OptionalityModifier = {}));
var EnumFeatures;
(function (EnumFeatures) {
    EnumFeatures[EnumFeatures["None"] = 0] = "None";
    EnumFeatures[EnumFeatures["JsDocDescription"] = 1] = "JsDocDescription";
    EnumFeatures[EnumFeatures["Initializers"] = 2] = "Initializers";
    EnumFeatures[EnumFeatures["All"] = 3] = "All";
    EnumFeatures[EnumFeatures["AllExceptJsDoc"] = 2] = "AllExceptJsDoc";
})(EnumFeatures = exports.EnumFeatures || (exports.EnumFeatures = {}));
var ClassFeatures;
(function (ClassFeatures) {
    ClassFeatures[ClassFeatures["None"] = 0] = "None";
    ClassFeatures[ClassFeatures["JsDocDescription"] = 1] = "JsDocDescription";
    ClassFeatures[ClassFeatures["Generalizations"] = 2] = "Generalizations";
    ClassFeatures[ClassFeatures["InterfaceRealizations"] = 4] = "InterfaceRealizations";
    ClassFeatures[ClassFeatures["All"] = 7] = "All";
    ClassFeatures[ClassFeatures["AllExceptJsDoc"] = 6] = "AllExceptJsDoc";
})(ClassFeatures = exports.ClassFeatures || (exports.ClassFeatures = {}));
var InterfaceFeatures;
(function (InterfaceFeatures) {
    InterfaceFeatures[InterfaceFeatures["None"] = 0] = "None";
    InterfaceFeatures[InterfaceFeatures["JsDocDescription"] = 1] = "JsDocDescription";
    InterfaceFeatures[InterfaceFeatures["Generalizations"] = 2] = "Generalizations";
    InterfaceFeatures[InterfaceFeatures["All"] = 3] = "All";
    InterfaceFeatures[InterfaceFeatures["AllExceptJsDoc"] = 2] = "AllExceptJsDoc";
})(InterfaceFeatures = exports.InterfaceFeatures || (exports.InterfaceFeatures = {}));
var PropertyFeatures;
(function (PropertyFeatures) {
    PropertyFeatures[PropertyFeatures["None"] = 0] = "None";
    PropertyFeatures[PropertyFeatures["JsDocDescription"] = 1] = "JsDocDescription";
    PropertyFeatures[PropertyFeatures["AccessModifier"] = 2] = "AccessModifier";
    PropertyFeatures[PropertyFeatures["ReadonlyModifier"] = 4] = "ReadonlyModifier";
    PropertyFeatures[PropertyFeatures["OptionalModifier"] = 8] = "OptionalModifier";
    // Initializer = 1 << 4,
    PropertyFeatures[PropertyFeatures["All"] = 15] = "All"; /*| Initializer */
    PropertyFeatures[PropertyFeatures["AllExceptJsDoc"] = 14] = "AllExceptJsDoc"; /* | Initializer*/
})(PropertyFeatures = exports.PropertyFeatures || (exports.PropertyFeatures = {}));
var FunctionFeatures;
(function (FunctionFeatures) {
    FunctionFeatures[FunctionFeatures["None"] = 0] = "None";
    FunctionFeatures[FunctionFeatures["Comments"] = 1] = "Comments";
    FunctionFeatures[FunctionFeatures["JsDocDescription"] = 2] = "JsDocDescription";
    FunctionFeatures[FunctionFeatures["JsDocParameters"] = 4] = "JsDocParameters";
    FunctionFeatures[FunctionFeatures["AccessModifier"] = 8] = "AccessModifier";
    FunctionFeatures[FunctionFeatures["All"] = 15] = "All";
    FunctionFeatures[FunctionFeatures["AllExceptJsDoc"] = 8] = "AllExceptJsDoc";
})(FunctionFeatures = exports.FunctionFeatures || (exports.FunctionFeatures = {}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib3B0aW9ucy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIm9wdGlvbnMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFFQTs7R0FFRztBQUNILElBQVksbUJBYVg7QUFiRCxXQUFZLG1CQUFtQjtJQUMzQjs7T0FFRztJQUNILGlFQUFVLENBQUE7SUFDVjs7T0FFRztJQUNILDJFQUFvQixDQUFBO0lBQ3BCOztPQUVHO0lBQ0gsK0VBQXNCLENBQUE7QUFDMUIsQ0FBQyxFQWJXLG1CQUFtQixHQUFuQiwyQkFBbUIsS0FBbkIsMkJBQW1CLFFBYTlCO0FBZUQsSUFBWSxZQU1YO0FBTkQsV0FBWSxZQUFZO0lBQ3BCLCtDQUFRLENBQUE7SUFDUix1RUFBeUIsQ0FBQTtJQUN6QiwrREFBcUIsQ0FBQTtJQUNyQiw2Q0FBcUMsQ0FBQTtJQUNyQyxtRUFBNkIsQ0FBQTtBQUNqQyxDQUFDLEVBTlcsWUFBWSxHQUFaLG9CQUFZLEtBQVosb0JBQVksUUFNdkI7QUFPRCxJQUFZLGFBT1g7QUFQRCxXQUFZLGFBQWE7SUFDckIsaURBQVEsQ0FBQTtJQUNSLHlFQUF5QixDQUFBO0lBQ3pCLHVFQUF3QixDQUFBO0lBQ3hCLG1GQUE4QixDQUFBO0lBQzlCLCtDQUFnRSxDQUFBO0lBQ2hFLHFFQUF3RCxDQUFBO0FBQzVELENBQUMsRUFQVyxhQUFhLEdBQWIscUJBQWEsS0FBYixxQkFBYSxRQU94QjtBQXFCRCxJQUFZLGlCQU1YO0FBTkQsV0FBWSxpQkFBaUI7SUFDekIseURBQVEsQ0FBQTtJQUNSLGlGQUF5QixDQUFBO0lBQ3pCLCtFQUF3QixDQUFBO0lBQ3hCLHVEQUF3QyxDQUFBO0lBQ3hDLDZFQUFnQyxDQUFBO0FBQ3BDLENBQUMsRUFOVyxpQkFBaUIsR0FBakIseUJBQWlCLEtBQWpCLHlCQUFpQixRQU01QjtBQWlCRCxJQUFZLGdCQVNYO0FBVEQsV0FBWSxnQkFBZ0I7SUFDeEIsdURBQVEsQ0FBQTtJQUNSLCtFQUF5QixDQUFBO0lBQ3pCLDJFQUF1QixDQUFBO0lBQ3ZCLCtFQUF5QixDQUFBO0lBQ3pCLCtFQUF5QixDQUFBO0lBQ3pCLHdCQUF3QjtJQUN4QixzREFBNkUsQ0FBQSxDQUFDLGtCQUFrQjtJQUNoRyw0RUFBcUUsQ0FBQSxDQUFDLGtCQUFrQjtBQUM1RixDQUFDLEVBVFcsZ0JBQWdCLEdBQWhCLHdCQUFnQixLQUFoQix3QkFBZ0IsUUFTM0I7QUFhRCxJQUFZLGdCQVFYO0FBUkQsV0FBWSxnQkFBZ0I7SUFDeEIsdURBQVEsQ0FBQTtJQUNSLCtEQUFpQixDQUFBO0lBQ2pCLCtFQUF5QixDQUFBO0lBQ3pCLDZFQUF3QixDQUFBO0lBQ3hCLDJFQUF1QixDQUFBO0lBQ3ZCLHNEQUFvRSxDQUFBO0lBQ3BFLDJFQUErQixDQUFBO0FBQ25DLENBQUMsRUFSVyxnQkFBZ0IsR0FBaEIsd0JBQWdCLEtBQWhCLHdCQUFnQixRQVEzQiJ9