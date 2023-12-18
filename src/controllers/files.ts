import { AES, enc } from "crypto-js";
import EncryptRsa from "encrypt-rsa";
import { random } from "../helpers";
import { FilesService } from "../services/filesService";

export const getFilesList = async (req: any, res: any) => {
  try {
    const files = FilesService.getFilesList();
    return res.status(200).json({ files });
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};

export const addFile = async (req: any, res: any) => {
  try {
    const { name, content } = req.body as Record<string, string>;
    if (!name || !content) {
      res.status(400).json("invalid data").end();
      return;
    }

    const files = FilesService.getFilesList();
    if (files.includes(`${name}.txt`)) {
      res.status(400).json("file already exist").end();
      return;
    }

    FilesService.addFile(name, content);
    return res.status(201).json({ name, content });
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};

export const readFile = async (req: any, res: any) => {
  try {
    const { name, publicKey } = req.query as Record<string, string>;
    if (!name || !publicKey) {
      res.status(400).json("invalid data").end();
      return;
    }

    const files = FilesService.getFilesList();
    if (!files.includes(`${name}.txt`)) {
      res.status(400).json("file doesn't exist").end();
      return;
    }

    const content = FilesService.getFile(name);
    const key = random().toString();
    const encryptedContent = AES.encrypt(content, key).toString();

    const encryptRsa = new EncryptRsa();
    const encryptedKey = encryptRsa.encryptStringWithRsaPublicKey({
      text: key,
      publicKey,
    });

    return res
      .status(200)
      .json({ content: encryptedContent, key, encryptedKey });
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};

export const editFile = async (req: any, res: any) => {
  try {
    const { name, updatedContent } = req.body as Record<string, string>;
    if (!name || !updatedContent) {
      res.status(400).json("invalid data").end();
      return;
    }

    const files = FilesService.getFilesList();
    if (!files.includes(`${name}.txt`)) {
      res.status(400).json("file doesn't exist").end();
      return;
    }

    FilesService.editFile(name, updatedContent);
    return res.status(200).json({ name, updatedContent });
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};

export const deleteFile = async (req: any, res: any) => {
  const { name } = req.body as Record<string, string>;
  if (!name) {
    res.status(400).json("invalid data").end();
    return;
  }

  const files = FilesService.getFilesList();
  if (!files.includes(`${name}.txt`)) {
    res.status(400).json("file doesn't exist").end();
    return;
  }

  FilesService.deleteFile(name);
  return res.status(204);
};
