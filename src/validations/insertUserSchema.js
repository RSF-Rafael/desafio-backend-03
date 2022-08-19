const yup = require('./yup');

const insertUserSchema = yup.object().shape({
    name: yup.string().required(),
    email: yup.string().email().required(),
    password: yup.string().required()
});

module.exports = insertUserSchema;