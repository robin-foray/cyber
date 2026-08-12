# Levelezőszerver telepítése — foray.hu

Ez a doksi a **családi `@foray.hu` levelezés** felállítását írja le a webes Foray app mellé.
A Filament `/admin` → **Levelezés** menü csak nyilvántartás; a tényleges postafiókokat itt, a levelezőszerveren hozod létre.

Ajánlott célhostok (illeszkednek a Filament defaultokhoz):

| Szolgáltatás | Host / URL |
|--------------|------------|
| Webapp | `https://foray.hu` |
| Mail (IMAP/SMTP) | `mail.foray.hu` |
| Webmail | `https://webmail.foray.hu` |

---

## 1. Előfeltételek

Mielőtt bármit telepítesz:

1. **VPS / dedikált gép** root SSH hozzáféréssel (Ubuntu 22.04/24.04 ajánlott).
2. **Publikus IPv4** (és ha van, IPv6) — a domain A/AAAA rekordja erre mutasson.
3. **PTR / reverse DNS** a szolgáltatódnál: az IP → `mail.foray.hu` (vagy a választott MX hostname). Enélkül a kimenő levelek gyakran spambe mennek.
4. **Portok nyitva** a tűzfalon / security groupban:

| Port | Protokoll | Cél |
|------|-----------|-----|
| 25 | TCP | SMTP (szerver–szerver) |
| 465 | TCP | SMTPS (küldés kliensből) |
| 587 | TCP | Submission (STARTTLS) |
| 993 | TCP | IMAPS |
| 80/443 | TCP | Webmail + ACME cert |

> Sok felhő/VPS **kimenő 25-öst** alapból tilt. Ha a küldés nem megy, kérj feloldást a hosternél.

5. A webes app (Laravel/Apache) és a mail stack **ugyanazon a gépen** is futhat, de a mailt érdemes külön hostname-en (`mail.foray.hu`) tartani. Ha Dockeres Mailcowot használsz, ne ütközzön az Apache 80/443-as kötésével — lásd alább.

---

## 2. DNS rekordok (foray.hu)

Állítsd be a DNS-ben (Cloudflare / registrar / saját nameserver). Példa IPv4: `203.0.113.10` — cseréld a sajátodra.

```dns
; Web (már létezik)
foray.hu.            A       203.0.113.10
www.foray.hu.        A       203.0.113.10

; Mail
mail.foray.hu.       A       203.0.113.10
webmail.foray.hu.    A       203.0.113.10

; MX — a domain leveleit a mail host fogadja
foray.hu.            MX 10   mail.foray.hu.

; SPF — csak a saját mail szerver küldhet
foray.hu.            TXT     "v=spf1 mx a:mail.foray.hu -all"

; DMARC
_dmarc.foray.hu.     TXT     "v=DMARC1; p=none; rua=mailto:admin@foray.hu"

; Autodiscover / kliens tippek (opcionális)
autoconfig.foray.hu.  CNAME  mail.foray.hu.
autodiscover.foray.hu. CNAME mail.foray.hu.
```

**DKIM** TXT rekordot a választott mail stack (Mailcow / OpenDKIM) generálja telepítés után — másold be a DNS-be, majd várj a propagációra.

Ellenőrzés:

```bash
dig +short MX foray.hu
dig +short TXT foray.hu
dig +short A mail.foray.hu
```

---

## 3. Ajánlott telepítés: Mailcow (Docker)

Családi használatra a legegyszerűbb teljes stack: Postfix + Dovecot + Rspamd + SOGo/webmail + admin UI.

### 3.1 Miért Mailcow?

- Egy paranccsal települ, van webes admin
- DKIM/SPF/DMARC, quarantine, alias, forward támogatott
- Webmail (SOGo) out of the box
- Illeszkedik a Filament inventory-hoz

### 3.2 Port / Apache ütközés

Ha a Foray webapp már Apache-on fut `foray.hu:80/443`-on:

**A) Külön szerver a mailnek (ajánlott)**  
Másik VPS → csak DNS `mail.` / `webmail.` oda mutat.

**B) Ugyanaz a gép**  
Mailcow Dockerben lefoglalná a 80/443-at. Opciók:

1. Mailcow reverse-proxy mód + Apache/Nginx proxy a `webmail.foray.hu` / `mail.foray.hu` hostokra, **vagy**
2. Mailcow HTTP(S)-t más portra (pl. 8080/8443), elé Apache/Caddy reverse proxy.

