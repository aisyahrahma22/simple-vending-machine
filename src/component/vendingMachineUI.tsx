"use client";
import { useState } from "react";

const initialProducts = [
  { name: "Biscuits", price: 6000, stock: 10, image: '/biscuits.jpg' },
  { name: "Chips", price: 8000, stock: 5, image: '/chips.jpg' },
  { name: "Oreo", price: 10000, stock: 8, image: '/oreo.jpg'},
  { name: "Tango", price: 12000, stock: 3,image: '/tango.jpg' },
  { name: "Chocolate", price: 15000, stock: 2, image: '/chocolate.jpg' },
];

const VendingMachineUI = () => {
  const [products, setProducts] = useState(initialProducts);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [insertedMoney, setInsertedMoney] = useState<number>(0);
  const [response, setResponse] = useState<string | null>(null);
  const [refund, setRefund] = useState<number>(0);
  // Fungsi untuk menambah uang yang dimasukkan
  const handleInsertMoney = (amount: number) => {
    setInsertedMoney((prev) => prev + amount);
  };

  // Fungsi untuk memilih produk
  const handleSelectItem = (name: string) => {
    setSelectedItem(name);
    setQuantity(1); // Reset quantity saat memilih produk baru
    setResponse(null); // Hapus pesan sebelumnya
  };

  // Fungsi untuk mengubah jumlah pembelian
  const handleQuantityChange = (change: number) => {
    const product = products.find((item) => item.name === selectedItem);
    if (!product) return;

    const newQuantity = quantity + change;
    if (newQuantity > 0 && newQuantity <= product.stock) {
      setQuantity(newQuantity);
    }
  };

  // Fungsi untuk melakukan pembelian
  const handlePurchase = () => {
    if (!selectedItem) {
      setResponse("Please select a product.");
      return;
    }

    const product = products.find((item) => item.name === selectedItem);
    if (!product) {
      setResponse("Product not found.");
      return;
    }

    const totalCost = product.price * quantity;

    if (insertedMoney < totalCost) {
      setResponse("Not enough money inserted.");
      return;
    }

    if (product.stock < quantity) {
      setResponse("Not enough stock.");
      return;
    }

    const updatedProducts = products.map((item) =>
      item.name === selectedItem
        ? { ...item, stock: item.stock - quantity }
        : item
    );

    const refund = insertedMoney - totalCost
    setProducts(updatedProducts);
    setInsertedMoney((prev) => prev - totalCost);
    setRefund(refund)
    setResponse(`Purchased ${quantity} ${product.name}(s). Change: ${refund}`);
    setSelectedItem(null); // Reset item setelah pembelian
    setQuantity(1); // Reset quantity
  };

  // Fungsi untuk mengembalikan uang dan mereset transaksi
  const handleRefund = () => {
    setResponse(`Refunded: ${insertedMoney} IDR`);
    setInsertedMoney(0);
    setSelectedItem(null); // Reset produk yang dipilih
    setQuantity(1); // Reset jumlah
    setRefund(0)
  };

  // Fungsi untuk mereset transaksi
  const handleReset = () => {
    setSelectedItem(null);
    setQuantity(1);
    setInsertedMoney(0);
    setResponse(null);
    setRefund(0)
  };

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col items-center p-6">
      <div className="w-full max-w-3xl bg-white rounded-lg shadow-lg p-6 space-y-6">
        <h1 className="text-3xl font-semibold text-center text-indigo-600">Vending Machine</h1>
        <br/>
        <div className="flex justify-center gap-4">
            {products.map((product) => (
                <div key={product.name} className="bg-gray-50 p-4 rounded-lg shadow-md text-center">
                <h2 className="text-xl font-semibold text-blue-500">{product.name}</h2>
                <img src={product.image}  
                width={50}
                height={50} 
                alt={product.name} className="w-full h-48 object-cover rounded-lg mb-4" />
                <p className="text-gray-700">Price: {product.price} IDR</p>
                <p className="text-gray-500">Stock: {product.stock}</p>
                <br/>
                <div>
                {selectedItem === product.name && product.stock > 0 ? (
                      <>
                      <div>Quantity: </div>
                      <div className="flex justify-center items-center space-x-2">
                        <button
                          onClick={() => handleQuantityChange(-1)}
                          className="px-4 py-1 rounded-lg bg-purple-500 text-white"
                          disabled={quantity <= 1}
                        >
                          -
                        </button>
                        <span className="px-4 py-1">{quantity}</span>
                        <button
                          onClick={() => handleQuantityChange(1)}
                          className="px-4 py-1 rounded-lg bg-blue-500 text-white"
                          disabled={quantity >= product.stock}
                        >
                          +
                        </button>
                      </div>
                      </>
                    ) : (
                      ""
                    )}
                </div>
                <button
                      onClick={() => handleSelectItem(product.name)}
                      className={`px-4 py-2 rounded-lg font-semibold transition-transform duration-300 ${
                        product.stock === 0
                          ? "bg-gray-400 cursor-not-allowed"
                          : selectedItem === product.name
                          ? "bg-indigo-600 text-white hover:bg-indigo-500 scale-105"
                          : "bg-blue-500 text-white hover:bg-blue-400 scale-105"
                      }`}
                      disabled={product.stock === 0 || insertedMoney === 0}
                    >
                      {product.stock === 0
                        ? "Out of Stock"
                        : selectedItem === product.name
                        ? "Selected"
                        : "Select"}
                    </button>
                </div>
            ))}   
            </div>
            <br/>
            <div className="flex flex-col items-center">
                <div>
                    {[2000, 5000, 10000, 20000, 50000].map((denomination) => (
                    <button
                    key={denomination}
                    onClick={() => handleInsertMoney(denomination)}
                    className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-all duration-300"
                    >
                    Insert {denomination} IDR
                    </button>
                ))}

                </div>
                <br/>
                <p>Inserted Money: {insertedMoney} IDR</p> 
                <span>  {response && (
                    <p className={`mt-4 text-xl font-medium text-center 
                    ${response.includes('error') ? 'text-red-600' : 'text-green-600'}`} >
                    {response}
                    </p>
                )}</span>
            </div>
            <br/>
            <div className="flex justify-center gap-4">
            <button
                onClick={handlePurchase}
                disabled={!selectedItem || quantity <= 0}
                className="w-full mt-4 py-2 bg-yellow-500 text-white rounded-md"
            >
                Buy
            </button>
            <button
                onClick={handleRefund}
                disabled={refund === 0}
                className="w-full mt-4 py-2 bg-green-500 text-white rounded-md"
            >
                Refund
            </button>
            <button
                onClick={handleReset}
                className="w-full mt-4 py-2 bg-purple-500 text-white rounded-md"
              >
                Reset Transaction
              </button>
            </div>
        </div>
    </div>
  );
};

export default VendingMachineUI;
