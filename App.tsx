
import React, { useState, useEffect, useCallback } from 'react';
import CalculatorInput from './components/CalculatorInput';
import ResultCard from './components/ResultCard';
import CalculationsBreakdown from './components/CalculationsBreakdown';
import ToggleSwitch from './components/ToggleSwitch';
import { PriceTagIcon, ProfitIcon, CommissionIcon, LogoIcon, VatIcon, ProfitPercentIcon } from './components/icons';

type PriceType = 'net' | 'gross';
type ActiveTab = 'result' | 'calculations';

const App: React.FC = () => {
  const [purchasePrice, setPurchasePrice] = useState<string>('');
  const [purchasePriceType, setPurchasePriceType] = useState<PriceType>('gross');
  const [purchaseVatRate, setPurchaseVatRate] = useState<string>('23');

  const [desiredProfit, setDesiredProfit] = useState<string>('');
  const [desiredProfitPercentage, setDesiredProfitPercentage] = useState<string>('');
  
  const [commissionRate, setCommissionRate] = useState<string>('');
  const [salesVatRate, setSalesVatRate] = useState<string>('23');

  const [activeTab, setActiveTab] = useState<ActiveTab>('result');

  const [result, setResult] = useState({
    sellingPriceGross: 0,
    sellingPriceNet: 0,
    commissionValue: 0,
    totalProfit: 0,
    salesVatValue: 0,
    purchasePriceNet: 0,
    error: ''
  });

  const calculatePrice = useCallback(() => {
    const purchase = parseFloat(purchasePrice) || 0;
    const purchaseVat = parseFloat(purchaseVatRate) || 0;
    const profitFixed = parseFloat(desiredProfit) || 0;
    const profitPerc = parseFloat(desiredProfitPercentage) || 0;
    const commission = parseFloat(commissionRate) || 0;
    const salesVat = parseFloat(salesVatRate) || 0;

    if (commission >= 100) {
        setResult(r => ({ ...r, error: 'Prowizja nie może być równa lub większa niż 100%.', sellingPriceGross: 0 }));
        return;
    }

    const purchaseNet = purchasePriceType === 'gross'
      ? purchase / (1 + purchaseVat / 100)
      : purchase;

    const totalProfit = profitFixed + (purchaseNet * (profitPerc / 100));
    const basePrice = purchaseNet + totalProfit;
    const denominator = 1 - ((1 + salesVat / 100) * (commission / 100));
    
    if (denominator <= 0) {
        setResult({ sellingPriceGross: 0, sellingPriceNet: 0, commissionValue: 0, totalProfit: 0, salesVatValue: 0, purchasePriceNet: purchaseNet, error: 'Przy tych ustawieniach prowizji i VAT nie można osiągnąć zysku.' });
        return;
    }

    const sellingNet = basePrice / denominator;
    const sellingGross = sellingNet * (1 + salesVat / 100);
    const commissionValue = sellingGross * (commission / 100);
    const salesVatValue = sellingNet * (salesVat / 100);

    setResult({
        sellingPriceGross: sellingGross,
        sellingPriceNet: sellingNet,
        commissionValue: commissionValue,
        totalProfit: totalProfit,
        salesVatValue: salesVatValue,
        purchasePriceNet: purchaseNet,
        error: ''
    });

  }, [purchasePrice, purchasePriceType, purchaseVatRate, desiredProfit, desiredProfitPercentage, commissionRate, salesVatRate]);

  useEffect(() => {
    calculatePrice();
  }, [calculatePrice]);

  const handleReset = () => {
    setPurchasePrice('');
    setPurchasePriceType('gross');
    setPurchaseVatRate('23');
    setDesiredProfit('');
    setDesiredProfitPercentage('');
    setCommissionRate('');
    setSalesVatRate('23');
    setActiveTab('result');
  };

  const getNumericValue = (value: string): number => {
      const num = parseFloat(value);
      return isNaN(num) ? 0 : num;
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 flex flex-col items-center justify-center p-4 font-sans">
      <main className="w-full max-w-4xl mx-auto">
        <div className="bg-slate-800 shadow-2xl rounded-2xl p-6 md:p-10 border border-slate-700">
          <header className="text-center mb-8">
            <div className="flex items-center justify-center gap-4 mb-2">
                <LogoIcon />
                <h1 className="text-3xl md:text-4xl font-bold text-white">
                Kalkulator Ceny Allegro
                </h1>
            </div>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Input Section */}
            <section className="flex flex-col gap-5">
              <h2 className="text-2xl font-semibold text-white border-b-2 border-orange-500 pb-2">Dane do kalkulacji</h2>
              
              <div>
                <div className="flex justify-between items-center mb-2">
                    <label htmlFor="purchasePrice" className="block text-sm font-medium text-slate-300">Cena zakupu</label>
                    <ToggleSwitch selected={purchasePriceType} setSelected={setPurchasePriceType} />
                </div>
                <CalculatorInput
                  id="purchasePrice"
                  value={purchasePrice}
                  onChange={(e) => setPurchasePrice(e.target.value)}
                  unit="zł"
                  icon={<PriceTagIcon />}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <CalculatorInput
                  id="desiredProfit"
                  label="Zysk kwotowy"
                  value={desiredProfit}
                  onChange={(e) => setDesiredProfit(e.target.value)}
                  unit="zł"
                  icon={<ProfitIcon />}
                />
                <CalculatorInput
                  id="desiredProfitPercentage"
                  label="Zysk procentowy"
                  value={desiredProfitPercentage}
                  onChange={(e) => setDesiredProfitPercentage(e.target.value)}
                  unit="%"
                  icon={<ProfitPercentIcon />}
                />
              </div>
              
              <div className="border border-slate-600 rounded-lg p-4">
                <p className="text-sm font-medium text-slate-300 mb-3 -mt-1">Stawki podatku VAT</p>
                <div className="grid grid-cols-2 gap-4">
                     <CalculatorInput
                        id="purchaseVatRate"
                        label="VAT zakupu"
                        value={purchaseVatRate}
                        onChange={(e) => setPurchaseVatRate(e.target.value)}
                        unit="%"
                        icon={<VatIcon />}
                    />
                    <CalculatorInput
                        id="salesVatRate"
                        label="VAT sprzedaży"
                        value={salesVatRate}
                        onChange={(e) => setSalesVatRate(e.target.value)}
                        unit="%"
                        icon={<VatIcon />}
                    />
                </div>
              </div>


              <CalculatorInput
                id="commissionRate"
                label="Prowizja Allegro"
                value={commissionRate}
                onChange={(e) => setCommissionRate(e.target.value)}
                unit="%"
                icon={<CommissionIcon />}
              />

               <button
                  onClick={handleReset}
                  className="mt-4 w-full bg-slate-600 hover:bg-slate-500 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-orange-500"
                >
                  Wyczyść formularz
                </button>
            </section>

            {/* Result Section */}
            <section className="flex flex-col">
                <div className="flex border-b border-slate-700">
                    <button
                        onClick={() => setActiveTab('result')}
                        aria-pressed={activeTab === 'result'}
                        className={`py-2 px-6 text-sm font-semibold rounded-t-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-orange-500 ${
                            activeTab === 'result'
                            ? 'bg-slate-700/50 border-b-2 border-orange-500 text-white'
                            : 'text-slate-400 hover:text-white hover:bg-slate-700/20'
                        }`}
                    >
                        Wynik
                    </button>
                    <button
                        onClick={() => setActiveTab('calculations')}
                        aria-pressed={activeTab === 'calculations'}
                        className={`py-2 px-6 text-sm font-semibold rounded-t-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-orange-500 ${
                            activeTab === 'calculations'
                            ? 'bg-slate-700/50 border-b-2 border-orange-500 text-white'
                            : 'text-slate-400 hover:text-white hover:bg-slate-700/20'
                        }`}
                    >
                        Obliczenia
                    </button>
                </div>
                <div className="flex-grow">
                    {activeTab === 'result' && (
                        <ResultCard
                            result={result}
                            commissionRate={getNumericValue(commissionRate)}
                            salesVatRate={getNumericValue(salesVatRate)}
                        />
                    )}
                    {activeTab === 'calculations' && (
                         <CalculationsBreakdown
                            result={result}
                            inputs={{
                                commissionRate: getNumericValue(commissionRate),
                                salesVatRate: getNumericValue(salesVatRate),
                                purchasePrice: getNumericValue(purchasePrice),
                                purchasePriceType: purchasePriceType,
                                purchaseVatRate: getNumericValue(purchaseVatRate),
                                desiredProfit: getNumericValue(desiredProfit),
                                desiredProfitPercentage: getNumericValue(desiredProfitPercentage)
                            }}
                        />
                    )}
                </div>
            </section>
          </div>
        </div>
        <footer className="text-center mt-8 text-slate-500 text-sm">
            <p>&copy; {new Date().getFullYear()} Kalkulator Ceny Allegro. Stworzony dla sprzedawców.</p>
        </footer>
      </main>
    </div>
  );
};

export default App;
