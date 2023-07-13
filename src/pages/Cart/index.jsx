import { faCartShopping, faClose, faMinusCircle, faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import { Button, Container, Input, Table } from "reactstrap";
import "./CartStyle.scss";
import { useDispatch, useSelector } from "react-redux";
import { removeAll, removeItem, updateCart } from "redux/cart/cartSlice";
import ToastMessage from "components/Toast";
import { useEffect, useState } from "react";
import { TOAST_MESSAGE_CONSTANT } from "components/Toast";
function Cart() {
  const cart = useSelector((state) => state.cartReducer);
  const dispatch = useDispatch();
  const [toast, setToast] = useState({});
  const [toggleToast, setToggleToast] = useState(false);

  useEffect(() => {
    if (Object.keys(toast).length > 1) setToggleToast(true);
    const delay = setTimeout(() => {
      setToggleToast(false);
      setToast({});
    }, 2000);
    return () => clearTimeout(delay);
  }, [toast]);

  const handleIncrement = ({ ...product }) => {
    product.quantity += 1;
    dispatch(updateCart(product));
    setToast(TOAST_MESSAGE_CONSTANT.update);
  };

  const handleDecrement = ({ ...product }) => {
    if (product.quantity < 2) return;
    product.quantity -= 1;
    dispatch(updateCart(product));
    setToast(TOAST_MESSAGE_CONSTANT.update);
  };
  const clearCart = () => {
    dispatch(removeAll());
    setToast(TOAST_MESSAGE_CONSTANT.removeAll);
  };
  const handleRemoveItem = (product) => {
    dispatch(removeItem(product));
    setToast(TOAST_MESSAGE_CONSTANT.remove);
  };
  if (cart.length < 1)
    return (
      <Container className="cart py-5">
        <ToastMessage isOpen={toggleToast} message={toast} />
        <div className="my-5">
          <h1>
            <FontAwesomeIcon icon={faCartShopping} className="cartIconEmpty" />
          </h1>
          <h4 className="text-muted py-3">No item found in cart</h4>
          <Link to="/shop" color="dark" className="btn btn-dark text-uppercase py-2 px-4">
            Shop now
          </Link>
        </div>
      </Container>
    );
  return (
    <Container className="cart py-5">
      <ToastMessage isOpen={toggleToast} message={toast} />
      <div className="my-5">
        <h3>Your cart items</h3>
        <Table className="table-responsive">
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Price</th>
              <th>QTy</th>
              <th>Subtotal</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody className="text-center">
            {cart.map((el, index) => {
              return (
                <tr key={index}>
                  <td>
                    <img className="img-fluid" src={el.allImg?.split(",")[0]} alt="img" />
                  </td>
                  <td>
                    <div className="d-inline-block">
                      <Link to="/" className="text-decoration-none text-dark fw-bolder">
                        <h5>{el.name}</h5>
                      </Link>
                      {el.colorSelected && <p className="my-3 text-capitalize">Color: {el.colorSelected}</p>}
                      {el.sizeSelected && <p className="text-capitalize">Size: {el.sizeSelected}</p>}
                    </div>
                  </td>
                  <td className="price">{el.price.toLocaleString("vi", { style: "currency", currency: "VND" })}</td>
                  <td>
                    <div className="quantityBtn d-flex align-items-center justify-content-center ">
                      <FontAwesomeIcon icon={faMinusCircle} onClick={() => handleDecrement(el)} />
                      <Input type="text" value={el.quantity} className="border-0 bg-transparent" disabled></Input>
                      <FontAwesomeIcon icon={faPlusCircle} onClick={() => handleIncrement(el)} />
                    </div>
                  </td>
                  <td>{(el.price * el.quantity).toLocaleString("vi", { style: "currency", currency: "VND" })}</td>
                  <td>
                    <Button outline color="transparent" onClick={() => handleRemoveItem(el)}>
                      <FontAwesomeIcon icon={faClose} color="black" />
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
        <div className="d-flex align-items-center justify-content-between">
          <Button color="dark" className="rounded-5 text-uppercase py-2 px-4">
            <Link to="/shop" className="text-decoration-none text-light">
              Continue shopping
            </Link>
          </Button>
          <Button color="dark" onClick={() => clearCart()} className="rounded-5 text-uppercase py-2 px-4">
            Clear shopping cart
          </Button>
        </div>
      </div>
    </Container>
  );
}

export default Cart;
