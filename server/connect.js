import sql from "mssql";

const config = {
  user: "sa",
  password: "123123",
  server: "TECHCARE\\MSSQLSERVER2",
  database: "CSDLPT",
  trustServerCertificate: true,
};
const config1 = {
  user: "sa",
  password: "123123",
  server: "TECHCARE\\MSSQLSERVER1",
  database: "CSDLPT",
  trustServerCertificate: true,
};
const config2 = {
  user: "sa",
  password: "123123",
  server: "TECHCARE",
  database: "CSDLPT",
  trustServerCertificate: true,
};

const pool = new sql.ConnectionPool(config);
const connect = await pool.connect();
export default connect;
