# Web3-Portfoliot 🧬
Hi !
I'm Sebastien Coponat, and this is my web3 portfoliot. 

Live demo: http://myweb3portfolio.s3-website-us-east-1.amazonaws.com/

A modern, animated, and decentralized-themed portfolio project crafted with React, Wagmi, and Web3 protocols.

Designed to showcase a Web3 skillset in an immersive and elegant way.

---

## ✨ Features

- ⚛️ **React + Next.js** — Fast, flexible framework
- 🔌 **Wagmi + viem** — Smooth wallet integrations and contract interactions
- 💱 **0x Swap API** — Token swapping integration
- 🎨 **Custom Canvas Animations** — Elegant, Web3-styled visuals
- 🪪 **Permit2 Ready** — Future-proof token approval system
- ⚡ **Modular Components** — Easy to customize and extend

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/CoponatRecords/Web3-Portfoliot.git
cd Web3-Portfoliot
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

### 3. Create .env.local

Set up your environment variables in a .env.local file:

```bash
NEXT_PUBLIC_ALCHEMY_API_KEY=your_alchemy_key
NEXT_PUBLIC_0X_API_BASE=https://api.0x.org
```

### 4. Run the App

```bash
npm run dev
# or
yarn dev
```

### 📦 Tech Stack

Layer Tech
Frontend React, Next.js, Tailwind CSS
Web3 Wagmi, viem, ethers.js
0x + Alchemy
Animations HTML Canvas, custom shaders

### 🧠 Concepts

This portfolio is built as a showcase of:

- Web3 wallet connectivity

- Token swap and DeFi UX

- Permit2-based token approvals

- Animated, abstract backgrounds

- Modular project/data components

### 🛠️ Roadmap

- Dark/light theme toggle
- Swap history section
- Create smartcontract to create anonymity for a wallet
- Pool transfer / create a Casino lottery setup in a smartcontract




Try the following steps to resolve your error:


Navigate to the EC2 console in the AWS Management Console


Click on the "Create target group" button

In the "Specify group details" section:

Choose a target type (e.g., Instances, IP addresses, or Lambda function)
Enter a name for your target group
Select the protocol and port
Choose the VPC that matches the one in the console URL (vpc-06ff4dca619a6e31f)
Configure health checks as needed

Click "Next" to proceed to "Register targets"

Select active and healthy targets to add to the target group

Ensure the targets are in the "running" state if they are EC2 instances
Click "Create target group" to finalize the creation

Once the target group is created, go to the "Load Balancers" section in the EC2 console

Select the load balancer with the ARN 'arn:aws:elasticloadbalancing:us-east-1:857159678124:loadbalancer/app/web3app/2a3f7bc71e6fb1cf'

In the "Listeners" tab, edit the listener or create a new one if needed

Associate the newly created target group with the listener

Save the changes

Wait a few minutes for the changes to propagate and for the targets to become active

If the issue persists, verify the health status of the targets in the target group and troubleshoot any failing health checks