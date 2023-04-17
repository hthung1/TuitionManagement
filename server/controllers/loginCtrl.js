import pool from "../connect.js";

const loginCtrl = {
  login: async (req, res) => {
    try {
      const { username, password } = req.body;
      // console.log(req.cookies);
      await pool.connect();
      const result = await pool
        .request()
        .query(
          `select * from users where Username='${username}' and password='${password}'`
        );
      const test = result.recordset;
      if (test) {
        const role = test.map((item) => item.role);
        res.cookie("role", role, {
          maxAge: 30 * 24 * 60 * 60 * 1000,
          httpOnly: true,
          sameSite: "strict",
        });
        return res.status(200).json({
          token: test.map((item) => item.role),
          name: test.map((item) => item.NguoiThu),
          email: username,
        });
      }
    } catch (err) {
      res.status(500).json({ error: err });
    }
  },
  register: async (req, res) => {
    return res.json(req.cookies.role);
  },
};

export default loginCtrl;
