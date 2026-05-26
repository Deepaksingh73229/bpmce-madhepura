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

/**
 * Prevent circular role hierarchy
 *
 * Example invalid hierarchy:
 * Admin -> Teacher
 * Teacher -> Admin
 */
roleSchema.pre('save', async function () {

    // Skip if no parent role
    if (!this.parentRole) {
        return;
    }

    // Prevent self-parenting
    if (this.parentRole.toString() === this._id.toString()) {
        throw new Error('Role cannot be parent of itself');
    }

    /**
     * Recursively check hierarchy
     */
    const checkCircularHierarchy = async (roleId) => {

        const role = await mongoose
            .model('Role')
            .findById(roleId);

        // Role not found
        if (!role) {
            return false;
        }

        // Circular detected
        if (role._id.toString() === this._id.toString()) {
            return true;
        }

        // Continue checking upward hierarchy
        if (role.parentRole) {
            return checkCircularHierarchy(role.parentRole);
        }

        return false;
    };

    const isCircular = await checkCircularHierarchy(
        this.parentRole
    );

    if (isCircular) {
        throw new Error('Circular role hierarchy detected');
    }
});

export const Role = mongoose.model('Role', roleSchema);