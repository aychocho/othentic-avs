# Simple Price Oracle AVS Example

This repository demonstrates how to implement a simple price oracle AVS using the Othentic Stack.

---

## Table of Contents

1. [Overview](#overview)
2. [Project Structure](#project-structure)
3. [Architecture](#architecture)
4. [Prerequisites](#prerequisites)
5. [Installation](#installation)
6. [Usage](#usage)

---

## Overview

Quok.it's AVS consists of four components, rather than the traditional 3 in an AVS.

1. GPU Provider: Runs a python script that performs hardware validation & sends its results to the AVS Performer node
2. Performer node: Packages this hardware validation output into a format suitable for Attester nodes
3. Attester node: Parses our hardware validation script's output and decides to accept or reject the GPU
4. Aggregator node: Submits consensus decision on-chain

Quok.it's AVS is built using the Othentic stack framework, which has vastly simplified the AVS deployment process. Shout out to Raz, Yash, and Dean for all their support in getting this to work!

![image.png](attachment:b075e064-24e3-4b75-898d-97032843e2fc:image.png)


### Explanation

env vars: RPC url, hashicorp vault public key for signature validation 

The flow of this program is as follows:

1. Provider starts the hw validation script
   a. Requests an ephemeral keypair from Hashicorp Vault
2. Vault returns an ephemeral keypair and a signature
3. Provider validates this signature & wraps up the hardware validation script
4. RPC call signed with said ephemeral keys
5. Attesters validate:
    a.  signature from vault on ephemeral key
    b. Ephemeral key signature
    c. Output of hwval
6. Attesters make a judgement on whether to let GPU in or not
    a. Red flags: IMMEDIATE REJECTION
        1. signature mismatch
        2. nvidia-smi & pciid don't match
        3. VBIOS shenanigans
        4. Secure boot enabled & kernel image signature failed
    b. Yellow flags: Log this, not grounds for rejection
        1. Secure boot disabled
        2. Virtualization detected
        3. Kernel modules tainted (Dassie)
8. Attesters come to consensus & submit to aggregators
9. Aggregators push consensus on-chain!

### Features

- **Containerised deployment:** Simplifies deployment and scaling.
- **Prometheus and Grafana integration:** Enables real-time monitoring and observability.

## Project Structure

```mdx
📂 simple-price-oracle-avs-example
├── 📂 Execution_Service         # Implements Task execution logic - Express JS Backend
│   ├── 📂 config/
│   │   └── app.config.js        # An Express.js app setup with dotenv, and a task controller route for handling `/task` endpoints.
│   ├── 📂 src/
│   │   └── dal.service.js       # A module that interacts with Pinata for IPFS uploads
│   │   ├── oracle.service.js    # A utility module to fetch the current price of a cryptocurrency pair from the Binance API
│   │   ├── task.controller.js   # An Express.js router handling a `/execute` POST endpoint
│   │   ├── 📂 utils             # Defines two custom classes, CustomResponse and CustomError, for standardizing API responses
│   ├── Dockerfile               # A Dockerfile that sets up a Node.js (22.6) environment, exposes port 8080, and runs the application via index.js
|   ├── index.js                 # A Node.js server entry point that initializes the DAL service, loads the app configuration, and starts the server on the specified port
│   └── package.json             # Node.js dependencies and scripts
│
├── 📂 Validation_Service         # Implements task validation logic - Express JS Backend
│   ├── 📂 config/
│   │   └── app.config.js         # An Express.js app setup with a task controller route for handling `/task` endpoints.
│   ├── 📂 src/
│   │   └── dal.service.js        # A module that interacts with Pinata for IPFS uploads
│   │   ├── oracle.service.js     # A utility module to fetch the current price of a cryptocurrency pair from the Binance API
│   │   ├── task.controller.js    # An Express.js router handling a `/validate` POST endpoint
│   │   ├── validator.service.js  # A validation module that checks if a task result from IPFS matches the ETH/USDT price within a 5% margin.
│   │   ├── 📂 utils              # Defines two custom classes, CustomResponse and CustomError, for standardizing API responses.
│   ├── Dockerfile                # A Dockerfile that sets up a Node.js (22.6) environment, exposes port 8080, and runs the application via index.js.
|   ├── index.js                  # A Node.js server entry point that initializes the DAL service, loads the app configuration, and starts the server on the specified port.
│   └── package.json              # Node.js dependencies and scripts
│
├── 📂 grafana                    # Grafana monitoring configuration
├── docker-compose.yml            # Docker setup for Operator Nodes (Performer, Attesters, Aggregator), Execution Service, Validation Service, and monitoring tools
├── .env.example                  # An example .env file containing configuration details and contract addresses
├── README.md                     # Project documentation
└── prometheus.yaml               # Prometheus configuration for logs
```

## Architecture

![Price oracle sample](https://github.com/user-attachments/assets/03d544eb-d9c3-44a7-9712-531220c94f7e)

The Performer node executes tasks using the Task Execution Service and sends the results to the p2p network.

Attester Nodes validate task execution through the Validation Service. Based on the Validation Service's response, attesters sign the tasks. In this AVS:

Task Execution logic:
- Fetch the ETHUSDT price.
- Store the result in IPFS.
- Share the IPFS CID as proof.

Validation Service logic:
- Retrieve the price from IPFS using the CID.
- Get the expected ETHUSDT price.
- Validate by comparing the actual and expected prices within an acceptable margin.
---

## Prerequisites

- Node.js (v 22.6.0 )
- Foundry
- [Yarn](https://yarnpkg.com/)
- [Docker](https://docs.docker.com/engine/install/)

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/Othentic-Labs/simple-price-oracle-avs-example.git
   cd simple-price-oracle-avs-example
   ```

2. Install Othentic CLI:

   ```bash
   npm i -g @othentic/othentic-cli
   ```

## Usage

Follow the steps in the official documentation's [Quickstart](https://docs.othentic.xyz/main/avs-framework/quick-start#steps) Guide for setup and deployment.

### Next
Modify the different configurations, tailor the task execution logic as per your use case, and run the AVS.

Happy Building! 🚀

