### Bandbestillingssystem for Studentersamfundet i Trondhjem (BaST ??)


For å installere og kjøre på *nix systemer via terminal

Vi bruker Nodejs for å kjøre serveren vår. For å installere Nodejs må vi bruke en pakkebehandler.
Vi bruker pakkebehandleren *apt*, dette avhenger av din distrubusjon. På MacOS er det enklest å bruke *brew*.

For å installere programmer med  må vi kjøre apt som *super user* ved hjelp av kommandoensud

Programmene vi trenger for å laste ned og kjøre serveren er git, nodejs, mongodb og pm2

	sudo apt install git nodejs mongodb pm2


Lag mappen som databasen skal være i:

	sudo mkdir /data/db

Last ned prosjektet ved hjelp av git:

	git clone *adresse til repoet*

Gå inn i prosjektmappen og installer tilleggspakkene som hører til prosjektet med pakkebehandleren npm, som følger med Nodejs
Pakkene som skal installeres er lagret i prosjektets package.json fil, og installeres ved å kjøre:

	cd gruppe09 && npm install 

For å kjøre MongoDB og Node bruker vi pm2

	pm2 start mongod && pm2 start app.js


