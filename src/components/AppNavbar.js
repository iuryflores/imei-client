import React, { useEffect, useState } from "react";
import { Navbar, Nav, NavDropdown } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import api from "../utils/api.utils";

import logoIury from "../imgs/iury.png";

const AppNavbar = ({ isAdmin, setError, userId, onLogout }) => {
  const { pathname } = useLocation();
  const newLocation = pathname.split("/");
  const isActive = (path) => newLocation[1] === path;

  const [userData, setUserData] = useState("");

  useEffect(() => {
    const getUser = async (userId) => {
      try {
        const data = await api.getUserNav(userId);
        setUserData(data);
      } catch (error) {
        setError(error);
      }
    };
    getUser(userId);
  }, []);

  return (
    <>
      <Navbar className="px-3 " expand="lg">
        <Navbar.Brand
          as={Link}
          to="/"
          className=" d-flex align-items-center mx-3"
        >
          <img className="mx-3 logo" src={logoIury} alt="Logo Iury" />
          <b>Gyn Distribuidora</b>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse
          id="basic-navbar-nav"
          className="justify-content-between"
        >
          <Nav className="mr-auto px-3">
            <Nav.Link as={Link} to="/" active={isActive("")}>
              Caixa
            </Nav.Link>
            {/* <Nav.Link as={Link} to="/compras" active={isActive("compras")}>
              Compras
            </Nav.Link>
            <Nav.Link as={Link} to="/vendas" active={isActive("vendas")}>
              Vendas
            </Nav.Link> */}
            <NavDropdown
              title="Pessoas"
              id="admin-dropdown"
              active={isActive("clientes") || isActive("fornecedores")}
            >
              <NavDropdown.Item
                as={Link}
                to="/clientes"
                active={isActive("clientes")}
              >
                Clientes
              </NavDropdown.Item>
              <NavDropdown.Item
                as={Link}
                to="/fornecedores"
                active={isActive("fornecedores")}
              >
                Fornecedores
              </NavDropdown.Item>
            </NavDropdown>
            {/* <Nav.Link as={Link} to="/clientes" active={isActive("clientes")}>
              Clientes
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/fornecedores/"
              active={isActive("fornecedores")}
            >
              Fornecedores
            </Nav.Link> */}
            {isAdmin !== true ? (
              <NavDropdown
                title="Estatística"
                id="admin-dropdown"
                active={
                  isActive("compras") ||
                  isActive("vendas") ||
                  isActive("usuarios") ||
                  isActive("auditoria")
                }
              >
                <NavDropdown.Item
                  as={Link}
                  to="/compras"
                  active={isActive("compras/cadastrando")}
                >
                  Compra
                </NavDropdown.Item>
                <NavDropdown.Item
                  as={Link}
                  to="/vendas"
                  active={isActive("vendas")}
                >
                  Vendas
                </NavDropdown.Item>
              </NavDropdown>
            ) : null}
            <Nav.Link as={Link} to="/estoque/" active={isActive("estoque")}>
              Estoque
            </Nav.Link>

            {isAdmin === true ? (
              <>
                <NavDropdown
                  title="Administração"
                  id="admin-dropdown"
                  active={
                    isActive("estatisticas") ||
                    isActive("todos-caixas") ||
                    isActive("usuarios") ||
                    isActive("auditoria") ||
                    isActive("caixa")
                  }
                >
                  <NavDropdown.Item
                    as={Link}
                    to="/estatisticas"
                    active={isActive("estatisticas")}
                  >
                    Estatísticas
                  </NavDropdown.Item>
                  {/* <NavDropdown.Item
                    as={Link}
                    to="/conciliacao"
                    active={isActive("conciliacao")}
                  >
                    Conciliação
                  </NavDropdown.Item> */}

                  <NavDropdown.Item
                    as={Link}
                    to="/todos-caixas"
                    active={isActive("todos-caixas")}
                  >
                    Caixas
                  </NavDropdown.Item>
                  <NavDropdown.Item
                    as={Link}
                    to="/usuarios"
                    active={isActive("usuarios")}
                  >
                    Usuários
                  </NavDropdown.Item>
                  <NavDropdown.Item
                    as={Link}
                    to="/auditoria/"
                    active={isActive("auditoria")}
                  >
                    Auditoria
                  </NavDropdown.Item>
                </NavDropdown>
              </>
            ) : null}
            <Nav.Link
              as={Link}
              to=""
              onClick={onLogout}
              active={isActive("/sair")}
            >
              Sair
            </Nav.Link>
          </Nav>
          <div
            className="d-flex align-items-center text-light"
            style={{ fontWeight: "bold", marginRight: "10px" }}
          >
            {userData.full_name}
            <i className="bi bi-person-circle mx-1 fs-2"></i>
          </div>
        </Navbar.Collapse>
      </Navbar>
    </>
  );
};

export default AppNavbar;
