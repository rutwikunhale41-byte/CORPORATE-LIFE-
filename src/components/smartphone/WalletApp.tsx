import React, { useState } from 'react';
import { PersonalLifeState, WalletTransaction } from '../../types/smartphone';
import { 
  Wallet, 
  ArrowDownRight, 
  ArrowUpRight, 
  Send, 
  PlusCircle, 
  TrendingUp, 
  ShieldCheck, 
  Zap, 
  Wifi, 
  Home, 
  CheckCircle2, 
  CreditCard 
} from 'lucide-react';

interface WalletAppProps {
  personalLife: PersonalLifeState;
  onUpdatePersonalLife: (updater: (prev: PersonalLifeState) => PersonalLifeState) => void;
}

export const WalletApp: React.FC<WalletAppProps> = ({
  personalLife,
  onUpdatePersonalLife,
}) => {
  const [activeTab, setActiveTab] = useState<'balance' | 'transfer' | 'bills' | 'invest'>('balance');
  const [transferRecipient, setTransferRecipient] = useState<string>('contact-mom');
  const [transferAmount, setTransferAmount] = useState<string>('');
  const [transferNote, setTransferNote] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');

  const handleSendMoney = () => {
    const amt = parseFloat(transferAmount);
    if (isNaN(amt) || amt <= 0 || amt > personalLife.walletBalance) {
      alert('Invalid or insufficient funds for transfer!');
      return;
    }

    const contact = personalLife.contacts.find(c => c.id === transferRecipient);
    const recipientName = contact ? contact.name : 'UPI Transfer';

    const newTx: WalletTransaction = {
      id: `tx-${Date.now()}`,
      type: 'EXPENSE',
      title: `UPI Transfer to ${recipientName}`,
      category: 'DATING',
      amount: amt,
      currency: '₹',
      timestamp: 'Just now',
    };

    onUpdatePersonalLife(prev => ({
      ...prev,
      walletBalance: prev.walletBalance - amt,
      walletTransactions: [newTx, ...prev.walletTransactions],
    }));

    setSuccessMessage(`₹${amt.toLocaleString('en-IN')} sent via UPI to ${recipientName}!`);
    setTransferAmount('');
    setTransferNote('');

    setTimeout(() => setSuccessMessage(''), 4000);
  };

  const handlePayBill = (billTitle: string, amount: number) => {
    if (amount > personalLife.walletBalance) {
      alert('Insufficient wallet balance to pay bill!');
      return;
    }

    const newTx: WalletTransaction = {
      id: `tx-bill-${Date.now()}`,
      type: 'EXPENSE',
      title: `Bill Paid: ${billTitle}`,
      category: 'BILLS',
      amount,
      currency: '₹',
      timestamp: 'Just now',
    };

    onUpdatePersonalLife(prev => ({
      ...prev,
      walletBalance: prev.walletBalance - amount,
      walletTransactions: [newTx, ...prev.walletTransactions],
    }));

    setSuccessMessage(`₹${amount.toLocaleString('en-IN')} paid for ${billTitle}!`);
    setTimeout(() => setSuccessMessage(''), 4000);
  };

  const candidateName = personalLife.candidateName || 'Candidate';
  const upiHandle = candidateName.toLowerCase().replace(/\s+/g, '') || 'pay';

  return (
    <div className="flex flex-col h-full bg-slate-950 text-white font-sans text-xs overflow-hidden">
      {/* Header */}
      <div className="p-3 bg-slate-900 border-b border-slate-800 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-teal-600 flex items-center justify-center font-bold text-white text-sm">
            <Wallet className="w-4 h-4" />
          </div>
          <div>
            <h2 className="font-bold text-sm text-slate-100">HDFC Banking & Wallet</h2>
            <p className="text-[10px] text-slate-400">UPI ID: {upiHandle}@hdfcbank</p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex bg-slate-950 p-0.5 rounded-lg border border-slate-800 text-[10px] font-bold">
          <button
            onClick={() => setActiveTab('balance')}
            className={`px-2 py-1 rounded ${activeTab === 'balance' ? 'bg-teal-600 text-white' : 'text-slate-400'}`}
          >
            Balance
          </button>
          <button
            onClick={() => setActiveTab('transfer')}
            className={`px-2 py-1 rounded ${activeTab === 'transfer' ? 'bg-teal-600 text-white' : 'text-slate-400'}`}
          >
            UPI Send
          </button>
          <button
            onClick={() => setActiveTab('bills')}
            className={`px-2 py-1 rounded ${activeTab === 'bills' ? 'bg-teal-600 text-white' : 'text-slate-400'}`}
          >
            Bills
          </button>
          <button
            onClick={() => setActiveTab('invest')}
            className={`px-2 py-1 rounded ${activeTab === 'invest' ? 'bg-teal-600 text-white' : 'text-slate-400'}`}
          >
            SIPs
          </button>
        </div>
      </div>

      {/* Main Area */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-slate-950">
        {/* Success Banner */}
        {successMessage && (
          <div className="p-2.5 rounded-xl bg-emerald-950 border border-emerald-700 text-emerald-300 font-bold text-xs flex items-center gap-2 animate-fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Account Balance Card */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950 via-teal-950 to-slate-900 border border-emerald-800 shadow-xl space-y-2">
          <div className="flex items-center justify-between text-xs text-emerald-300">
            <span>Primary Savings Account</span>
            <span className="flex items-center gap-1 font-bold text-[10px] bg-emerald-900/80 px-2 py-0.5 rounded-full border border-emerald-700">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> CIBIL: 785
            </span>
          </div>

          <div className="text-2xl font-extrabold text-white tracking-tight">
            ₹{personalLife.walletBalance.toLocaleString('en-IN')}
          </div>

          <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-emerald-900/60">
            <span>A/C No: •••• 8912</span>
            <span className="text-emerald-400 font-bold">UPI Active</span>
          </div>
        </div>

        {/* BALANCE & TRANSACTIONS TAB */}
        {activeTab === 'balance' && (
          <div className="space-y-2">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-1">
              Transaction History
            </div>

            {personalLife.walletTransactions.map(tx => (
              <div key={tx.id} className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    tx.type === 'INCOME' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-rose-950 text-rose-400 border border-rose-800'
                  }`}>
                    {tx.type === 'INCOME' ? <ArrowDownRight className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-100">{tx.title}</h4>
                    <p className="text-[9px] text-slate-400">{tx.category} • {tx.timestamp}</p>
                  </div>
                </div>

                <div className={`text-xs font-extrabold ${tx.type === 'INCOME' ? 'text-emerald-400' : 'text-slate-200'}`}>
                  {tx.type === 'INCOME' ? '+' : '-'}₹{tx.amount.toLocaleString('en-IN')}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* SEND MONEY / UPI TRANSFER TAB */}
        {activeTab === 'transfer' && (
          <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl space-y-3">
            <div className="font-bold text-slate-100 text-xs flex items-center gap-1.5">
              <Send className="w-4 h-4 text-teal-400" />
              <span>Instant UPI Money Transfer</span>
            </div>

            <div>
              <label className="text-[10px] text-slate-400 block mb-1">Select Recipient Contact</label>
              <select
                value={transferRecipient}
                onChange={e => setTransferRecipient(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-white"
              >
                {personalLife.contacts.map(c => (
                  <option key={c.id} value={c.id}>{c.name} ({c.relationshipType})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[10px] text-slate-400 block mb-1">Amount (₹)</label>
              <input
                type="number"
                value={transferAmount}
                onChange={e => setTransferAmount(e.target.value)}
                placeholder="e.g. 2000"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-500"
              />
            </div>

            <button
              onClick={handleSendMoney}
              disabled={!transferAmount}
              className="w-full py-2.5 bg-teal-600 hover:bg-teal-500 text-white font-bold rounded-lg text-xs flex items-center justify-center gap-1 shadow"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send UPI Transfer Now</span>
            </button>
          </div>
        )}

        {/* PAY UTILITY BILLS TAB */}
        {activeTab === 'bills' && (
          <div className="space-y-2">
            <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-amber-400" />
                <div>
                  <div className="font-bold text-slate-200 text-xs">MSEDCL Electricity Bill</div>
                  <div className="text-[10px] text-slate-400">Due in 4 days</div>
                </div>
              </div>
              <button
                onClick={() => handlePayBill('Electricity Bill', 1850)}
                className="px-3 py-1.5 bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold rounded-lg shadow"
              >
                Pay ₹1,850
              </button>
            </div>

            <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Wifi className="w-5 h-5 text-blue-400" />
                <div>
                  <div className="font-bold text-slate-200 text-xs">Airtel Fiber Broadband</div>
                  <div className="text-[10px] text-slate-400">Monthly 300 Mbps Unlimited</div>
                </div>
              </div>
              <button
                onClick={() => handlePayBill('Airtel Broadband', 999)}
                className="px-3 py-1.5 bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold rounded-lg shadow"
              >
                Pay ₹999
              </button>
            </div>
          </div>
        )}

        {/* INVESTMENTS & SIPS TAB */}
        {activeTab === 'invest' && (
          <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl space-y-2">
            <div className="flex items-center gap-2 font-bold text-slate-100 text-xs">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <span>Mutual Fund SIP Investment Portfolio</span>
            </div>
            <p className="text-[10px] text-slate-400 leading-relaxed">
              Automated monthly SIP of ₹15,000 in Nifty 50 Index & Large Cap Equity Fund. Projected returns: 14% p.a.
            </p>
            <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800 text-[10px] flex items-center justify-between">
              <span>Total Invested Value</span>
              <span className="font-extrabold text-emerald-400">₹3,40,000 (+18.4%)</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
