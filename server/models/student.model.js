import mongoose from 'mongoose';

const { Schema } = mongoose;

const studentSchema = new Schema(
    {
        name: {
            type: String,
            required: [true, 'Name is required'],
            trim: true,
        },

        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: true,
            lowercase: true,
            trim: true,
            match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
        },

        phone: {
            type: String,
            trim: true,
        },

        password: {
            type: String,
            required: [true, 'Password is required'],
            minlength: [6, 'Password must be at least 6 characters'],
            select: false, // Don't return password by default
        },

        rollNumber: {
            type: String,
            required: [true, 'Roll Number is required'],
            unique: true,
            trim: true,
        },

        registrationNumber: {
            type: String,
            required: [true, 'Registration Number is required'],
            unique: true,
            trim: true,
        },

        course: {
            type: String,
            trim: true,
        },

        branch: {
            type: String,
            trim: true,
        },

        batchYear: {
            type: Number,
        },

        gender: {
            type: String,
            enum: ['Male', 'Female', 'Other'],
        },

        dateOfBirth: {
            type: Date,
        },

        address: {
            type: String,
            trim: true,
        },

        role: {
            type: String,
            default: 'student',
            immutable: true,
        },

        isActive: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

studentSchema.pre('save', async function (next) {
    // only run on user creation
    if(this.isNew){
        if(!this.rollNumber && !this.dateOfBirth){
            return next(
                new Error('Roll No and DOB are required!')
            )
        }

        // parse dob
        const dob = new Date(this.dateOfBirth);

        const day = String(dob.getDate()).padStart(2, '0');
        const month = String(dob.getMonth() + 1).padStart(2, '0');
        const year = dob.getFullYear();

        const formattedDOB = `${day}${month}${year}`;

        this.password = `${this.rollNumber}@${formattedDOB}`
    }

    next()
})

// Indexes for performance
studentSchema.index({ isActive: 1 });
studentSchema.index({ batchYear: 1 });
studentSchema.index({ course: 1, branch: 1 });

export const Student = mongoose.model('Student', studentSchema);