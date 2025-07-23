
import React from 'react';

type PriceType = 'net' | 'gross';

interface Result {
    sellingPriceGross: number;
    sellingPriceNet: number;
    commissionValue: number;
    totalProfit: number;
    salesVatValue: number;
    purchasePriceNet: number;
    error: string;
}

interface Inputs {
    commissionRate: number;
    salesVatRate: number;
    purchasePrice: number;
    purchasePriceType: PriceType;
    purchaseVatRate: number;
    desiredProfit: number;
    desiredProfitPercentage: number;
}

interface CalculationsBreakdownProps {
    result: Result;
    inputs: Inputs;
}

const formatCurrency = (value: number) => {
    return value.toLocaleString('pl-PL', { style: 'currency', currency: 'PLN', minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

const CalculationRow: React.FC<{ label: React.ReactNode; value: string; isBold?: boolean; className?: string }> = ({ label, value, isBold = false, className = '' }) => (
    <div className={`flex justify-between items-baseline py-2 ${isBold ? 'font-bold' : ''} ${className}`}>
        <span className="text-slate-300 text-left pr-2">{label}</span>
        <span className="text-right text-white tabular-nums">{value}</span>
    </div>
);

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="mb-4">
        <h3 className="font-semibold text-md text-orange-400 border-b border-slate-600 pb-2 mb-2">{title}</h3>
        <div className="space-y-1 text-sm">{children}</div>
    </div>
);


const CalculationsBreakdown: React.FC<CalculationsBreakdownProps> = ({ result, inputs }) => {
    const { sellingPriceGross, error, purchasePriceNet, totalProfit, sellingPriceNet, salesVatValue, commissionValue } = result;
    const isValid = sellingPriceGross > 0 && !error;

    if (!isValid) {
        return (
            <div className="bg-slate-700/50 rounded-b-xl rounded-tr-xl p-6 h-full flex flex-col justify-center items-center shadow-lg border border-slate-600 border-t-0 text-slate-400">
                <p className="text-center">Wprowadź poprawne dane, aby zobaczyć szczegółowe obliczenia.</p>
                {error && <p className="mt-4 text-center text-sm text-red-400 bg-red-900/30 p-3 rounded-lg">{error}</p>}
            </div>
        );
    }
    
    const basePrice = purchasePriceNet + totalProfit;
    const profitFromPercentage = purchasePriceNet * (inputs.desiredProfitPercentage / 100);

    return (
        <div className="bg-slate-700/50 rounded-b-xl rounded-tr-xl p-6 h-full shadow-lg border border-slate-600 border-t-0 overflow-y-auto">
            <Section title="Krok 1: Cena zakupu netto">
                <CalculationRow label={<>Cena zakupu <span className="text-slate-400 capitalize">({inputs.purchasePriceType})</span></>} value={formatCurrency(inputs.purchasePrice)} />
                {inputs.purchasePriceType === 'gross' && (
                    <CalculationRow label={<><span className="text-slate-400">Przeliczenie na netto</span></>} value={`${formatCurrency(purchasePriceNet)}`} />
                )}
                <CalculationRow label="Cena zakupu netto" value={formatCurrency(purchasePriceNet)} isBold={true} className="border-t border-slate-600/50"/>
            </Section>

            <Section title="Krok 2: Całkowity zysk">
                <CalculationRow label="Zysk kwotowy" value={formatCurrency(inputs.desiredProfit)} />
                <CalculationRow label={<>Zysk % <span className="text-slate-400">({inputs.desiredProfitPercentage}% od zakupu)</span></>} value={formatCurrency(profitFromPercentage)} />
                <CalculationRow label="Całkowity zysk (do ręki)" value={formatCurrency(totalProfit)} isBold={true} className="border-t border-slate-600/50"/>
            </Section>
            
            <Section title="Krok 3: Podstawa do ceny sprzedaży">
                 <CalculationRow label="Cena zakupu netto" value={formatCurrency(purchasePriceNet)} />
                 <CalculationRow label="Całkowity zysk" value={formatCurrency(totalProfit)} />
                 <CalculationRow label="Podstawa (Zakup + Zysk)" value={formatCurrency(basePrice)} isBold={true} className="border-t border-slate-600/50"/>
            </Section>
            
            <Section title="Krok 4: Ustalenie ceny sprzedaży">
                <p className="text-xs text-slate-400 pb-2">Cena musi pokryć podstawę, prowizję Allegro (liczoną od ceny brutto) oraz VAT sprzedaży (liczony od ceny netto).</p>
                <CalculationRow label="Cena sprzedaży netto" value={formatCurrency(sellingPriceNet)} isBold={true} />
                <CalculationRow label={<>+ VAT od sprzedaży <span className="text-slate-400">({inputs.salesVatRate}%)</span></>} value={formatCurrency(salesVatValue)} />
                <CalculationRow label="= Cena sprzedaży brutto" value={formatCurrency(sellingPriceGross)} isBold={true} className="border-t border-slate-600/50" />
            </Section>
            
            <Section title="Krok 5: Weryfikacja">
                <CalculationRow label="Przychód (Cena brutto)" value={formatCurrency(sellingPriceGross)} />
                <CalculationRow label={<>- Prowizja <span className="text-slate-400">({inputs.commissionRate}%)</span></>} value={`- ${formatCurrency(commissionValue)}`} />
                <CalculationRow label={<>- VAT od sprzedaży <span className="text-slate-400">({inputs.salesVatRate}%)</span></>} value={`- ${formatCurrency(salesVatValue)}`} />
                <CalculationRow label="= Kwota po odliczeniach" value={formatCurrency(sellingPriceGross - commissionValue - salesVatValue)} isBold={true} className="border-t border-slate-600/50"/>
                <CalculationRow label="- Cena zakupu netto" value={`- ${formatCurrency(purchasePriceNet)}`}/>
                <CalculationRow 
                    label="= Zysk na czysto" 
                    value={formatCurrency(totalProfit)} 
                    isBold={true} 
                    className="!text-green-400 border-t border-green-500/50"
                />
            </Section>
        </div>
    );
}

export default CalculationsBreakdown;
