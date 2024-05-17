# CSRF Showcase

This is a vulnerable web application that is vulnerable to Cross-Site Request Forgery (CSRF) attacks. The application is a simple online banking system that allows users to transfer money between accounts. The application's transfer money functionality is vulnerable to CSRF attacks, which allows an attacker to transfer money from a victim's account without their consent.

## Setup

### Pre-requisites

- Python 3.10 or higher
- PostgreSQL
- Redis
- Node.js
- Yarn

### Installation

First of all, install the required dependencies by running the following command:

```bash
pip install -r requirements.txt
```

Next, build the frontend assets by running the following command:

```bash
cd frontend
yarn install
yarn build
```

After this, you need to provide the application with a secret key. Create a file named `.env` in the root directory of the project and add the following line to it:

```properties
SECRET_KEY=<your_secret_key>
```

Replace `<your_secret_key>` with a secret key of your choice.

Also, you need to create the database and apply the migrations. Create the database, and then add URL to the database in the `.env` file:

```properties
DATABASE_URL=postgresql+asyncpg://postgres:postgres@localhost:5432/stbank
ALEMBIC_DATABASE_URL=postgresql+psycopg2://postgres:postgres@localhost:5432/stbank
```

After this, apply the migrations by running the following command:

```bash
alembic upgrade head
```

Next, specify the Redis connection details in the `.env` file:

```properties
REDIS_HOST=localhost
REDIS_PORT=6379
CACHE_EXPIRE_SECONDS=1209600
```

To run the application with HTTPS, you need to generate a self-signed SSL certificate. You can generate a self-signed SSL certificate by running the following command:

```
openssl req -x509 -newkey rsa:4096 -keyout key.pem -out cert.pem -days 365
```

Finally, you can start the application by running the following command:

```bash
uvicorn src.main:app --reload --ssl-keyfile key.pem --ssl-certfile cert.pem
```

The application will be accessible at `https://localhost:8000` (or any other port you specify).

## Performing the CSRF Attack

To perform the CSRF attack, you need to create a malicious HTML page that contains a form that submits a POST request to the `/transfer` endpoint of the application. The form should contain the following fields:

- `amount` - The amount of money to transfer
- `recipient` - The recipient's account number
- `description` - The description of the transaction (optional)

The form should be submitted using JavaScript when the page is loaded. The following is an example of a malicious HTML page that performs a CSRF attack:

```html
<form action="https://localhost:8000/transfer" method="POST">
  <input type="hidden" name="amount" value="10" />
  <input type="hidden" name="recipient" value="scammer" />
  <input type="hidden" name="description" value="CSRF Attack" />
</form>

<script>
  document.forms[0].submit();
</script>
```

When a victim visits the malicious page, the form will be submitted automatically, and the attacker will be able to transfer money from the victim's account without their consent.

## Preventing CSRF Attacks

To prevent CSRF attacks, you can implement the following countermeasures:

- Synchronizer Token Pattern: Include a unique token in each form submission that is validated on the server-side to prevent CSRF attacks.

- Signed Double-Submit Cookie: Include a signed cookie with each form submission that contains a unique value. The server can verify the cookie to prevent CSRF attacks.

- SameSite Cookies: Set the `SameSite` attribute on cookies to `Strict` or `Lax` to prevent CSRF attacks.

## References

- [OWASP Cross-Site Request Forgery (CSRF) Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html)
- [Web Security 101: An Interactive Cross-Site Request Forgery (CSRF) Demo](https://victorzhou.com/blog/csrf)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
