//"C:\Program Files\MongoDB\Server\7.0\bin\mongod.exe" --dbpath=C:\data\db
    const http = require('http');
    const os = require('os');
    const path = require('path');
    const fs = require('fs');
    
    const pug = require('pug');
    
    const express = require("express");
    const app = express();
    const router = express.Router();
    
    app.set('view engine', 'pug');
    app.set('views', './public/views');
    app.use(express.static(path.join(__dirname ,"/node_modules/bootstrap/dist/css")));
    app.use(express.static("./node_modules/bootstrap/dist/js"));
    app.use(express.static("./public/style/img"));
    app.use(express.static("./public/style/js"));
    app.use(express.static("./public/style/"));
    
    const {MongoClient} = require("mongodb");
    const db = require('./basicMongoFunctions');
const { log } = require('console');
    
    const url = "mongodb://localhost:27017";
    const client = new MongoClient(url);
    
    global.dbName = "GameOFThrones_RPG";
    
    //#region Data fill    
    let weapon = {
        "id" : 1,
        "name" : "Sword",
        "dmg" : 10,
        "price" : 1500
    }
    
    let weapon1 = {
        "id" : 2,
        "name" : "Mace",
        "dmg" : 35,
        "price" : 1555
    }
    
    let weapon2 = {
        "id" : 3,
        "name" : "Cross bow",
        "dmg" : 5,
        "price" : 500
    }
    
    let weapon3 = {
        "id" : 4,
        "name" : "Staff of the arc Mage",
        "dmg" : 700,
        "price" : 5000
    }
    
    let weapon4 = {
        "id" : 5,
        "name" : "Dragon Slayer Blade",
        "dmg" : 70,
        "price" : 4500
    }

    let character = {
        "id" : 1,
        "name" : "Bozó",
        "health" : 95,
        "armor" : 55,
        "weapon" : weapon
    }
    
    let character1 = {
        "id" : 2,
        "name" : "Másik Bozó",
        "health" : 100,
        "armor" : 100,
        "weapon" : weapon1
    }
    
    let character2 = {
        "id" : 3,
        "name" : "Bozó a kalandor",
        "health" : 70,
        "armor" : 0,
        "weapon" : weapon2
    }
    
    let character3 = {
        "id" : 4,
        "name" : "Bozó a védelmező",
        "health" : 150,
        "armor" : 150,
        "weapon" : weapon4
    }

    let character4 = {
        "id" : 5,
        "name" : "Bozó the weak",
        "health" : 15,
        "armor" : 0,
        "weapon" : weapon1
    }
    //#endregion
    
    async function Main() 
    {
        try
        {
            app.get("/", (req, res) => {
                async function Home()
                {
                    characters = await db.listAll(client, dbName, "Characters");
                    weapons = await db.listAll(client, dbName, "Weapons");

                    res.render('homepage');
                }
                Home();
            });

            app.get("/index", (req, res) => {
                async function GoToIndex()
                {
                    characters = await db.listAll(client, dbName, "Characters");
                    weapons = await db.listAll(client, dbName, "Weapons");
                }
                res.render('Characters/index');
            });

            app.get("/createDatabase", (req, res) => {
                async function DoDatabaseStuff()
                {
                    db.createDb(client, dbName);
                    db.createCollection(client, dbName, "Characters");
                    db.createCollection(client, dbName, "Weapons");
            
                    db.createDocs(client, dbName, "Characters", characters);
                    db.createDocs(client, dbName, "Weapons", weapons);
    
                    characters = await db.listAll(client, dbName, "Characters");
                    weapons = await db.listAll(client, dbName, "Weapons");
                    res.render('homepage');
                }

                DoDatabaseStuff();
            });

            app.get("/create", (req, res) => {
                async function Create()
                {
                    characters = await db.listAll(client, dbName, "Characters");
                    weapons = await db.listAll(client, dbName, "Weapons");
                
                    res.render('Characters/create');
                }
                Create();
            });

            app.get("/createCharacter/:name/:weaponid", (req, res) => {
                const name = req.params.name;
                const weaponId = parseInt(req.params.weaponid);
                async function CreateCharacter()
                {
                    try{
                        characters = await db.listAll(client, dbName, "Characters");
                        weapons = await db.listAll(client, dbName, "Weapons");
                        
                        if (weaponId != 0) 
                        {
                            let orderById = await db.SortBy(client, dbName, "Characters", "id", -1);
                            let maxId = orderById[0].id;
                            
                            let character = {
                                "id" : maxId + 1,
                                "name" : name,
                                "health" : 100,
                                "armor" : 100,
                                "weapon" : weapons.find(weapon => weapon.id === weaponId)
                            };  
                            db.createDoc(client, dbName, "Characters", character);
                            characters = await db.listAll(client, dbName, "Characters");
                            weapons = await db.listAll(client, dbName, "Weapons");

                            characters = await db.listAll(client, dbName, "Characters");
                            weapons = await db.listAll(client, dbName, "Weapons");
                            res.redirect('/index');           
                        }    
                    }
                    catch(err){
                        console.log(err);
                    }                  
                }
                CreateCharacter(); 
            });

            app.get("/show/:id", (req, res) => {
                async function Show()
                {
                    characters = await db.listAll(client, dbName, "Characters");
                    weapons = await db.listAll(client, dbName, "Weapons");

                    character = await db.findOne(client, dbName, "Characters", "id", Number.parseInt(req.params.id));
                    res.render('Characters/show', {character : character});
                }
                Show();
            });

            app.get("/update/:id", (req, res) => {
                async function Update()
                {
                    characters = await db.listAll(client, dbName, "Characters");
                    weapons = await db.listAll(client, dbName, "Weapons");

                    character = await db.findOne(client, dbName, "Characters", "id", Number.parseInt(req.params.id));
                    res.render('Characters/update', {character : character});
                }
                Update();
            });

            app.get("/updateCharacter/:id/:name/:hp/:armor/:weaponid", (req, res) => {
                try {
                    let id = parseInt(req.params.id);
                    let name = req.params.name;
                    let hp = parseInt(req.params.hp);
                    let armor = parseInt(req.params.armor);
                    let weaponID = parseInt(req.params.weaponid);

                    async function Update()
                    {
                        weapons = await db.listAll(client, dbName, "Weapons");

                        await db.deleteOne(client, dbName, "Characters", "id", id);
    
                        let character = {
                            "id" : id,
                            "name" : name,
                            "health" : hp,
                            "armor" : armor,
                            "weapon" : weapons.find(weapon => weapon.id === weaponID)
                        };

                        db.createDoc(client, dbName, "Characters", character);  

                        characters = await db.listAll(client, dbName, "Characters");
                        weapons = await db.listAll(client, dbName, "Weapons");
                        res.redirect('/index');
                    }
                    Update();
                } 
                catch (error) {
                    console.log(error);
                    res.redirect('/index');
                    res.render('Characters/index');
                }       
            });

            app.get("/delete/:id", (req, res) => {
                const idToDelete = parseInt(req.params.id);
                async function DeleteCharacter()
                {
                    await db.deleteOne(client, dbName, "Characters", "id", idToDelete);

                    characters = await db.listAll(client, dbName, "Characters");
                    weapons = await db.listAll(client, dbName, "Weapons");

                    res.redirect('/index');
                }
                DeleteCharacter();
            });

            app.get("/fight", (req, res) => {
                async function Fight()
                {
                    characters = await db.listAll(client, dbName, "Characters");
                    weapons = await db.listAll(client, dbName, "Weapons");
                    res.render('arena');
                }
                Fight();
            });

            app.get("/duel/:aid/:did", (req, res) => {
                async function Duel()
                {
                    try 
                    {
                        characters = await db.listAll(client, dbName, "Characters");
                        weapons = await db.listAll(client, dbName, "Weapons");
    
                        attacker = await db.findOne(client, dbName, "Characters", "id", Number.parseInt(req.params.aid));
                        opponent = await db.findOne(client, dbName, "Characters", "id", Number.parseInt(req.params.did));
    
                        safe = 0;
                        attackerRound = true;
                        attackerAllHealth = Number.parseInt(attacker.health) + Number.parseInt(attacker.armor);
                        opponentAllHealth = Number.parseInt(opponent.health) + Number.parseInt(opponent.armor);
                        winner = null;
                        while (true) 
                        {
                            if (attackerRound) 
                                {
                                    opponentAllHealth -=  Number.parseInt(attacker.weapon.dmg);
                                    if (0 >= opponentAllHealth) 
                                    {
                                        winner = attacker;
                                        break;
                                    }                   
                                    attackerRound = false;
                                }
                                else
                                {
                                    attackerAllHealth -=  Number.parseInt(opponent.weapon.dmg);
                                    if (0 >= attackerAllHealth) 
                                    {
                                        winner = opponent;
                                        break;
                                    } 
                                    attackerRound = true;
                                }
                        }
                        res.render('arena', {winner : winner});                       
                    } 
                    catch (error)
                    {
                        console.log(error);   
                    }
                }

                Duel();
            });

            app.get("*", (req, res) => {
                res.send("Page not found");
            });
            
            app.listen(3000, () => {
                console.log("SERVER RUNNING ON PORT 3000");
            });
        }
        catch (error)
        {
            console.log(error);
        }    
    }
    
    Main();