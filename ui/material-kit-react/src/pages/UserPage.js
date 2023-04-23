import { Helmet } from 'react-helmet-async';
import { filter } from 'lodash';
// import { sentenceCase } from 'change-case';
import moment from 'moment';
import { useState, useEffect } from 'react';

// @mui
import 'bootstrap/dist/css/bootstrap.min.css';
// Bootstrap Bundle JS
import 'bootstrap/dist/js/bootstrap.bundle.min';
import {
  Card,
  Table,
  Stack,
  Paper,
  Avatar,
  Popover,
  Button,
  Checkbox,
  TableRow,
  MenuItem,
  TableBody,
  TableCell,
  Container,
  Typography,
  IconButton,
  TableContainer,
  TablePagination,
} from '@mui/material';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
// components
import Label from '../components/label';
import Iconify from '../components/iconify';
import Scrollbar from '../components/scrollbar';
// sections
import { UserListHead, UserListToolbar } from '../sections/@dashboard/user';

// mock
// import USERLIST from '../_mock/user';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'name', label: 'Họ tên', alignRight: false },
  { id: 'MaSV', label: 'Mã sinh viên', alignRight: false },
  { id: 'money', label: 'Số tiền', alignRight: false },
  { id: 'date', label: 'Ngày thu', alignRight: false },
  { id: 'collector', label: 'Người thu', alignRight: false },
  { id: 'status', label: 'Trạng thái', alignRight: false },
  { id: '' },
];

