const TYPE_BOOLEAN = 'boolean';
const TYPE_STRING = 'string';
const TYPE_NUMBER = 'number';

export class TypeUtility {
    public static isPrimitiveType(typeName: string | null): boolean {
        if (!typeName)
            return false;

        switch (typeName.trim()) {
            case TYPE_BOOLEAN:
            case TYPE_STRING:
            case TYPE_NUMBER:
                return true;
            default: return false;
        }
    }

    public static getPrimitiveTypeDefault(typeName: string | null): string | null {
        if (!typeName)
            return null;

        switch (typeName.trim()) {
            case TYPE_BOOLEAN:
                return 'false';
            case TYPE_STRING:
                return `''`; // empty string
            case TYPE_NUMBER:
                return '0';
            default: return null;
        }
    }
}