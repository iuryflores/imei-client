/* eslint-disable import/no-anonymous-default-export */
import axios from "axios";

class Api {
  constructor() {
    this.api = axios.create({
      baseURL: "http://localhost:9000",
    });
    this.api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem("token");

        if (token) {
          config.headers = {
            Authorization: `Bearer ${token}`,
          };
        }
        return config;
      },
      (error) => {
        console.log(error);
        throw error;
      }
    );
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response.status === 401) {
          localStorage.removeItem("token");
          if (window.location.pathname !== "/admin/login") {
            window.location.replace("/admin/login"); // Use window.location.replace para fazer o redirecionamento
          }
        }
        throw error;
      }
    );
  }
  login = async (loginInfo) => {
    try {
      const { data } = await this.api.post("/user/auth/login", loginInfo);
      localStorage.setItem("token", data.token);
      localStorage.setItem("userId", data.id);
    } catch (error) {
      throw error.response.data.msg;
    }
  };
  signup = async (signupInfo) => {
    try {
      const { data } = await this.api.post("/user/auth/signup", signupInfo);
      return data;
    } catch (error) {
      throw error.response.data.msg;
    }
  };
  getAllClients = async () => {
    try {
      const { data } = await this.api.get("/clientes/");
      return data;
    } catch (error) {
      throw error.response.data.msg;
    }
  };
  getAllFornecedores = async () => {
    try {
      const { data } = await this.api.get("/fornecedores");
      return data;
    } catch (error) {
      throw error.response.data.msg;
    }
  };
  buscaFornecedor = async (term) => {
    try {
      const { data } = await this.api.get(`/fornecedores/busca/${term}`);
      return data;
    } catch (error) {
      throw error.response.data.msg;
    }
  };
  buscaCliente = async (term) => {
    try {
      const { data } = await this.api.get(`/clientes/busca/${term}`);
      return data;
    } catch (error) {
      throw error.response.data.msg;
    }
  };
  buscarImeiDados = async (imeiNumber) => {
    try {
      const { data } = await this.api.get(`/imei/${imeiNumber}`);
      return data;
    } catch (error) {
      throw error.response.data.msg;
    }
  };
  buscarImeiDadosCompra = async (imeiNumber) => {
    try {
      const { data } = await this.api.get(`/imei/${imeiNumber}/compra`);
      return data;
    } catch (error) {
      throw error.response.data.msg;
    }
  };
  addFornecedor = async (fornecedorData, userId) => {
    try {
      const { data } = await this.api.post(
        "/fornecedores/new/",
        fornecedorData,
        userId
      );
      return data;
    } catch (error) {
      throw error.response.data.msg;
    }
  };
  addCliente = async (clienteData, userId) => {
    try {
      const { data } = await this.api.post(
        "/clientes/new/",
        clienteData,
        userId
      );
      return data;
    } catch (error) {
      throw error.response.data.msg;
    }
  };
  addImei = async (customerData, selectedItem, priceDb, imeiArray, userId) => {
    try {
      const { data } = await this.api.post(
        "/compras/new/",
        customerData,
        priceDb,
        selectedItem,
        imeiArray,
        userId
      );
      return data;
    } catch (error) {
      throw error.response.data.msg;
    }
  };
  getAllCompras = async () => {
    try {
      const { data } = await this.api.get("/compras/");
      return data;
    } catch (error) {
      throw error.response.data.msg;
    }
  };
  getAllVendas = async () => {
    try {
      const { data } = await this.api.get("/vendas/");
      return data;
    } catch (error) {
      throw error.response.data.msg;
    }
  };
  getAuditorias = async () => {
    try {
      const { data } = await this.api.get("/auditoria/");
      return data;
    } catch (error) {
      throw error.response.data.msg;
    }
  };
  addVenda = async (
    sellDate,
    selectedCliente,
    imeiArray,
    valorVenda,
    userId,
    userData,
    dataPagamento,
    formaPagamento,
    idCaixa
  ) => {
    try {
      const { data } = await this.api.post(
        "/vendas/new/",
        sellDate,
        selectedCliente,
        imeiArray,
        valorVenda,
        userId,
        userData,
        dataPagamento,
        formaPagamento,
        idCaixa
      );
      return data;
    } catch (error) {
      throw error.response.data.msg;
    }
  };
  getProdutos = async () => {
    try {
      const { data } = await this.api.get("/imei/");
      return data;
    } catch (error) {
      throw error.response.data.msg;
    }
  };
  deleteVenda = async (vendaData, userId) => {
    try {
      const { data } = await this.api.put("/vendas/delete/", vendaData, userId);
      return data;
    } catch (error) {
      throw error.response.data.msg;
    }
  };
  deleteCompra = async (compraData) => {
    try {
      const { data } = await this.api.put("/compras/delete/", compraData);
      return data;
    } catch (error) {
      throw error.response.data.msg;
    }
  };
  getUserNav = async (userId) => {
    try {
      const { data } = await this.api.get(`/user/${userId}`);
      return data;
    } catch (error) {
      throw error.response.data.msg;
    }
  };
  getUsers = async () => {
    try {
      const { data } = await this.api.get(`/user/`);
      return data;
    } catch (error) {
      throw error.response.data.msg;
    }
  };
  getUserData = async (user_Id) => {
    try {
      const { data } = await this.api.get(`/user/edit/`, user_Id);
      return data;
    } catch (error) {
      throw error.response.data.msg;
    }
  };
  editUser = async (userDataEdit, userId) => {
    try {
      const { data } = await this.api.put(`/user/edit/`, userDataEdit, userId);
      return data;
    } catch (error) {
      throw error.response.data.msg;
    }
  };
  getCaixas = async () => {
    try {
      const { data } = await this.api.get(`/caixas/`);
      return data;
    } catch (error) {
      throw error.response.data.msg;
    }
  };
  getCaixaDia = async (selectedDate) => {
    try {
      const { data } = await this.api.get(
        `/lancamentos/meu-caixa/${selectedDate}/`
      );
      return data;
    } catch (error) {
      throw error.response.data.msg;
    }
  };
  getCaixasAtivos = async () => {
    try {
      const { data } = await this.api.get(`/caixas/ativos/`);
      return data;
    } catch (error) {
      throw error.response.data.msg;
    }
  };
  addCaixas = async (caixaData, userId) => {
    try {
      const { data } = await this.api.post(`/caixas/new/`, caixaData, userId);
      return data;
    } catch (error) {
      throw error.response.data.msg;
    }
  };
  getCaixaData = async (caixa_id) => {
    try {
      const { data } = await this.api.get(`/caixas/edit/${caixa_id}`);
      return data;
    } catch (error) {
      throw error.response.data.msg;
    }
  };
  editCaixa = async (caixaData, userId) => {
    try {
      const { data } = await this.api.put(`/caixas/edit/`, caixaData, userId);
      return data;
    } catch (error) {
      throw error.response.data.msg;
    }
  };
  checkCaixaAberto = async (selectedDate) => {
    try {
      const { data } = await this.api.get(`/caixa/aberto/${selectedDate}`);
      return data;
    } catch (error) {
      throw error.response.data.msg;
    }
  };
  abrirCaixa = async (userId, selectedDate) => {
    try {
      const { data } = await this.api.post(
        `/caixa/abrir/`,
        userId,
        selectedDate
      );
      return data;
    } catch (error) {
      throw error.response.data.msg;
    }
  };
}

export default new Api();
