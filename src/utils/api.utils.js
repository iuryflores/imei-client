/* eslint-disable import/no-anonymous-default-export */
import axios from "axios";

class Api {
  constructor() {
    this.api = axios.create({
      // baseURL: "http://imeiapp.iuryflores.com/",
      // baseURL: "http://localhost:9000",
      // baseURL: "http://35.175.178.173:3001",
      baseURL: "https://imeiapi.iuryflores.dev.br/",
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
          if (window.location.pathname !== "/login") {
            window.location.replace("/login"); // Use window.location.replace para fazer o redirecionamento
          }
        }

        if (error.response.data.msg.message === "jwt expired") {
          localStorage.removeItem("token");
          localStorage.removeItem("userId");
          if (window.location.pathname !== "/login") {
            window.location.replace("/logout");
          }
        }
        if (
          error.response.data.msg.message === "invalid signature" ||
          error.response.data.msg ===
            "Sua sessão expirou, é necessário fazer login novamente."
        ) {
          if (window.location.pathname !== "/login") {
            window.location.replace("/logout");
          }
        }
        console.error(error);
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
  addImei = async (
    customerData,
    selectedItem,
    selectedProduto,
    priceVendaDb,
    priceDb,
    valorFormatado,
    imeiArray,
    userId
  ) => {
    try {
      const { data } = await this.api.post(
        "/compras/new/",
        customerData,
        priceDb,
        valorFormatado,
        selectedItem,
        selectedProduto,
        priceVendaDb,
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
    selectedProducts,
    qtdSelectedProducts,
    valorTotal,
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
        selectedProducts,
        qtdSelectedProducts,
        valorTotal,
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
  getEstoque = async () => {
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
  devolverVenda = async (vendaID, userId) => {
    try {
      const { data } = await this.api.put("/vendas/devolver/", vendaID, userId);
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
  getCaixasAbertos = async () => {
    try {
      const { data } = await this.api.get(`/caixa/todos-abertos/`);
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
  getLancamentos = async (selectedDate) => {
    try {
      const { data } = await this.api.get(
        `/lancamentos/meu-caixa-dia/${selectedDate}/`
      );
      return data;
    } catch (error) {
      throw error.response.data.msg;
    }
  };
  getLancamentosCaixa = async (caixa_id) => {
    try {
      const { data } = await this.api.get(
        `/lancamentos/meu-caixa-id/${caixa_id}/`
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
  getTodosCaixas = async () => {
    try {
      const { data } = await this.api.get(`/caixa/todos/`);
      return data;
    } catch (error) {
      throw error.response.data.msg;
    }
  };
  fechandoCaixa = async (caixa_id) => {
    try {
      const { data } = await this.api.get(`/caixa/fechando/${caixa_id}`);
      return data;
    } catch (error) {
      throw error.response.data.msg;
    }
  };
  fecharCaixa = async (saldoCaixaDb, userId, caixaId, dataVendas) => {
    try {
      const { data } = await this.api.put(
        `/caixa/fechar/`,
        saldoCaixaDb,
        userId,
        caixaId,
        dataVendas
      );
      return data;
    } catch (error) {
      throw error.response.data.msg;
    }
  };
  getVendasByCaixaId = async (caixa_id) => {
    try {
      const { data } = await this.api.get(`/caixa/vendas/${caixa_id}`);
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
  getProdutos = async () => {
    try {
      const { data } = await this.api.get(`/produtos/`);
      return data;
    } catch (error) {
      throw error.response.data.msg;
    }
  };
  addProduto = async (formData, hasImei, valorCompra, valorVenda, userId) => {
    try {
      const { data } = await this.api.post(
        `/produtos/new/`,
        formData,
        hasImei,
        valorCompra,
        valorVenda,
        userId
      );
      return data;
    } catch (error) {
      throw error.response.data.msg;
    }
  };
  buscaProduto = async (term) => {
    try {
      const { data } = await this.api.get(`/produtos/busca/${term}`);
      return data;
    } catch (error) {
      throw error.response.data.msg;
    }
  };
  deleteProduto = async (produtoID) => {
    try {
      const { data } = await this.api.delete(`/produtos/delete/${produtoID}`);
      return data;
    } catch (error) {
      throw error.response.data.msg;
    }
  };
  editProduto = async (produtoID, description) => {
    try {
      const { data } = await this.api.put(
        `/produtos/edit/${produtoID}`,
        description
      );
      return data;
    } catch (error) {
      throw error.response.data.msg;
    }
  };
  addPriceProduto = async (buy_id, priceDb, priceVendaDb) => {
    try {
      const { data } = await this.api.put(
        `/compras/add-price/${buy_id}`,
        priceDb,
        priceVendaDb
      );
      return data;
    } catch (error) {
      throw error.response.data.msg;
    }
  };
  getProdutoID = async (compraID) => {
    try {
      const { data } = await this.api.get(`/produtos/compraID/${compraID}`);
      return data;
    } catch (error) {
      throw error.response.data.msg;
    }
  };
}

export default new Api();
