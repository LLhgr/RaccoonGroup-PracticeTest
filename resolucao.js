const fs = require('fs');

const filePath = "./broken-database.json";
const finalFilePath = "./saida.json"


//Functions for JSON

const WriteJSON = (filePath, data, encoding = 'utf-8') =>
{
    const promiseCallback = (resolve, reject) =>
    {
        fs.writeFile(filePath, JSON.stringify(data,null,2), encoding, (err) =>
        {
            if(err)
            {
                reject(err);
                return;
            } 
            resolve(true);
        });
    };

    return new Promise(promiseCallback);
};

const ReadJSON = (filePath, encoding = 'utf-8') =>
{
    const promiseCallback = (resolve, reject) =>
    {
        fs.readFile(filePath, encoding, (err, data) =>
        {
            if(err)
            {
                reject(err);
                return;
            }

            try 
            {
                const object = JSON.parse(data);
                resolve(object);
            } 
            catch (e) 
            {
                reject(e)
            }
        });
    };

    return new Promise(promiseCallback);
};

const UpdateJSON = (filePath, newData, encoding = 'utf-8') =>
{
    const promiseCallback = async (resolve, reject) =>
    {
        try
        {
            const data = await ReadJSON(filePath, encoding);

            const result = {...data, ...newData};

            await WriteJSON(filePath, result, encoding);

            resolve(result);
        }
        catch(e)
        {
            reject(e);
        }
    }

    return new Promise(promiseCallback);
};

//PART 1

const correctName = (filePath, objectJSON) =>
{
    try
    {
        for (let i = 0; i < Object.keys(objectJSON).length; i++) 
        {
            objectJSON[i].name = objectJSON[i].name.replace(/([æ])+/g,"a");
            objectJSON[i].name = objectJSON[i].name.replace(/([¢])+/g,"c");
            objectJSON[i].name = objectJSON[i].name.replace(/([ø])+/g,"o");
            objectJSON[i].name = objectJSON[i].name.replace(/([ß])+/g,"b");
        }

        UpdateJSON(filePath, objectJSON);
    } 
    catch (e) 
    {  
        console.error(e)
    }
    
}

const correctPrice = (filePath, objectJSON) =>
{
    try 
    {
        for (let i = 0; i < Object.keys(objectJSON).length; i++) 
        {
            objectJSON[i].price = parseFloat(objectJSON[i].price);
        }

        UpdateJSON(filePath, objectJSON);
    } 
    catch (e) 
    {  
        console.error(e)
    }

}

const correctQuantity = (filePath, objectJSON) =>
{ 
    try 
    {
        for (let i = 0; i < Object.keys(objectJSON).length; i++) 
        {
            if (!objectJSON[i].hasOwnProperty("quantity")) 
            {
                objectJSON[i].quantity = 0;
            }
        }

        UpdateJSON(filePath, objectJSON);
    } 
    catch (e) 
    {  
        console.error(e)
    }
}

const exportJSON = async (filePath, finalFilePath) =>
{
    const objectJSON = await ReadJSON(filePath).catch(console.error);

    correctName(filePath, objectJSON);
    correctPrice(filePath, objectJSON);
    correctQuantity(filePath, objectJSON);

    try 
    {
        WriteJSON(finalFilePath, objectJSON);
        return true;
    } 
    catch (e) 
    {  
        console.error(e)
    }
}

//PART 2

const status = async () =>
{
    const statusExport = await exportJSON(filePath,finalFilePath).catch(console.error);
    return statusExport;
}

const qtdCategory = async (filePath) =>
{
        const statusValue = await status()  
    
        if(statusValue === true)
        {
            objectJSON = await ReadJSON(filePath).catch(console.error);

            let eletrodomestico = 0;
            let eletronico = 0;
            let acessorios = 0;
            let panelas = 0;


            for (let i = 0; i < Object.keys(objectJSON).length; i++) 
            {
                if(objectJSON[i].category === "Eletrodomésticos")
                {
                    eletrodomestico += objectJSON[i].quantity;
                }
                else if(objectJSON[i].category === "Eletrônicos")
                {
                    eletronico += objectJSON[i].quantity;
                }
                else if(objectJSON[i].category === "Acessórios")
                {
                    acessorios += objectJSON[i].quantity;
                }
                else if(objectJSON[i].category === "Panelas")
                {
                    panelas += objectJSON[i].quantity;
                }
            }


            console.log("\n>Quantidade por categoria<\n");
            console.log("Eletrodomésticos: ", eletrodomestico);
            console.log("Eletrônicos: ", eletronico);
            console.log("Acessórios: ", acessorios);
            console.log("Panelas: ", panelas);
        } 
}

const productList = async (filePath) =>
{
    const statusValue = await status()  
    
    if(statusValue === true)
    {
        objectJSON = await ReadJSON(filePath).catch(console.error);

        const listId = [];
        const listCategory = [];
        const listAll = [];
        const listName = [];

        for (let i = 0; i < Object.keys(objectJSON).length; i++) 
        {
            listId[i] = objectJSON[i]["id"];
            listCategory[i] = objectJSON[i]["category"];
            listName[i] = objectJSON[i]["name"];
            listAll[i] = listCategory[i]  + " | " +  listId[i] + " | " + listName[i];
        }

        listCategory;
        listId.sort();
        console.log("\n>Product List< \n",listAll.sort());
    }
}

exportJSON(filePath, finalFilePath);
qtdCategory(finalFilePath);
productList(finalFilePath);
