const main = async () => {
  // Akıllı kontratın fabrikasını (Contract Factory) alır.
  const transactionsFactory = await hre.ethers.getContractFactory(
    "Transactions"
  );

  // Akıllı kontratı Hardhat geliştirme ortamında dağıtır.
  const transactionsContract = await transactionsFactory.deploy();

  // Dağıtılan kontratın hazır olduğunu doğrular.
  await transactionsContract.deployed();

  // Dağıtılan kontratın adresini konsola yazdırır.
  console.log("Transactions address: ", transactionsContract.address);
};

// Ana fonksiyonu çalıştırmak ve hataları işlemek için bir yardımcı fonksiyon.
const runMain = async () => {
  try {
    // Ana fonksiyonu çalıştırır.
    await main();
    // Programı başarıyla sonlandırır.
    process.exit(0);
  } catch (error) {
    // Hata oluştuğunda hata mesajını konsola yazdırır ve programı hata koduyla sonlandırır.
    console.error(error);
    process.exit(1);
  }
};

// Yardımcı fonksiyonu çalıştırır.
runMain();
