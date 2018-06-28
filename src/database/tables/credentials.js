// imports.
import Table from 'src/database/tables/table'

// export a model for the credentials table.
export const credentials = new Table('credentials', ['name'], null)

// default table export.
export default credentials
