
import React from 'react';

interface Result {
    sellingPriceGross: number;
    sellingPriceNet: number;
    commissionValue: number;
    totalProfit: number;
    salesVatValue: number;
    purchasePriceNet: number;
    error: string;
}

interface ResultCardProps {
    result: Result;
    commissionRate: number;
    salesVatRate: number;
}

const formatCurrency = (value: number) => {
    return value.toLocaleString('pl-PL', { style: 'currency', currency: 'PLN', minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

const ResultCard: React.FC<ResultCardProps> = ({
    result,
    commissionRate,
    salesVatRate
}) => {
    const { sellingPriceGross, sellingPriceNet, commissionValue, totalProfit, salesVatValue, purchasePriceNet, error } = result;
    const isValid = sellingPriceGross > 0 && !error;

    return (
        <div className="bg-slate-700/50 rounded-b-xl rounded-tr-xl p-6 h-full flex flex-col justify-center shadow-lg border border-slate-600 border-t-0">
            <div className="text-center">
                <p className="text-slate-400 text-lg">Sugerowana cena sprzedaży</p>
                <p className={`text-4xl md:text-5xl font-bold my-2 transition-colors duration-300 ${isValid ? 'text-orange-400' : 'text-slate-500'}`}>
                    {isValid ? formatCurrency(sellingPriceGross) : formatCurrency(0)}
                </p>
                <p className="text-slate-400 text-md">
                   ( {isValid ? formatCurrency(sellingPriceNet) : formatCurrency(0)} netto )
                </p>
            </div>

            {error && (
                <div className="mt-4 text-center text-sm text-red-400 bg-red-900/30 p-3 rounded-lg">
                    {error}
                </div>
            )}

            <div className="mt-6 border-t border-slate-600 pt-6 space-y-3 text-sm">
                <div className="flex justify-between items-center text-slate-300">
                    <span>Cena zakupu (netto):</span>
                    <span className="font-medium text-white">{formatCurrency(purchasePriceNet)}</span>
                </div>
                <div className="flex justify-between items-center text-slate-300">
                    <span>Planowany zysk:</span>
                    <span className="font-medium text-white">{formatCurrency(totalProfit)}</span>
                </div>
                <div className="flex justify-between items-center text-slate-300">
                    <span>Prowizja Allegro ({commissionRate}%):</span>
                    <span className="font-medium text-white">{formatCurrency(commissionValue)}</span>
                </div>
                <div className="flex justify-between items-center text-slate-300">
                    <span>Podatek VAT ({salesVatRate}%):</span>
                    <span className="font-medium text-white">{formatCurrency(salesVatValue)}</span>
                </div>

                <div className="flex justify-between items-center text-lg font-bold border-t border-slate-600 pt-3 mt-3 text-white">
                    <span>Cena sprzedaży (brutto):</span>
                    <span className="text-orange-400">{isValid ? formatCurrency(sellingPriceGross) : '-'}</span>
                </div>
            </div>
             {!isValid && !error && (
                <div className="mt-4 text-center text-xs text-slate-500">
                    Wprowadź dane, aby zobaczyć wynik.
                </div>
            )}
        </div>
    );
};

export default ResultCard;
