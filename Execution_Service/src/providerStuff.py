import os
import json
import requests
import subprocess
import dotenv
import hvac

def hwValBash():
    try:
        output = subprocess.check_output(["sudo", "./devil.sh"], universal_newlines=True).strip()
    except Exception as e:
        output = f"hw_validation_error: {str(e)}"
    print("Hardware validation output:", output)
    return output

def publishDataToIpfs(data):
    """Push the hardware validation output (or other data) to IPFS via Pinata."""
    pinata_api_key = os.environ.get("PINATA_API_KEY")
    pinata_secret_api_key = os.environ.get("PINATA_SECRET_API_KEY")
    url = "https://api.pinata.cloud/pinning/pinJSONToIPFS"
    headers = {
        "pinata_api_key": pinata_api_key,
        "pinata_secret_api_key": pinata_secret_api_key,
        "Content-Type": "application/json"
    }
    try:
        response = requests.post(url, data=json.dumps(data), headers=headers)
        response.raise_for_status()
        resp_json = response.json()
        proof_of_task = resp_json.get("IpfsHash", "")
        print(f"proofOfTask: {proof_of_task}")
        return proof_of_task
    except Exception as error:
        print("Error making API request to Pinata:", error)
        return ""

def main():
    dotenv.load_dotenv()

    vault_addr = os.environ.get("VAULT_ADDR", "http://127.0.0.1:8200")
    vault_token = os.environ.get("VAULT_TOKEN", "")
    vault_cacert = os.environ.get("CURL_CA_BUNDLE")  # if TLS is used

    print("vault address", vault_addr)
    print("vault token", vault_token)

    client = hvac.Client(url=vault_addr, token=vault_token)

    account_name = "ephemeral-account-123"
    create_resp = client.write(
        f"ethsign/accounts/{account_name}",
    )
    print("Create Account Response:", create_resp)

    account_resp = client.read(f"ethsign/accounts/{account_name}")
    print("Account Info:", account_resp)

    hwValOutput = hwValBash()
    proofOfTask = publishDataToIpfs({"hw_validation": hwValOutput})

    sign_payload = f"ipfs://{proofOfTask}".encode("utf-8")

    sign_resp = client.write(
        f"ethsign/accounts/{account_name}/sign",
        payload=sign_payload.hex()  
    )
    print("Sign Response:", sign_resp)

    signature = sign_resp["data"]["signature"]
    print("Vault-Generated Signature:", signature)



if __name__ == "__main__":
    main()
