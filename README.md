# Node.JS + UI5 + MySql

- Név és telefonszám felvétele
- Keresés név alapján
- Keresés telefonszám alapján

---

## Szükséges programok

- [Node.js](https://nodejs.org/en/download)
- [MySQL](https://dev.mysql.com/downloads/installer/) (server only)

---

## Telepítés és futtatás

### Backend setup

> MySQL felhasználónév / jelszót a .env fájlba kell berakni (a .env.example fájl alapján)
```bash
cd backend
npm install
node setup.js
```

### Frontend setup

```bash
cd frontend
npm install
```

### Backend futtatás

```bash
cd backend
node server.js
```

### Frontend futtatás (külön terminálban)

```bash
cd frontend
npm start
```
*(npm start => ui5 serve -o index.html)*

---

## Adatbázis struktúra

```
- users
 - id           INT  PK  AUTO_INCREMENT
 - user_name    VARCHAR(255)
 - phone_number VARCHAR(20)
```

---

## Backend tesztek

Jest testing framework:

*összes teszt futtatása:*
```bash
cd backend
npm test
```
*teszt, eredmény exportálással:*
```bash
cd backend
npm test:export
```


# Dokumentáció

Minden dokumentáció megtalálható a backend / frontend mappában (../backend/README.md, ../frontend/README.md). 
A dokumnetációt AI írta és manuálisan ellenőriztem.