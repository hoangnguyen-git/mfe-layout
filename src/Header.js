import React, { useEffect, useState } from 'react';
import { Heading4 } from 'ui-components';

import { API_ROOT } from './env';
import * as S from './Header.styles';

export default () => {
  const [itemsInCart, setItemsInCart] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(JSON.parse(localStorage.getItem('isLoggedIn')) || false);

  const addToCartEventlistener = async ({ detail }) => {
    const newItemInCart = { item: { id: detail.itemId, price: detail.price } };
    try {
      const itemAdded = await fetch(`${API_ROOT.DEV}/cart/1/items`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'auth-token': localStorage.getItem('authToken'),
        },
        body: JSON.stringify(newItemInCart)
      }).then(res => res.json());

      setItemsInCart((itemsInCart) => [...itemsInCart, itemAdded]);
    } catch (e) {
      alert('something went wrong')
    }
  };

  const removeFromCartEventlistener = async ({ detail }) => {
    try {
      await fetch(`${API_ROOT.DEV}/items/${detail.itemId}`, {
        method: 'DELETE',
        headers: {
          'auth-token': localStorage.getItem('authToken'),
        }
      }).then(res => res.json());

      setItemsInCart((itemsInCart) => itemsInCart.filter(item => item.id !== detail.itemId));
    } catch (e) {
      alert('something went wrong')
    }
  };

  useEffect(async () => {
    const itemsInCart = await fetch(`${API_ROOT.DEV}/cart/1/items`, {
      headers: {
        'auth-token': localStorage.getItem('authToken'),
      }
    }).then(res => res.json());

    setItemsInCart(itemsInCart);
  }, []);

  useEffect(() => {
    window.addEventListener('ADD_TO_CART', addToCartEventlistener)
    window.addEventListener('REMOVE_FROM_CART', removeFromCartEventlistener)
    return () => {
      window.removeEventListener('ADD_TO_CART', addToCartEventlistener)
      window.removeEventListener('REMOVE_FROM_CART', addToCartEventlistener)
    }
  }, []);

  const logout = (e) => {
    e.preventDefault();
    localStorage.setItem('isLoggedIn', false);
    localStorage.removeItem('authToken');
    setIsLoggedIn(false);
    window.location.href = "https://e-commerce-microfrontend-api-b3671a39f1e5.herokuapp.com/products/";
  }

  return (
    <S.Header>
      <div className='container'>
        <S.Content>
          <a href="https://e-commerce-microfrontend-api-b3671a39f1e5.herokuapp.com/products/">
            <Heading4>CBP Marketplace</Heading4>
          </a>
          {
            isLoggedIn ?
              <div>
                <S.CartLink id="go-to-cart" href="https://e-commerce-microfrontend-api-b3671a39f1e5.herokuapp.com/cart/">
                  Cart
                  {
                    itemsInCart.length > 0 &&
                    <S.CartCount id="cart-count">{itemsInCart.length}</S.CartCount>
                  }
                </S.CartLink>
                <span id="Logout" onClick={logout}>Logout</span>
              </div>
              :
              <a id="go-to-login" href="http://localhost:3000/login/">Login</a>
          }
        </S.Content>
      </div>
    </S.Header>
  )
}