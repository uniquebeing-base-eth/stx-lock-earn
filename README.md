# Stack Lock

Lock your STX. Complete your goal. Earn it back.

Stack Lock is a self-accountability dApp built on the Stacks blockchain. Users lock STX into a smart contract as a commitment to complete a goal. If they complete it before the deadline, they withdraw their STX. If they fail, the funds remain locked.

Simple. Psychological. Powerful.



# Overview

Stack Lock helps users build discipline using financial commitment.
	1.	User locks STX into a smart contract.
	2.	User sets a goal and deadline.
	3.	If completed before deadline → user withdraws STX.
	4.	If not completed → STX remains locked permanently in V1.

No voting.
No complexity.
Pure commitment.


# How It Works

Create Lock
	•	Connect wallet (Leather or Xverse)
	•	Enter goal description
	•	Choose STX amount
	•	Set deadline
	•	Confirm transaction

Complete Goal
	•	Mark goal as completed before deadline

Withdraw
	•	Withdraw full STX after marking completed

If deadline passes before completion → withdrawal is disabled.

# Architecture

Smart Contract
	•	Written in Clarity
	•	Stores locks in a map
	•	Handles STX transfers
	•	Enforces deadlines and ownership

Frontend
	•	Next.js
	•	Stacks Connect
	•	TailwindCSS
	•	Wallet integration (Leather, Xverse)



# Smart Contract Structure

Each lock contains:
	•	Owner (principal)
	•	Amount (uint)
	•	Deadline (block height or timestamp)
	•	Completed (bool)
	•	Withdrawn (bool)

Core functions:
	•	create-lock
	•	complete-lock
	•	withdraw



# Security Rules
	•	Amount must be greater than zero
	•	Deadline must be in the future
	•	Only lock owner can complete or withdraw
	•	Cannot withdraw twice
	•	Cannot complete after deadline



# Network

Deployed on:
	•	Stacks Testnet (initial)
	•	Stacks Mainnet (after testing)

Explorer: Hiro Explorer

# Local Development

1️⃣ Install dependencies

npm install

2️⃣ Run frontend

npm run dev

3️⃣ Deploy contract

Use Clarinet or Hiro tools for deployment to testnet.



# Project Structure

/contracts
  stack-lock.clar

/frontend
  pages/
  components/
  lib/

/public




# Testing
	•	Test all edge cases:
	•	Withdraw before completion (should fail)
	•	Complete after deadline (should fail)
	•	Double withdraw (should fail)
	•	Non-owner interactions (should fail)



# Roadmap

V1
	•	Basic lock and withdraw logic
	•	Simple dashboard
	•	Manual completion

V2
	•	Proof upload
	•	Public goal feed

V3
	•	Community voting
	•	Partial slashing
	•	Reputation scoring


# Why Stack Lock?

Discipline is hard.

Stack Lock makes commitment financial and real.
You either complete your goal — or lose your STX.


# License

MIT License

