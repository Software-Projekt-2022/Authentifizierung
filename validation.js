const { checkSchema } = require('express-validator');
const database = require('./database');

const schema = {};
schema.create_account = checkSchema(
{
    email:
    {
        in: ['body'],
        exists: existsCustom('validation.email.missing'),
        isEmail: true
    },
    first_name:
    {
        in: ['body'],
        exists: existsCustom('validation.first_name.missing'),
        isLength: isLengthCustom(4, 64, 'validation.first_name.length'),
        trim: true
    },
    last_name:
    {
        in: ['body'],
        exists: existsCustom('validation.last_name.missing'),
        isLength: isLengthCustom(4, 64, 'validation.last_name.length'),
        trim: true
    },
    date_of_birth:
    {
        in: ['body'],
        exists: existsCustom('validation.date_of_birth.missing'),
        isISO8601: isISO8601Custom('validation.date_of_birth.invalid')
    },
    street:
    {
        in: ['body'],
        exists: existsCustom('validation.street.missing'),
        isLength: isLengthCustom(1, 64, 'validation.street.length'),
        trim: true
    },
    street2:
    {
        in: ['body'],
        isLength: isLengthCustom(0, 64, 'validation.street2.length'),
        trim: true
    },
    house_number:
    {
        in: ['body'],
        exists: existsCustom('validation.house_number.missing'),
        isLength: isLengthCustom(1, 8, 'validation.house_number.length'),
        trim: true
    },
    password:
    {
        in: ['body'],
        exists: existsCustom('validation.password.missing'),
        isLength: isLengthCustom(6, 32, 'validation.password.length'),
    }
});
schema.update_account = checkSchema(
{
    email:
    {
        in: ['body'],
        optional: true,
        isEmail: true
    },
    first_name:
    {
        in: ['body'],
        optional: true,
        isLength: isLengthCustom(4, 64, 'validation.first_name.length'),
        trim: true
    },
    last_name:
    {
        in: ['body'],
        optional: true,
        isLength: isLengthCustom(4, 64, 'validation.last_name.length'),
        trim: true
    },
    date_of_birth:
    {
        in: ['body'],
        optional: true,
        isISO8601: isISO8601Custom('validation.date_of_birth.invalid')
    },
    street:
    {
        in: ['body'],
        optional: true,
        isLength: isLengthCustom(1, 64, 'validation.street.length'),
        trim: true
    },
    street2:
    {
        in: ['body'],
        optional: true,
        isLength: isLengthCustom(1, 64, 'validation.street2.length'),
        trim: true
    },
    house_number:
    {
        in: ['body'],
        optional: true,
        isLength: isLengthCustom(1, 8, 'validation.house_number.length'),
        trim: true
    },
    password:
    {
        in: ['body'],
        optional: true,
        isLength: isLengthCustom(6, 32, 'validation.password.length'),
    }
});
schema.findByID = checkSchema(
{
    id:
    {
        in: ['query'],
        exists: existsCustom('validation.id.missing')
    }
});
schema.findByEmail = checkSchema(
{
    email:
    {
        in: ['query'],
        exists: existsCustom('validation.email.missing')
    }
});
schema.login = checkSchema(
{
    email:
    {
        in: ['body'],
        exists: existsCustom('validation.email.missing')
    },
    password:
    {
        in: ['body'],
        exists: existsCustom('validation.password.missing')
    }
});

function isLengthCustom(min, max, errMsg)
{
    return {
        errorMessage:
        {
            msg: errMsg,
            params:
            {
                'min': min,
                'max': max
            }
        },
        options: { 'min': min, 'max': max }
    };
}

function existsCustom(errMsg)
{
    return {
        errorMessage: {msg: errMsg},
        bail: true
    };
}

function isISO8601Custom(errMsg)
{
    return{
        errorMessage: {msg: errMsg}
    };
}

module.exports.schema = schema;
