
const Sequelize = require("sequelize")
const sequelize = new Sequelize(
    process.env.MYSQL_DB_NAME,
    process.env.MYSQL_USER,
    process.env.MYSQL_PASSWORD,
    {
        host: process.env.MYSQL_HOST,
        dialect: 'mysql'
    }
);

sequelize.authenticate().then(() => {
    console.log('Connection has been established successfully.')
}).catch((error) => {
    console.error('Unable to connect to the database: ', error)
})

async function query(query, args = {}) {
    let queryExecute = query
    let information = {}
    let error = null
    if (args.page && args.size) {
        queryExecute += ` limit ${args.size} offset  ${((args.page * args.size) - args.size)}`
    }

    await sequelize.query(queryExecute)
        .then(data => information.data = data[0])
        .catch(err => error = err)

    if (args.page && error === null) {
        const total = await paginator(args.table)
        const lastPage = Math.ceil(total.counted / args.size)
        information.meta = {
                total: total.counted,
                per_page: args.size,
                current_page: args.page,
                last_page: lastPage,
                first_page: 1,
                first_page_url: "/?page=1",
                last_page_url: `/?page=${lastPage}`,
                next_page_url: args.page === lastPage ? null : `/?page=${args.page + 1}`,
                previous_page_url: args.page === 1 ? null : `/?page=${args.page - 1}`
            }
    }else if(error !== null){
        information.error = error
    } else if (information.data.length === 0){
        information.error = "Data wasen't found"
        information.data = { message : "No se encontraron datos"}
    }

    return information
}


async function paginator(table) {
    const data = await sequelize.query("SELECT COUNT(id) AS counted FROM " + table + " WHERE deleted_at IS NULL ")
    return data[0][0]
}
module.exports = { query }