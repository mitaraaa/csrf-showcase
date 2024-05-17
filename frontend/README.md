<div align="center">
    <img src="./public/logo.svg" width="32">
    <h1 align="center">stbank</h1>
</div>

This web application is a simple online banking system vulnerable to Cross-Site Request Forgery (CSRF) attacks. Users can transfer money between accounts, but the transfer functionality is not protected against CSRF attacks, allowing unauthorized transfers.

## Stack

- [Vite](https://vitejs.dev/)
- [React](https://reactjs.org/)
- [Radix UI](https://radix-ui.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Tanstack Router](https://tanstack.com/router/latest)

## Installation

Assuming you have Yarn:

```bash
yarn install
yarn dev
```

To build, run:

```bash
yarn build
```
