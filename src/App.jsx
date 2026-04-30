/* eslint-disable jsx-a11y/accessible-emoji */
import React, { useState } from 'react';
import './App.scss';

import classNames from 'classnames';
import usersFromServer from './api/users';
import categoriesFromServer from './api/categories';
import productsFromServer from './api/products';

const products = productsFromServer.map(product => {
  const productCategory =
    categoriesFromServer.find(category => product.categoryId === category.id) ||
    null;
  const productUser =
    (productCategory !== null
      ? usersFromServer.find(user => productCategory.ownerId === user.id)
      : null) || null;

  return {
    ...product,
    category: productCategory,
    user: productUser,
  };
});

export const App = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState([]);

  function getFilteredProducts(preparedProducts) {
    let filteredProducts = [...preparedProducts];

    if (selectedUser !== null) {
      filteredProducts = filteredProducts.filter(product => {
        return selectedUser === product.user.name;
      });
    }

    if (search !== '') {
      filteredProducts = filteredProducts.filter(product => {
        const name = product.name.trim().toLowerCase();

        return name.includes(search.trim().toLowerCase());
      });
    }

    if (categoryFilter.length > 0) {
      filteredProducts = filteredProducts.filter((product) => {
        return categoryFilter.includes(product.category.id);
      })
    }

    return filteredProducts;
  }

  function handleCategoryFilter(categoryId) {
    if (categoryFilter.includes(categoryId)) {
      setCategoryFilter(categoryFilter.filter(id => id !== categoryId))
    } else {
      setCategoryFilter([...categoryFilter, categoryId] );
    }
  }

  const visibleProducts = getFilteredProducts(products);

  return (
    <div className="section">
      <div className="container">
        <h1 className="title">Product Categories</h1>

        <div className="block">
          <nav className="panel">
            <p className="panel-heading">Filters</p>

            <p className="panel-tabs has-text-weight-bold">
              <a
                data-cy="FilterAllUsers"
                href="#/"
                className={classNames({ 'is-active': selectedUser === null })}
                onClick={() => setSelectedUser(null)}
              >
                All
              </a>
              {usersFromServer.map(user => {
                return (
                  <a
                    key={user.id}
                    data-cy="FilterUser"
                    href="#/"
                    className={classNames({
                      'is-active': selectedUser === user.name,
                    })}
                    onClick={() => setSelectedUser(user.name)}
                  >
                    {user.name}
                  </a>
                );
              })}
            </p>

            <div className="panel-block">
              <p className="control has-icons-left has-icons-right">
                <input
                  data-cy="SearchField"
                  type="text"
                  className="input"
                  placeholder="Search"
                  value={search}
                  onChange={event => setSearch(event.target.value)}
                />

                <span className="icon is-left">
                  <i className="fas fa-search" aria-hidden="true" />
                </span>
                {search !== '' ? (
                  <span className="icon is-right">
                    {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
                    <button
                      data-cy="ClearButton"
                      type="button"
                      className="delete"
                      onClick={() => setSearch('')}
                    />
                  </span>
                ) : null}
              </p>
            </div>

            <div className="panel-block is-flex-wrap-wrap">
              <a
                href="#/"
                data-cy="AllCategories"
                className={classNames("button is-success mr-6", {"is-outlined" : categoryFilter.length > 0})}
                onClick={() => setCategoryFilter([])}
              >
                All
              </a>

              {categoriesFromServer.map((category) => {
                return (
                  <a
                    key={category.id}
                    data-cy="Category"
                    className={classNames("button mr-2 my-1", {"is-info" : categoryFilter.includes(category.id)})}
                    href="#/"
                    onClick={() => handleCategoryFilter(category.id)}
                  >
                    {category.title}
                  </a>
                )
              })}
            </div>

            <div className="panel-block">
              <a
                data-cy="ResetAllButton"
                href="#/"
                className="button is-link is-outlined is-fullwidth"
                onClick={() => {
                  setSearch('');
                  setSelectedUser(null);
                  setCategoryFilter([]);
                }}
              >
                Reset all filters
              </a>
            </div>
          </nav>
        </div>

        <div className="box table-container">
          {visibleProducts.length === 0 ? (
            <p data-cy="NoMatchingMessage">
              No products matching selected criteria
            </p>
          ) : (
            <table
              data-cy="ProductTable"
              className="table is-striped is-narrow is-fullwidth"
            >
              <thead>
                <tr>
                  <th>
                    <span className="is-flex is-flex-wrap-nowrap">
                      ID
                      <a href="#/">
                        <span className="icon">
                          <i data-cy="SortIcon" className="fas fa-sort" />
                        </span>
                      </a>
                    </span>
                  </th>

                  <th>
                    <span className="is-flex is-flex-wrap-nowrap">
                      Product
                      <a href="#/">
                        <span className="icon">
                          <i data-cy="SortIcon" className="fas fa-sort-down" />
                        </span>
                      </a>
                    </span>
                  </th>

                  <th>
                    <span className="is-flex is-flex-wrap-nowrap">
                      Category
                      <a href="#/">
                        <span className="icon">
                          <i data-cy="SortIcon" className="fas fa-sort-up" />
                        </span>
                      </a>
                    </span>
                  </th>

                  <th>
                    <span className="is-flex is-flex-wrap-nowrap">
                      User
                      <a href="#/">
                        <span className="icon">
                          <i data-cy="SortIcon" className="fas fa-sort" />
                        </span>
                      </a>
                    </span>
                  </th>
                </tr>
              </thead>

              <tbody>
                {visibleProducts.map(product => {
                  return (
                    <tr key={product.id} data-cy="Product">
                      <td className="has-text-weight-bold" data-cy="ProductId">
                        {product.id}
                      </td>

                      <td data-cy="ProductName">{product.name}</td>
                      <td data-cy="ProductCategory">
                        {product.category.icon} - {product.category.title}
                      </td>

                      <td
                        data-cy="ProductUser"
                        className={
                          product.user.sex === 'm'
                            ? 'has-text-link'
                            : 'has-text-danger'
                        }
                      >
                        {product.user.name}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};
