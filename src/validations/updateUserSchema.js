const yup = require('./yup');

const updateUserSchema = yup.object().shape({
    name: yup.string(),
    email: yup.string().email(),
    password: yup.string(),
});

module.exports = updateUserSchema;