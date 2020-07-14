Ohessa on main-funktio, joka käyttää Ship - nimistä tietorakennetta, jota ei kuitenkaan ole vielä määritelty. Siksipä, kun koitat kääntää ja suorittaa ohjelman “Submit” - napilla, esiin ryöpsähtää iso joukko kääntäjävaroituksia ja -virheitä.
        
Määriteltävässä tietorakenteessa tulisi olla kolme kenttää:

* name, joka kertoo aluksen nimen
* weight, joka kertoo aluksen painon tonneissa
* cargo, joka on taulukko merkkijonoja. Taulukossa kerrotaan mitä lastia laivassa on. Taulukon maksimipituus määritellään staattisesti tietorakenteessa (voit esimerkiksi päättää, että taulukossa on enintään 10 alkiota). Merkkijononhan voi esittää char - osoittimella. Voit myös olettaa että merkkijonon sisältö ei muutu.

Voit muokata ohjelmasta vain main-funktion yläpuolista osuutta. Määrittele siihen vaadittu tietorakenne niin, että ohjelma kääntyy ja toimii virheettä. Tutki main - funktiota, ja päättele sen perusteella mitä tietorakenteen tarkalleen ottaen tulisi pitää sisällään.

Kun ohjelma toimii oikein, sen tulisi tulostaa:

```
Name: Tanker  / Weight 100000.00 tonnes
Cargo:
* Gasoline
* Oil
----------
Name: Fun boat  / Weight 1.25 tonnes
Cargo:
* Food basket
* Sunscreen
* Very good lemonade
----------
```