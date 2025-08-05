

'use client';

import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import './OTPForm.css';

const schema = z.object({
  countryCode: z.string().min(1, 'Country code is required'),
  phoneNumber: z.string().min(6, 'Invalid phone number'),
  otp: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

const OTPForm = () => {
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [countries, setCountries] = useState<{ name: string; code: string }[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    fetch('https://restcountries.com/v3.1/all?fields=name,idd')
      .then(res => res.json())
      .then(data => {
        const list = data
          .map((c: any) => ({
            name: c.name.common,
            code: c.idd?.root ? `${c.idd.root}${c.idd.suffixes?.[0] || ''}` : '',
          }))
          .filter((c: any) => c.code);
        setCountries(list.sort((a, b) => a.name.localeCompare(b.name)));
      });
  }, []);

  const onSubmit = (data: FormData) => {
    if (!otpSent) {
      setLoading(true);
      setTimeout(() => {
        setOtpSent(true);
        setLoading(false);
        alert('OTP sent successfully (simulated)');
      }, 1500);
    } else {
      alert('OTP verified! Logging in...');
      localStorage.setItem('isLoggedIn', 'true');
      window.location.href = '/dashboard';
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="otp-container">
      <h2>Login</h2>

      <label>Country Code</label>
      <select {...register('countryCode')}>
        <option value="">Select Country</option>
        {countries.map((c, i) => (
          <option key={i} value={c.code}>
            {c.name} ({c.code})
          </option>
        ))}
      </select>
      {errors.countryCode && <p style={{ color: 'red' }}>{errors.countryCode.message}</p>}

      <label>Phone Number</label>
      <input type="text" {...register('phoneNumber')} placeholder="Enter your number" />
      {errors.phoneNumber && <p style={{ color: 'red' }}>{errors.phoneNumber.message}</p>}

      {otpSent && (
        <>
          <label>Enter OTP</label>
          <input type="text" {...register('otp')} placeholder="123456" />
        </>
      )}

      <button type="submit" disabled={loading}>
        {loading ? 'Sending OTP...' : otpSent ? 'Verify OTP' : 'Send OTP'}
      </button>
    </form>
  );
};

export default OTPForm;
