// app/pages.tsx
import VendingMachineUI from '../component/vendingMachineUI';
import "./globals.css"
const HomePage = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <VendingMachineUI />
    </div>
  );
};

export default HomePage;
