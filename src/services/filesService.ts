import fs from "fs";
import { AES, enc } from "crypto-js";

const STORE_DIR = "./store";

const MASTER_KEY = "uFKivhBM1Y8eq95GN+9U9F+Nbf96UoCDagv9ikWNXCSIZQWzRE9AAbya0S";

export class FilesService {
  static getFilesList() {
    return fs.readdirSync(STORE_DIR);
  }

  static getFile(name: string) {
    const encryptedContent = fs.readFileSync(
      `${STORE_DIR}/${name}.txt`,
      "utf8"
    );

    const content = AES.decrypt(encryptedContent, MASTER_KEY).toString(
      enc.Utf8
    );

    return content;
  }

  static addFile(name: string, content: string) {
    const encryptedContent = AES.encrypt(content, MASTER_KEY);
    fs.appendFile(
      `${STORE_DIR}/${name}.txt`,
      encryptedContent.toString(),
      () => {
        console.log(`File '${name}.txt' was created.`);
      }
    );
  }

  static editFile(name: string, content: string) {
    const encryptedContent = AES.encrypt(content, MASTER_KEY);
    fs.writeFileSync(`${STORE_DIR}/${name}.txt`, encryptedContent.toString(), {
      encoding: "utf8",
      flag: "w",
    });
  }

  static deleteFile(name: string) {
    fs.rmSync(`${STORE_DIR}/${name}.txt`, {
      force: true,
    });
  }
}
