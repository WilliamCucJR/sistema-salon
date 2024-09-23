/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import {
  GridRow,
  GridColumn,
  Grid,
  Image,
  Button,
  ButtonContent,
  Icon,
} from "semantic-ui-react";
import { jwtDecode } from 'jwt-decode';
import "./Store.css";

export default function Store() {
  const urlBase = import.meta.env.VITE_DEVELOP_URL_API;
  const urlFile = import.meta.env.VITE_DEVELOP_URL_FILE;
  const urlProducts = `${urlBase}products`;
  const urlCart = `${urlBase}cart`;
  const urlTotal = `${urlBase}cart/total`;
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState({});
  const [totalQuantity, setTotalQuantity] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userSessionData, setUserSessionData] = useState(null);
  const today = new Date();

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(urlProducts);
        if (!response.ok) {
          throw new Error("Error al obtener los productos");
        }
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [urlProducts]);

  // Decode token and get user session data
  useEffect(() => {
    const decodeToken = () => {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No token found in local storage');
        return null;
      }

      try {
        const decoded = jwtDecode(token);
        console.log('Decoded token:', decoded);
        setUserSessionData(decoded);
      } catch (error) {
        console.error('Error decoding token:', error);
        setUserSessionData(null);
      }
    };

    decodeToken();
  }, []);

  // Fetch cart data when userSessionData is not null
  useEffect(() => {
    const fetchCartData = async () => {
      if (!userSessionData || !userSessionData.id) return;

      try {
        const response = await fetch(`${urlTotal}/${userSessionData.id}`);
        if (!response.ok) {
          throw new Error("Error al obtener los datos del carrito");
        }
        const data = await response.json();
        
        console.log('Datos del carrito:', data);

        const cantidad = parseInt(data[0].CANTIDAD);
        const total = parseFloat(data[0].TOTAL);

        setTotalQuantity(cantidad);
        setTotalPrice(total);
        
        // Aquí puedes calcular totalQuantity y totalPrice si es necesario
      } catch (error) {
        setError(error.message);
      }
    };

    fetchCartData();
  }, [userSessionData, urlTotal]);

  const addToCart = (product) => {
    setCart((prevCart) => {
      const currentQuantity = prevCart[product.PRO_ID]?.quantity || 0;
      if (currentQuantity < product.PRO_STOCK) {
        const newCart = {
          ...prevCart,
          [product.PRO_ID]: {
            PRO_ID: product.PRO_ID,
            PRO_VALUE: parseFloat(product.PRO_VALUE),
            quantity: currentQuantity + 1,
          },
        };
        setTotalQuantity((prevTotalQuantity) => prevTotalQuantity + 1);
        setTotalPrice((prevTotalPrice) => prevTotalPrice + parseFloat(product.PRO_VALUE));
        return newCart;
      } else {
        alert('No hay suficiente stock disponible');
        return prevCart;
      }
    });
  };

  const removeFromCart = (product) => {
    setCart((prevCart) => {
      const currentQuantity = prevCart[product.PRO_ID]?.quantity || 0;
      if (currentQuantity > 1) {
        const newCart = {
          ...prevCart,
          [product.PRO_ID]: {
            PRO_ID: product.PRO_ID,
            PRO_VALUE: parseFloat(product.PRO_VALUE),
            quantity: currentQuantity - 1,
          },
        };
        setTotalQuantity((prevTotalQuantity) => prevTotalQuantity - 1);
        setTotalPrice((prevTotalPrice) => prevTotalPrice - parseFloat(product.PRO_VALUE));
        return newCart;
      } else {
        const { [product.PRO_ID]: _, ...rest } = prevCart;
        setTotalQuantity((prevTotalQuantity) => prevTotalQuantity - 1);
        setTotalPrice((prevTotalPrice) => prevTotalPrice - parseFloat(product.PRO_VALUE));
        return rest;
      }
    });
  };

  const goToPayment = () => {
    const userSessionId = userSessionData['id'];
    const today = new Date();
    const orderIdentifier = `ORD${userSessionId}${today.getFullYear()}${today.getMonth() + 1}${today.getDate()}`;
    const orderDate = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()} ${today.getHours()}:${today.getMinutes()}:${today.getSeconds()}`;
    const updatedStockArray = [];

    Object.entries(cart).forEach(([productId, productDetails]) => {
      const ORDER_IDENTIFIER = orderIdentifier;
      const ORD_ORDER_DATE = orderDate;
      const CUS_ID = userSessionId;
      const PRO_ID = productId;
      const ORD_QUANTITY = productDetails['quantity'];
      const ORD_TOTAL = productDetails['quantity'] * productDetails['PRO_VALUE'];
  
      const orderData = {
        ORD_IDENTIFIER: ORDER_IDENTIFIER,
        ORD_ORDER_DATE: ORD_ORDER_DATE,
        CUS_ID: CUS_ID,
        PRO_ID: PRO_ID,
        ORD_QUANTITY: ORD_QUANTITY,
        ORD_TOTAL: ORD_TOTAL
      };

      const product = products.find(p => p.PRO_ID === parseInt(productId));

      const updatedStock = product.PRO_STOCK - ORD_QUANTITY;
      const stockData = {
        PRO_STOCK: updatedStock
      };
      updatedStockArray.push(stockData);
      sendOrderData(orderData);
      updateStock(PRO_ID, stockData);
    });

  };
  
  const sendOrderData = async (orderData) => {
    try {
      const response = await fetch(urlCart, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });
  
      if (!response.ok) {
        throw new Error('Error al enviar los datos del pedido');
      }
  
      const result = await response.json();
      console.log('Respuesta del servidor:', result);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const updateStock = async (PRO_ID, stockData) => {
    try {
      const response = await fetch(`${urlProducts}/${PRO_ID}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(stockData),
      });

      if (!response.ok) {
        throw new Error('Error al actualizar el stock');
      }

      const result = await response.json();
      console.log('Respuesta del servidor:', result);
    } catch (error) {
      console.error('Error:', error);
    }
  }

  useEffect(() => {
    console.log('Cantidad total:', totalQuantity);
    console.log('Precio total:', totalPrice);
  }, [totalQuantity, totalPrice]);

  if (loading) {
    return <div>Cargando...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h1>Tienda</h1>
      <div className="pay-button-container">
        <div className="button-container" style={{ width: "24%" }}>
          <GridColumn width={4} textAlign="right">
            <Button animated="fade" style={{ float: "right" }} color="yellow" onClick={goToPayment}>
              <ButtonContent visible><Icon name="payment" /> Realizár pago</ButtonContent>
              <ButtonContent hidden>  {totalQuantity} / Q {totalPrice.toFixed(2)}</ButtonContent>
            </Button>
          </GridColumn>
        </div>
      </div>
      <div className="store-container">
        <Grid>
          {products.map((product) => (
            <GridRow key={product.PRO_ID} className="grid-card-content">
              <GridColumn width={4}>
                <Image
                  src={`${urlFile}${product.PRO_IMAGEN}`}
                  alt={product.PRO_NAME}
                  className="product-image"
                />
              </GridColumn>
              <GridColumn width={8}>
                <h2>{product.PRO_NAME}</h2>
                <p>{product.PRO_DESCRIPTION}</p>
                <p>Precio: Q {product.PRO_VALUE}</p>
                <p>Disponible: {product.PRO_STOCK}</p>
              </GridColumn>
              <GridColumn width={4} textAlign="right">
                <div className="button-container">
                  <Button
                    onClick={() => addToCart(product)}
                    disabled={
                      cart[product.PRO_ID]?.quantity >= product.PRO_STOCK
                    }
                    animated="vertical"
                    color="teal"
                  >
                    <ButtonContent hidden>Añadir al carrito</ButtonContent>
                    <ButtonContent visible>
                      <Icon name="shop" />
                    </ButtonContent>
                  </Button>
                  <Button
                    onClick={() => removeFromCart(product)}
                    disabled={!cart[product.PRO_ID]?.quantity}
                    inverted
                    color="red"
                    animated="vertical"
                  >
                    <ButtonContent hidden>Quitar del carrito</ButtonContent>
                    <ButtonContent visible>
                      <Icon name="trash" />
                    </ButtonContent>
                  </Button>
                </div>
              </GridColumn>
            </GridRow>
          ))}
        </Grid>
      </div>
    </div>
  );
}