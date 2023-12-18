import emailjs from "@emailjs/browser";
import axios from "axios";
import { AES, enc } from "crypto-js";
import {
  exportPKCS8PrivateKeyPem,
  exportSPKIPublicKeyPem,
} from "../helpers/rsa";

const serviceId = "service_t3ebqjz";
const templateId = "template_yxeotlq";
const apiPath = "http://localhost:8080/";

export const sendEmail = async (email: string, code: string) => {
  await emailjs.send(serviceId, templateId, {
    email,
    code,
  });
};

export const login = async (password: string, email: string) => {
  const response = await axios.post(`${apiPath}auth/login`, {
    email,
    password,
  });
  return response;
};

export const register = async (
  username: string,
  email: string,
  password: string
) => {
  const response = await axios.post(`${apiPath}auth/register`, {
    username,
    email,
    password,
  });
  return response;
};

export const getFiles = async (sessionToken: string) => {
  const response = await axios.get(`${apiPath}files`, {
    headers: { auth: sessionToken },
  });
  return response;
};

export const addnewFile = async (
  name: string,
  content: string,
  sessionToken: string
) => {
  const response = await axios.post(
    `${apiPath}file`,
    { name, content },
    {
      headers: { auth: sessionToken },
    }
  );
  return response;
};

export const getFile = async (name: string, sessionToken: string) => {
  const { publicKey, privateKey } = await window.crypto.subtle.generateKey(
    {
      name: "RSA-OAEP",
      modulusLength: 4096,
      publicExponent: new Uint8Array([1, 0, 1]),
      hash: "SHA-256",
    },
    true,
    ["encrypt", "decrypt"]
  );

  const privatePem = await exportPKCS8PrivateKeyPem(privateKey);
  const publicPem = await exportSPKIPublicKeyPem(publicKey);
  console.log({ publicPem, privatePem });

  const response = await axios.get(`${apiPath}file`, {
    headers: { auth: sessionToken },
    params: {
      publicKey: publicPem,
      name,
    },
  });

  const { content, key } = response.data;

  const decryptedContent = AES.decrypt(content, key).toString(enc.Utf8);
  return decryptedContent;
};
