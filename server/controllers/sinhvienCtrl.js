import pool from "../connect.js";
const sinhvienCtrl = {
  getSinhvien: async (req, res) => {
    try {
      const role = req.cookies.role.toString();
      if (role == 1) {
        var query = "where lop.MaK = 'KHMT'";
      } else if (role == 2) {
        var query = "where lop.MaK = 'KTMT&DT'";
      } else {
        var query = "";
      }
      console.log(query);
      // await pool.connect();
      const result = await pool
        .request()
        .query(
          `SELECT SINHVIEN.HoTen,sinhvien.masv,BIENLAI.SoTien,BIENLAI.NgayNop, Users.NguoiThu ,lop.mak FROM BIENLAI INNER JOIN Users ON BIENLAI.NguoiThu = Users.id right join sinhvien on bienlai.SVnop = sinhvien.masv inner join lop on lop.mal = sinhvien.mal ${query}`
        );
      const test = result.recordset;
      res.status(200).json(test);
    } catch (err) {
      res.status(500).json({ error: err });
    }
  },
};
export default sinhvienCtrl;
