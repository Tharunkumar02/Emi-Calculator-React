import React, { useEffect, useState } from 'react'
import './styles.css'
import { tenureData } from './constants'
import { numberWithComma } from './config'

function MainBody() {
    const [totalAmount, setTotalAmount] = useState(0)
    const [interestRate, setInterestRate] = useState(10)
    const [fee, setFee] = useState(1)
    const [downPayment, setDownPayment] = useState(0)
    const [emi, setEmi] = useState(0)
    const [tenure, setTenure] = useState(12)

    const updateEMI = (e) => {
        if (!totalAmount) return

        const dp = Number(e.target.value)
        setDownPayment(dp.toFixed(0))

        const emi = calculateEMI(dp)
        setEmi(emi)
    }

    const updateDownPayment = (e) => {
        if (!totalAmount) return

        const emi = Number(e.target.value)
        setEmi(emi.toFixed(0))

        const dp = calculateDp(emi)
        setDownPayment(dp)
    }

    const calculateEMI = (downPayment) => {
        if (!totalAmount) return

        const loanAmount = totalAmount - downPayment;
        const rateofInterest = interestRate / 100;
        const numofYears = tenure / 12;

        const EMI = (loanAmount * rateofInterest * Math.pow(1 + rateofInterest, numofYears)) / (Math.pow(1 + rateofInterest, numofYears) - 1);
        return Number(EMI / 12).toFixed(0);

    }

    const calculateDp = () => {
        if (!totalAmount) return

        const downPaymentPercentage = 100 - (emi / calculateEMI(0) * 100);
        return Number(totalAmount * downPaymentPercentage / 100).toFixed(0);
    }

    useEffect(() => {
        if (!(totalAmount > 0)) {
            setDownPayment(0)
            setEmi(0)
        }

        const emi = calculateEMI(downPayment);
        setEmi(emi);
    }, [tenure])

    const totalDownPayment = () => {
        return numberWithComma(
            (Number(downPayment) + (totalAmount - downPayment) * (fee / 100)).toFixed(0)
        )
    }

    const totalLoanAmount = () => {
        return numberWithComma(
            (emi * tenure).toFixed(0)
        )
    }


    return (
        <div className='container'>
            <h1 className='title'>EMI CALCULATOR</h1>
            <span className='in-title'>Total Cost of Asset</span>
            <input type='number' value={totalAmount} onChange={(e) => setTotalAmount(e.target.value)} placeholder="Total Cost of the Assest" />

            <span className='in-title'>Interest Rate (in %)</span>
            <input type='number' value={interestRate} onChange={(e) => setInterestRate(e.target.value)} placeholder="Interest Rate" />

            <span className='in-title'>Processing Fee (in %)</span>
            <input type='number' value={fee} onChange={(e) => setFee(e.target.value)} placeholder="Processing Fee" />

            {/* Sliders */}

            <div className='container' id='container-1'>
                <span className='in-title'>Down Payment</span>
                <span>Total Down Payment - {totalDownPayment()}</span>
                <input type="range" min={0} max={totalAmount} className="slider" id="myRange" value={downPayment} onChange={updateEMI} />
                <div className='labels'>
                    <label>0%</label>
                    <b>{numberWithComma(downPayment)}</b>
                    <label>100%</label>
                </div>
            </div>

            <div className='container' id='container-1'>
                <span className='in-title'>Loan per Month</span>
                <span>Total Loan Amount - {totalLoanAmount()}</span>
                <input type="range" min={calculateEMI(totalAmount)} max={calculateEMI(0)} className="slider" id="myRange" value={emi} onChange={updateDownPayment} />
                <div className='labels'>
                    <label>{numberWithComma(calculateEMI(totalAmount))}</label>
                    <b>{numberWithComma(emi)}</b>
                    <label>{numberWithComma(calculateEMI(0))}</label>
                </div>
            </div>

            <span className='in-title'>Tenure</span>
            <div className='tenure-cont'>
                {tenureData.map((t) => (
                    <button key={t} className={`tenure-btn ${t === tenure ? "selected" : ""}`} onClick={() => setTenure(t)}>{t} Months</button>
                ))}
            </div>

        </div>
    )
}

export default MainBody