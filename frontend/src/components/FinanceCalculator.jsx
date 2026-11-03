import React, { useState, useMemo } from 'react';
import { Calculator, DollarSign, Calendar, ShieldCheck, ArrowRight, CheckCircle2, Code, ChevronDown, ChevronUp, User, Mail, Phone, MapPin, Briefcase, Award } from 'lucide-react';
import confetti from 'canvas-confetti';
import { submitLoanApplication } from '../utils/api';

export default function FinanceCalculator({ cars = [] }) {
  const [selectedCarId, setSelectedCarId] = useState(cars[0]?.id || '');
  const [downPaymentPercent, setDownPaymentPercent] = useState(15);
  const [termMonths, setTermMonths] = useState(60);
  const [interestRate, setInterestRate] = useState(4.99);
  const [isLease, setIsLease] = useState(false);
  
  // Applicant details
  const [applicantName, setApplicantName] = useState('');
  const [applicantEmail, setApplicantEmail] = useState('');
  const [applicantPhone, setApplicantPhone] = useState('');
  const [applicantCity, setApplicantCity] = useState('');
  const [annualIncome, setAnnualIncome] = useState('$100,000 - $150,000');
  const [creditTier, setCreditTier] = useState('Excellent (740+)');
  const [employmentStatus, setEmploymentStatus] = useState('Employed / Executive');

  const [loanSubmitted, setLoanSubmitted] = useState(false);
  const [confirmedLoan, setConfirmedLoan] = useState(null);
  const [loanLoading, setLoanLoading] = useState(false);
  const [showJsonRaw, setShowJsonRaw] = useState(false);

  const currentCar = cars.find(c => c.id === selectedCarId) || cars[0] || { starting_price: 100000, name: 'BMW' };
  const vehiclePrice = currentCar.starting_price;

  const downPaymentAmount = Math.round((vehiclePrice * downPaymentPercent) / 100);
  const loanPrincipal = vehiclePrice - downPaymentAmount;

  // Monthly payment calculation
  const monthlyPayment = useMemo(() => {
    if (isLease) {
      const residual = vehiclePrice * 0.54;
      const depreciation = (vehiclePrice - downPaymentAmount - residual) / termMonths;
      const financeFee = (vehiclePrice + residual) * (interestRate / 2400);
      return Math.max(100, Math.round(depreciation + financeFee));
    } else {
      const monthlyRate = interestRate / 100 / 12;
      if (monthlyRate === 0) return Math.round(loanPrincipal / termMonths);
      const factor = Math.pow(1 + monthlyRate, termMonths);
      return Math.round((loanPrincipal * (monthlyRate * factor)) / (factor - 1));
    }
  }, [vehiclePrice, downPaymentAmount, loanPrincipal, termMonths, interestRate, isLease]);

  const totalCost = (monthlyPayment * termMonths) + downPaymentAmount;
  const totalInterest = Math.max(0, totalCost - vehiclePrice);

  const handleSubmitLoan = async (e) => {
    e.preventDefault();
    if (!applicantName || !applicantEmail) return;

    setLoanLoading(true);
    try {
      const loanPayload = {
        name: applicantName,
        email: applicantEmail,
        phone: applicantPhone,
        city: applicantCity || 'Not specified',
        annual_income: annualIncome,
        credit_score_tier: creditTier,
        employment_status: employmentStatus,
        car_id: currentCar.id,
        car_name: currentCar.name,
        vehicle_price: vehiclePrice,
        plan_type: isLease ? 'BMW Executive Lease' : 'BMW Select Loan',
        down_payment: downPaymentAmount,
        down_payment_percent: downPaymentPercent,
        term_months: termMonths,
        interest_rate_apr: interestRate,
        estimated_monthly_payment: monthlyPayment,
        total_financed_principal: loanPrincipal,
        total_estimated_interest: totalInterest,
        total_cost: totalCost,
        notes: `Applied online via BMW Financial Services Estimator. Selected ${termMonths} months @ ${interestRate}% APR.`
      };

      const res = await submitLoanApplication(loanPayload);
      
      try {
        confetti({
          particleCount: 90,
          spread: 70,
          origin: { y: 0.7 }
        });
      } catch (cErr) {
        // ignore
      }

      setConfirmedLoan(res.application);
      setLoanSubmitted(true);
    } catch (err) {
      console.error(err);
      alert('Could not submit loan application: ' + err.message);
    } finally {
      setLoanLoading(false);
    }
  };

  return (
    <section id="finance" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      <div className="glass-panel rounded-3xl p-6 sm:p-12 border border-white/10 relative overflow-hidden">
        
        {/* Glow corner */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center space-x-2 text-blue-400 font-mono text-xs uppercase tracking-widest mb-2 font-semibold">
            <Calculator className="w-4 h-4" />
            <span>BMW Financial Services // Credit Application</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white uppercase tracking-tight font-sans">
            Payment & Loan Application
          </h2>
          <p className="text-gray-400 text-xs sm:text-sm mt-2">
            Calculate your customized terms and submit an official financing application with instant pre-approval review.
          </p>
        </div>

        {/* Lease vs Finance Switch */}
        <div className="flex justify-center mb-8">
          <div className="bg-black/60 p-1 rounded-xl border border-white/10 flex space-x-2">
            <button
              onClick={() => setIsLease(false)}
              className={`px-6 py-2 rounded-lg text-xs font-mono uppercase tracking-wider font-bold transition-all cursor-pointer ${
                !isLease ? 'bg-blue-600 text-white shadow-md' : 'text-gray-400 hover:text-white'
              }`}
            >
              BMW Select Loan
            </button>
            <button
              onClick={() => setIsLease(true)}
              className={`px-6 py-2 rounded-lg text-xs font-mono uppercase tracking-wider font-bold transition-all cursor-pointer ${
                isLease ? 'bg-blue-600 text-white shadow-md' : 'text-gray-400 hover:text-white'
              }`}
            >
              BMW Executive Lease
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Sliders and Controls */}
          <div className="lg:col-span-6 space-y-6">
            
            {/* Select Vehicle */}
            <div className="space-y-2">
              <label className="text-xs uppercase font-mono text-gray-400 tracking-wider flex justify-between">
                <span>Select Vehicle</span>
                <span className="text-white font-bold font-mono">${vehiclePrice.toLocaleString()} MSRP</span>
              </label>
              <select
                value={selectedCarId}
                onChange={(e) => setSelectedCarId(e.target.value)}
                className="w-full bg-black/60 border border-white/15 text-white text-xs sm:text-sm rounded-xl px-4 py-3 font-mono focus:outline-none focus:border-blue-500 cursor-pointer"
              >
                {cars.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} — ${c.starting_price.toLocaleString()}
                  </option>
                ))}
              </select>
            </div>

            {/* Down Payment Slider */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-gray-400 uppercase">Down Payment ({downPaymentPercent}%)</span>
                <span className="text-white font-bold">${downPaymentAmount.toLocaleString()}</span>
              </div>
              <input
                type="range"
                min="0"
                max="50"
                step="5"
                value={downPaymentPercent}
                onChange={(e) => setDownPaymentPercent(Number(e.target.value))}
                className="w-full accent-blue-500 cursor-pointer h-2 bg-gray-800 rounded-lg"
              />
              <div className="flex justify-between text-[10px] text-gray-500 font-mono">
                <span>0% ($0)</span>
                <span>25%</span>
                <span>50% (${Math.round(vehiclePrice * 0.5).toLocaleString()})</span>
              </div>
            </div>

            {/* Loan Term Selection */}
            <div className="space-y-2">
              <label className="text-xs uppercase font-mono text-gray-400 tracking-wider block">
                Term Length ({termMonths} Months)
              </label>
              <div className="grid grid-cols-5 gap-2">
                {[24, 36, 48, 60, 72].map((m) => (
                  <button
                    key={m}
                    onClick={() => setTermMonths(m)}
                    className={`py-2 rounded-lg text-xs font-mono font-bold transition-all border cursor-pointer ${
                      termMonths === m
                        ? 'bg-blue-600 border-blue-400 text-white'
                        : 'bg-black/40 border-white/10 text-gray-400 hover:text-white'
                    }`}
                  >
                    {m} mo
                  </button>
                ))}
              </div>
            </div>

            {/* Interest Rate APR */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-gray-400 uppercase">Annual Percentage Rate (APR)</span>
                <span className="text-white font-bold">{interestRate}%</span>
              </div>
              <input
                type="range"
                min="1.99"
                max="9.99"
                step="0.25"
                value={interestRate}
                onChange={(e) => setInterestRate(Number(e.target.value))}
                className="w-full accent-blue-500 cursor-pointer h-2 bg-gray-800 rounded-lg"
              />
            </div>

            {/* Breakdown numbers */}
            <div className="p-4 rounded-xl bg-black/50 border border-white/10 space-y-2 text-xs font-mono">
              <div className="flex justify-between text-gray-400">
                <span>Vehicle MSRP:</span>
                <span className="text-white">${vehiclePrice.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>Down Payment:</span>
                <span className="text-white">-${downPaymentAmount.toLocaleString()} ({downPaymentPercent}%)</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>Net Financed Principal:</span>
                <span className="text-white">${loanPrincipal.toLocaleString()}</span>
              </div>
              {!isLease && (
                <div className="flex justify-between text-gray-400">
                  <span>Estimated Total Interest:</span>
                  <span className="text-white">${totalInterest.toLocaleString()}</span>
                </div>
              )}
            </div>

          </div>

          {/* Right Summary Box & Official Loan Application Form */}
          <div className="lg:col-span-6 glass-card rounded-2xl p-6 border border-white/10 space-y-5">
            
            {/* Payment Callout */}
            <div className="text-center p-5 rounded-xl bg-gradient-to-b from-blue-950/40 to-black/60 border border-blue-500/30">
              <span className="text-[10px] uppercase font-mono tracking-widest text-blue-400 font-bold block mb-1">
                Estimated Monthly Payment
              </span>
              <div className="text-4xl sm:text-5xl font-extrabold text-white font-mono tracking-tight">
                ${monthlyPayment.toLocaleString()}
                <span className="text-sm font-normal text-gray-400">/mo</span>
              </div>
              <span className="text-[11px] text-gray-400 font-mono mt-1 block">
                {isLease ? '36k Miles Standard Lease' : `Based on ${termMonths} months @ ${interestRate}% APR`}
              </span>
            </div>

            {/* Application Form or Confirmation Ticket */}
            {loanSubmitted && confirmedLoan ? (
              <div className="p-5 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 text-left space-y-4">
                <div className="flex items-center space-x-3">
                  <CheckCircle2 className="w-7 h-7 text-emerald-400 flex-shrink-0" />
                  <div>
                    <span className="text-[10px] font-mono uppercase text-emerald-400 font-bold block">
                      BMW Financial Services Pre-Approval
                    </span>
                    <h4 className="text-base font-bold text-white uppercase font-sans">
                      Application Submitted Successfully
                    </h4>
                  </div>
                </div>

                <div className="space-y-2 text-xs font-mono border-y border-white/10 py-3">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Application ID:</span>
                    <strong className="text-blue-400">{confirmedLoan.id}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Applicant:</span>
                    <strong className="text-white">{confirmedLoan.name}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Vehicle:</span>
                    <span className="text-white">{confirmedLoan.car_name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Financing Plan:</span>
                    <span className="text-emerald-300 font-bold">{confirmedLoan.plan_type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Monthly Payment:</span>
                    <strong className="text-white">${confirmedLoan.estimated_monthly_payment}/mo</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Down Payment:</span>
                    <span className="text-white">${confirmedLoan.down_payment?.toLocaleString()}</span>
                  </div>
                </div>

                {/* Raw JSON toggle */}
                <div>
                  <button
                    onClick={() => setShowJsonRaw(!showJsonRaw)}
                    className="text-[11px] font-mono text-gray-400 hover:text-white flex items-center space-x-1"
                  >
                    <Code className="w-3.5 h-3.5 text-blue-400" />
                    <span>{showJsonRaw ? 'Hide Financial Summary' : 'View Financial Summary (JSON)'}</span>
                    {showJsonRaw ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                  </button>

                  {showJsonRaw && (
                    <pre className="mt-2 p-3 rounded-lg bg-black border border-white/10 text-emerald-400 text-[10px] overflow-x-auto max-h-48 font-mono">
                      {JSON.stringify(confirmedLoan, null, 2)}
                    </pre>
                  )}
                </div>

                <button
                  onClick={() => {
                    setLoanSubmitted(false);
                    setConfirmedLoan(null);
                  }}
                  className="w-full py-2 bg-white/10 hover:bg-white/20 border border-white/10 text-white text-xs font-mono uppercase font-bold rounded-lg"
                >
                  Apply For Another Vehicle
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmitLoan} className="space-y-3.5">
                <div className="flex items-center justify-between border-b border-white/10 pb-2">
                  <span className="text-xs uppercase font-mono text-gray-300 font-bold">
                    Official BMW Financing Application
                  </span>
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800">
                    Instant Review
                  </span>
                </div>
                
                {/* Name */}
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    type="text"
                    required
                    placeholder="Full Legal Name"
                    value={applicantName}
                    onChange={(e) => setApplicantName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-black/60 border border-white/10 text-white text-xs rounded-xl font-mono focus:outline-none focus:border-blue-500"
                  />
                </div>

                {/* Email & Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input
                      type="email"
                      required
                      placeholder="Email Address"
                      value={applicantEmail}
                      onChange={(e) => setApplicantEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-black/60 border border-white/10 text-white text-xs rounded-xl font-mono focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input
                      type="tel"
                      required
                      placeholder="Phone Number"
                      value={applicantPhone}
                      onChange={(e) => setApplicantPhone(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-black/60 border border-white/10 text-white text-xs rounded-xl font-mono focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                {/* City & Credit Tier */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div className="relative">
                    <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input
                      type="text"
                      placeholder="City / Region"
                      value={applicantCity}
                      onChange={(e) => setApplicantCity(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-black/60 border border-white/10 text-white text-xs rounded-xl font-mono focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <select
                    value={creditTier}
                    onChange={(e) => setCreditTier(e.target.value)}
                    className="w-full bg-black/60 border border-white/10 text-white text-xs rounded-xl px-3 py-2.5 font-mono focus:outline-none focus:border-blue-500 cursor-pointer"
                  >
                    <option value="Excellent (750+)">Credit: Excellent (750+)</option>
                    <option value="Very Good (700-749)">Credit: Very Good (700-749)</option>
                    <option value="Good (650-699)">Credit: Good (650-699)</option>
                    <option value="Fair / Building (Under 650)">Credit: Fair (&lt;650)</option>
                  </select>
                </div>

                {/* Income & Employment */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <select
                    value={annualIncome}
                    onChange={(e) => setAnnualIncome(e.target.value)}
                    className="w-full bg-black/60 border border-white/10 text-white text-xs rounded-xl px-3 py-2.5 font-mono focus:outline-none focus:border-blue-500 cursor-pointer"
                  >
                    <option value="$75,000 - $100,000">Income: $75k - $100k</option>
                    <option value="$100,000 - $150,000">Income: $100k - $150k</option>
                    <option value="$150,000 - $250,000">Income: $150k - $250k</option>
                    <option value="$250,000+">Income: $250k+</option>
                  </select>

                  <select
                    value={employmentStatus}
                    onChange={(e) => setEmploymentStatus(e.target.value)}
                    className="w-full bg-black/60 border border-white/10 text-white text-xs rounded-xl px-3 py-2.5 font-mono focus:outline-none focus:border-blue-500 cursor-pointer"
                  >
                    <option value="Employed / Executive">Employed / Executive</option>
                    <option value="Business Owner / Self-Employed">Business Owner</option>
                    <option value="Corporate Professional">Corporate Professional</option>
                    <option value="Retired / Private Investor">Private Investor</option>
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={loanLoading}
                  className="w-full py-3.5 rounded-xl bg-[#0066b1] hover:bg-[#00528e] text-white text-xs uppercase font-bold tracking-widest transition-all cursor-pointer shadow-lg shadow-blue-900/50 flex items-center justify-center space-x-2 disabled:opacity-50"
                >
                  <DollarSign className="w-4 h-4" />
                  <span>{loanLoading ? 'Submitting Application...' : 'Submit Financing Application'}</span>
                </button>
                <span className="text-[10px] text-gray-500 text-center block font-mono">
                  BMW Financial Services will review your application confidentially.
                </span>
              </form>
            )}

          </div>

        </div>

      </div>

    </section>
  );
}
