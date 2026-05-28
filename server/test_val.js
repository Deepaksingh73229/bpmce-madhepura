import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        password: { type: String, required: true, minlength: 6 },
        rollNumber: { type: String, required: true },
        dateOfBirth: { type: Date }
    }
);

studentSchema.pre('save', function (next) {
    if(this.isNew) {
        this.password = '123456';
    }
    next();
});

const Student = mongoose.model('Student', studentSchema);

const s = new Student({
    name: 'test',
    rollNumber: '1',
    dateOfBirth: new Date()
});

s.validate()
.then(() => console.log('Validated ok!'))
.catch(err => {
    console.error('Validation failed: ', err.message);
});