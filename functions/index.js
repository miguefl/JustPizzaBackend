const functions = require('firebase-functions');
const admin = require('firebase-admin');
const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors({ origin: true }));

var serviceAccount = require("./permissions.json");
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://justpizzaapp.firebaseio.com"
});
const db = admin.firestore();

app.post('/api/pizzas', (req, res) => {
    (async () => {
        try {
            await db.collection('pizzas').add(req.body);
            return res.status(200).send();
        } catch (error) {
            console.log(error);
            return res.status(500).send(error);
        }
    })();
});

app.get('/api/pizzas/:pizza_id', (req, res) => {
    (async () => {
        try {
            const document = db.collection('pizzas').doc(req.params.pizza_id);
            let pizza = await document.get();
            let response = {
                id: pizza.id,
                pizza: pizza.data()
            };
            return res.status(200).send(response);
        } catch (error) {
            console.log(error);
            return res.status(500).send(error);
        }
    })();
});

app.get('/api/pizzas', (req, res) => {
    (async () => {
        try {
            let query = db.collection('pizzas');
            let response = [];
            await query.get().then(querySnapshot => {
                let docs = querySnapshot.docs;
                for (let doc of docs) {
                    const selectedItem = {
                        id: doc.id,
                        pizza: doc.data()
                    };
                    response.push(selectedItem);
                }
                return response;
            });
            return res.status(200).send(response);
        } catch (error) {
            console.log(error);
            return res.status(500).send(error);
        }
    })();
});

app.put('/api/pizzas/:pizza_id', (req, res) => {
    (async () => {
        try {
            const document = db.collection('pizzas').doc(req.params.pizza_id);
            await document.update(req.body);
            return res.status(200).send();
        } catch (error) {
            console.log(error);
            return res.status(500).send(error);
        }
    })();
});

app.delete('/api/pizzas/:pizza_id', (req, res) => {
    (async () => {
        try {
            const document = db.collection('pizzas').doc(req.params.pizza_id);
            await document.delete();
            return res.status(200).send();
        } catch (error) {
            console.log(error);
            return res.status(500).send(error);
        }
    })();
});

exports.app = functions.region('europe-west1').https.onRequest(app);