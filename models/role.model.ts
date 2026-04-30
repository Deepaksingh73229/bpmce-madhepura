import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IRole extends Document {
    name: string;
    parentRole?: Types.ObjectId;
    permissions: string[];
    createdAt: Date;
    updatedAt: Date;
}

const roleSchema = new Schema<IRole>(
    {
        name: {
            type: String,
            required: [true, 'Role name is required'],
            unique: true,
            trim: true,
            lowercase: true,
        },

        parentRole: {
            type: Schema.Types.ObjectId,
            ref: 'Role',
            default: null,
        },
        
        permissions: {
            type: [String],
            default: [],
        },
    },
    {
        timestamps: true,
    }
);

// Prevent circular hierarchy
roleSchema.pre('save', async function () {
    if (this.parentRole) {
        const checkCircular = async (roleId: Types.ObjectId, visited: Set<string> = new Set()): Promise<boolean> => {
            if (visited.has(roleId.toString())) {
                return true;
            }
            visited.add(roleId.toString());

            const role = await Role.findById(roleId);
            if (role?.parentRole) {
                return checkCircular(role.parentRole, visited);
            }
            return false;
        };

        const isCircular = await checkCircular(this.parentRole);
        if (isCircular) {
            throw new Error('Circular role hierarchy detected');
        }
    }
});

export const Role = mongoose.model<IRole>('Role', roleSchema);
