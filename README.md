## 🚀 Get Started

Follow these steps to set up the project locally:

### 1️⃣ Install dependencies

Install all required packages for the project:

```bash
npm install
```

### 2️⃣ Configure environment variables

Rename the `example.env` to `.env`:

- Linux / MacOS:

```bash
mv example.env .env
```

- Windows (CMD)::

```bash
rename example.env .env
```

### 3️⃣ Set up the database

```bash
npx prisma generate
npx prisma db push
```

### 4️⃣ Run the development server

```bash
npm run dev
```