// ----------------------------------------------------------------------

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function applySortFilter(array, comparator, query) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  if (query) {
    return filter(array, (_user) => _user.HoTen.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis.map((el) => el[0]);
}

export default function UserPage() {
  const [open, setOpen] = useState(null);

  const [data, setData] = useState();

  const [page, setPage] = useState(0);

  const [clickModal, setClickModal] = useState();

  const [order, setOrder] = useState('asc');

  const [selected, setSelected] = useState([]);

  const [orderBy, setOrderBy] = useState('name');

  const [filterName, setFilterName] = useState('');

  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [bills, setBills] = useState([]);

  const [modalShow, setModalShow] = useState(false);

  const [change, setChange] = useState(false);

  useEffect(() => {
    fetch(`http://localhost:5000/sinhvien`, { withCredentials: true, credentials: 'include' })
      .then((res) => res.json())
      .then((res) => {
        setBills(res);
      });
    setChange(false);
  }, [change]);
  const handleOpenMenu = (event, item) => {
    setOpen(event.currentTarget);
    setData(item);
  };

  const handleCloseMenu = () => {
    setOpen(null);
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = bills.map((n) => n.HoTen);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const handleFilterByName = (event) => {
    setPage(0);
    setFilterName(event.target.value);
  };

  const AddFee = () => {
    setModalShow(true);
    setClickModal(0);
    setOpen(null);
  };
  const EditFee = () => {
    setModalShow(true);
    setClickModal(1);
    setOpen(null);
  };
  const DeleteFee = () => {
    setModalShow(true);
    setClickModal(2);
    setOpen(null);
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - bills.length) : 0;

  const filteredUsers = applySortFilter(bills, getComparator(order, orderBy), filterName);

  const isNotFound = !filteredUsers.length && !!filterName;

  const tokenString = sessionStorage.getItem('token');
  const userToken = JSON.parse(tokenString);
  // const [fullscreen, setFullscreen] = useState('sm-down');
  function AddModal(props) {
    const [money, setMoney] = useState('5.000.000');
    const clickAddButton = () => {
      setChange(true);
      fetch('http://localhost:5000/fee', {
        method: 'POST',
        withCredentials: true,
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ masv: data.masv, money }),
      });
    };
    return (
      <Modal style={{ marginLeft: 100 }} {...props} size="lg" aria-labelledby="contained-modal-title-vcenter" centered>
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">Thu Phí</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Người thu</Form.Label>
              <Form.Control
                placeholder={
                  userToken?.token[0] === 1
                    ? 'Nguyễn Văn B'
                    : userToken?.token[0] === 2
                    ? 'Nguyễn Văn C'
                    : 'Nguyễn Văn A'
                }
                disabled
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Mã sinh viên</Form.Label>
              <Form.Control type="text" value={data?.masv} placeholder="Mã sinh viên" />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Số tiền</Form.Label>
              <Form.Control
                type="text"
                onChange={(e) => setMoney(e?.target.value)}
                value={money}
                placeholder="Số tiền"
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Form onClick={props.onHide}>
            <Button sx={{ color: 'error.main' }}>Không</Button>
            <Button sx={{ color: 'success.main' }} onClick={clickAddButton}>
              Nộp
            </Button>
          </Form>
        </Modal.Footer>
      </Modal>
    );
  }

  function EditModal(props) {
    const [money, setMoney] = useState(data?.SoTien);
    const clickEditButton = () => {
      setChange(true);
      fetch('http://localhost:5000/fee', {
        method: 'PATCH',
        withCredentials: true,
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ masv: data.masv, money }),
      });
    };
    return (
      <Modal style={{ marginLeft: 100 }} {...props} size="lg" aria-labelledby="contained-modal-title-vcenter" centered>
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">Sửa</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Người thu</Form.Label>
              <Form.Control
                placeholder={
                  userToken?.token[0] === 1
                    ? 'Nguyễn Văn B'
                    : userToken?.token[0] === 2
                    ? 'Nguyễn Văn C'
                    : 'Nguyễn Văn A'
                }
                disabled
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Mã sinh viên</Form.Label>
              <Form.Control type="text" value={data?.masv} placeholder="Mã sinh viên" disabled />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Số tiền</Form.Label>
              <Form.Control
                type="text"
                onChange={(e) => setMoney(e?.target.value)}
                value={money}
                placeholder="Số tiền"
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Form onClick={props.onHide}>
            <Button sx={{ color: 'error.main' }}>Không</Button>
            <Button sx={{ color: 'success.main' }} onClick={clickEditButton}>
              Sửa
            </Button>
          </Form>
        </Modal.Footer>
      </Modal>
    );
  }
  function DeleteModal(props) {
    const clickDeleteButton = () => {
      setChange(true);
      fetch('http://localhost:5000/fee', {
        method: 'DELETE',
        withCredentials: true,
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ masv: data.masv }),
      });
    };
    return (
      <Modal style={{ marginLeft: 100 }} {...props} size="lg" aria-labelledby="contained-modal-title-vcenter" centered>
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">Xóa</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Bạn muốn xóa hóa đơn có mã sinh viên {data.masv} ?</p>
        </Modal.Body>
        <Modal.Footer>
          <Form onClick={props.onHide}>
            <Button sx={{ color: 'error.main' }}>Không</Button>
            <Button sx={{ color: 'success.main' }} onClick={clickDeleteButton}>
              Xóa
            </Button>
          </Form>
        </Modal.Footer>
      </Modal>
    );
  }

  return (
    <>
      <Helmet>
        <title> User | Minimal UI </title>
      </Helmet>

      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            {userToken?.token[0] === 1 ? 'KHMT' : userToken?.token[0] === 2 ? 'KTMT&DT' : 'ALL'}
          </Typography>
          {/* <Button
            variant="contained"
            onClick={() => {
              setModalShow(true);
            }}
            startIcon={<Iconify icon="eva:plus-fill" />}
          >
            New User
          </Button> */}

          {clickModal === 1 ? (
            <EditModal show={modalShow} onHide={() => setModalShow(false)} />
          ) : clickModal === 2 ? (
            <DeleteModal show={modalShow} onHide={() => setModalShow(false)} />
          ) : (
            <AddModal show={modalShow} onHide={() => setModalShow(false)} />
          )}
        </Stack>

        <Card>
          <UserListToolbar numSelected={selected.length} filterName={filterName} onFilterName={handleFilterByName} />

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <UserListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={bills.length}
                  numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={handleSelectAllClick}
                />
                <TableBody>
                  {filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((item, index) => {
                    const selectedUser = selected.indexOf(item.HoTen) !== -1;

                    return (
                      <TableRow hover key={index} tabIndex={-1} role="checkbox" selected={selectedUser}>
                        <TableCell padding="checkbox">
                          <Checkbox checked={selectedUser} onChange={(event) => handleClick(event, item.HoTen)} />
                        </TableCell>

                        <TableCell component="th" scope="row" padding="none">
                          <Stack direction="row" alignItems="center" spacing={2}>
                            <Avatar alt={item.HoTen} src={'assets/images/avatars/avatar_10.jpg'} />
                            <Typography variant="subtitle2" noWrap>
                              {item.HoTen}
                            </Typography>
                          </Stack>
                        </TableCell>
                        <TableCell align="left">{item.masv}</TableCell>
                        <TableCell align="left">{item.SoTien}</TableCell>

                        <TableCell align="left">
                          {item.NgayNop ? moment.utc(item.NgayNop).format('MM/DD/YYYY') : item.NgayNop}
                        </TableCell>

                        <TableCell align="left">{item.NguoiThu}</TableCell>

                        <TableCell align="left">
                          <Label color={item.SoTien === '5.000.000' ? 'success' : item.SoTien ? 'warning' : 'error'}>
                            {item.SoTien === '5.000.000' ? 'Đã nộp' : item.SoTien ? 'Nộp thiếu' : 'Chưa nộp'}
                          </Label>
                        </TableCell>

                        <TableCell align="right">
                          <IconButton size="large" color="inherit" onClick={(e) => handleOpenMenu(e, item)}>
                            <Iconify icon={'eva:more-vertical-fill'} />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  {emptyRows > 0 && (
                    <TableRow style={{ height: 53 * emptyRows }}>
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
                </TableBody>

                {isNotFound && (
                  <TableBody>
                    <TableRow>
                      <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                        <Paper
                          sx={{
                            textAlign: 'center',
                          }}
                        >
                          <Typography variant="h6" paragraph>
                            Not found
                          </Typography>

                          <Typography variant="body2">
                            No results found for &nbsp;
                            <strong>&quot;{filterName}&quot;</strong>.
                            <br /> Try checking for typos or using complete words.
                          </Typography>
                        </Paper>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                )}
              </Table>
            </TableContainer>
          </Scrollbar>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={bills.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
      </Container>

      <Popover
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleCloseMenu}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: {
            p: 1,
            width: 140,
            '& .MuiMenuItem-root': {
              px: 1,
              typography: 'body2',
              borderRadius: 0.75,
            },
          },
        }}
      >
        {!data?.NguoiThu ? (
          <MenuItem sx={{ color: 'success.main' }} onClick={() => AddFee()}>
            <Iconify icon={'eva:checkmark-circle-fill'} sx={{ mr: 2 }} />
            Nộp
          </MenuItem>
        ) : null}
        {data?.NguoiThu ? (
          <div>
            <MenuItem onClick={() => EditFee()}>
              <Iconify icon={'eva:edit-fill'} sx={{ mr: 2 }} />
              Sửa
            </MenuItem>
            <MenuItem sx={{ color: 'error.main' }} onClick={() => DeleteFee()}>
              <Iconify icon={'eva:trash-2-outline'} sx={{ mr: 2 }} />
              Xóa
            </MenuItem>
          </div>
        ) : null}
      </Popover>
    </>
  );
}
