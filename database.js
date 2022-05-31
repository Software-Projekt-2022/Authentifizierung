const mariadb = require('mariadb');

console.log(
`Connecting to database with the following information:
  Host: ${process.env.DB_HOST}
  User: ${process.env.DB_USER}
  DB Name: ${process.env.DB_NAME}`
);

const db_connect_pool = mariadb.createPool({
    host: process.env.DB_HOST, 
    user: process.env.DB_USER, 
    password: process.env.DB_PASS,
    connectionLimit: 4,
    database: process.env.DB_NAME
});

function getPool()
{
    return db_connect_pool;
}

async function doQuery(query, values)
{
    try
    {
        const result = await db_connect_pool.query(query, values);
        return result;
    }
    catch(err)
    {
        console.log(err);
        return null;
    }
}

async function registerAccount(email, first_name, last_name, date_of_birth, street, street2, house_number, password)
{
    let result = await doQuery('CALL RegisterAccount(?, ?, ?, ?, ?, ?, ?, ?);',
    [email, first_name, last_name, date_of_birth, street, street2, house_number, password]);
    if(result && result.affectedRows == 1) // 1 because one row was added to 'account' table
    {
        return true;
    }
    return false;
}

async function isEmailTaken(email)
{
    let result = await doQuery('SELECT EXISTS(SELECT * FROM account WHERE email = ?);', [email]);

    if(result && result[0])
    {
        return Object.values(result[0])[0] === 1;
    }
    return true;
}

async function getAccountAuthData(email)
{
    let result = await doQuery('SELECT account_id, email, password FROM account WHERE email = ?;', [email]);

    if(result && result[0])
    {
        return result[0];
    }
    return null;
}

async function getAccountByID(account_id)
{
    let result = await doQuery(
    `SELECT
    account_id,
    email,
    first_name,
    last_name,
    date_of_birth,
    street,
    street2,
    house_number,
    registration_date
    FROM account
    WHERE account_id = ?;`, [account_id]);

    if(result && result[0])
    {
        return result[0];
    }
    return null;
}

async function getAccountByEmail(account_email)
{
    let acc = await doQuery(
    `SELECT
    account_id,
    email,
    first_name,
    last_name,
    date_of_birth,
    street,
    street2,
    house_number,
    registration_date
    FROM account
    WHERE email = ?;`, [account_email]);

    if(acc && acc[0])
    {
        return acc[0];
    }
    return null;
}

async function getAccountIDs()
{
    let accs = await doQuery('SELECT account_id FROM account;');

    if(accs)
    {
        const ids = [];
        for (const entry of accs)
        {
            ids.push(entry.account_id);
        }
        return ids;
    }
    return null;
}

async function updateRow(table, where, values)
{
    let query = `UPDATE ${table} SET `;
    let sqlValues = [];
    const valKeys = Object.keys(values);
    for (let i = 0; i < valKeys.length; i++)
    {
        query += `${valKeys[i]}=?`;
        if(i < valKeys.length - 1)
        {
            query += ',';
        }
        sqlValues.push(values[valKeys[i]]);
    }

    query += ` WHERE ${where.column}=?;`;
    sqlValues.push(where.value);

    await doQuery(query, sqlValues);
}

async function updateAccount(account_email, body)
{
    await updateRow('account', {column: 'email', value: account_email}, body);
}

module.exports.getPool = getPool;
module.exports.doQuery = doQuery;

module.exports.getAccountByEmail = getAccountByEmail;
module.exports.getAccountByID = getAccountByID;
module.exports.getAccountIDs = getAccountIDs;
module.exports.registerAccount = registerAccount;
module.exports.isEmailTaken = isEmailTaken;
module.exports.getAccountAuthData = getAccountAuthData;
module.exports.updateAccount = updateAccount;
