import { logging, u, sc, wallet } from "@cityofzion/neon-core";
import { resolve } from "./main";

const log = logging.default("neon-domain");

const operation = "resolve";

/**
 * Get balances of NEO and GAS for an address
 * @param url - URL of an NEO RPC service.
 * @param contract - the contract used to resolve
 * @param domain - the domain to resolve.
 * @return public address as string
 */

export async function resolveDomain(
  url: string,
  contract: string,
  domain: string
): Promise<string> {
  const protocol = {
    type: "String",
    value: "addr"
  };

  const empty = {
    type: "String",
    value: ""
  };

  const tld = domain.split(".").reverse()[0];
  const regExp = new RegExp(`.${tld}$`);

  const subdomain = domain.replace(regExp, "");
  const hashSubdomain = u.sha256(u.str2hexstring(subdomain));
  const hashDomain = u.sha256(u.str2hexstring(tld));

  const hashName = u.sha256(hashSubdomain.concat(hashDomain));
  const parsedName = sc.ContractParam.byteArray(hashName, "name");

  const args = [protocol, parsedName, empty];

  const response = await resolve(url, domain, contract, operation, args);

  return response;
}
