# Blockchain-App-Web-3.0

## Project Overview

Blockchain-App, Ethereum blockchain üzerindeki işlemleri yönetmek için geliştirilmiş bir React uygulamasıdır. Kullanıcılar, MetaMask entegrasyonu sayesinde cüzdanlarını bağlayabilir, Ethereum adreslerine kripto gönderebilir ve tüm geçmiş işlemlerini takip edebilirler.

## Features

- MetaMask entegrasyonu ile kullanıcı cüzdanlarını bağlama
- Ethereum adreslerine kripto gönderme
- Geçmiş işlemleri görüntüleme ve takip etme

## Teknolojiler

- React
- Tailwind CSS
- Ethereum: Blockchain tabanlı kripto para işlemleri için kullanılan bir platform
- MetaMask: Ethereum tabanlı uygulamalara entegre edilen bir cüzdan ve kullanıcı kimlik doğrulama aracı


## Kurulum ve Kullanım

Projeyi yerel bilgisayarınıza klonlayın ve gerekli bağımlılıkları yükleyin. Daha sonra projeyi başlatarak tarayıcınızda görüntüleyebilirsiniz.

```bash
cd Client
yarn install
yarn run dev
cd smart_contract
npx hardhat accounts
npx hardhat compile
npx hardhat clean
npx hardhat test
npx hardhat node
node scripts/sample-script.js
npx hardhat help

