/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  env: {
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY:
      "pk_test_51N1tHlSGqMoxAco2KCATuVlExkwH2MihkgI2wxGj7JXeaWje55qu9Qa2h598QM1UgE5m46UhrzV4zZhS30jDoq7g00ourbSHr5",
    STRIPE_SECRET_KEY:
      "sk_test_51N1tHlSGqMoxAco2dmleB2U9O17Ehc4JwWxSzYnFCTwilZXb8Caz0wdKM1DNpAQSbpT0wQIGTDpqN7knYmorfwuU00UpCAZzB0",
  },
};

module.exports = nextConfig;
