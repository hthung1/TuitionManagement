import pool from "../connect.js";
import moment from "moment";

const feeCtrl = {
  pay: async (req, res) => {
    try {
      const { masv, money } = req.body;
      const role = req.cookies.role ? req.cookies.role.toString() : "";
      const time = moment().format("L");
      console.log(time);
      await pool.connect();
      await pool
        .request()
        .query(
          `INSERT INTO Bienlai (SoTien, NgayNop, SVNop, NguoiThu) VALUES ('${money}', '${time}', '${masv}', '${role}');`
        );
      console.log({ money, role, time, masv });
      res.status(200).json("Pay Success !!!");
    } catch (err) {
      res.status(500).json({ error: err });
    }
  },
  delete: async (req, res) => {
    try {
      const { masv } = req.body;
      await pool.connect();
      await pool.request().query(`DELETE FROM Bienlai WHERE SVNop= '${masv}'`);
      console.log(masv);
      res.status(200).json("Delete Success !!!");
    } catch (err) {
      res.status(500).json({ error: err });
    }
  },
  update: async (req, res) => {
    try {
      const { masv, money } = req.body;
      await pool.connect();
      await pool
        .request()
        .query(
          `UPDATE Bienlai SET SoTien = '${money}' WHERE SVNop = '${masv}'`
        );
      console.log(money, masv);
      res.status(200).json("Update Success !!!");
    } catch (err) {
      res.status(500).json({ error: err });
    }
  },
};

export default feeCtrl;