Részletek: [Mailcow reverse proxy](https://docs.mailcow.email/post_installation/firststeps-rp/).

### 3.3 Telepítés (tiszta Ubuntu, külön mail host)

```bash
# Docker
curl -sSL https://get.docker.com/ | CHANNEL=stable sh
systemctl enable --now docker

# Mailcow
cd /opt
git clone https://github.com/mailcow/mailcow-dockerized
cd mailcow-dockerized
./generate_config.sh
# MAILCOW_HOSTNAME: mail.foray.hu
# Timezone: Europe/Budapest

# Ha kell: nano mailcow.conf  (HTTP_PORT / HTTPS_PORT reverse proxyhoz)

docker compose pull
docker compose up -d
```

Admin UI: `https://mail.foray.hu` (vagy a beállított URL).  
Alap admin jelszó: a telepítés utáni Mailcow doksi / első belépéskor cseréld.

### 3.4 Domain és postafiókok Mailcowban

1. **Configuration → Mail Setup → Domains** → add `foray.hu`
2. Másold ki a **DKIM** TXT-t → DNS
3. **Mailboxes** → pl. `info@foray.hu`, `admin@foray.hu`, családtagok
4. **Aliases / Filters** → pl. `family@foray.hu` → `info@foray.hu`

Webmail tipikusan: `https://mail.foray.hu` (SOGo) — ha külön `webmail.foray.hu`-t akarsz, állíts reverse proxyt vagy CNAME-et.

---

## 4. Alternatíva: klasszikus Postfix + Dovecot + Roundcube

Ha nem akarsz Dockert, manuális stack (több munka, több karbantartás):

```bash
sudo apt update
sudo apt install -y postfix dovecot-imapd dovecot-pop3d opendkim opendkim-tools \
  certbot python3-certbot-apache roundcube
```

Magas szintű lépések:

1. **Postfix** — `main.cf`: `myhostname = mail.foray.hu`, `mydestination` / virtual mailbox domain = `foray.hu`
2. **Virtual users** — `postfix-mysql`/`pgsql` vagy egyszerű `virtual_mailbox_maps` fájlok
3. **Dovecot** — IMAPS 993, auth a virtual users ellen
4. **OpenDKIM** — kulcs generálás → DNS TXT
5. **Let’s Encrypt** — `certbot` a `mail.foray.hu` / `webmail.foray.hu` hostokra
6. **Roundcube** — Apache vhost `webmail.foray.hu` → Roundcube docroot

Ez a path hosszabb; családi használatra általában a Mailcow kevesebb gond.

Példa minimális Postfix identity:

```bash
sudo postconf -e "myhostname = mail.foray.hu"
sudo postconf -e "mydomain = foray.hu"
sudo postconf -e "myorigin = \$mydomain"
sudo systemctl restart postfix
```

Mailbox usereket / virtual map-eket a választott sémához igazítsd — ne tárolj jelszót a Foray Filament DB-ben plaintextben.

---

## 5. Kliens beállítások (Thunderbird / telefon)

| | Érték |
|--|--------|
| Email | `valaki@foray.hu` |
| IMAP | `mail.foray.hu` · 993 · SSL/TLS |
| SMTP | `mail.foray.hu` · 465 (SSL) vagy 587 (STARTTLS) |
| Auth | Normal password · teljes email cím |

---

## 6. Összekötés a Foray admin panellel

A webapp **nem** hoz létre mailboxot a Postfixban — csak nyilvántart:

1. Deploy után: `php artisan foray:install --force`
2. Belépés: `https://foray.hu/admin`
3. **Levelezés → Levelezőszerver** — állítsd:
   - Domain: `foray.hu`
   - IMAP/SMTP host: `mail.foray.hu`
   - Portok: 993 / 465
   - Webmail URL: `https://webmail.foray.hu` (vagy Mailcow SOGo URL)
4. **Levelezés → Családi emailek** — vidd fel ugyanazokat a címeket, amiket a mail stackben létrehoztál (típus: postafiók / alias / továbbítás).

Env override (opcionális, `.env`):

```env
FORAY_MAIL_DOMAIN=foray.hu
FORAY_MAIL_IMAP_HOST=mail.foray.hu
FORAY_MAIL_IMAP_PORT=993
FORAY_MAIL_SMTP_HOST=mail.foray.hu
FORAY_MAIL_SMTP_PORT=465
FORAY_MAIL_WEBMAIL_URL=https://webmail.foray.hu
```

---

## 7. Teszt checklist

```bash
# DNS
dig +short MX foray.hu
dig +short TXT foray.hu
dig +short TXT default._domainkey.foray.hu   # DKIM selector neve stack-függő

# Portok a szerveren
ss -tlnp | grep -E ':25|:465|:587|:993'

# Küldés / fogadás
# 1) küldj levelet Gmailre info@foray.hu-ról
# 2) válaszolj vissza Gmailről
# 3) ellenőrizd: https://www.mail-tester.com/  (cél: 8+/10)
```

Spam score javítás:

- PTR rendben (`mail.foray.hu`)
- SPF `-all` + érvényes DKIM
- DMARC legalább `p=none`, később `quarantine`
- Ne küldj shared/blacklisted IP-ről

---

## 8. Biztonság

- Erős mailbox jelszavak; 2FA a Mailcow adminra ha elérhető
- Fail2ban / Mailcow beépített rate limit
- Rendszeres `docker compose pull && docker compose up -d` (Mailcow)
- Ne nyiss meg Relayout (open relay tilos)
- A Foray Filamentben **ne** tárolj éles mailbox jelszót

---

## 9. Gyors döntési fa

```
Van külön VPS a mailnek?
 ├─ Igen → Mailcow Docker a mail.foray.hu-n (ajánlott)
 └─ Nem, webapp is itt van
      ├─ Tudsz reverse proxy-t állítani → Mailcow + proxy
      └─ Nem akarsz Dockert → Postfix+Dovecot+Roundcube (több munka)
```

---

## Kapcsolódó fájlok a repóban

| Fájl | Szerep |
|------|--------|
| `deploy/apache-vhost.conf.example` | Webapp Apache vhost |
| `config/foray.php` → `mail.*` | Default mail hostok |
| `.cursor/skills/foray-family-mail/SKILL.md` | Filament Levelezés modul |
| `/admin` → Levelezés | Családi címek inventory |
