/* eslint-disable import/no-anonymous-default-export */
import axios from "axios";

class Api {
  constructor() {
    this.api = axios.create({
      baseURL: "http://localhost:9000",
    });
    this.api.interceptors.request.use(
      (config) => {
        const token = sessionStorage.getItem("token");
        if (token) {
          config.headers = {
            Authorization: `Bearer ${token}`,
          };
        }
        return config;
      },
      (error) => {
        console.log(error);
      }
    );
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response.status === 401) {
          sessionStorage.removeItem("token");
          window.location = "/admin/login";
        }
        throw error;
      }
    );
  }
  login = async (loginInfo) => {
    try {
      const { data } = await this.api.post("/user/auth/login", loginInfo);
      sessionStorage.setItem("token", data.token);
      sessionStorage.setItem("userId", data.id);
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
        "/imei/new/",
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
}

export default new Api();
