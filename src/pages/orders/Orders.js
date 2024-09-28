import React, { useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import './Orders.css';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ isCompleted }) => ({
  backgroundColor: isCompleted ? 'transparent' : '#ffcccc', // Softer red for incomplete orders
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const userRole = window.localStorage.getItem('role');
  const userId = window.localStorage.getItem('userId'); // Assuming you store userId in localStorage

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch('http://localhost:5000/order', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Network response was not ok ' + response.statusText);
        }

        const orders = await response.json();

        // Filter orders for user role 'Shop' to show only relevant orders
        if (userRole === 'Shop') {
          const filteredOrders = orders.filter(order => order.orderedBy !== userId);
          setOrders(filteredOrders);
        } else {
          setOrders(orders); // For other roles, show all orders
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };

    fetchOrders();
  }, [refresh]);

  const handleDone = async (orderId) => {
    try {
      const response = await fetch(`http://localhost:5000/order/${orderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isCompleted: true }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok ' + response.statusText);
      }

      setRefresh(!refresh);
    } catch (error) {
      console.error('Error updating order:', error);
    }
  };

  const handleCancel = async (orderId) => {
    try {
      const response = await fetch(`http://localhost:5000/order/${orderId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Network response was not ok ' + response.statusText);
      }

      setRefresh(!refresh);
    } catch (error) {
      console.error('Error canceling order:', error);
    }
  };

  return (
    <div>
      <h1 className="orders-title">Orders</h1>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 700 }} aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell>Order Name</StyledTableCell>
              <StyledTableCell align="right">Quantity</StyledTableCell>
              <StyledTableCell align="right">Ordered On</StyledTableCell>
              {userRole !== 'Shop' && <StyledTableCell align="right">Actions</StyledTableCell>}
              {userRole === 'Shop' && <StyledTableCell align="right">Ordered By</StyledTableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.length > 0 ? (
              orders.map((order) => (
                <StyledTableRow key={order._id} isCompleted={order.isCompleted}>
                  <StyledTableCell component="th" scope="row">
                    {order.name}
                  </StyledTableCell>
                  <StyledTableCell align="right">{order.quantity}</StyledTableCell>
                  <StyledTableCell align="right">{new Date(order.createdAt).toLocaleString()}</StyledTableCell>
                  {userRole !== 'Shop' && (
                    <StyledTableCell align="right">
                      <button
                        disabled={order.isCompleted}
                        onClick={() => handleDone(order._id)}
                        className="done-button"
                      >
                        {order.isCompleted ? 'Completed' : 'Done'}
                      </button>
                      <button
                        className="cancel-btn"
                        onClick={() => handleCancel(order._id)}
                      >
                        Cancel
                      </button>
                    </StyledTableCell>
                  )}
                  {userRole === 'Shop' && (
                    <StyledTableCell align="right">
                      {order.userRole ? order.userRole : 'Unknown'}
                    </StyledTableCell>
                  )}
                </StyledTableRow>
              ))
            ) : (
              <StyledTableRow>
                <StyledTableCell colSpan={5} align="center">No orders yet.</StyledTableCell>
              </StyledTableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default Orders;
