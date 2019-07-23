# MAIC Software

## How to build

1. Create a netlify account

2. Drag and drop

3. npm run build as a depoyment command

4. Root public/

5. Deploy

## Update the informations

This website uses nodejs react in order to render the different objects. It also uses algolia as a back-end and searching engine. Objects are dynamically added to the website according to the back-end. For the information inside those objects, they are also dynamically created. The principal app (named src/App.js) will create JSX objects according to information provided inside **src/data/**. This folder list le different language version presented for a certain template. Then, the app will create a place holder with a specific id. This place holder will be filled with specific info later on. When the user click on a file, the app will search the content of the file in **public/data/{nameOfTheApi}/{nameOfTheTemplate}**. Then, the app will list all language in the json file **src/data/{nameOfTheApi}List.json**, and add the information from the first directory to the website.
</br>
So in order to update the data base, you need to :

1. **Update the data base :** Either drag and drop a new data.json file, or add a new object manually in your algolia project ; **utilities/data.json** servs as an example.

2. **Update src/data folder :** Add your files inside **public/data/{apiName}/{templateName}/** folder. Attention, it has to be the same API name and template as the ones mentioned in the algolia object.

3. **Modify your files names :** All your files must have the name **{templateName}.lang** where 'lang' can be c or py or whatever.

4. **Update public/data folder :** Create the file **src/data/{apiName}/{templateName}List.json**. It has to be composed of the number of different language presented and a list of the sayed languages. Check out the already present list to have an exact syntaxe.

5. **ReDeploy :** Simply redeploy.

## Problems

Right now the website is composed of parts that can be stored inside a backend, such as files inside **public/data/** and **src/data/**. This is why we have to redeploy after evry single modifications. It would be better if an external API could take care of that.
