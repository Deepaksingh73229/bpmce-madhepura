import mongoose from 'mongoose';

const { Schema } = mongoose;

const roleSchema = new Schema(
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
roleSchema.pre('save', async function (next) {
    try {
        if (this.parentRole) {
            const checkCircular = async (roleId, visited = new Set()) => {
                const roleIdStr = roleId.toString();

                if (visited.has(roleIdStr)) {
                    return true;
                }

                visited.add(roleIdStr);

                const role = await mongoose.model('Role').findById(roleId);

                if (role && role.parentRole) {
                    return checkCircular(role.parentRole, visited);
                }

                return false;
            };

            const isCircular = await checkCircular(this.parentRole);

            if (isCircular) {
                throw new Error('Circular role hierarchy detected');
            }
        }

        next();
    } catch (err) {
        next(err);
    }
});

export const Role = mongoose.model('Role', roleSchema);