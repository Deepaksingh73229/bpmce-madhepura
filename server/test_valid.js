const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema(
    {
        name: { type: String, required: [true, 'Name is required'], trim: true },
        email: { type: String, required: [true, 'Email is required'], unique: true, lowercase: true, trim: true, match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'] },
        phone: { type: String, trim: true },
        password: { type: String, required: [true, 'Password is required'], minlength: [6, 'Password must be at least 6 characters'], select: false },
        rollNumber: { type: String, required: [true, 'Roll Number is required'], unique: true, trim: true },
        registrationNumber: { type: String, required: [true, 'Registration Number is required'], unique: true, trim: true },
        course: { type: String, trim: true },
        branch: { type: String, trim: true },
        batchYear: { type: Number },
        gender: { type: String, enum: ['Male', 'Female', 'Other'] },
        dateOfBirth: { type: Date },
        address: { type: String, trim: true },
        role: { type: String, default: 'student', immutable: true },
        isActive: { type: Boolean, default: true },
    },
    { timestamps: true }
);

studentSchema.pre('save', async function (next) {
    if(this.isNew){
        if(!this.rollNumber || !this.dateOfBirth){
            return next(new Error('Roll No and DOB are required!'))
        }
        const dob = new Date(this.dateOfBirth);
        const day = String(dob.getDate()).padStart(2, '0');
        const month = String(dob.getMonth() + 1).padStart(2, '0');
        const year = dob.getFullYear();
        const formattedDOB = \\\\\;
        this.password = \\@\\
    }
    next()
})

const Student = mongoose.model('Student', studentSchema);

const s = new Student({
    name: 'test',
    email: 'test@test.com',
    rollNumber: '1',
    registrationNumber: '2',
    course: 'test',
    branch: 'test',
    batchYear: 2024,
    dateOfBirth: new Date('2024-05-28')
});

// Since password is set in pre('save'), validateSync will FAIL on password!!
s.save().catch(err => console.log('HOOK ERROR:', err.message));
