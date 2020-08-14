# TRADING APP

## Description

A bot which will leverage the DeversiFi API to calculate the best bid and ask. It initializes with virtual 10-ETH and 2000-USD. Then, creates 5 random bid and ask orders.

For every 5 seconds it requests the API and fulfills the orders based on the values set and update the account balance. The account balance in logged every 30 seonds.

## Requirements
    1. node > v12.18.3

## Installation instruction

### API server:
    1. Clone the folder
    2. npm install
    
## Run instruction:
    1. npm run build
    2. npm start

### Run Tests:
    1. npm run test
