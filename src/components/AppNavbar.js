import React from "react";
import { Navbar, Nav, NavDropdown } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";

const AppNavbar = () => {
  const isActive = (path) => {
    const { pathname } = useLocation();
    const newLocation = pathname.split("/")
    return newLocation[1] === path;
  };


  



  return (
    <Navbar className="px-3 " expand="lg">
      <Navbar.Brand as={Link} to="/">
        Gyn Distribuidora
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav" >
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
          <Nav.Link as={Link} to="/produtos" active={isActive("/produtos")}>
            Produtos
          </Nav.Link>
          <Nav.Link as={Link} to="/caixa" active={isActive("/caixa")}>
            Caixa
          </Nav.Link>
          <Nav.Link
            as={Link}
            to="/estatisticas"
            active={isActive("/estatisticas")}
          >
            Estatísticas
          </Nav.Link>
          <Nav.Link as={Link} to="/auditoria/" active={isActive("/auditoria/")}>
            Auditoria
          </Nav.Link>
        </Nav>
        <Nav>
          <NavDropdown title="Usuário" id="basic-nav-dropdown">
            <NavDropdown.Item
              as={Link}
              to="/perfil"
              active={isActive("/perfil")}
            >
              Perfil
            </NavDropdown.Item>
            <NavDropdown.Divider />
            <NavDropdown.Item as={Link} to="/sair" active={isActive("/sair")}>
              Sair
            </NavDropdown.Item>
          </NavDropdown>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default AppNavbar;
