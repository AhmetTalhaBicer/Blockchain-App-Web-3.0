import React, { useEffect, useState, useMemo } from "react";
import { ethers } from "ethers";

import { contractABI, contractAddress } from "../utils/constants";

// Ethereum işlemleri için kullanılan bağlam (context)
export const TransactionContext = React.createContext();

// Web3Provider'dan sağlayıcı ve işlem yapanı oluşturan yardımcı işlev
const createEthereumContract = () => {
  // MetaMask'ten sağlayıcı ve işlem yapanı oluştur
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  // Akıllı sözleşme nesnesini oluştur
  const transactionsContract = new ethers.Contract(
    contractAddress,
    contractABI,
    signer
  );

  return transactionsContract;
};

// İşlem bağlamı sağlayıcısı
export const TransactionsProvider = ({ children }) => {
  // State'lerin tanımlanması
  const [formData, setFormData] = useState({
    addressTo: "",
    amount: "",
    keyword: "",
    message: "",
  });
  const [currentAccount, setCurrentAccount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [transactionCount, setTransactionCount] = useState(
    localStorage.getItem("transactionCount")
  );
  const [transactions, setTransactions] = useState([]);

  // Form verilerini güncellemek için yardımcı işlev
  const handleChange = (e, name) => {
    setFormData((prevState) => ({ ...prevState, [name]: e.target.value }));
  };

  // Tüm işlemleri almak için yardımcı işlev
  const getAllTransactions = async () => {
    try {
      if (window.ethereum) {
        // Ethereum sözleşme nesnesini oluştur
        const transactionsContract = createEthereumContract();

        // Akıllı sözleşmeden tüm işlemleri al
        const availableTransactions =
          await transactionsContract.getAllTransactions();

        // Alınan işlemleri yapılandır ve state'i güncelle
        const structuredTransactions = availableTransactions.map(
          (transaction) => ({
            addressTo: transaction.receiver,
            addressFrom: transaction.sender,
            timestamp: new Date(
              transaction.timestamp.toNumber() * 1000
            ).toLocaleString(),
            message: transaction.message,
            keyword: transaction.keyword,
            amount: parseInt(transaction.amount.toHexString(), 10) / 10 ** 18,
          })
        );

        console.log(structuredTransactions);

        setTransactions(structuredTransactions);
      } else {
        console.log("Ethereum is not present");
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Cüzdanın bağlı olup olmadığını kontrol eden yardımcı işlev
  const checkIfWalletIsConnect = async () => {
    try {
      if (!window.ethereum) {
        alert("Please install MetaMask.");
        return false; // Add a return statement here
      }

      const accounts = await window.ethereum.request({
        method: "eth_accounts",
      });

      if (accounts.length) {
        setCurrentAccount(accounts[0]);
        getAllTransactions();
      } else {
        console.log("No accounts found");
      }
      return true; // Add a return statement here
    } catch (error) {
      console.log(error);
      return false; // Add a return statement here
    }
  };

  // İşlemlerin mevcut olup olmadığını kontrol eden yardımcı işlev
  const checkIfTransactionsExists = async () => {
    try {
      if (window.ethereum) {
        // Ethereum sözleşme nesnesini oluştur
        const transactionsContract = createEthereumContract();

        // Akıllı sözleşmeden mevcut işlem sayısını al
        const currentTransactionCount =
          await transactionsContract.getTransactionCount();

        // LocalStorage'a mevcut işlem sayısını kaydet
        window.localStorage.setItem(
          "transactionCount",
          currentTransactionCount
        );
      }
    } catch (error) {
      console.log(error);
      throw new Error("No ethereum object");
    }
  };

  // Cüzdanı bağlayan yardımcı işlev
  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        alert("Please install MetaMask.");
        return false; // Add a return statement here
      }

      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      setCurrentAccount(accounts[0]);
      window.location.reload();
      return true; // Add a return statement here
    } catch (error) {
      console.log(error);
      throw new Error("No ethereum object");
    }
  };

  // İşlem gönderen yardımcı işlev
  const sendTransaction = async () => {
    try {
      if (window.ethereum) {
        const { addressTo, amount, keyword, message } = formData;
        // Ethereum sözleşme nesnesini oluştur
        const transactionsContract = createEthereumContract();

        // Gönderilecek miktarı parse et
        const parsedAmount = ethers.utils.parseEther(amount);

        // Ethereum üzerinden işlem gönder
        const tx = await window.ethereum.request({
          method: "eth_sendTransaction",
          params: [
            {
              from: currentAccount,
              to: addressTo,
              gas: "0x5208",
              value: parsedAmount.toHexString(),
            },
          ],
        });

        // Blockchain'e işlem eklemek için akıllı sözleşme fonksiyonunu çağır
        const transactionHash = await transactionsContract.addToBlockchain(
          addressTo,
          parsedAmount,
          message,
          keyword
        );

        // Yükleniyor durumunu etkinleştir ve başarı durumunda güncelle
        setIsLoading(true);
        console.log(`Loading - ${transactionHash.hash}`);
        await tx.wait();
        console.log(`Success - ${transactionHash.hash}`);
        setIsLoading(false);

        // Toplam işlem sayısını güncelle ve sayfayı yeniden yükle
        const transactionsCount =
          await transactionsContract.getTransactionCount();
        setTransactionCount(transactionsCount.toNumber());
        window.location.reload();
      } else {
        console.log("No ethereum object");
      }
    } catch (error) {
      console.log(error);
      throw new Error("No ethereum object");
    }
  };

  // useMemo kullanarak bağlam değerini bellekte önbelleğe al
  const contextValue = useMemo(
    () => ({
      transactionCount,
      connectWallet,
      transactions,
      currentAccount,
      isLoading,
      sendTransaction,
      handleChange,
      formData,
    }),
    [
      transactionCount,
      connectWallet,
      transactions,
      currentAccount,
      isLoading,
      sendTransaction,
      handleChange,
      formData,
    ]
  );

  // useEffect kullanarak cüzdan bağlantısını ve mevcut işlemleri kontrol et
  useEffect(() => {
    checkIfWalletIsConnect();
    checkIfTransactionsExists();
  }, [transactionCount]);

  // Ana bileşeni döndür
  return (
    <TransactionContext.Provider value={contextValue}>
      {children}
    </TransactionContext.Provider>
  );
};
