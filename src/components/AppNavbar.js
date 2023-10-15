import React from "react";
import { Navbar, Nav } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";

const AppNavbar = ({ userData, isAdmin }) => {
  const { pathname } = useLocation();
  const newLocation = pathname.split("/");
  const isActive = (path) => newLocation[1] === path;

  return (
    <>
      <Navbar className="px-3 " expand="lg">
        <Navbar.Brand as={Link} to="/">
          Gyn Distribuidora
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse
          id="basic-navbar-nav"
          className="justify-content-between"
        >
          <Nav className="mr-auto">
            <Nav.Link as={Link} to="/compras" active={isActive("compras")}>
              Compras
            </Nav.Link>
            <Nav.Link as={Link} to="/vendas" active={isActive("vendas")}>
              Vendas
            </Nav.Link>
            <Nav.Link as={Link} to="/clientes" active={isActive("clientes")}>
              Clientes
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/fornecedores/"
              active={isActive("fornecedores")}
            >
              Fornecedores
            </Nav.Link>
            <Nav.Link as={Link} to="/estoque/" active={isActive("estoque")}>
              Estoque
            </Nav.Link>

            {isAdmin === true ? (
              <>
                <Nav.Link
                  as={Link}
                  to="/estatisticas"
                  active={isActive("estatisticas")}
                >
                  Estatísticas
                </Nav.Link>
                <Nav.Link
                  as={Link}
                  to="/auditoria/"
                  active={isActive("auditoria")}
                >
                  Auditoria
                </Nav.Link>
                <Nav.Link
                  as={Link}
                  to="/usuarios/"
                  active={isActive("usuarios")}
                >
                  Usuários
                </Nav.Link>
                <Nav.Link as={Link} to="/caixas/" active={isActive("caixas")}>
                  Caixas
                </Nav.Link>
              </>
            ) : null}
            <Nav.Link as={Link} to="/sair" active={isActive("/sair")}>
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
