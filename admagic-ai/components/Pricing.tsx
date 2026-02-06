
import React from 'react';
import { PlanType } from '../types';

interface PricingProps {
  selectedPlan: PlanType;
  onPlanSelect: (plan: PlanType) => void;
}

const Pricing: React.FC<PricingProps> = ({ selectedPlan, onPlanSelect }) => {
  const plans: { id: PlanType; name: string; price: string; features: string[]; highlight?: boolean; url?: string }[] = [
    {
      id: 'free',
      name: 'Plan FREE',
      price: '$0',
      features: ['4 usos diarios', 'Video con Marca de Agua', 'Calidad Estándar', 'Anuncios Activos'],
    },
    {
      id: 'standard',
      name: 'Plan STANDARD',
      price: '$9.99',
      features: ['100 Usos / Mes', 'Video HD Sin Marcas', 'Calidad 2K Pro', 'Sin Anuncios'],
      highlight: true,
      url: 'https://admagicstudio.gumroad.com/l/Standard'
    },
    {
      id: 'premium',
      name: 'Plan PREMIUM',
      price: '$16.99',
      features: ['Usos Ilimitados', 'Video 4K / Alta Duración', 'Máxima Resolución 4K', 'Soporte Prioritario'],
      url: 'https://admagicstudio.gumroad.com/l/Premium'
    }
  ];

  const handlePlanClick = (plan: typeof plans[0]) => {
    if (plan.url) {
      window.open(plan.url, '_blank');
    }
    onPlanSelect(plan.id);
  };

  return (
    <div className="grid grid-cols-1 gap-4 max-h-[70vh] overflow-y-auto px-1 py-4">
      {plans.map((plan) => (
        <button
          key={plan.id}
          onClick={() => handlePlanClick(plan)}
          className={`relative p-5 rounded-2xl border transition-all text-left flex flex-col ${
            selectedPlan === plan.id
              ? 'border-cyan-500 bg-cyan-500/10 shadow-[0_0_15px_rgba(6,182,212,0.2)]'
              : 'border-white/5 bg-[#050b18] hover:border-cyan-500/40'
          }`}
        >
          {plan.highlight && (
            <span className="absolute -top-2 right-4 bg-cyan-600 text-white text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-tighter font-cyber">
              Recomendado
            </span>
          )}
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-bold text-white text-xs uppercase tracking-tighter font-cyber">{plan.name}</h3>
            <p className="text-sm font-black text-cyan-400 font-cyber">{plan.price}</p>
          </div>
          <ul className="space-y-1.5">
            {plan.features.map((f, i) => (
              <li key={i} className="text-[9px] text-indigo-300 flex items-center gap-1.5 font-cyber">
                <div className="w-1 h-1 bg-cyan-500 rounded-full" />
                <span className="truncate uppercase tracking-tight font-bold">{f}</span>
              </li>
            ))}
          </ul>
        </button>
      ))}
    </div>
  );
};

export default Pricing;
