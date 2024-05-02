 # Elokuvasovellus  

 

### Mistä projektissa on kyse:  

OAMK:in toisen vuoden TVT-insinööriopiskelijoiden luoma web-sovellus elokuvaharrastajille.  

 

### Projektin kuvaus:  

Lähdimme toteuttamaan elokuvasovellus projektia, joka toimii web-sovelluksena. Sovelluksessa pystyy tarkastelemaan elokuvia ja niiden esitysaikoja. Käyttäjä pystyy luomaan itselleen tunnukset sovellukseen. Kirjautuneet käyttäjät voivat muodostaa ryhmiä ja omia suosikkilistoja sekä jättää elokuva-arvosteluja muiden käyttäjien luettavaksi.   

 

### Sovelluksen teknologiat: 

Frontend on toteutettu ohjelmointikielillä React, JavaScript, HTML ja CSS. Backend on toteutettu ohjelmointikielillä Node.js ja PostgreSQL. Ohjelman kehittämiseen on käytetty VsCode-ympäristöä, GitHubia versionhallintaan ja tietokanta on ylläpidetty Render.com- palvelussa.  

 

### Ryhmän jäsenet ja roolit: 

Ryhmään kuuluvat jäsenet Jenni Korhonen, Peetu Rantanen, Maija Björkman ja Aaro Kallioinen. Kaikki ryhmän jäsenet toimivat full-stack-koodareina ja osallistuivat ohjelman toiminnallisuuden ja ulkoasun suunnitteluun. Jokaiselle ryhmäläiselle on jaettu back- ja frontend-tehtäviä.  

 

### Sovelluksen käyttöönotto: 

Githubista täytyy ladata kaksi repositoryä Elokuvasovellus ja ElokuvasovellusServer. ElokuvasovellusServer-kansion juureen luodaan .env-tiedosto repositorystä löytyvän pohjan mukaan. Käyttöönottajan täytyy luoda tunnukset TMDB-palveluun API-avaimen saamiseksi. Seuraavaksi käyttöönottajan tulee perustaa postgreSQL-tietokanta ElokuvasovellusServer repositorystä löytyvällä tietokanta.sql-skriptillä.  Tämän tehtyään käyttöönottajan tulee ajaa molemmissa kansioissa terminaalin kautta ”npm i”-komento, joka lataa ohjelman tarvitsemat node.js-paketit. Sitten käynnistetään ensin ElokuvasovellusServer-komennolla ”npm start” ja sama tehdään Elokuvasovellus-kansiossa. Viimeisin komento avaa ohjelman käyttöjärjestelmän oletusselaimessa.  

 

 

## Sovelluksen tietokantakaavio 

Kuvassa 1 on tietokantakaavio, jonka pohjalta sovellus on toteutettu. 

 

![erkaavio](https://github.com/TVT23-11/Elokuvasovellus/assets/129080102/56ee9fc5-1d5e-41fe-855a-85317667799f)


Kuva 1 . 

 

## Käyttöliittymän suunnittelukuvia  

Kuvissa 2, 3 ja 4 esitellään sovelluksen käyttöliittymän suunnitelmaa. 


![etusiwu](https://github.com/TVT23-11/Elokuvasovellus/assets/129080102/f5effc95-42f9-4845-b42e-e2faf0b42aca)



Kuva 2. Käyttöliittymän etusivu. 


![ryhmat1](https://github.com/TVT23-11/Elokuvasovellus/assets/129080102/38b6aa62-38a7-452d-9fdb-ce77098ee701)



Kuva 3. Käyttöliittymän ryhmienhallinta -sivu.

![teatterioik](https://github.com/TVT23-11/Elokuvasovellus/assets/129080102/ae2d02d7-835a-4908-9322-5cf7034ea3a6)

Kuva 4. Käyttöliittymän teatterinäytöksen valinta – sivu. 

 

[Linkki palvelimelle, jossa sovellus ajossa](https://elokuvasovellusserver.onrender.com)


 

[Esittelyvideo](https://www.youtube.com/watch?v=QJQU2sthYj4) 

[API-dokumentaatio](https://documenter.getpostman.com/view/30128179/2sA3JDi6HT)

This project is licensed under the terms of the MIT license.
